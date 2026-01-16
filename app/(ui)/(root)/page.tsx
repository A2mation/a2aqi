import { AQIDashboard } from "@/components/aqi-ui/aqi-dashboard";
import AirQualityDashboard from "../../../components/aqi-ui/major-air-pollutants-board";
import { AQIGraph } from "@/components/aqi-ui/aqi-graph";
import { AirPollutionTable } from "@/components/aqi-ui/location-based-air-pollution-table";
import PopularCityCards from "@/components/aqi-ui/popular-city-aqi-table";
import AirQualityIndexTable from "@/components/aqi-ui/air-quality-index-table";


export default function Home() {


  return (
    <>
      <AQIDashboard />
      <AirQualityDashboard />
      {/* <AQIGraph /> */}
      <AirQualityIndexTable />
      <AirPollutionTable />
      <PopularCityCards />
      
    </>
  );
}
