import { useState, useEffect } from 'react';
import { projectStorage, projectFirestore } from '../config/FirebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { collection, addDoc, Timestamp, getDoc, doc, setDoc, updateDoc } from '@firebase/firestore';
import { Alert } from 'react-native';
import { arrayUnion } from 'firebase/firestore';

const useStorage = (file, extension, path, senderNumber, receiverNumber, chatId, content, type, userId) =>{
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [url, setUrl] = useState(null);

    const randomArray = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    function getRandomNum(num){
        let result = '';
        for(let i=0; i<num; i++){
            result += randomArray[Math.floor(Math.random()*(randomArray.length - 1))];
        }
        return result;
    }

    useEffect(()=>{
        let fileName = getRandomNum(10);
        // refrences
        const spaceRef = ref(projectStorage, `${path}/${fileName}.${extension}`);
        const uploadTask = uploadBytesResumable(spaceRef, file);
        const collectionRef = collection(projectFirestore, `${path}`);

        uploadTask.on(
            'state_changed', 
            (snap)=>{
            let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
            setProgress(percentage);
        }, 
        (err)=>{
            setError(err);
        }, 
        async ()=>{
            const url = await getDownloadURL(uploadTask.snapshot.ref)
            // if(path === 'chat-messages'){
            //     const add = await addDoc(collectionRef, {
            //         senderNumber: senderNumber, 
            //         receiverNumber: receiverNumber,
            //         id: chatId,
            //         timeStamp: Timestamp.now(),
            //         attachment: {
            //             file: url, 
            //             attachmentType: type.split('/')[0], 
            //             fileName: `${fileName}.${extension}`
            //         }
            //     });
            //     const update = updateDoc(doc(projectFirestore, 'chat', chatId), {
            //         timeStamp: Timestamp.now()
            //     })
            //     try{
            //         await Promise.all([add, update])
            //     }
            //     catch(err){
            //         // return Alert.alert('error', 'an error occured, please try again later')
            //     }
            // }
            if(path === 'chat-messages'){
                // const add = await addDoc(collectionRef, {
                //     senderNumber: senderNumber, 
                //     receiverNumber: receiverNumber,
                //     id: chatId,
                //     timeStamp: Timestamp.now(),
                //     attachment: {
                //         file: url, 
                //         attachmentType: type.split('/')[0], 
                //         fileName: `${fileName}.${extension}`
                //     }
                // });
                const update = updateDoc(doc(projectFirestore, 'chat', chatId), {
                    chat: arrayUnion({
                        senderNumber: senderNumber, 
                        receiverNumber: receiverNumber,
                        timeStamp: Timestamp.now(),
                        attachment: {
                            file: url, 
                            attachmentType: type.split('/')[0], 
                            fileName: `${fileName}.${extension}`
                        }
                    }),
                    timeStamp: Timestamp.now()
                })
                try{
                    await Promise.all([add, update])
                }
                catch(err){
                    // return Alert.alert('error', 'an error occured, please try again later')
                }
            }
            else if(path === 'profile-pictures') {
                try{
                    const user = await getDoc(doc(projectFirestore, 'users', userId));
                    if(user.data().attachment){
                        const imageRef = ref(projectStorage, `profile-pictures/${user.data().attachment.fileName}`);
                        await deleteObject(imageRef)
                    }
                    await updateDoc(doc(projectFirestore, 'users', userId),{
                        attachment: {
                            file: url, 
                            fileName: `${fileName}.${extension}`
                        },
                    })
                }
                catch(err){
                    Alert.alert('Could not upload')
                    console.error(err.message);
                }
            }
            setUrl(url);
        });
    },[file, path, content, type])

    return { progress, error, url };

}

export default useStorage;