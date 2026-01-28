import { useState } from "react";
import { ApplicationForm } from "@/components/ApplicationForm";
import { SuccessMessage } from "@/components/SuccessMessage";

const DISCORD_INVITE_URL = "https://discord.gg/your-invite-link"; // User can replace this

const Index = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSuccess = () => {
    setIsSubmitted(true);
    // Redirect to Discord after 3 seconds
    setTimeout(() => {
      window.location.href = DISCORD_INVITE_URL;
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-secondary/20 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo / Title */}
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gradient tracking-tight mb-2">
            Dash SMP
          </h1>
          <p className="text-muted-foreground text-lg">
            Minecraft Survival Server
          </p>
        </header>

        {/* Content */}
        {isSubmitted ? (
          <SuccessMessage />
        ) : (
          <ApplicationForm onSuccess={handleSuccess} />
        )}
      </div>
    </main>
  );
};

export default Index;
