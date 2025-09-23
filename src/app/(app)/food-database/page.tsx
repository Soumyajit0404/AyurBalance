"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase-client"; // Using client-side firebase config
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton";

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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);

  useEffect(() => {
    const q = query(collection(db, "foods"), orderBy("name"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const foodsData: Food[] = [];
      querySnapshot.forEach((doc) => {
        foodsData.push({ id: doc.id, ...doc.data() } as Food);
      });
      setFoods(foodsData);
      setFilteredFoods(foodsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredFoods(foods);
    } else {
      setFilteredFoods(
        foods.filter((food) =>
          food.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, foods]);

  return (
    <div className="space-y-8">
      <PageHeader title="Food Database" description="Explore foods and their Ayurvedic properties." />
       <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search for a food item..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Food Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Calories (approx.)</TableHead>
              <TableHead>Ayurvedic Properties</TableHead>
              <TableHead>Qualities</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                </TableRow>
              ))
            ) : (
              filteredFoods.map((food) => (
                <TableRow key={food.id}>
                  <TableCell className="font-medium">{food.name}</TableCell>
                  <TableCell>{food.category}</TableCell>
                  <TableCell>{food.calories}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{food.properties}</Badge>
                  </TableCell>
                  <TableCell>{food.qualities}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
