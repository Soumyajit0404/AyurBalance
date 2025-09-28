import Link from "next/link"
import Image from "next/image"
import {
  HeartPulse,
  Leaf,
  BookOpen,
  Pipette,
  MessageCircleQuestion,
  TrendingUp,
  ArrowRight,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"

const features = [
  {
    title: "Patient Management",
    description: "Create and manage detailed profiles for your patients.",
    icon: <HeartPulse className="size-8 text-primary" />,
    href: "/patients",
  },
  {
    title: "Food Database",
    description: "Browse a comprehensive database of foods and their properties.",
    icon: <Leaf className="size-8 text-primary" />,
    href: "/food-database",
  },
  {
    title: "AI Diet Plans",
    description: "Generate personalized Ayurvedic diet plans with our AI tool.",
    icon: <BookOpen className="size-8 text-primary" />,
    href: "/diet-plan-tool",
  },
]

const tools = [
  {
    title: "Recipe Analysis",
    description: "Analyze any recipe for its nutritional and Ayurvedic properties.",
    icon: <Pipette className="size-8 text-primary" />,
    href: "/public/recipe-analysis",
    image: {
      url: "/recipe-analysis.jpg",
      alt: "Recipe Analysis",
      hint: "cooking food",
    },
  },
  {
    title: "Ayurvedic Q&A",
    description: "Ask our AI assistant about diet, wellness, and Ayurvedic principles.",
    icon: <MessageCircleQuestion className="size-8 text-primary" />,
    href: "/public/Ayurvedic",
    image: {
      url: "/Ayurvedic.jpg",
      alt: "A person looking at a laptop and thinking",
      hint: "person thinking",
    },
  },
  {
    title: "Patient Wellness Journey",
    description: "Visualize patient progress and dosha balance over time.",
    icon: <TrendingUp className="size-8 text-primary" />,
    href: "/public/Patient",
    image: {
      url: "/Patient.jpg",
      alt: "A chart showing an upward trend line",
      hint: "progress chart",
    },
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center">
        <PageHeader
          title="Welcome to AyurBalance"
          description="Your holistic solution for Ayurvedic diet management and patient wellness."
          className="items-center"
        />
        <Button asChild size="lg" className="mt-4">
          <Link href="/patients">
            View Patients
            <ArrowRight className="ml-2 size-5" />
          </Link>
        </Button>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-3xl font-headline text-center text-primary mb-8">Core Features</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
             <Link href={feature.href} key={feature.title}>
              <Card className="text-center h-full hover:shadow-lg transition-shadow duration-300 flex flex-col">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                    {feature.icon}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
                  <CardDescription className="mt-2">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Explore Tools Section */}
      <section>
        <h2 className="text-3xl font-headline text-center text-primary mb-8">Explore Our Tools</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Card key={tool.title} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0">
                <Image
                  src={tool.image.url}
                  alt={tool.image.alt}
                  width={600}
                  height={400}
                  data-ai-hint={tool.image.hint}
                  className="aspect-video object-cover"
                />
              </CardHeader>
              <CardContent className="flex-grow p-6 flex flex-col">
                 <div className="flex items-start gap-4 mb-4">
                  {tool.icon}
                  <div className="flex-1">
                    <CardTitle className="font-headline text-2xl">{tool.title}</CardTitle>
                    <p className="mt-2 text-muted-foreground">{tool.description}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                 <Button asChild variant="outline" className="w-full">
                  <Link href={tool.href}>
                    Go to {tool.title}
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
