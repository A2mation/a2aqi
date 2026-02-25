import { AQIDashboard } from "@/components/aqi-ui/aqi-dashboard";
import AirQualityDashboard from "../../../components/aqi-ui/major-air-pollutants-board";
import { AQIGraph } from "@/components/aqi-ui/aqi-graph";
import { AirPollutionTable } from "@/components/aqi-ui/location-based-air-pollution-table";
import PopularCityCards from "@/components/aqi-ui/popular-city-aqi-table";
import AirQualityIndexTable from "@/components/aqi-ui/air-quality-index-table";
import { ClientLogosBanner } from "@/components/CientLogoBanner";


export default function Home() {
  const logos = [
    { name: "adani", src: "/assets/partner-company-logo/adani-logo.svg" },
    { name: "IITKGP", src: "/assets/partner-company-logo/IITKGP.png" },
    { name: "emami", src: "/assets/partner-company-logo/emami_logo.png" },
    { name: "indian-army", src: "/assets/partner-company-logo/indian-army-logo.png" },
    { name: "indian-navy", src: "/assets/partner-company-logo/indian-navy-logo.png" },
    { name: "tata", src: "/assets/partner-company-logo/Tata_logo.svg" },
  ]

  return (
    <>
      <AQIDashboard />
      <AirQualityDashboard />
      {/* <AQIGraph /> */}
      <AirQualityIndexTable />
      <section className="hidden md:block">
        <AirPollutionTable />
      </section>
      <PopularCityCards />
      <ClientLogosBanner logos={logos} />
    </>
  );
}
