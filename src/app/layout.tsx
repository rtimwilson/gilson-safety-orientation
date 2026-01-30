import type { Metadata, Viewport } from "next";
import { Work_Sans, Oswald } from "next/font/google";
import "./globals.css";
import { OrientationProvider } from "@/lib/orientation-context";
import { OfflineIndicator } from "@/components/OfflineIndicator";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Gil-Son Safety Orientation",
  description: "Complete your safety orientation for Gil-Son Construction Limited",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Gil-Son Safety",
  },
  icons: {
    icon: "/gilson-logo.png",
    apple: "/gilson-logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#a12642",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${workSans.variable} ${oswald.variable} font-sans antialiased`}
        style={{ backgroundColor: '#f5f5f5' }}>
        <OrientationProvider>
          <OfflineIndicator />
          {children}
        </OrientationProvider>
      </body>
    </html>
  );
}
