import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Brush, Code, Megaphone, BarChart, Store } from 'lucide-react';
import { cn } from '@/lib/utils';

// Local service assets provided by user (SVGs & GIF)
// Note: spaces and casing preserved exactly as in filenames
import imgBranding from '../../../services/sds_Visual Branding.svg?url';
import imgCampaigns from '../../../services/sds_Creative Caampaigns.svg?url';
import imgDigital from '../../../services/sds_Digital Marketing.svg?url';
import imgEcom from '../../../services/sds_Ecommerce content and collat.svg?url';
import gifWeb from '../../../services/web des aand dev.gif?url';

// Retro-styled inline SVG fallback (cream-red gradient with subtle texture cues)
const FALLBACK_SVG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#f8efe2"/>
        <stop offset="100%" stop-color="#e24a4a"/>
      </linearGradient>
      <radialGradient id="v" cx="80%" cy="20%" r="80%">
        <stop offset="0%" stop-color="#ffffff66"/>
        <stop offset="100%" stop-color="#00000000"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <rect width="100%" height="100%" fill="url(#v)"/>
    <g fill="#6b1a1a" opacity="0.08">
      <circle cx="120" cy="90" r="60"/>
      <circle cx="820" cy="520" r="80"/>
      <circle cx="300" cy="480" r="40"/>
    </g>
  </svg>`);

const services = [
  {
    icon: Brush,
    title: "Visual Branding",
    description:
  "We craft brand identities that hit with soul, nostalgia and attitude timeless, unforgettable and unapologetically yours.",
    points: [
      "Logo design & redesign",
      "Brand identity systems",
      "Color palette & typography selection",
      "Brand guidelines & usage manuals",
    ],
  image: imgBranding,
    alt: "Vintage Indian hand-painted signage and typography",
  },
  {
    icon: Code,
    title: "Website Design & Development",
    description:
  "We craft websites that aren’t just seen they’re experienced",
    points: [
      "Custom HTML/CSS websites",
      "Responsive, mobile-first design",
      "Hosting & deployment (Netlify and similar)",
      "UX/UI design and optimization",
    ],
  image: gifWeb,
    alt: "Retro Indian design cues adapted for the web",
  },
  {
    icon: Megaphone,
    title: "Creative Campaigns",
    description:
      "We design campaigns that spark conversations and connect with culture.",
    points: [
      "Brand & product launches",
      "Social media creative direction",
      "Content strategy & design",
      "Story driven marketing campaigns",
    ],
  image: imgCampaigns,
    alt: "Bollywood-style retro posters and campaign art",
  },
  {
    icon: BarChart,
    title: "Digital Marketing",
    description:
      "Turning clicks into conversations, scrolls into sales.",
    points: [
      "Social media management (Instagram, Facebook, LinkedIn)",
      "Ad campaign strategy & execution (Meta, Google)",
      "Performance marketing & lead generation",
      "Content creation (static, reels, ads)",
    ],
  image: imgDigital,
    alt: "Vibrant retro Indian market signs and lights",
  },
  {
    icon: Store,
    title: "E-commerce Content & Collaterals",
    description:
      "From clicks to cravings content that sells with soul.",
    points: [
      "Amazon A+ product pages",
      "Product photography & presentation",
      "Catalog & brochure design (print & digital)",
      "Lifestyle content for online listings",
    ],
  image: imgEcom,
    alt: "Retro-styled Indian market product displays",
  },
];


export const Services = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end']
  });

  const x = useTransform(scrollYProgress, [0, 1], ["2.5%", "-82.5%"]);

  return (
    <section id="services" ref={targetRef} className="relative h-[500vh] bg-background">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-12">
          {services.map((service, index) => (
            <ServiceCard 
              key={index} 
              service={service} 
              index={index}
              total={services.length}
              scrollYProgress={scrollYProgress} 
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const ServiceCard = ({ service, index, total, scrollYProgress }) => {
  const cardRef = useRef(null);
  const start = index / total;
  const end = (index + 1) / total;
  const center = (start + end) / 2;

  const scale = useTransform(scrollYProgress, [start, center, end], [0.85, 1, 0.85]);
  const glowOpacity = useTransform(scrollYProgress, [start, center, end], [0, 1, 0]);

  return (
    <motion.div
      ref={cardRef}
      style={{ scale }}
      className="w-[90vw] lg:w-[70vw] flex-shrink-0 relative"
    >
      <motion.div
        style={{ opacity: glowOpacity }}
        className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-kaagaz-red/50 via-kaagaz-cream/50 to-kaagaz-red/50 blur-2xl z-0"
        aria-hidden="true"
      />
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-6xl mx-auto p-8 rounded-2xl bg-background border border-border shadow-2xl">
        <div className="space-y-6 order-2 lg:order-1">
          <motion.div 
            className="bg-kaagaz-red/10 w-16 h-16 rounded-xl flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 10 }}
          >
            <service.icon className="h-8 w-8 text-kaagaz-red" />
          </motion.div>
          <h3 className="text-4xl font-bold gradient-text">{service.title}</h3>
          <p className="text-lg text-muted-foreground leading-relaxed">{service.description}</p>
          {service.points && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground">
              {service.points.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-kaagaz-red shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="relative h-96 rounded-lg overflow-hidden order-1 lg:order-2 bg-black flex items-center justify-center">
          <img 
            className="max-w-full max-h-full object-contain"
            alt={service.alt}
            src={service.image}
            loading="lazy"
            onError={(e) => {
              const img = e.currentTarget;
              img.onerror = null;
              img.src = FALLBACK_SVG;
              img.classList.add('object-contain', 'bg-muted');
            }}
          />
          {/* Overlay removed to keep SVGs fully visible */}
        </div>
      </div>
    </motion.div>
  );
};