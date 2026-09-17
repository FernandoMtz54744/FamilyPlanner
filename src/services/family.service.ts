import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export type Family = {
  id: string
  members: string[]
}

export async function getFamilyByUserId(userId: string ): Promise<Family | null> {
    const familiesRef = collection(db, 'family');
    const q = query(familiesRef, where('members', 'array-contains', userId));
    const snapshot = await getDocs(q);
    if(snapshot.empty){
        return null
    }
    
    const familyDoc = snapshot.docs[0]
    return { 
        id: familyDoc.id,
        ...familyDoc.data()
    } as Family
}