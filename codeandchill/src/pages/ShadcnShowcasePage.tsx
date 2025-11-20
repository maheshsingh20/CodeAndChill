import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShadcnCard } from "@/components/ui/shadcn-card";
import { 
  Code, 
  Palette, 
  Zap, 
  Shield, 
  Sparkles, 
  Rocket,
  Star,
  Heart,
  ThumbsUp
} from "lucide-react";

export function ShadcnShowcasePage() {
  const [activeTab, setActiveTab] = useState("components");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Palette className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Shadcn Dark Mode</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A comprehensive dark theme implementation using shadcn/ui components with consistent styling
            </p>
            <div className="flex items-center justify-center gap-2">
              <Badge className="badge badge-default">Dark Mode</Badge>
              <Badge className="badge badge-secondary">Consistent</Badge>
              <Badge className="badge badge-outline">Professional</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="tabs w-full">
          <TabsList className="tabs-list grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="components" className="tabs-trigger">Components</TabsTrigger>
            <TabsTrigger value="cards" className="tabs-trigger">Cards</TabsTrigger>
            <TabsTrigger value="forms" className="tabs-trigger">Forms</TabsTrigger>
            <TabsTrigger value="colors" className="tabs-trigger">Colors</TabsTrigger>
          </TabsList>

          <TabsContent value="components" className="tabs-content space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Button Variants */}
              <Card className="card">
                <CardHeader className="card-header">
                  <CardTitle className="card-title">Buttons</CardTitle>
                  <CardDescription className="card-description">
                    Various button styles and states
                  </CardDescription>
                </CardHeader>
                <CardContent className="card-content space-y-4">
                  <Button className="btn btn-default w-full">Default</Button>
                  <Button className="btn btn-secondary w-full">Secondary</Button>
                  <Button className="btn btn-outline w-full">Outline</Button>
                  <Button className="btn btn-ghost w-full">Ghost</Button>
                  <Button className="btn btn-destructive w-full">Destructive</Button>
                </CardContent>
              </Card>

              {/* Badge Variants */}
              <Card className="card">
                <CardHeader className="card-header">
                  <CardTitle className="card-title">Badges</CardTitle>
                  <CardDescription className="card-description">
                    Status indicators and labels
                  </CardDescription>
                </CardHeader>
                <CardContent className="card-content">
                  <div className="flex flex-wrap gap-2">
                    <Badge className="badge badge-default">Default</Badge>
                    <Badge className="badge badge-secondary">Secondary</Badge>
                    <Badge className="badge badge-outline">Outline</Badge>
                    <Badge className="badge badge-destructive">Destructive</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Icons */}
              <Card className="card">
                <CardHeader className="card-header">
                  <CardTitle className="card-title">Icons</CardTitle>
                  <CardDescription className="card-description">
                    Lucide icons with consistent styling
                  </CardDescription>
                </CardHeader>
                <CardContent className="card-content">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <Code className="h-6 w-6 text-primary" />
                      <span className="text-xs text-muted-foreground">Code</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Zap className="h-6 w-6 text-primary" />
                      <span className="text-xs text-muted-foreground">Zap</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Shield className="h-6 w-6 text-primary" />
                      <span className="text-xs text-muted-foreground">Shield</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Sparkles className="h-6 w-6 text-primary" />
                      <span className="text-xs text-muted-foreground">Sparkles</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cards" className="tabs-content space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ShadcnCard
                title="Default Card"
                description="A standard card with default styling"
                badge="New"
                action={{
                  label: "Learn More",
                  onClick: () => console.log("Default card clicked")
                }}
              >
                <p className="text-muted-foreground">
                  This is a default card with consistent shadcn styling.
                </p>
              </ShadcnCard>

              <ShadcnCard
                title="Glass Card"
                description="A card with glass morphism effect"
                variant="glass"
                badge="Popular"
                action={{
                  label: "Get Started",
                  onClick: () => console.log("Glass card clicked"),
                  variant: "secondary"
                }}
              >
                <p className="text-muted-foreground">
                  This card uses a glass effect with backdrop blur.
                </p>
              </ShadcnCard>

              <ShadcnCard
                title="Outline Card"
                description="A card with prominent border"
                variant="outline"
                badge="Featured"
                action={{
                  label: "Explore",
                  onClick: () => console.log("Outline card clicked"),
                  variant: "outline"
                }}
              >
                <p className="text-muted-foreground">
                  This card emphasizes the border for a clean look.
                </p>
              </ShadcnCard>
            </div>
          </TabsContent>

          <TabsContent value="forms" className="tabs-content space-y-8">
            <Card className="card max-w-md mx-auto">
              <CardHeader className="card-header">
                <CardTitle className="card-title">Sample Form</CardTitle>
                <CardDescription className="card-description">
                  Consistent form styling with shadcn components
                </CardDescription>
              </CardHeader>
              <CardContent className="card-content space-y-6">
                <div className="space-y-2">
                  <Label className="label">Name</Label>
                  <Input className="input" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <Label className="label">Email</Label>
                  <Input className="input" type="email" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <Label className="label">Message</Label>
                  <Input className="input" placeholder="Enter your message" />
                </div>
                <Button className="btn btn-default w-full">Submit</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="colors" className="tabs-content space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="card">
                <CardHeader className="card-header">
                  <CardTitle className="card-title">Color Palette</CardTitle>
                  <CardDescription className="card-description">
                    Shadcn dark mode color system
                  </CardDescription>
                </CardHeader>
                <CardContent className="card-content space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-background border border-border"></div>
                      <span className="text-sm text-foreground">Background</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-foreground"></div>
                      <span className="text-sm text-foreground">Foreground</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-primary"></div>
                      <span className="text-sm text-foreground">Primary</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-secondary"></div>
                      <span className="text-sm text-foreground">Secondary</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-muted"></div>
                      <span className="text-sm text-foreground">Muted</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-accent"></div>
                      <span className="text-sm text-foreground">Accent</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card">
                <CardHeader className="card-header">
                  <CardTitle className="card-title">Interactive Elements</CardTitle>
                  <CardDescription className="card-description">
                    Hover and focus states
                  </CardDescription>
                </CardHeader>
                <CardContent className="card-content space-y-4">
                  <div className="space-y-3">
                    <Button className="btn btn-default w-full hover-lift">
                      <Star className="mr-2 h-4 w-4" />
                      Hover Effect
                    </Button>
                    <Button className="btn btn-secondary w-full hover-lift">
                      <Heart className="mr-2 h-4 w-4" />
                      Secondary Hover
                    </Button>
                    <Button className="btn btn-outline w-full hover-lift">
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      Outline Hover
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}