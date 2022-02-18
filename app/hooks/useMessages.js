import {useState, useEffect} from 'react'
import { projectFirestore } from '../config/FirebaseConfig'
import { onSnapshot, doc } from 'firebase/firestore';

const useMessages = (id) =>{
    const [docs, setDocs] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const unsub = onSnapshot(doc(projectFirestore, 'chat', id), (snap)=>{
                setDocs([...snap.data().chat]);
                setLoading(false)
            })
        return () => unsub();
    }, [])

    return { docs, loading };
}

export default useMessages;