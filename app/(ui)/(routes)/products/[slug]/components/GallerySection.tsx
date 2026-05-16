import { motion } from 'framer-motion';

import { StackingScroll } from '@/components/ui/StackingScroll';
import { Carousel, Card } from '@/components/ui/apple-cards-carousel';

const galleryData = [
  {
    src: '/assets/gallery/watching-tv.png',
    title: 'Smart TV App',
    description: 'Display real-time readings from your Handy Sensor  on a larger screen. Ideal for offices, schools, and public spaces.'
  },
  {
    src: '/assets/gallery/watching-mobile.png',
    title: 'Air Quality App',
    description: 'Connect your Handy Sensor Monitor to view real-time PM1, PM2.5, PM10, and AQI data on your smartphone. Track trends and get instant alerts anytime.',
    isApp: true
  },
  {
    src: '/assets/gallery/watching-laptop.png',
    title: 'Web Dashboard',
    description: 'Access live and historical data from your Sensor   Monitor through the web-dashboard. Analyze trends and manage devices in one place.'
  },
];

export const GallerySection = () => {

  const mobileData = galleryData.map((d) => ({
    src: d.src,
    title: d.description.slice(0, 51) + '..',
    category: d.title,
  }))

  const cards = mobileData.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (<>
    <main className="bg-inherit">
      <div className="flex items-center justify-center p-6 mt-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl text-center text-slate-800 text-4xl md:text-6xl font-semibold tracking-tight leading-tight"
        >
          Monitor Air Quality Smartly – <br className="hidden md:block" />
          <span className="text-zinc-400 font-medium">On Your Phone, Dashboard, or TV.</span>
        </motion.h1>
      </div>

      <section className="hidden md:block">
        {/* Pass the new data object here */}
        <StackingScroll data={galleryData} />
      </section>
      <section className='bg-inherit block md:hidden'>
        <Carousel
          items={cards}
        />
      </section>
    </main>
  </>
  );
};
