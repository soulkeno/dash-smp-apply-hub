import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export const SuccessMessage = () => {
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm glow-effect">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-6 animate-pulse">
          <CheckCircle2 className="h-20 w-20 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-gradient mb-4">
          Application Submitted!
        </h2>
        <p className="text-muted-foreground text-lg mb-2">
          Thank you for applying to Dash SMP.
        </p>
        <p className="text-muted-foreground">
          Redirecting you to our Discord in a few seconds...
        </p>
      </CardContent>
    </Card>
  );
};
