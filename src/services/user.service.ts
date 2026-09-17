import { collection, documentId, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Horario } from './schedule.service'

export type Usuario = {
    id: string,
    displayName: string,
    photoURL?: string,
    horario: Horario | undefined
}

export async function getUsersByIds(userIds: string[]): Promise<Usuario[]> {
    if(userIds.length === 0) {
        return []
    }

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where(documentId(), 'in', userIds));
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        horario: doc.data().horario,
        displayName: doc.data().displayName,
        photoURL: doc.data().photoURL
    }));
}