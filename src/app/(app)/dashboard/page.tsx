import Link from "next/link"
import Image from "next/image"
import {
  Carrot,
  NotebookText,
  Pipette,
  Users,
  MessageCircleQuestion,
  ArrowRight,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Button } from "@/components/ui/button"

const features = [
  {
    title: "Patient Profiles",
    description: "Manage patient demographics, health data, and dietary preferences.",
    href: "/patients",
    icon: <Users className="size-8 text-primary" />,
    image: PlaceHolderImages.find((img) => img.id === 'dash-patients'),
    priority: true,
  },
  {
    title: "Food Database",
    description: "Browse foods with nutritional and Ayurvedic attributes.",
    href: "/food-database",
    icon: <Carrot className="size-8 text-primary" />,
    image: PlaceHolderImages.find((img) => img.id === 'dash-food'),
  },
  {
    title: "AI Diet Plan Tool",
    description: "Generate personalized Ayurvedic diet plans based on patient data.",
    href: "/diet-plan-tool",
    icon: <NotebookText className="size-8 text-primary" />,
    image: PlaceHolderImages.find((img) => img.id === 'dash-diet'),
  },
  {
    title: "Recipe Analysis",
    description: "Analyze custom recipes for nutritional and Ayurvedic properties.",
    href: "/recipe-analysis",
    icon: <Pipette className="size-8 text-primary" />,
    image: PlaceHolderImages.find((img) => img.id === 'dash-recipe'),
  },
  {
    title: "Natural Language Q&A",
    description: "Ask questions about diet and wellness using natural language.",
    href: "/q-and-a",
    icon: <MessageCircleQuestion className="size-8 text-primary" />,
    image: PlaceHolderImages.find((img) => img.id === 'dash-q-and-a'),
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Welcome to AyurBalance"
        description="Your holistic solution for Ayurvedic diet management."
        className="text-center"
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.href} className="flex">
            <Card className="flex flex-col w-full hover:border-primary transition-all duration-300 hover:shadow-lg hover:scale-105">
              <CardHeader>
                {feature.image && (
                   <Image
                    src={feature.image.imageUrl}
                    alt={feature.image.description}
                    width={600}
                    height={400}
                    priority={feature.priority}
                    data-ai-hint={feature.image.imageHint}
                    className="rounded-lg aspect-video object-cover"
                  />
                )}
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-start gap-4">
                  {feature.icon}
                  <div className="flex-1">
                    <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
                    <CardDescription className="mt-1">{feature.description}</CardDescription>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                 <Button variant="ghost" className="w-full justify-start text-primary hover:text-primary">
                    <span>Go to {feature.title}</span>
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
