import Image from "next/image";


const AdBanner = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <a
        href="https://a2mation.in/"
      >
        <Image
          src="/assets/ads/display-monitor-ad.jpg"
          alt=" a woman coughing due to air pollution"
          width={1200} height={800}
          className="hover:cursor-pointer"
          priority
        />
      </a>
    </div>);
};
export default AdBanner;