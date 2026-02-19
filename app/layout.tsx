import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";

import NextTopLoader from "nextjs-toploader";
import VisitCounter from "@/components/VisitCounter";
import TanStackProvider from "@/providers/tanstack-provider";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});



export const metadata: Metadata = {
  title: {
    default: "A2aqi – Live Air Quality Index (AQI) & Pollution Data",
    template: "%s | a2aqi",
  },
  description:
    "A2aqi provides real-time Air Quality Index (AQI), PM2.5, PM10, and pollution data across Indian cities. Track air quality near you with accurate, live updates.",
  keywords: [
    "AQI",
    "Air Quality Index",
    "Live AQI",
    "Real time AQI",
    "AQI India",
    "Air quality India",
    "Live air quality India",
    "Real time AQI India",
    "AQI today",
    "AQI now",
    "AQI near me",
    "Air pollution India",
    "Pollution levels India",
    "Air quality today",
    "India air pollution",
    "AQI by city India",
    "City AQI",
    "Local AQI",
    "AQI map India",
    "India pollution map",
    "Most polluted cities India",
    "Cleanest air in India",
    "PM2.5",
    "PM10",
    "PM2.5 India",
    "PM10 India",
    "PM2.5 levels",
    "PM10 levels",
    "Air pollution level",
    "Particulate pollution",
    "Smog levels",
    "Hazardous air quality",
    "Unhealthy air quality",
    "AQI health effects",
    "Air pollution health risks",
    "AQI for children",
    "AQI for elderly",
    "Safe AQI level",
    "AQI forecast India",
    "AQI alert",
    "Pollution advisory",
    "Air quality monitoring",
    "AQI tracker",
    "Air quality tracker",
    "Live pollution data India",
    "Real time pollution tracker",
    "Air quality index website",
    "Pollution monitoring website",
    "A2aqi",
    "a2aqi",
    "a2aqi.com",
    "a2 aqi",
    "a2aqi AQI",
    "a2aqi air quality",
    "a2aqi pollution tracker",
    "Best AQI website India",
    "Accurate AQI data India",
    "Trusted AQI source India"
  ],
  metadataBase: new URL("https://a2aqi.com"),
  openGraph: {
    title: "a2aqi – Live Air Quality Index & Pollution Tracker",
    description:
      "Check real-time AQI, PM2.5, PM10, and pollution levels across India. Stay informed about air quality in your city.",
    url: "https://a2aqi.com",
    siteName: "a2aqi",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "a2aqi – Live Air Quality Index",
    description:
      "Real-time AQI and air pollution data for Indian cities. Track PM2.5, PM10, and more with a2aqi.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <link rel="icon" href="/favicon.png" sizes="32x32" type="image/png" />
      </head>
      <body className="font-poppins">
        <TanStackProvider>
          <NextTopLoader
            color="#3b82f6"
            height={3}
            showSpinner={false}
            speed={200}
          />

          {children}
          <VisitCounter />
          <Toaster position="top-center" reverseOrder={false} />
        </TanStackProvider>
      </body>
    </html>
  );
}
