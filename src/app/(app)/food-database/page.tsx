"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { generateFoodAnalysis } from "@/ai/flows/generate-food-analysis";

import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Wheat, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [dbLoading, setDbLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  useEffect(() => {
    const foodsQuery = query(collection(db, "foods"), orderBy("name"));
    const unsubscribeFoods = onSnapshot(foodsQuery, (querySnapshot) => {
      const foodsData: Food[] = [];
      querySnapshot.forEach((doc) => {
        foodsData.push({ id: doc.id, ...doc.data() } as Food);
      });
      setFoods(foodsData);
      setDbLoading(false);
    });

    return () => unsubscribeFoods();
  }, []);

  const filteredFoods = useMemo(() => {
    if (!searchTerm) return foods;
    return foods.filter((food) =>
      food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [foods, searchTerm]);

  const handleFoodClick = async (food: Food) => {
    setSelectedFood(food);
    setAnalysis(null);
    setAnalysisLoading(true);
    try {
      const result = await generateFoodAnalysis({
        foodName: food.name,
        foodProperties: food.properties,
      });
      setAnalysis(result.detailedAnalysis);
    } catch (e) {
      console.error(e);
      setAnalysis("Could not retrieve detailed analysis for this food.");
    } finally {
      setAnalysisLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Food Database"
        description="Browse foods and their Ayurvedic properties."
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for a food..."
          className="pl-10 w-full md:w-1/2 lg:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div>
        {dbLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton key={index} className="h-28 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredFoods.map((food) => (
              <Card
                key={food.id}
                className="cursor-pointer hover:shadow-lg hover:border-primary transition-all"
                onClick={() => handleFoodClick(food)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Wheat className="text-primary size-5" />
                    {food.name}
                  </CardTitle>
                  <CardDescription className="flex flex-wrap gap-2 pt-2">
                     <Badge variant="outline">{food.category}</Badge>
                     <Badge variant="secondary">{food.properties}</Badge>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
        {!dbLoading && filteredFoods.length === 0 && (
          <div className="text-center p-16 border-2 border-dashed rounded-lg">
              <Info className="mx-auto size-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium text-muted-foreground">No food found.</h3>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search term or check if data has been uploaded in the Setup page.</p>
          </div>
        )}
      </div>

      <Dialog open={!!selectedFood} onOpenChange={(open) => !open && setSelectedFood(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline text-3xl text-primary flex items-center gap-3">
               <Image
                  src={`https://picsum.photos/seed/${selectedFood?.name}/100/100`}
                  alt={selectedFood?.name || 'Food'}
                  width={60}
                  height={60}
                  className="rounded-md"
                  data-ai-hint={selectedFood?.name}
                />
              {selectedFood?.name}
            </DialogTitle>
            <DialogDescription className="pt-2">
              Detailed analysis of this food item.
            </DialogDescription>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="outline">{selectedFood?.category}</Badge>
              <Badge variant="secondary">{selectedFood?.calories} kcal (approx.)</Badge>
            </div>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] my-4 pr-4">
             {analysisLoading && (
                <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">
                    <Loader2 className="size-8 animate-spin text-primary mr-2" />
                    Analyzing...
                </div>
             )}
            {analysis && (
              <div
                className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-body text-foreground"
                dangerouslySetInnerHTML={{ __html: analysis.replace(/(\r\n|\n|\r)/gm, "<br>").replace(/\\*\\*/g, "") }}
              />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
