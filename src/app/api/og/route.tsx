import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Get parameters from query string
    const title = searchParams.get("title") || "My Horse Farm";
    const description = searchParams.get("description") || "Farm & Property Services";
    const type = searchParams.get("type") || "website"; // blog, service, offer, etc.
    const _imageBg = searchParams.get("bg") || "default";

    // Define colors based on type
    const colorScheme = {
      blog: {
        gradient: "linear-gradient(135deg, #2D5016 0%, #4A8C3A 100%)",
        accentColor: "#F5A623",
      },
      service: {
        gradient: "linear-gradient(135deg, #1B3A2E 0%, #2D5016 100%)",
        accentColor: "#4A8C3A",
      },
      offer: {
        gradient: "linear-gradient(135deg, #E8A022 0%, #D97706 100%)",
        accentColor: "#FFFFFF",
      },
      default: {
        gradient: "linear-gradient(135deg, #2D5016 0%, #1B3A2E 100%)",
        accentColor: "#F5A623",
      },
    };

    const colors = colorScheme[type as keyof typeof colorScheme] || colorScheme.default;

    // Truncate title to fit in image
    const maxTitleLength = 60;
    const displayTitle = title.length > maxTitleLength 
      ? title.substring(0, maxTitleLength) + "..."
      : title;

    // Truncate description
    const maxDescLength = 100;
    const displayDescription = description.length > maxDescLength
      ? description.substring(0, maxDescLength) + "..."
      : description;

    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 16,
            background: colors.gradient,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            padding: "60px",
            color: "white",
            fontFamily: "system-ui, -apple-system, sans-serif",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative elements */}
          <div
            style={{
              position: "absolute",
              top: "-100px",
              right: "-100px",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-50px",
              left: "-50px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
            }}
          />

          {/* Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              flex: 1,
              justifyContent: "center",
              zIndex: 1,
              maxWidth: "90%",
            }}
          >
            {/* Type badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  backgroundColor: colors.accentColor,
                  color: "#1B3A2E",
                  padding: "4px 12px",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {type}
              </div>
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: "56px",
                fontWeight: "800",
                lineHeight: "1.2",
                letterSpacing: "-1px",
              }}
            >
              {displayTitle}
            </div>

            {/* Description */}
            {displayDescription && (
              <div
                style={{
                  fontSize: "20px",
                  lineHeight: "1.5",
                  color: "rgba(255, 255, 255, 0.85)",
                  maxWidth: "600px",
                }}
              >
                {displayDescription}
              </div>
            )}
          </div>

          {/* Footer branding */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "16px",
              fontWeight: "600",
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: colors.accentColor,
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1B3A2E",
                fontSize: "20px",
                fontWeight: "800",
              }}
            >
              🐴
            </div>
            <span>My Horse Farm</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error("OG Image generation error:", error);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
