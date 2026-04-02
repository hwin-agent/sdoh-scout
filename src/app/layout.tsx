import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SDOH Scout — See What the EHR Misses",
  description:
    "SDOH Scout detects social risk factors hiding in patient records and connects patients to community resources automatically.",
  openGraph: {
    title: "SDOH Scout — See What the EHR Misses",
    description:
      "Detect social determinant risk factors from FHIR data and generate community resource referrals.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
