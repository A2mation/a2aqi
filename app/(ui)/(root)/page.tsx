'use client'

import dynamic from "next/dynamic";

import AQIDashboard from "@/components/aqi-ui/aqi-dashboard";
import { ClientLogosBanner } from "@/components/CientLogoBanner";
import { FloatingMarketingNav } from "@/components/FloatingMarketingNav";

const AirQualityDashboard = dynamic(
  () => import("../../../components/aqi-ui/major-air-pollutants-board"),
  {
    ssr: false,
    loading: () => <div className="h-40 animate-pulse bg-gray-100 rounded-lg m-4" />
  }
);

const AQIGraph = dynamic(
  () => import("@/components/aqi-ui/aqi-graph"),
  {
    ssr: false,
    loading: () => <div className="h-64 animate-pulse bg-gray-100 rounded-lg m-4" />
  }
);

const AirPollutionTable = dynamic(
  () => import("@/components/aqi-ui/location-based-air-pollution-table"),
  {
    ssr: false,
    loading: () => <div className="h-96 animate-pulse bg-gray-100 rounded-lg m-4" />
  }
);

const PopularCityCards = dynamic(
  () => import("@/components/aqi-ui/popular-city-aqi-table"),
  {
    ssr: false,
    loading: () => <div className="h-40 animate-pulse bg-gray-100 rounded-lg m-4" />
  }
);

const AirQualityIndexTable = dynamic(
  () => import("@/components/aqi-ui/air-quality-index-table"),
  {
    ssr: false,
    loading: () => <div className="h-40 animate-pulse bg-gray-100 rounded-lg m-4" />
  }
);

const PlatformShowcaseSection = dynamic(
  () => import("@/components/aqi-ui/PlatformShowcaseSection"),
  {
    ssr: false,
    loading: () => <div className="h-40 animate-pulse bg-gray-100 rounded-lg m-4" />
  }
);

const ConnectivitySection = dynamic(
  () => import("@/components/aqi-ui/ConnectivitySection"),
  {
    ssr: false,
    loading: () => <div className="h-40 animate-pulse bg-gray-100 rounded-lg m-4" />
  }
);



export default function Home() {
  const logos = [
    { name: "adani", src: "/assets/partner-company-logo/adani-logo.svg" },
    { name: "IITKGP", src: "/assets/partner-company-logo/IITKGP.png" },
    { name: "emami", src: "/assets/partner-company-logo/emami_logo.png" },
    { name: "indian-army", src: "/assets/partner-company-logo/indian-army-logo.png" },
    { name: "indian-navy", src: "/assets/partner-company-logo/indian-navy-logo.png" },
    { name: "tata", src: "/assets/partner-company-logo/Tata_logo.svg" },
  ];

  return (
    <main>

      <AQIDashboard />

      <AirQualityDashboard />
      <AQIGraph />


      <AirPollutionTable />

      <AirQualityIndexTable />

      <PlatformShowcaseSection />

      <ConnectivitySection />

      <PopularCityCards />


      <ClientLogosBanner logos={logos} />

      <FloatingMarketingNav />

    </main>
  );
}