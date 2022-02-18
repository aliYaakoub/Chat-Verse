import {useState, useEffect} from 'react'
import { projectFirestore } from '../config/FirebaseConfig'
import { collection, onSnapshot, query, where } from 'firebase/firestore';

const useFirestore = (col, fieldPath, filter, value) =>{
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const q = query(collection(projectFirestore, col), where(fieldPath, filter, value));
        const unsub = onSnapshot(q, (snap)=>{
                let documents = [];
                snap.forEach(doc => {
                    documents.push({...doc.data(), id: doc.id})
                });
                setDocs(documents);
                setLoading(false)
            })
        return () => unsub();
    }, [col])

    return { docs, loading };
}

export default useFirestore;