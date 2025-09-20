import { PageHeader } from "@/components/page-header";
import { QAndAClient } from "./client";

export default function QAndAPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      <PageHeader
        title="Ayurvedic Q&A"
        description="Ask our AI assistant about diet, wellness, and Ayurvedic principles."
      />
      <QAndAClient />
    </div>
  );
}
