"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { recommendFoodsForPatient, RecommendFoodsForPatientOutput } from "@/ai/flows/recommend-foods-for-patient";
import type { Patient } from "@/app/(app)/patients/patient-form";

import { PageHeader } from "@/components/page-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2, Sparkles, User, Wheat, BrainCircuit } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


interface Food {
  id: string;
  name: string;
  category: string;
  calories: number;
  properties: string;
  qualities: string;
}

export default function FoodDatabasePage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendFoodsForPatientOutput['recommendations'] | null>(null);

  useEffect(() => {
    const foodsQuery = query(collection(db, "foods"), orderBy("name"));
    const unsubscribeFoods = onSnapshot(foodsQuery, (querySnapshot) => {
      const foodsData: Food[] = [];
      querySnapshot.forEach((doc) => {
        foodsData.push({ id: doc.id, ...doc.data() } as Food);
      });
      setFoods(foodsData);
    });

    const patientsQuery = query(collection(db, "patients"), orderBy("name"));
    const unsubscribePatients = onSnapshot(patientsQuery, (querySnapshot) => {
      const patientsData: Patient[] = [];
      querySnapshot.forEach((doc) => {
        patientsData.push({ id: doc.id, ...doc.data() } as Patient);
      });
      setPatients(patientsData);
    });

    return () => {
      unsubscribeFoods();
      unsubscribePatients();
    };
  }, []);

  const handleSearch = async () => {
    if (!selectedPatientId || !searchTerm.trim()) {
      setError("Please select a patient and enter a search term.");
      return;
    }
    setLoading(true);
    setError(null);
    setRecommendations(null);

    const patient = patients.find(p => p.id === selectedPatientId);
    if (!patient) {
      setError("Could not find selected patient.");
      setLoading(false);
      return;
    }

    const patientProfile = `
      Name: ${patient.name}, Age: ${patient.age}, Gender: ${patient.gender}, Dosha: ${patient.dosha}.
      Dietary Preferences: ${patient.diet || 'Not specified'}.
      Health Notes: ${patient.notes || 'Not specified'}.
      Allergies: ${patient.allergies || 'None'}.
    `;
    
    // For large food lists, consider filtering before sending or using a more advanced retrieval method.
    const foodListString = JSON.stringify(foods.map(f => ({ name: f.name, category: f.category, properties: f.properties, qualities: f.qualities })));

    try {
      const result = await recommendFoodsForPatient({
        patientProfile,
        searchQuery: searchTerm,
        foodList: foodListString,
      });
      setRecommendations(result.recommendations);
    } catch (e) {
      console.error(e);
      setError("Sorry, our AI couldn't fetch recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="space-y-8">
      <PageHeader title="AI Food Recommender" description="Get personalized food recommendations for your patients." />
      
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">1. Select a Patient</label>
               <Select onValueChange={setSelectedPatientId} value={selectedPatientId || ''}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select patient..." />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.length > 0 ? (
                      patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id!}>
                          {patient.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-4 text-sm text-muted-foreground">No patients found.</div>
                    )}
                  </SelectContent>
                </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">2. Search for a Food</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="e.g., 'cooling vegetables', 'foods for pitta', 'grains'" 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                 <Button onClick={handleSearch} disabled={loading || !selectedPatientId || !searchTerm}>
                  {loading ? (
                    <><Loader2 className="animate-spin" /> Searching...</>
                  ) : (
                    <><Sparkles /> Get Recommendations</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        {loading && (
          <div className="flex flex-col items-center justify-center text-muted-foreground space-y-4 p-8">
             <Loader2 className="size-12 animate-spin text-primary" />
             <p className="text-lg">Our AI is analyzing the best foods for your patient...</p>
          </div>
        )}
        {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

        {recommendations && (
           <div className="space-y-4">
             <h2 className="font-headline text-3xl text-primary">Recommended for {patients.find(p => p.id === selectedPatientId)?.name}</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec) => (
                <Card key={rec.name} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wheat className="text-primary"/>
                      {rec.name}
                    </CardTitle>
                    <CardDescription>{rec.ayurvedicProperties}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                     <div className="flex items-start gap-3 text-sm">
                       <BrainCircuit className="size-5 mt-1 shrink-0 text-primary/70" />
                       <p className="text-muted-foreground">{rec.reasoning}</p>
                     </div>
                  </CardContent>
                </Card>
              ))}
             </div>
           </div>
        )}

        {!loading && !recommendations && !error && (
            <div className="text-center p-16 border-2 border-dashed rounded-lg">
                <User className="mx-auto size-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium text-muted-foreground">Personalized recommendations will appear here.</h3>
                <p className="mt-1 text-sm text-muted-foreground">Select a patient and search for a food to get started.</p>
            </div>
        )}
      </div>
    </div>
  )
}
