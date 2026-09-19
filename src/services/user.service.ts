import { collection, doc, documentId, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Horario } from './schedule.service'
import type { SchedulerEventColor } from '@mui/x-scheduler/models'

export type Usuario = {
    id: string,
    displayName: string,
    photoURL?: string,
    horario: Horario | undefined,
    color: string
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
        photoURL: doc.data().photoURL,
        color: doc.data().color
    }));
}

export async function saveUserInfo( userId: string, color: SchedulerEventColor, displayName: string, photoURL?: string): Promise<void> {
    const userRef = doc(db, 'users', userId)
    await setDoc(userRef, {color, displayName, photoURL },{merge: true});
}

export async function getUserById(userId: string): Promise<Usuario | null> {
  const userRef = doc(db, 'users', userId)
  const snapshot = await getDoc(userRef)

  if (!snapshot.exists()) {
    return null
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Usuario
}