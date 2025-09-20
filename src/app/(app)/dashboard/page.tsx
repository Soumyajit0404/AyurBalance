import Link from "next/link"
import Image from "next/image"
import {
  HeartPulse,
  Leaf,
  BookOpen,
  Wind,
  Flame,
  Mountain,
  ArrowRight,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"

const features = [
  {
    title: "Patient Management",
    description: "Create and manage detailed profiles for your patients.",
    icon: <HeartPulse className="size-8 text-primary" />,
  },
  {
    title: "Food Database",
    description: "Browse a comprehensive database of foods and their properties.",
    icon: <Leaf className="size-8 text-primary" />,
  },
  {
    title: "AI Diet Plans",
    description: "Generate personalized Ayurvedic diet plans with our AI tool.",
    icon: <BookOpen className="size-8 text-primary" />,
  },
]

const doshas = [
  {
    title: "Vata (Air & Ether)",
    description: "Governs movement, creativity, and vitality. Prone to anxiety and dryness when imbalanced.",
    icon: <Wind className="size-8 text-primary" />,
    image: {
      url: "https://picsum.photos/seed/vata-dosha/600/400",
      alt: "Illustration of wind and flowing leaves",
      hint: "wind leaves",
    },
  },
  {
    title: "Pitta (Fire & Water)",
    description: "Controls digestion, metabolism, and intelligence. Imbalances can lead to inflammation and anger.",
    icon: <Flame className="size-8 text-primary" />,
    image: {
      url: "https://picsum.photos/seed/pitta-dosha/600/400",
      alt: "Illustration of a gentle flame",
      hint: "gentle flame",
    },
  },
  {
    title: "Kapha (Earth & Water)",
    description: "Provides structure, stability, and lubrication. Excess Kapha can cause lethargy and congestion.",
    icon: <Mountain className="size-8 text-primary" />,
    image: {
      url: "https://picsum.photos/seed/kapha-dosha/600/400",
      alt: "Illustration of stable, earthy mountains",
      hint: "earthy mountains",
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
            <Card key={feature.title} className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                   {feature.icon}
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
                <CardDescription className="mt-2">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Doshas Section */}
      <section>
        <h2 className="text-3xl font-headline text-center text-primary mb-8">Understanding the Doshas</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {doshas.map((dosha) => (
            <Card key={dosha.title} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0">
                <Image
                  src={dosha.image.url}
                  alt={dosha.image.alt}
                  width={600}
                  height={400}
                  data-ai-hint={dosha.image.hint}
                  className="aspect-video object-cover"
                />
              </CardHeader>
              <CardContent className="flex-grow p-6">
                <div className="flex items-start gap-4">
                  {dosha.icon}
                  <div className="flex-1">
                    <CardTitle className="font-headline text-2xl">{dosha.title}</CardTitle>
                    <p className="mt-2 text-muted-foreground">{dosha.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
