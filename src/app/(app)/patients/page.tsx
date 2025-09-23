"use client";

import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { Patient, PatientForm } from "./patient-form";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { deletePatient } from "./actions";
import { Skeleton } from "@/components/ui/skeleton";

const doshaColors: { [key: string]: string } = {
  Vata: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Pitta: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Kapha: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "Pitta-Vata":
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  "Kapha-Pitta":
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "Vata-Pitta":
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Tridoshic:
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
};

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "patients"), orderBy("name"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const patientsData: Patient[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        patientsData.push({
          id: doc.id,
          ...data,
          lastVisit: data.lastVisit?.toDate ? data.lastVisit.toDate().toLocaleDateString() : data.lastVisit,
        } as Patient);
      });
      setPatients(patientsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setSheetOpen(true);
  };

  const handleDeleteClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setAlertOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!selectedPatient) return;
    const result = await deletePatient(selectedPatient.id!);
    if (result.success) {
      toast({ title: "Patient deleted", description: `${selectedPatient.name} has been removed.` });
    } else {
      toast({ variant: "destructive", title: "Error", description: result.error });
    }
    setAlertOpen(false);
    setSelectedPatient(null);
  };

  const handleSheetClose = (open: boolean) => {
    setSheetOpen(open);
    if (!open) {
      setSelectedPatient(null);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Patient Profiles"
        description="Manage your patients' information and diet plans."
      >
        <Sheet open={isSheetOpen} onOpenChange={handleSheetClose}>
          <SheetTrigger asChild>
            <Button>
              <PlusCircle />
              New Patient
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-2xl">
            <SheetHeader>
              <SheetTitle className="font-headline text-2xl text-primary">
                {selectedPatient ? "Edit Patient" : "Add New Patient"}
              </SheetTitle>
              <SheetDescription>
                {selectedPatient ? "Update the patient's profile." : "Fill in the details to create a new patient profile."}
              </SheetDescription>
            </SheetHeader>
            <PatientForm
              patient={selectedPatient}
              onSuccess={() => handleSheetClose(false)}
            />
          </SheetContent>
        </Sheet>
      </PageHeader>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Age</TableHead>
              <TableHead className="hidden sm:table-cell">Gender</TableHead>
              <TableHead>Dosha Type</TableHead>
              <TableHead className="hidden lg:table-cell">Last Visit</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
               Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-10" /></TableCell>
                  <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                  <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : (
              patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell className="hidden sm:table-cell">{patient.age}</TableCell>
                  <TableCell className="hidden sm:table-cell">{patient.gender}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${
                        doshaColors[patient.dosha] || ""
                      } border-transparent`}
                    >
                      {patient.dosha}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{patient.lastVisit || 'N/A'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => handleEdit(patient)}>
                          Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Diet Plan</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => handleDeleteClick(patient)} className="text-destructive">
                          Delete Patient
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

       <AlertDialog open={isAlertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the patient record for {selectedPatient?.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
