import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flooded AI | Satellite Flood Detection in North East India",
  description: "Flooded AI - Tactical geospatial intelligence platform for monitoring, analyzing, and explaining satellite flood inundation across North East India using Copernicus Sentinel SAR and AI vision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-tactical-950 text-slate-100 min-h-screen flex flex-col font-sans overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
