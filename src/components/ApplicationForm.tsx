import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Send } from "lucide-react";

const MIN_CHARACTERS = 100;

interface ApplicationFormProps {
  onSuccess: () => void;
}

export const ApplicationForm = ({ onSuccess }: ApplicationFormProps) => {
  const [application, setApplication] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const characterCount = application.length;
  const isValid = characterCount >= MIN_CHARACTERS;
  const remainingChars = MIN_CHARACTERS - characterCount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("submit-application", {
        body: { application: application.trim() },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Application Submitted!",
        description: "Redirecting you to our Discord...",
      });

      onSuccess();
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-3xl font-bold text-gradient">
          Apply Here
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Textarea
              value={application}
              onChange={(e) => setApplication(e.target.value)}
              placeholder="Tell us about yourself! Why do you want to join Dash SMP? What's your Minecraft experience? What makes you a great addition to our community?..."
              className="min-h-[200px] resize-none bg-input/50 border-border/50 focus:border-primary/50 transition-all duration-300 text-foreground placeholder:text-muted-foreground"
              disabled={isSubmitting}
            />
            
            {/* Character counter */}
            <div className="flex justify-end">
              <span
                className={`text-sm transition-colors duration-300 ${
                  isValid
                    ? "text-primary"
                    : characterCount > 0
                    ? "text-muted-foreground"
                    : "text-muted-foreground/60"
                }`}
              >
                {characterCount} / {MIN_CHARACTERS}
                {!isValid && characterCount > 0 && (
                  <span className="ml-1 text-muted-foreground">
                    ({remainingChars} more needed)
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`w-full h-12 text-lg font-semibold transition-all duration-500 ${
              isValid
                ? "glow-effect-active hover:scale-[1.02] bg-primary text-primary-foreground animate-pulse-glow"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Submit Application
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
