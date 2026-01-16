import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Footer } from "@/components/aqi-ui/footer";
import "./globals.css";
import { NavbarMain } from "./(ui)/(root)/components/Navbar";
import VisitCounter from "@/components/VisitCounter";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});



export const metadata: Metadata = {
  title: {
    default: "AQIIndia – Live Air Quality Index (AQI) & Pollution Data",
    template: "%s | AQIIndia",
  },
  description:
    "AQIIndia provides real-time Air Quality Index (AQI), PM2.5, PM10, and pollution data across Indian cities. Track air quality near you with accurate, live updates.",
  keywords: [
    "AQI India",
    "Air Quality Index India",
    "Live AQI",
    "Air Pollution India",
    "PM2.5 India",
    "PM10 India",
    "Real-time AQI",
    "India Air Quality",
    "Pollution levels India",
  ],
  metadataBase: new URL("https://aqiindia.com"), // change when domain is final
  openGraph: {
    title: "AQIIndia – Live Air Quality Index & Pollution Tracker",
    description:
      "Check real-time AQI, PM2.5, PM10, and pollution levels across India. Stay informed about air quality in your city.",
    url: "https://aqiindia.com",
    siteName: "AQIIndia",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AQIIndia – Live Air Quality Index",
    description:
      "Real-time AQI and air pollution data for Indian cities. Track PM2.5, PM10, and more with AQIIndia.",
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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="font-poppins">
        <NavbarMain />
        {children}
        <Footer />
        <VisitCounter />
      </body>
    </html>
  );
}
