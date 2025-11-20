import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ShadcnCardProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "glass" | "outline";
  badge?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "secondary" | "outline" | "ghost";
  };
}

export function ShadcnCard({ 
  title, 
  description, 
  children, 
  className,
  variant = "default",
  badge,
  action
}: ShadcnCardProps) {
  const cardVariants = {
    default: "card",
    glass: "card glass-card",
    outline: "card border-2"
  };

  return (
    <Card className={cn(cardVariants[variant], "hover-lift", className)}>
      <CardHeader className="card-header">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="card-title">{title}</CardTitle>
            {description && (
              <CardDescription className="card-description">
                {description}
              </CardDescription>
            )}
          </div>
          {badge && (
            <Badge className="badge badge-secondary">
              {badge}
            </Badge>
          )}
        </div>
      </CardHeader>
      {children && (
        <CardContent className="card-content">
          {children}
        </CardContent>
      )}
      {action && (
        <CardContent className="card-content pt-0">
          <Button 
            onClick={action.onClick}
            variant={action.variant || "default"}
            className="btn w-full"
          >
            {action.label}
          </Button>
        </CardContent>
      )}
    </Card>
  );
}