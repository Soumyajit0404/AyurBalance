import { PageHeader } from "@/components/page-header";
import { RecipeAnalysisClient } from "./client";

export default function RecipeAnalysisPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Recipe Analysis"
        description="Analyze custom recipes for their nutritional and Ayurvedic properties."
      />
      <RecipeAnalysisClient />
    </div>
  );
}
