import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'

import { db } from '@/lib/firebase'

export type Vacation = {
  id: string
  userId: string
  familyId: string
  startDate: string
  endDate: string
}

const vacationsCollection = collection(db, 'vacations')

export async function getUserVacations(
  userId: string,
): Promise<Vacation[]> {
  const q = query(
    vacationsCollection,
    where('userId', '==', userId),
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Vacation[]
}

export async function createVacation(
  vacation: Omit<Vacation, 'id'>,
) {
  return addDoc(vacationsCollection, vacation)
}

export async function updateVacation(
  vacationId: string,
  vacation: Pick<Vacation, 'startDate' | 'endDate'>,
) {
  const vacationRef = doc(
    db,
    'vacations',
    vacationId,
  )

  await updateDoc(vacationRef, vacation)
}

export async function deleteVacation(
  vacationId: string,
) {
  await deleteDoc(
    doc(db, 'vacations', vacationId),
  )
}


export async function getFamilyVacations(
  familyId: string,
): Promise<Vacation[]> {
  const q = query(
    vacationsCollection,
    where('familyId', '==', familyId),
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Vacation[]
}