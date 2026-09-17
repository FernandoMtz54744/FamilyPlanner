import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export type DiaHorario = {
  descanso: boolean
  entrada: string
  salida: string
}

export type Horario = {
  lunes: DiaHorario
  martes: DiaHorario
  miercoles: DiaHorario
  jueves: DiaHorario
  viernes: DiaHorario
  sabado: DiaHorario
  domingo: DiaHorario
}

export async function getSchedule(userId: string): Promise<Horario | null> {
  const userRef = doc(db, 'users', userId)
  const snapshot = await getDoc(userRef)
  if (!snapshot.exists()) {
    return null
  }

  const data = snapshot.data()
  return data.horario ?? null
}

export async function saveSchedule( userId: string, horario: Horario, displayName: string, photoURL?: string ): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await setDoc( userRef, {horario: horario, displayName: displayName, photoURL: photoURL}, {merge: true});
}