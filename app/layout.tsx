import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});
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
    <html lang="en" className={`h-full ${roboto.variable}`}>
      <body className="h-full font-[family-name:var(--font-roboto)] antialiased">{children}</body>
    </html>
  );
}
