import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export type Event = {
  id?: string,
  title: string,
  start: string,
  end: string,
  familyId: string,
  userId: string
}

const eventsCollection = collection(db, 'events');

export async function createEvent(event: Event) {
  return addDoc(eventsCollection, event)
}

export async function deleteEvent(eventId: string) {
  const eventRef = doc(db, 'events', eventId)
  await deleteDoc(eventRef)
}

export async function updateEvent(eventId: string, event: Pick<Event, 'title' | 'start' | 'end'>) {
  const eventRef = doc(db, 'events', eventId)
  await updateDoc(eventRef, event)
}

export async function getFamilyEvents(familyId: string ): Promise<Event[]>{
  const eventsRef = collection(db, 'events')
  const q = query(eventsRef, where('familyId', '==', familyId))
  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    title: doc.data().title,
    start: doc.data().start,
    end: doc.data().end,
    familyId: doc.data().familyId,
    userId: doc.data().userId
  })) 
}

export async function getUserEvents(userId: string ): Promise<Event[]>{
  const eventsRef = collection(db, 'events')
  const q = query(eventsRef, where('userId', '==', userId))
  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    title: doc.data().title,
    start: doc.data().start,
    end: doc.data().end,
    familyId: doc.data().familyId,
    userId: doc.data().userId
  })) 
}