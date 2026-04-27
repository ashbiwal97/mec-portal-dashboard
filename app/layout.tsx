import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MEC Portal — Director Dashboard",
  description: "MEConnects Director Analytics Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
