'use client';

import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { z } from 'zod';
import { db } from '@/lib/firebase-client';

const PatientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name is too short'),
  age: z.coerce.number().int().positive('Age must be a positive number'),
  gender: z.string().min(1, 'Gender is required'),
  dosha: z.string().min(1, 'Dosha is required'),
  diet: z.string().optional(),
  mealFrequency: z.string().optional(),
  bowelMovements: z.string().optional(),
  waterIntake: z.string().optional(),
  allergies: z.string().optional(),
  notes: z.string().optional(),
  dietPlans: z.array(z.any()).optional(),
});

export async function savePatient(
  values: z.infer<typeof PatientSchema>
) {
  const validatedFields = PatientSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid data',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, ...patientData } = validatedFields.data;

  try {
    if (id) {
      const patientRef = doc(db, 'patients', id);
      await updateDoc(patientRef, {
        ...patientData,
        lastVisit: serverTimestamp(),
      });
    } else {
      await addDoc(collection(db, 'patients'), {
        ...patientData,
        createdAt: serverTimestamp(),
        lastVisit: serverTimestamp(),
      });
    }
    return { success: true };
  } catch (error) {
    console.error('Error saving patient:', error);
    return { success: false, error: 'Failed to save patient.' };
  }
}

export async function deletePatient(patientId: string) {
  if (!patientId) {
    return { success: false, error: 'Patient ID is required.' };
  }
  try {
    await deleteDoc(doc(db, 'patients', patientId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting patient:', error);
    return { success: false, error: 'Failed to delete patient.' };
  }
}

export async function saveDietPlanToPatient(patientId: string, dietPlan: string) {
  if (!patientId || !dietPlan) {
    return { success: false, error: 'Patient ID and diet plan are required.' };
  }
  try {
    const dietPlanRef = collection(db, 'patients', patientId, 'dietPlans');
    await addDoc(dietPlanRef, {
      plan: dietPlan,
      createdAt: serverTimestamp(),
    });
    // Also update the patient's last visit timestamp
    const patientRef = doc(db, 'patients', patientId);
    await updateDoc(patientRef, {
      lastVisit: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error saving diet plan:', error);
    return { success: false, error: 'Failed to save diet plan.' };
  }
}
