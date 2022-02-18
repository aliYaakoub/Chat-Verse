import { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { projectStorage, projectFirestore, projectDatabase, auth } from './FirebaseConfig';
import { collection, doc, getDoc, getDocs, query, setDoc, where, Timestamp, addDoc, updateDoc, arrayUnion, deleteDoc } from "firebase/firestore";
import { Alert } from "react-native";
import { deleteObject, ref } from "firebase/storage";

const Context = createContext()

export function useAppContext() {
    return useContext(Context);
}

export function ContextProvider({children}){

    const [changes, setChanges] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function signUp(email, password, phoneNumber, username){
        // if there exist a user with the same username throw an error
        const q = query(collection(projectFirestore, 'users'), where('username', '==', username));
        const findUser = await getDocs(q)
        let documents = [];
        findUser.forEach((doc)=>{
            documents.push(doc.data());
        })
        if(documents.length > 0){
            throw new Error('username already exists');
        }
        // and check for matching phone numbers
        const q2 = query(collection(projectFirestore, 'users'), where('phoneNumber', '==', phoneNumber));
        const findUser2 = await getDocs(q2)
        let documents2 = [];
        findUser2.forEach((doc)=>{
            documents2.push(doc.data());
        })
        if(documents2.length > 0){
            throw new Error('phoneNumber already in use');
        }
        // if not, add the user to the database
        const signUpUser =  await createUserWithEmailAndPassword(auth, email, password);
        const addUser = setDoc(doc(projectFirestore, 'users', auth.currentUser.uid), {
            username: username,
            phoneNumber: phoneNumber.replace(/ /g, ""),
        })
        return Promise.all(signUpUser, addUser);
    }

    function signIn(email, password){
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout(){
        return auth.signOut();
    }

    async function changeUsername(id, newUsername){
        return updateDoc(doc(projectFirestore, 'users', id),{
            username: newUsername
        })
    }
    async function changePhoneNumber(id, newPhoneNumber){
        return updateDoc(doc(projectFirestore, 'users', id),{
            phoneNumber: newPhoneNumber
        })
    }

    async function getUserData(number){
        const q = query(collection(projectFirestore, 'users'), where('phoneNumber', 'in', number));
        const users = await getDocs(q);
        let user = null;
        users.forEach(item=>{
            if(item.data() !== {}){
                user = {...item.data(), id: item.id}
            }
        })
        return user;
    }

    async function getAllChats (userNumber) {
        const q = query(collection(projectFirestore, 'chat'), where('users', 'array-contains', userNumber));
        const allChats = await getDocs(q);
        let chats = [];
        allChats.forEach(chat => {
            chats.push({...chat.data(), id: chat.id})
        })
        return chats;
    }

    async function getChat(userNumber, receiverNumber) {
        const allChats = await getAllChats(userNumber);
        let chat;
        for(let i = 0; i < allChats.length; i++){
            if (allChats[i].users.includes(userNumber) && allChats[i].users.includes(receiverNumber.replace(/ /g, ""))){
                chat = {...allChats[i]};
            }
        }
        if(chat){
            return chat;
        }
        else{
            await createChat(userNumber, receiverNumber);
            const chat = await getChat(userNumber, receiverNumber)
            return chat;
        }
    }

    async function createChat(senderNumber, receiverNumber) {
        await addDoc(collection(projectFirestore, 'chat'), {
            users: [senderNumber, receiverNumber.replace(/ /g, "")],
            timeStamp: Timestamp.now(),
            chat: [],
        })
    }

    async function sendMessage(id, sender, receiver, message){
        // const newMessage = addDoc(collection(projectFirestore, 'chat-messages'), {
        //         senderNumber: sender,
        //         receiverNumber: receiver,
        //         message: message,
        //         id: id,
        //         timeStamp: Timestamp.now()
        // })

        //second method :
        try{
            await updateDoc(doc(projectFirestore, 'chat', id), {
                chat: arrayUnion({
                    senderNumber: sender,
                    receiverNumber: receiver,
                    message: message,
                    timeStamp: Timestamp.now()
                }),
                timeStamp: Timestamp.now()
            })
        }
        catch(err){
            console.error(err.message);
        }
        return Promise.all([newMessage, update]);
    }

    async function deleteMessage(id, fileName){
        try{
            let deletePic;
            if(fileName){
                const imageRef = ref(projectStorage, `chat-messages/${fileName}`);
                deletePic = deleteObject(imageRef)
            }
            const deleteObj = deleteDoc(doc(projectFirestore, 'chat-messages', id));
            if(deletePic){
                await Promise.all([deletePic, deleteObj]);
            }
            else await deleteObj;
        }
        catch(err){
            console.error(err.message);
            Alert.alert('error', 'an error occured, please try again.')
        }
    }

    useEffect(()=>{
        const unsub = onAuthStateChanged(auth, (currentUser) => {
            if(currentUser){
                async function setUserData(){
                    const user = await getDoc(doc(projectFirestore, 'users', auth.currentUser.uid));
                    setCurrentUser({...user.data(), id: user.id})
                    setLoading(false);
                }
                setUserData();
            }
            else{
                setCurrentUser(null);
            }
        })
        return unsub;
    }, [changes])

    const value = {
        currentUser: loading ? null : currentUser,
        setChanges,
        signIn,
        signUp,
        logout,
        getUserData,
        getAllChats,
        getChat,
        createChat,
        sendMessage,
        changePhoneNumber,
        changeUsername,
        deleteMessage
    }

    return(
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    )
}