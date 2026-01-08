import Image from "next/image";

const HealthImpactByPollution = () => {
  return (
    <section className="w-full py-16 flex justify-center">
      <div className="relative w-full max-w-6xl">

        {/* IMAGE */}
        <div className="relative mx-auto h-[420px] w-[280px] sm:w-[320px] md:w-[360px] md:h-[520px]">
          <Image
            src="/assets/Woman-with-cold-coughing.png"
            alt="Woman coughing due to air pollution"
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* DESKTOP LABELS */}
        <div className="hidden md:block">
          {/* Left */}
          <div className="absolute left-0 top-1/4 space-y-6">
            <InfoBox text="Headaches, dizziness, nausea" />
            <InfoBox text="Difficulty in breathing, sweating" />
            <InfoBox text="Irritation in the eyes, nose, and throat" />
          </div>

          {/* Right */}
          <div className="absolute right-0 top-1/4 space-y-6">
            <InfoBox text="Worsen asthma & respiratory diseases" />
            <InfoBox text="Damages to the lungs and kidney" />
            <InfoBox text="Cancer" />
          </div>
        </div>

        {/* MOBILE LABELS */}
        <div className="mt-8 justify-center grid gap-4 md:hidden px-4">
          <InfoBox text="Headaches, dizziness, nausea" />
          <InfoBox text="Difficulty in breathing, sweating" />
          <InfoBox text="Irritation in the eyes, nose, and throat" />
          <InfoBox text="Worsen asthma & respiratory diseases" />
          <InfoBox text="Damages to the lungs and kidney" />
          <InfoBox text="Cancer" />
        </div>

      </div>
    </section>
  );
};

export default HealthImpactByPollution;

const InfoBox = ({ text }: { text: string }) => {
  return (
    <div className="bg-yellow-100 text-gray-500 px-5 py-5 rounded-lg shadow-md text-sm font-medium max-w-[260px]">
      {text}
    </div>
  );
};
