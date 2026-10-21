import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Team Balancer #Pemoeda",
  description: "Pengacak tim adil dan seimbang untuk kegiatan GKO Depok 1.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
