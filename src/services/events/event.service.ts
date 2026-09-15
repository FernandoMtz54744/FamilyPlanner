import { addDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const eventsCollection = collection(db, 'events')

export async function getEvents() {
  const snapshot = await getDocs(eventsCollection)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export async function createEvent(event: { title: string, start: string, end: string, resource: string }) {
  return addDoc(eventsCollection, event)
}