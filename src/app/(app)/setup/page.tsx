
"use client";

import { useState, useEffect } from "react";
import { writeBatch, doc } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import foodData from "@/lib/food-data.json";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const UPLOADED_FOODS_KEY = 'ayurbalance_uploaded_foods';

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [newItems, setNewItems] = useState<typeof foodData.foods>([]);
  const [isUpToDate, setIsUpToDate] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const getUploadedFoods = () => {
      try {
        const uploaded = localStorage.getItem(UPLOADED_FOODS_KEY);
        return uploaded ? JSON.parse(uploaded) : [];
      } catch (e) {
        console.error("Failed to parse uploaded foods from localStorage", e);
        return [];
      }
    };

    const uploadedFoodNames = getUploadedFoods();
    const allFoodNames = foodData.foods.map(food => food.name);

    const itemsToUpload = foodData.foods.filter(
      (food) => !uploadedFoodNames.includes(food.name)
    );

    setNewItems(itemsToUpload);

    if (itemsToUpload.length === 0 && uploadedFoodNames.length >= allFoodNames.length) {
      setIsUpToDate(true);
    }
  }, []);

  const handleUpload = async () => {
    setLoading(true);
    setProgress(0);

    const batchSize = 400; // Firestore batch limit is 500
    const numBatches = Math.ceil(newItems.length / batchSize);

    try {
      let successfullyUploadedNames: string[] = [];

      for (let i = 0; i < numBatches; i++) {
        const batch = writeBatch(db);
        const start = i * batchSize;
        const end = start + batchSize;
        const foodBatch = newItems.slice(start, end);

        foodBatch.forEach((food) => {
          const docId = food.name.replace(/\//g, '-');
          const docRef = doc(db, "foods", docId);
          batch.set(docRef, food);
        });

        await batch.commit();
        successfullyUploadedNames = [
          ...successfullyUploadedNames,
          ...foodBatch.map(f => f.name)
        ];
        const currentProgress = ((i + 1) / numBatches) * 100;
        setProgress(currentProgress);
      }

      toast({
        title: "Upload Successful!",
        description: `${newItems.length} new food items have been added to your database.`,
      });

      // Update localStorage with all uploaded items
      const previouslyUploaded = JSON.parse(localStorage.getItem(UPLOADED_FOODS_KEY) || '[]');
      const allUploaded = [...new Set([...previouslyUploaded, ...successfullyUploadedNames])];
      localStorage.setItem(UPLOADED_FOODS_KEY, JSON.stringify(allUploaded));
      
      setNewItems([]);
      setIsUpToDate(true);

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
            This tool uploads the extensive food list to your database. It's smart enough to only add new items if the list is updated later.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Important Note</AlertTitle>
            <AlertDescription>
              To clear duplicates from previous attempts, please delete the entire 'foods' collection in your Firebase console before running this again. This new uploader prevents future duplicates.
            </AlertDescription>
          </Alert>

          {isUpToDate ? (
            <div className="flex items-center justify-center p-4 rounded-md bg-green-50 text-green-700 border border-green-200">
                <CheckCircle className="mr-2" />
                <span>Your food database is up to date.</span>
            </div>
          ) : (
             <>
                <Button onClick={handleUpload} disabled={loading || newItems.length === 0} className="w-full">
                    {loading ? `Uploading... (${Math.round(progress)}%)` : `Upload ${newItems.length} New Food Items`}
                </Button>
                {loading && <Progress value={progress} className="w-full" />}
             </>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
