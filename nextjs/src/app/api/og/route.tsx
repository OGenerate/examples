import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path") || "/";

    const apiKey = process.env.OGENERATE_API_KEY;
    const domain =
      process.env.NEXT_PUBLIC_APP_BASE_URL || "https://yoursite.com";
    const fullUrl = domain + path;

    // Try to use OGenerate API if API key is available
    if (apiKey) {
      try {
        const apiUrl = `https://api.ogenerate.com/api/v1/screenshot?apiKey=${encodeURIComponent(
          apiKey
        )}&url=${encodeURIComponent(fullUrl)}`;

        const response = await fetch(apiUrl, {
          cache: "no-store",
          headers: {
            "User-Agent": "OGenerate-Bot/1.0",
            Accept: "image/png,image/*,*/*",
          },
        });

        if (response.ok) {
          const imageBuffer = await response.arrayBuffer();
          return new Response(imageBuffer, {
            headers: {
              "Content-Type": "image/png",
              "Cache-Control": "public, max-age=3600",
            },
          });
        }
      } catch (error) {
        console.error("OGenerate API error:", error);
      }
    }

    // Fallback to custom image generation
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#000",
            backgroundImage: "linear-gradient(45deg, #000 0%, #111 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h1 style={{ fontSize: "60px", fontWeight: "bold", color: "#fff" }}>
              Your Site
            </h1>
            <p style={{ fontSize: "24px", color: "#ccc" }}>
              Your site description
            </p>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (error) {
    return new Response("Failed to generate image", { status: 500 });
  }
}
