
"use client";

import { useState } from "react";
import { writeBatch, doc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import foodData from "@/lib/food-data.json";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleUpload = async () => {
    setLoading(true);
    setProgress(0);

    const foods = foodData.foods;
    const batchSize = 400; // Firestore batch limit is 500
    const numBatches = Math.ceil(foods.length / batchSize);

    try {
      for (let i = 0; i < numBatches; i++) {
        const batch = writeBatch(db);
        const start = i * batchSize;
        const end = start + batchSize;
        const foodBatch = foods.slice(start, end);

        foodBatch.forEach((food) => {
          // Use food.name as the document ID to prevent duplicates
          const docRef = doc(db, "foods", food.name);
          batch.set(docRef, food);
        });

        await batch.commit();
        const currentProgress = ((i + 1) / numBatches) * 100;
        setProgress(currentProgress);
      }

      toast({
        title: "Upload Successful!",
        description: `${foods.length} food items have been created or updated in your database.`,
      });
    } catch (error) {
      console.error("Error uploading food data: ", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "There was an error populating the database. Check the console for details.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="One-Time Data Setup"
        description="Populate your Firestore database with the initial food data."
      />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Food Database Population</CardTitle>
          <CardDescription>
            Click the button below to upload over 700 food items to your 'foods' collection in Firestore.
            You can run this multiple times; it will update existing items and add new ones without creating duplicates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Important Note</AlertTitle>
            <AlertDescription>
              This process will add/update documents in your Firestore 'foods' collection. If you have duplicate items from a previous upload, please delete the collection in your Firebase console before running this again.
            </AlertDescription>
          </Alert>

          <Button onClick={handleUpload} disabled={loading} className="w-full">
            {loading ? `Uploading... (${Math.round(progress)}%)` : "Upload Food Data to Firestore"}
          </Button>
          {loading && <Progress value={progress} className="w-full" />}
        </CardContent>
      </Card>
    </div>
  );
}
