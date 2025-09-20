import { PageHeader } from "@/components/page-header";
import { DietPlanToolClient } from "./client";

export default function DietPlanToolPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Diet Plan Generator"
        description="Generate personalized Ayurvedic diet plans based on patient data."
      />
      <DietPlanToolClient />
    </div>
  );
}
