import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "ui";
  const description =
    searchParams.get("description") ??
    "A collection of interface experiments developed by @danielsims.";

  const [interLight, plexMono] = await Promise.all([
    fetch(
      "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuOKfMZg.ttf",
    ).then((res) => res.arrayBuffer()),
    fetch(
      "https://fonts.gstatic.com/s/ibmplexmono/v20/-F63fjptAgt5VM-kVkqdyU8n5ig.ttf",
    ).then((res) => res.arrayBuffer()),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0a",
          fontFamily: "Inter",
          padding: 80,
        }}
      >
        {/* Breadcrumb, echoing the site header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "IBM Plex Mono",
            fontSize: 22,
            letterSpacing: "0.02em",
          }}
        >
          <span style={{ color: "#8a8a8a" }}>danielsims</span>
          <span style={{ color: "#454545" }}>/</span>
          <span style={{ color: "#fafafa" }}>ui</span>
        </div>

        {/* Component name + description, bottom left */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 62,
              fontWeight: 300,
              color: "#fafafa",
              letterSpacing: "-0.015em",
            }}
          >
            {title}
          </span>
          <span
            style={{
              fontSize: 24,
              fontWeight: 300,
              color: "#8a8a8a",
              lineHeight: 1.4,
              marginTop: 16,
              maxWidth: 780,
            }}
          >
            {description}
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: interLight, weight: 300, style: "normal" },
        { name: "IBM Plex Mono", data: plexMono, weight: 400, style: "normal" },
      ],
    },
  );
}
