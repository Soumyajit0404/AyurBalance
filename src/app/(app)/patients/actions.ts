'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { dbAdmin } from '@/lib/firebase-admin';

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
});

export async function savePatient(formData: FormData) {
  const values = Object.fromEntries(formData.entries());
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
      // Update existing patient
      await dbAdmin.collection('patients').doc(id).set({
        ...patientData,
        lastVisit: new Date(),
      }, { merge: true });
    } else {
      // Create new patient
      await dbAdmin.collection('patients').add({
        ...patientData,
        createdAt: new Date(),
        lastVisit: new Date(),
      });
    }
    revalidatePath('/patients');
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
    await dbAdmin.collection('patients').doc(patientId).delete();
    revalidatePath('/patients');
    return { success: true };
  } catch (error) {
    console.error('Error deleting patient:', error);
    return { success: false, error: 'Failed to delete patient.' };
  }
}
