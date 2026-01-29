import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const DISCORD_WEBHOOK_URL = Deno.env.get("DISCORD_WEBHOOK_URL");

    if (!DISCORD_WEBHOOK_URL) {
      console.error("DISCORD_WEBHOOK_URL is not configured");
      throw new Error("Webhook URL not configured");
    }

    const { discordUsername, application } = await req.json();

    // Validate Discord username
    if (!discordUsername || typeof discordUsername !== "string" || discordUsername.trim().length < 3) {
      return new Response(
        JSON.stringify({ error: "Discord username must be at least 3 characters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate application
    if (!application || typeof application !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid application data" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate minimum length
    if (application.trim().length < 100) {
      return new Response(
        JSON.stringify({ error: "Application must be at least 100 characters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create Discord embed message
    const timestamp = new Date().toISOString();
    const discordPayload = {
      embeds: [
        {
          title: "📝 New Dash SMP Application",
          fields: [
            {
              name: "Discord Username",
              value: discordUsername.trim(),
              inline: true,
            },
            {
              name: "Application",
              value: application.trim(),
              inline: false,
            },
          ],
          color: 0x808080, // Gray color to match theme
          footer: {
            text: "Dash SMP Application System",
          },
          timestamp: timestamp,
        },
      ],
    };

    // Send to Discord webhook
    const discordResponse = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(discordPayload),
    });

    if (!discordResponse.ok) {
      const errorText = await discordResponse.text();
      console.error("Discord webhook error:", errorText);
      throw new Error("Failed to send to Discord");
    }

    return new Response(
      JSON.stringify({ success: true, message: "Application submitted successfully" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing application:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process application" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
