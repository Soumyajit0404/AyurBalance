"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { generateAyurvedicDietPlan } from "@/ai/flows/generate-ayurvedic-diet-plan";
import { saveDietPlanToPatient } from "@/app/(app)/patients/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, Printer, NotebookText, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Patient } from "@/app/(app)/patients/patient-form";
import jsPDF from "jspdf";

const formSchema = z.object({
  patientData: z.string().min(20, {
    message: "Patient data must be at least 20 characters.",
  }),
});

export function DietPlanToolClient() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dietPlan, setDietPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "patients"), orderBy("name"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const patientsData: Patient[] = [];
      querySnapshot.forEach((doc) => {
        patientsData.push({ id: doc.id, ...doc.data() } as Patient);
      });
      setPatients(patientsData);
    });
    return () => unsubscribe();
  }, []);

  // When a new diet plan is generated, reset edit state
  useEffect(() => {
    if (dietPlan) {
      setEditedPlan(dietPlan);
      setEditing(false);
    }
  }, [dietPlan]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientData: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setDietPlan(null);
    setError(null);
    try {
      const result = await generateAyurvedicDietPlan(values);
      setDietPlan(result.dietPlan);
    } catch (e) {
      setError("Failed to generate diet plan. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleSavePlan = async () => {
    if (!selectedPatientId || !dietPlan) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a patient and generate a diet plan first.",
      });
      return;
    }
    setSaving(true);
    const result = await saveDietPlanToPatient(selectedPatientId, dietPlan);
    if (result.success) {
      const patientName = patients.find(p => p.id === selectedPatientId)?.name;
      toast({
        title: "Plan Saved!",
        description: `Diet plan has been saved to ${patientName}'s profile.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: result.error,
      });
    }
    setSaving(false);
  };

  // Helper: Format markdown-like text for PDF
  function formatDietPlanForPDF(markdown: string): string[] {
    const lines = markdown.split('\n');
    const formatted: string[] = [];
    lines.forEach(line => {
      // Headings: lines starting with ## or #
      if (/^#+\s/.test(line)) {
        formatted.push('\n' + line.replace(/^#+\s/, '').toUpperCase());
      }
      // Bullet points: lines starting with * or -
      else if (/^\s*[\*\-]\s/.test(line)) {
        formatted.push('• ' + line.replace(/^\s*[\*\-]\s/, ''));
      }
      // Numbered lists: lines starting with 1. 2. etc.
      else if (/^\s*\d+\.\s/.test(line)) {
        formatted.push(line.trim());
      }
      // Bold: **text**
      else if (/\*\*(.*?)\*\*/.test(line)) {
        formatted.push(line.replace(/\*\*(.*?)\*\*/g, '$1'));
      }
      // Italic: *text*
      else if (/\*(.*?)\*/.test(line)) {
        formatted.push(line.replace(/\*(.*?)\*/g, '$1'));
      }
      else {
        formatted.push(line.trim());
      }
    });
    return formatted.filter(l => l.length > 0);
  }

  const handleExportPDF = () => {
    if (!dietPlan && !editedPlan) return;
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("AyurBalance Diet Plan", 20, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    let y = 35;
    const selectedPatient = patients.find(p => p.id === selectedPatientId);
    if (selectedPatient) {
      doc.text(`Patient: ${selectedPatient.name}`, 20, y);
      y += 8;
      doc.text(`Age: ${selectedPatient.age} | Gender: ${selectedPatient.gender}`, 20, y);
      y += 8;
    }

    // Format diet plan for PDF
    const lines = formatDietPlanForPDF(editedPlan || dietPlan || "");
    lines.forEach(line => {
      // Bold headings
      if (/^[A-Z\s]+$/.test(line) && line.length > 0) {
        doc.setFont("helvetica", "bold");
      } else {
        doc.setFont("helvetica", "normal");
      }
      doc.text(line, 20, y);
      y += 8;
    });

    doc.save("AyurBalance-Diet-Plan.pdf");
  };

  const formatPlan = (text: string) => {
    return text
      .replace(/^#\s(.*?)$/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
      .replace(/^##\s(.*?)$/gm, '<h3 class="text-lg font-bold mt-3 mb-1">$1</h3>')
      .replace(/^###\s(.*?)$/gm, '<h4 class="text-md font-bold mt-2 mb-1">$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^\*\s(.*?)$/gm, '<li>$1</li>')
      .replace(/^\s*\-\s(.*?)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
      .replace(/<li>(.*?)<ul>/gs, '<li>$1<ul class="pl-4">')
      .replace(/<\/ul>\n<ul>/gs, '')
      .replace(/(\r\n|\n|\r)/gm, "<br />")
      .replace(/<br \/>\n*<br \/>/gm, '<br />')
      .replace(/<ul><br \/>/g, '<ul>')
      .replace(/<br \/>\s*<\/ul>/g, '</ul>');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="patientData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient Data & Preferences</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Patient is a 35-year-old male, Pitta dosha with high Vata imbalance. Prefers vegetarian food, dislikes spicy meals. Works a desk job..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include dosha, imbalances, health parameters, and dietary preferences for best results.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles />
                    Generate AI Diet Plan
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="sticky top-24">
        <Card className="min-h-[400px]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline text-2xl text-primary">Generated Diet Plan</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleExportPDF}
                disabled={!dietPlan}
              >
                <Printer className="h-4 w-4" />
                <span className="sr-only">Export as PDF</span>
              </Button>
              {dietPlan && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setEditing((prev) => !prev)}
                  aria-label="Edit"
                >
                  ✏️
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Loader2 className="size-12 animate-spin text-primary" />
                <p className="mt-4">Our AI is crafting the perfect plan...</p>
              </div>
            )}
            {error && <p className="text-destructive">{error}</p>}
            {dietPlan && !editing && (
              <div
                className="prose prose-sm dark:prose-invert max-w-none font-body text-foreground"
                dangerouslySetInnerHTML={{ __html: formatPlan(editedPlan) }}
              />
            )}
            {dietPlan && editing && (
              <Textarea
                className="min-h-[200px] font-body"
                value={editedPlan}
                onChange={e => setEditedPlan(e.target.value)}
              />
            )}
            {!loading && !dietPlan && !error && (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <NotebookText className="size-12" />
                <p className="mt-4">Your generated diet plan will appear here.</p>
              </div>
            )}
          </CardContent>
          {dietPlan && (
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select onValueChange={setSelectedPatientId} value={selectedPatientId || ''}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select patient to save plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id!}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleSavePlan} disabled={saving || !selectedPatientId}>
                  {saving ? <Loader2 className="animate-spin" /> : <Save />}
                  Save to Patient
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
      {dietPlan && (
        <Button
          className="mt-4 px-4 py-2 rounded bg-[#c87058] text-white font-bold hover:bg-[#613f3c]"
          onClick={handleExportPDF}
        >
          Export as PDF
        </Button>
      )}
    </div>
  );
}
