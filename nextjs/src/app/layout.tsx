import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const pathname = headersList.get("x-current-path") || "/";

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_APP_BASE_URL || "https://yoursite.com"
    ),
    title: "Your Site Title",
    description: "Your site description",
    openGraph: {
      title: "Your Site Title",
      description: "Your site description",
      images: [`/api/og?path=${encodeURIComponent(pathname)}`],
    },
    twitter: {
      card: "summary_large_image",
      title: "Your Site Title",
      description: "Your site description",
      images: [`/api/og?path=${encodeURIComponent(pathname)}`],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
