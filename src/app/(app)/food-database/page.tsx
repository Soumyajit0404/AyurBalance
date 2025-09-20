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

const mockFoods = [
  { name: "Apple", category: "Fruit", calories: 95, properties: "V-P- K+", qualities: "Cooling, Sweet" },
  { name: "Almonds (soaked)", category: "Nuts", calories: 7, properties: "V- P+ K+", qualities: "Heavy, Oily" },
  { name: "Basmati Rice (white)", category: "Grain", calories: 205, properties: "V-P-K-", qualities: "Light, Sweet" },
  { name: "Ghee", category: "Dairy", calories: 112, properties: "V-P- K+", qualities: "Oily, Heating" },
  { name: "Mung Dal", category: "Legume", calories: 212, properties: "V-P-K-", qualities: "Light, Astringent" },
  { name: "Spinach", category: "Vegetable", calories: 7, properties: "V+ P- K-", qualities: "Light, Astringent" },
  { name: "Ginger (fresh)", category: "Spice", calories: 5, properties: "V-P+ K-", qualities: "Pungent, Heating" },
];


export default function FoodDatabasePage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Food Database" description="Explore foods and their Ayurvedic properties." />
       <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search for a food item..." className="pl-10" />
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
            {mockFoods.map((food) => (
              <TableRow key={food.name}>
                <TableCell className="font-medium">{food.name}</TableCell>
                <TableCell>{food.category}</TableCell>
                <TableCell>{food.calories}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{food.properties}</Badge>
                </TableCell>
                <TableCell>{food.qualities}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
