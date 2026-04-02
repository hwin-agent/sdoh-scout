import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0D6E6E",
};

export const metadata: Metadata = {
  title: "SDOH Scout — See What the EHR Misses",
  description:
    "SDOH Scout detects social risk factors hiding in patient records and connects patients to community resources automatically. Built with MCP and A2A for the Prompt Opinion platform.",
  openGraph: {
    title: "SDOH Scout — See What the EHR Misses",
    description:
      "Detect social determinant risk factors from FHIR data and generate community resource referrals.",
    type: "website",
    url: "https://sdoh-scout.vercel.app",
    siteName: "SDOH Scout",
  },
  twitter: {
    card: "summary_large_image",
    title: "SDOH Scout — See What the EHR Misses",
    description:
      "Detect social determinant risk factors from FHIR data and generate community resource referrals.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
