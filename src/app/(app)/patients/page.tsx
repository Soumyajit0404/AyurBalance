import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { PlusCircle, MoreHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const mockPatients = [
  { id: "PAT001", name: "Ananya Sharma", age: 34, gender: "Female", dosha: "Pitta-Vata", lastVisit: "2023-10-15" },
  { id: "PAT002", name: "Rohan Verma", age: 45, gender: "Male", dosha: "Kapha", lastVisit: "2023-10-12" },
  { id: "PAT003", name: "Priya Singh", age: 28, gender: "Female", dosha: "Vata", lastVisit: "2023-10-18" },
  { id: "PAT004", name: "Amit Patel", age: 52, gender: "Male", dosha: "Pitta", lastVisit: "2023-09-25" },
  { id: "PAT005", name: "Sunita Gupta", age: 41, gender: "Female", dosha: "Kapha-Pitta", lastVisit: "2023-10-20" },
];

const doshaColors: { [key: string]: string } = {
  "Vata": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Pitta": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  "Kapha": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "Pitta-Vata": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  "Kapha-Pitta": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
};


export default function PatientsPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Patient Profiles" description="Manage your patients' information and diet plans.">
        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <PlusCircle />
              New Patient
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="font-headline text-2xl text-primary">Add New Patient</SheetTitle>
              <SheetDescription>
                Fill in the details to create a new patient profile.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" placeholder="Patient's full name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="age" className="text-right">
                  Age
                </Label>
                <Input id="age" type="number" placeholder="Patient's age" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="gender" className="text-right">
                  Gender
                </Label>
                <Input id="gender" placeholder="e.g., Female, Male" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dosha" className="text-right">
                  Dosha
                </Label>
                <Input id="dosha" placeholder="e.g., Vata, Pitta-Kapha" className="col-span-3" />
              </div>
              <div className="grid grid-cols-1 items-center gap-2">
                <Label htmlFor="notes">
                  Initial Notes
                </Label>
                <Textarea id="notes" placeholder="Any initial observations or health details..." />
              </div>
            </div>
             <div className="flex justify-end">
                <Button type="submit">Save Patient</Button>
            </div>
          </SheetContent>
        </Sheet>
      </PageHeader>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Dosha Type</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">{patient.id}</TableCell>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${doshaColors[patient.dosha] || ''} border-transparent`}>{patient.dosha}</Badge>
                </TableCell>
                <TableCell>{patient.lastVisit}</TableCell>
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
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>View Diet Plan</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
