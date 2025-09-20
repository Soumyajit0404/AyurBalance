import Link from "next/link"
import Image from "next/image"
import {
  Globe,
  Activity,
  ShieldCheck,
  Building,
  Mountain,
  Leaf,
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
    title: "Real-Time Data Integration",
    description: "Track asteroids with live data from global observatories.",
    icon: <Globe className="size-8 text-primary" />,
  },
  {
    title: "Impact Simulation",
    description: "Model and visualize potential impact scenarios on a global scale.",
    icon: <Activity className="size-8 text-primary" />,
  },
  {
    title: "Mitigation Strategies",
    description: "Explore and evaluate different strategies to prevent or reduce impact.",
    icon: <ShieldCheck className="size-8 text-primary" />,
  },
]

const riskFactors = [
  {
    title: "Seismic Effect",
    description: "Analyze the potential for earthquakes and tsunamis following an impact.",
    icon: <Mountain className="size-8 text-primary" />,
    image: {
      url: "https://picsum.photos/seed/seismic-effect/600/400",
      alt: "Illustration of seismic waves",
      hint: "seismic waves",
    },
  },
  {
    title: "Population Risk",
    description: "Assess the risk to human populations in the affected areas.",
    icon: <Building className="size-8 text-primary" />,
    image: {
      url: "https://picsum.photos/seed/population-risk/600/400",
      alt: "City skyline at risk",
      hint: "city skyline",
    },
  },
  {
    title: "Environmental Damage",
    description: "Evaluate the long-term environmental consequences of an impact event.",
    icon: <Leaf className="size-8 text-primary" />,
    image: {
      url: "https://picsum.photos/seed/environmental-damage/600/400",
      alt: "Forest with a hazy sky",
      hint: "forest haze",
    },
  },
]


export default function DashboardPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center">
        <PageHeader
          title="Welcome to Meteor Madness"
          description="Simulate asteroid impacts, analyze risks, and explore mitigation strategies with cutting-edge data."
          className="items-center"
        />
        <Button asChild size="lg" className="mt-4">
          <Link href="/simulation-tool">
            Go to Simulation Tool
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

      {/* Risk Factors Section */}
      <section>
        <h2 className="text-3xl font-headline text-center text-primary mb-8">Key Risk Factors</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {riskFactors.map((factor) => (
            <Card key={factor.title} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0">
                <Image
                  src={factor.image.url}
                  alt={factor.image.alt}
                  width={600}
                  height={400}
                  data-ai-hint={factor.image.hint}
                  className="aspect-video object-cover"
                />
              </CardHeader>
              <CardContent className="flex-grow p-6">
                <div className="flex items-start gap-4">
                  {factor.icon}
                  <div className="flex-1">
                    <CardTitle className="font-headline text-2xl">{factor.title}</CardTitle>
                    <p className="mt-2 text-muted-foreground">{factor.description}</p>
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
