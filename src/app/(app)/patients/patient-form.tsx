'use client';

import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { savePatient } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const PatientFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  age: z.coerce.number().int().positive({ message: 'Please enter a valid age.' }),
  gender: z.string().min(1, { message: 'Please select a gender.' }),
  dosha: z.string().min(1, { message: 'Please select a dosha.' }),
  diet: z.string().optional(),
  mealFrequency: z.string().optional(),
  bowelMovements: z.string().optional(),
  waterIntake: z.string().optional(),
  allergies: z.string().optional(),
  notes: z.string().optional(),
});

export type Patient = z.infer<typeof PatientFormSchema>;

interface PatientFormProps {
  patient?: Patient | null;
  onSuccess: () => void;
}

export function PatientForm({ patient, onSuccess }: PatientFormProps) {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof PatientFormSchema>>({
    resolver: zodResolver(PatientFormSchema),
    defaultValues: patient || {
      name: '',
      age: 0,
      gender: '',
      dosha: '',
      diet: '',
      mealFrequency: '',
      bowelMovements: '',
      waterIntake: '',
      allergies: '',
      notes: '',
    },
  });

  useEffect(() => {
    form.reset(patient || {
      name: '',
      age: 0,
      gender: '',
      dosha: '',
      diet: '',
      mealFrequency: '',
      bowelMovements: '',
      waterIntake: '',
      allergies: '',
      notes: '',
    });
  }, [patient, form]);

  const onSubmit = async (values: z.infer<typeof PatientFormSchema>) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, String(value));
        }
    });

    const result = await savePatient(formData);

    if (result.success) {
      toast({
        title: `Patient ${patient ? 'Updated' : 'Saved'}`,
        description: `${values.name}'s profile has been saved.`,
      });
      onSuccess();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Something went wrong.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 overflow-y-auto pr-2" style={{maxHeight: 'calc(100vh - 150px)'}}>
        
        {patient?.id && <input type="hidden" {...form.register('id')} />}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Patient's full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Patient's age" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dosha"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Dosha</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a dosha type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Vata">Vata</SelectItem>
                  <SelectItem value="Pitta">Pitta</SelectItem>
                  <SelectItem value="Kapha">Kapha</SelectItem>
                  <SelectItem value="Vata-Pitta">Vata-Pitta</SelectItem>
                  <SelectItem value="Pitta-Kapha">Pitta-Kapha</SelectItem>
                  <SelectItem value="Vata-Kapha">Vata-Kapha</SelectItem>
                  <SelectItem value="Tridoshic">Tridoshic</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="diet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dietary Preference</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Vegetarian, Vegan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mealFrequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meal Frequency</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 3 times a day" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bowelMovements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bowel Movements</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Once a day, irregular" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="waterIntake"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Water Intake</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 2-3 liters/day" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allergies"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Allergies / Intolerances</FormLabel>
              <FormControl>
                <Textarea placeholder="List any known food allergies (e.g., peanuts, gluten, dairy)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Initial Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Any initial observations or health details..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save Patient'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
