/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useSpring, useInView, AnimatePresence, useTransform } from "framer-motion";
import React, { useEffect, useState, useRef } from "react";
import { 
  ChevronDown, 
  Cpu, 
  Microscope, 
  Mail, 
  Github, 
  Linkedin, 
  ArrowUpRight,
  Code,
  Database,
  Cloud,
  Layers,
  ExternalLink,
  BrainCircuit
} from "lucide-react";

// --- Animation Components ---

const LetterReveal = ({ text, className = "" }: { text: string; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.h1
      ref={ref}
      style={{ overflow: "hidden", display: "flex", flexWrap: "wrap" }}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {text.split("").map((letter, index) => (
        <motion.span variants={child} key={index}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.h1>
  );
};

const WordReveal = ({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: delay },
    },
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1],
      },
    },
    hidden: {
      opacity: 0,
      y: 10,
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
      style={{ display: "flex", flexWrap: "wrap" }}
    >
      {text.split(" ").map((word, index) => (
        <motion.span variants={child} key={index} className="mr-[0.25em]">
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

const FadeInUp = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay, ease: [0.215, 0.61, 0.355, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const DrawingLine = ({ className = "" }: { className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ scaleX: 0 }}
      animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className={`origin-left h-px bg-outline-variant/30 ${className}`}
    />
  );
};

const Counter = ({ value, duration = 2, suffix = "" }: { value: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const totalFrames = duration * 60;
      let frame = 0;

      const timer = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const easeOutQuad = (t: number) => t * (2 - t);
        const currentCount = Math.round(start + (end - start) * easeOutQuad(progress));
        setCount(currentCount);

        if (frame === totalFrames) {
          clearInterval(timer);
        }
      }, 1000 / 60);

      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const MiniChart = ({ type = "bar", color = "#4f392b" }: { type?: "bar" | "line"; color?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="w-full h-12 mt-4 overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
        {type === "bar" ? (
          [20, 45, 30, 60, 40, 80, 55, 90].map((h, i) => (
            <motion.rect
              key={i}
              x={i * 13}
              y={40 - h / 2.5}
              width="8"
              height={h / 2.5}
              fill={color}
              initial={{ scaleY: 0, originY: "bottom" }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
              className="opacity-20"
            />
          ))
        ) : (
          <motion.path
            d="M0,35 Q15,30 25,20 T50,25 T75,10 T100,15"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ delay: 0.5, duration: 2, ease: "easeInOut" }}
            className="opacity-40"
          />
        )}
      </svg>
    </div>
  );
};

const Carousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div 
      className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-2xl cursor-pointer group"
      onClick={nextSlide}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
          alt={`Slide ${currentIndex + 1}`}
        />
      </AnimatePresence>
      
      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, i) => (
          <div 
            key={i}
            className={`h-1 transition-all duration-500 rounded-full ${
              i === currentIndex ? "w-8 bg-white" : "w-2 bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Click Hint */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="bg-ink/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-[10px] uppercase tracking-widest border border-white/20">
          Click to next
        </div>
      </div>
    </div>
  );
};

const PersistentColorImage = ({ src, alt, className = "", delay = 0, referrerPolicy }: { src: string; alt: string; className?: string; delay?: number; referrerPolicy?: React.ImgHTMLAttributes<HTMLImageElement>["referrerPolicy"] }) => {
  const [hasHovered, setHasHovered] = useState(false);

  return (
    <motion.img 
      onMouseEnter={() => setHasHovered(true)}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 1.2 }}
      alt={alt} 
      className={`${className} ${hasHovered ? "grayscale-0" : "grayscale"} transition-all duration-1000`} 
      src={src} 
      referrerPolicy={referrerPolicy}
    />
  );
};

// --- Main App Component ---

export default function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cursorScale, setCursorScale] = useState(1);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const academicRef = useRef(null);
  const { scrollYProgress: academicScrollY } = useScroll({
    target: academicRef,
    offset: ["start end", "end start"]
  });
  const academicY = useTransform(academicScrollY, [0, 1], ["0%", "20%"]);
  const academicScale = useTransform(academicScrollY, [0, 1], [1.1, 1.3]);

  const volunteeringRef = useRef(null);
  const { scrollYProgress: volunteeringScrollY } = useScroll({
    target: volunteeringRef,
    offset: ["start end", "end start"]
  });
  const volunteeringY = useTransform(volunteeringScrollY, [0, 1], ["0%", "20%"]);
  const volunteeringScale = useTransform(volunteeringScrollY, [0, 1], [1.1, 1.3]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
        setCursorScale(2.5);
      } else {
        setCursorScale(1);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <div className="relative selection:bg-[#cba72f] selection:text-[#4e3d00]">
      {/* Custom Cursor */}
      <motion.div 
        className="custom-cursor hidden md:block"
        animate={{ 
          x: mousePos.x - 10, 
          y: mousePos.y - 10,
          scale: cursorScale
        }}
        transition={{ type: "spring", damping: 20, stiffness: 250, mass: 0.5 }}
      />
      <motion.div 
        className="custom-cursor-dot hidden md:block"
        animate={{ 
          x: mousePos.x - 2, 
          y: mousePos.y - 2 
        }}
        transition={{ type: "spring", damping: 30, stiffness: 500, mass: 0.1 }}
      />

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#735c00] origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <nav className="bg-stone-50/70 backdrop-blur-xl rounded-full mt-4 mx-auto max-w-fit px-6 py-2 sticky top-4 z-50 flex items-center gap-8 shadow-xl shadow-stone-900/5">
        <span className="font-headline italic text-2xl text-[#4f392b]">Ana Catalina</span>
        <div className="hidden md:flex items-center gap-6">
          {["Story", "Experience", "Projects", "Contact"].map((item) => (
            <a 
              key={item}
              className="text-[#755843] hover:text-[#4f392b] transition-colors uppercase tracking-widest text-[10px] font-semibold"
              href={`#${item.toLowerCase()}`}
            >
              {item}
            </a>
          ))}
        </div>
        <button className="bg-[#4f392b] text-white px-5 py-2 rounded-full text-[10px] uppercase tracking-widest hover:scale-105 transition-transform active:scale-95">
          Get in Touch
        </button>
      </nav>

      {/* Hero Section */}
      <header className="min-h-[90vh] flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_40%,_#f2ede3_0%,_transparent_60%)] opacity-40"></div>
        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center">
          <div className="text-left space-y-6">
            <WordReveal text="BARRANQUILLA → EL MUNDO" className="uppercase tracking-[0.3em] text-muted text-[10px] mb-2 font-bold" />
            <div className="space-y-0">
              <LetterReveal text="Ana Catalina" className="font-headline text-5xl md:text-7xl text-ink leading-[1.1] font-light tracking-tight" />
              <LetterReveal text="Torres Oñate" className="font-headline text-5xl md:text-7xl text-ink leading-[1.1] italic font-normal tracking-tight" />
            </div>
            <FadeInUp delay={0.5} className="space-y-4">
              <p className="font-headline text-xl md:text-2xl text-ink/80 font-light leading-snug max-w-lg">
                Desarrolladora de software Full Stack, apasionada por crear soluciones inteligentes, combinando tecnología, diseño y creatividad.
              </p>
              <p className="font-body text-sm md:text-base text-muted max-w-md font-light tracking-widest uppercase opacity-70">
                Software Developer · AI Builder · Founder in Progress
              </p>
            </FadeInUp>
            <FadeInUp delay={0.7}>
              <div className="pt-4 border-l-2 border-accent pl-6">
                <p className="font-headline italic text-xl text-muted leading-relaxed">
                  "Hecha para crear. Curiosa por naturaleza. Apenas empezando."
                </p>
              </div>
            </FadeInUp>
          </div>
          <FadeInUp delay={0.4} className="relative flex justify-end">
            <div className="relative w-full max-w-sm">
              <div className="absolute -inset-12 bg-accent/20 rounded-full blur-3xl"></div>
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-2xl shadow-ink/10"
              >
                <PersistentColorImage 
                  alt="Ana Catalina Torres Oñate" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida/ADBb0ujCSKWEmfOQv3Gg7wXs2JMb8kM5fkUztMEQ4cxWGmKqYwp7yJDPMahas2fkYKR5vb9RpKdoSN5FCIq_xpx6ABxomqlkMa8nfEoc6_VmVm0D1MNy07rC_zLmkzRvZQLh0RbXbaTpSHnsf9yJ87f1RRrO6_VT592MAkdqiGdTF0CTBGofieGXudL7KStySmc89q3hpXypf8VvWqy7J3auns0i3qn759FVpYIFgMIOquBUByzKgrcOmWpMtOy9eN1tmPTrtYcEKZDb" 
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </div>
          </FadeInUp>
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted"
        >
          <ChevronDown className="animate-bounce w-4 h-4" />
        </motion.div>
      </header>

      {/* Short Story Section */}
      <section className="py-48 px-6 bg-bg" id="story">
        <div className="max-w-3xl mx-auto space-y-12">
          <WordReveal text="THE NARRATIVE" className="uppercase tracking-[0.3em] text-[10px] text-muted font-bold mb-16" />
          <WordReveal 
            text="No soy solo desarrolladora. Soy la persona que a las 11pm sigue leyendo sobre un modelo de IA nuevo, la que desarma problemas complejos hasta encontrar la elegancia en su resolución." 
            className="font-headline text-3xl md:text-5xl leading-[1.4] text-ink font-light" 
            delay={0.2}
          />
        </div>
      </section>

      {/* My Story, My Direction */}
      <section className="py-40 px-6 bg-bg/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 relative">
            <DrawingLine className="hidden md:block absolute top-12 left-0 right-0 -z-0 opacity-20" />
            <div className="relative space-y-6">
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-3 h-3 rounded-full bg-accent mb-8 outline outline-4 outline-bg" 
              />
              <WordReveal text="The Past" className="font-headline text-2xl italic text-ink" />
              <FadeInUp delay={0.3}>
                <p className="text-muted leading-relaxed font-light">Inicié mi camino en Cooweb como estudiante, donde el desarrollo trascendió lo académico para convertirse en mi lenguaje y forma de entender el mundo. Esta experiencia no solo me impulsó y retó técnicamente, sino que sentó las bases sólidas de mi visión como ingeniera.</p>
              </FadeInUp>
            </div>
            <div className="relative space-y-6">
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="w-3 h-3 rounded-full bg-muted mb-8 outline outline-4 outline-bg" 
              />
              <WordReveal text="Today" className="font-headline text-2xl italic text-ink" />
              <FadeInUp delay={0.5}>
                <p className="text-muted leading-relaxed font-light">Senior AI Engineer en Google, trabajando en los problemas que mueven el mundo.<br/><br/>Todavía en Cooweb, ahora desde Francia, llevando la empresa a otra escala. Dos mundos, una sola dirección.</p>
              </FadeInUp>
            </div>
            <FadeInUp delay={0.6} className="relative space-y-6 p-10 bg-paper rounded-2xl shadow-xl shadow-ink/5 border border-accent/10">
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="w-3 h-3 rounded-full bg-ink mb-8 outline outline-4 outline-paper" 
              />
              <WordReveal text="Future" className="font-headline text-2xl italic text-ink" />
              <ul className="space-y-5 text-ink font-light leading-relaxed">
                {[
                  "Una cafetería en Francia que es también un espacio de coworking — donde el café y el código conviven.",
                  "Mi propia empresa, nacida de mis proyectos personales.",
                  "Y una casita en las montañas donde todo lo que construí finalmente tiene lugar para respirar."
                ].map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + (i * 0.2) }}
                    className="flex gap-4"
                  >
                    <span className="mt-2.5 h-1 w-1 rounded-full bg-accent"></span>
                    <span className="text-sm">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* Academic Background */}
      <section className="py-48 px-6 overflow-hidden relative bg-ink" ref={academicRef}>
        {/* Video Background */}
        <motion.div 
          style={{ y: academicY, scale: academicScale }}
          className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        >
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover"
          >
            <source src="https://res.cloudinary.com/dq8kucfgq/video/upload/Disen%CC%83o_sin_ti%CC%81tulo_1_uinirg.mp4" type="video/mp4" />
          </video>
          {/* Overlay to ensure readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/40 to-ink/80" />
        </motion.div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
            <div className="max-w-xl">
              <WordReveal text="FORMATION" className="uppercase tracking-[0.3em] text-[10px] text-accent font-bold mb-6" />
              <WordReveal text="Doble titulación porque una sola no era suficiente para todo lo que quiero construir." className="font-headline text-4xl md:text-5xl text-bg leading-tight font-light" />
            </div>
            <WordReveal text="Universidad del Norte" className="text-accent italic font-serif text-lg" />
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <FadeInUp delay={0.2} className="group bg-paper/5 backdrop-blur-md p-12 rounded-2xl border border-accent/10 hover:border-accent/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent/5">
              <Cpu className="w-8 h-8 text-accent mb-8 opacity-60" />
              <WordReveal text="Ingeniería de Sistemas" className="font-headline text-2xl mb-4 text-bg" />
              <p className="text-bg/70 leading-relaxed font-light text-sm">Enfoque en arquitectura de software, algoritmos y el arte de la computación escalable.</p>
            </FadeInUp>
            <FadeInUp delay={0.4} className="group bg-paper/5 backdrop-blur-md p-12 rounded-2xl border border-accent/10 hover:border-accent/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent/5">
              <Microscope className="w-8 h-8 text-accent mb-8 opacity-60" />
              <WordReveal text="Ingeniería Biomédica" className="font-headline text-2xl mb-4 text-bg" />
              <p className="text-bg/70 leading-relaxed font-light text-sm">Exploración de la tecnología aplicada a la salud, donde la precisión informática se encuentra con la vida humana.</p>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* Experience (Cooweb) */}
      <section className="py-32 px-6 bg-white" id="experience">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-20">
            <div className="md:w-1/3">
              <WordReveal text="THE JOURNEY" className="uppercase tracking-widest text-[10px] text-[#735c00] font-bold mb-6" />
              <WordReveal text="Cooweb" className="font-headline text-4xl text-[#4f392b] mb-8" />
              <FadeInUp delay={0.2}>
                <p className="text-[#81756d] mb-12">2026 - Presente</p>
              </FadeInUp>
              <div className="flex flex-wrap gap-2">
                {["Python", "Node.js", "React", "AWS", "Docker", "LLMs"].map((tech, i) => (
                  <motion.span 
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded-full ${tech === 'LLMs' ? 'bg-[#cba72f]/30 text-[#735c00] font-bold' : 'bg-[#f2ede3]'}`}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
            <div className="md:w-2/3 space-y-12">
              <div className="grid grid-cols-2 gap-8">
                <FadeInUp delay={0.3} className="p-8 bg-bg rounded-2xl border border-accent/20 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-4xl font-headline text-ink mb-2">
                    ↑<Counter value={34} suffix="%" />
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-muted font-bold">Retención</p>
                  <MiniChart type="bar" color="#7a6a5e" />
                </FadeInUp>
                <FadeInUp delay={0.5} className="p-8 bg-bg rounded-2xl border border-accent/20 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-4xl font-headline text-ink mb-2">
                    ↓<Counter value={47} suffix="%" />
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-muted font-bold">Response Time</p>
                  <MiniChart type="line" color="#7a6a5e" />
                </FadeInUp>
              </div>
              <FadeInUp delay={0.6}>
                <div className="prose prose-stone max-w-none text-muted leading-relaxed text-lg font-light">
                  <p>Liderando el desarrollo técnico y la implementación de soluciones de IA para optimizar procesos de negocio. Mi enfoque en Cooweb se centra en la escalabilidad y la experiencia de usuario final, transformando requerimientos complejos en aplicaciones robustas y fluidas.</p>
                </div>
              </FadeInUp>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-48 bg-bg" id="projects">
        <div className="max-w-6xl mx-auto px-6">
          <header className="mb-32 text-center max-w-2xl mx-auto">
            <WordReveal text="SELECTED WORKS" className="uppercase tracking-[0.3em] text-[10px] text-muted font-bold mb-8" />
            <WordReveal text="Curated Projects" className="font-headline text-5xl md:text-6xl text-ink italic mb-6 font-light" />
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1 }}
              className="h-px w-20 bg-accent mx-auto" 
            />
          </header>
          
          <div className="space-y-64">
            {/* Project 1: LearnPath AI */}
            <div className="grid md:grid-cols-12 gap-16 items-center">
              <FadeInUp className="md:col-span-7 group overflow-hidden rounded-2xl shadow-2xl shadow-ink/5">
                <motion.img 
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 1.2, ease: [0.215, 0.61, 0.355, 1] }}
                  alt="LearnPath AI" 
                  className="w-full aspect-[16/10] object-cover grayscale hover:grayscale-0 transition-all duration-1000" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxdlW5zJNIClrE--dE35g_UOwDQYe7SXXMhFhQPF_Hypb4BXVp1U0rgUC6bFtcAG0JEjOm6b_PRnMumUH888F7sAuGufXwaU0kPYVi_zcXLBKK6vIPa-QISzhxNPqLL4yEoSo0_bebP-4VdnGqiYp6oWqFaIwvovSdljtzlgHJTjtcdfJG5lY49H4mXou8bNdmUWkmRUhFy10u32Xqwsb4uL_o6k-TPNoTyc1VTG65d1ZPBdOKhMTEfPWHODkDOeOMOovxdC6lEqA" 
                />
              </FadeInUp>
              <div className="md:col-span-5 space-y-8">
                <div className="space-y-2">
                  <WordReveal text="LearnPath AI" className="font-headline text-3xl text-ink" />
                  <WordReveal text="Democratizando la Educación Adaptativa" className="font-headline text-xl italic text-muted font-light" />
                </div>
                <FadeInUp delay={0.2}>
                  <p className="text-muted leading-relaxed font-light text-sm">En América Latina, el acceso a una educación técnica de calidad suele estar fragmentado por barreras socioeconómicas y geográficas. LearnPath nació de la necesidad de cerrar esta brecha mediante una plataforma que no solo entrega contenido, sino que evoluciona con el estudiante.</p>
                </FadeInUp>
                <div className="pt-8 space-y-6 border-t border-accent/20">
                  <div className="space-y-2">
                    <WordReveal text="Stack / Arquitectura" className="text-[10px] uppercase tracking-widest text-muted font-bold" />
                    <p className="font-body text-xs text-ink opacity-80">Next.js, Python, PostgreSQL, Custom Recommendation Model.</p>
                  </div>
                  <div className="space-y-3">
                    <WordReveal text="Insight" className="text-[10px] uppercase tracking-widest text-muted font-bold" />
                    <p className="font-headline italic text-lg text-ink leading-relaxed">"Construir sola es difícil, pero el producto que surge es completamente tuyo."</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Project 2: Mira */}
            <div className="grid md:grid-cols-12 gap-16 items-center">
              <div className="md:col-span-5 space-y-8 order-2 md:order-1">
                <div className="space-y-2">
                  <WordReveal text="Mira" className="font-headline text-3xl text-ink" />
                  <WordReveal text="Memoria Semántica en la Era del Diálogo" className="font-headline text-xl italic text-muted font-light" />
                </div>
                <FadeInUp delay={0.2}>
                  <p className="text-muted leading-relaxed font-light text-sm">Los asistentes virtuales actuales sufren a menudo de "amnesia contextual", perdiendo el hilo de conversaciones pasadas que definen la relación con el usuario. El problema era dotar a la IA de una memoria persistente y coherente sin comprometer la velocidad de respuesta.</p>
                </FadeInUp>
                <div className="pt-8 space-y-6 border-t border-accent/20">
                  <div className="space-y-2">
                    <WordReveal text="Stack / Arquitectura" className="text-[10px] uppercase tracking-widest text-muted font-bold" />
                    <p className="font-body text-xs text-ink opacity-80">Python, Vector DB, OpenAI API, LangChain.</p>
                  </div>
                  <div className="space-y-3">
                    <WordReveal text="Insight" className="text-[10px] uppercase tracking-widest text-muted font-bold" />
                    <p className="font-headline italic text-lg text-ink leading-relaxed">"La memoria es lo que hace humana a la inteligencia."</p>
                  </div>
                </div>
              </div>
              <FadeInUp className="md:col-span-7 order-1 md:order-2 group overflow-hidden rounded-2xl shadow-2xl shadow-ink/5">
                <motion.img 
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 1.2, ease: [0.215, 0.61, 0.355, 1] }}
                  alt="Mira Project" 
                  className="w-full aspect-[16/10] object-cover grayscale hover:grayscale-0 transition-all duration-1000" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8L-oaWp2OjZjKzfXMXWVp0tAvMWWSsDRPwvtg5x3-2qTolVPvrGOXsq4C_GxzPa9rDk57mMYTyCbfVXY3UB8wEutg9kBGS0T7Wkczu15S0v3UNkvNf51aDM0XC3nrrLsv0pKVtC45YhYX4oJPafVnNGF_2I5H0O3wNkN7DIjmpjmzDm7XCC7ocWHYckXCyYCEFe5XwIcWPKdjGoefojvIoauMW8EcmP58A-yaE8U6146Oq_VInZPMgrIIfDdpYdFoJUgZr95O1KQ" 
                />
              </FadeInUp>
            </div>

            {/* Project 3: Suave */}
            <div className="grid md:grid-cols-12 gap-16 items-center">
              <FadeInUp className="md:col-span-7 group overflow-hidden rounded-2xl shadow-2xl shadow-ink/5">
                <motion.img 
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 1.2, ease: [0.215, 0.61, 0.355, 1] }}
                  alt="Suave UI Kit" 
                  className="w-full aspect-[16/10] object-cover grayscale hover:grayscale-0 transition-all duration-1000" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYGLxU5VgA-D_VKYyfG8TiLP-TBBU4NXVLmKWl4_oyhJLZtUtEjPBDsRl4UAhS14GLdP16oHI2N5vNjm7LMLq95vu6XtVxw7c8HujF7P0cGw18rMs05T5gzGpD5tLlIlKvK28MG0fkB8uYa4UzV87XBpgfAVxCMVUbxyVwkIF1icEjPz-pERsPHOHcMjm1NwDt4fKZVKWbFKNtwhmppjshGdsPjE6nbIKbKJdBPKy0G56qdyAY3AepQASEKOJ1mQO_jb-oC2dXJJ0" 
                />
              </FadeInUp>
              <div className="md:col-span-5 space-y-8">
                <div className="space-y-2">
                  <WordReveal text="Suave" className="font-headline text-3xl text-ink" />
                  <WordReveal text="La Estética de la Funcionalidad" className="font-headline text-xl italic text-muted font-light" />
                </div>
                <FadeInUp delay={0.2}>
                  <p className="text-muted leading-relaxed font-light text-sm">La web financiera está plagada de interfaces ruidosas que priorizan la densidad de datos sobre la claridad mental. El problema no era solo visual, sino de accesibilidad cognitiva; componentes genéricos que fallan en transmitir seguridad y orden.</p>
                </FadeInUp>
                <div className="pt-8 space-y-6 border-t border-accent/20">
                  <div className="space-y-2">
                    <WordReveal text="Stack / Arquitectura" className="text-[10px] uppercase tracking-widest text-muted font-bold" />
                    <p className="font-body text-xs text-ink opacity-80">React, Figma, Styled Components, Storybook.</p>
                  </div>
                  <div className="space-y-3">
                    <WordReveal text="Insight" className="text-[10px] uppercase tracking-widest text-muted font-bold" />
                    <p className="font-headline italic text-lg text-ink leading-relaxed">"La belleza no es decorativa. Es funcional."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Skills */}
      <section className="py-48 px-6 bg-bg/50" id="skills">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start mb-32 gap-12">
            <div className="max-w-xl">
              <WordReveal text="EXPERTISE" className="uppercase tracking-[0.3em] text-[10px] text-muted font-bold mb-6" />
              <WordReveal text="Mi caja de herramientas está diseñada para la intersección entre IA y Producto." className="font-headline text-4xl text-ink leading-tight font-light" />
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full border border-accent/20 flex items-center justify-center">
                <Code className="w-5 h-5 text-muted" />
              </div>
              <div className="w-12 h-12 rounded-full border border-accent/20 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-muted" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-24">
            {[
              { category: "Frontend", skills: ["React", "Next.js", "Tailwind", "Framer Motion"] },
              { category: "Backend", skills: ["Node.js", "Python", "PostgreSQL", "Redis"] },
              { category: "AI / ML", skills: ["TensorFlow", "PyTorch", "LLMs", "Computer Vision"] },
              { category: "Tools", skills: ["Docker", "AWS", "Git", "Figma"] }
            ].map((group, idx) => (
              <div key={idx} className="space-y-8">
                <WordReveal text={group.category} className="text-[10px] uppercase tracking-widest text-muted font-bold" />
                <ul className="space-y-4">
                  {group.skills.map((skill, sIdx) => (
                    <motion.li 
                      key={sIdx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * sIdx + (idx * 0.1) }}
                      className="text-ink font-light flex items-center gap-3 group cursor-default"
                    >
                      <span className="w-1 h-1 rounded-full bg-accent group-hover:scale-150 transition-transform" />
                      {skill}
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="py-64 px-6 bg-bg text-center overflow-hidden relative">
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl -z-0"
        />
        <div className="max-w-4xl mx-auto relative z-10">
          <WordReveal text="MANIFESTO" className="uppercase tracking-[0.4em] text-[10px] text-muted font-bold mb-16" />
          <WordReveal 
            text="No construyo software para que funcione. Construyo software para que importe." 
            className="font-headline text-4xl md:text-7xl text-ink leading-[1.1] mb-12 font-light" 
          />
          <FadeInUp delay={0.5}>
            <p className="text-muted text-lg max-w-xl mx-auto font-light leading-relaxed">Cada línea de código es una decisión ética, estética y funcional. Mi objetivo es crear herramientas que amplifiquen el potencial humano.</p>
          </FadeInUp>
        </div>
      </section>

      {/* Volunteering & Leadership */}
      <section className="py-48 px-6 bg-ink overflow-hidden relative" ref={volunteeringRef}>
        {/* Video Background */}
        <motion.div 
          style={{ y: volunteeringY, scale: volunteeringScale }}
          className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        >
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover"
          >
            <source src="https://res.cloudinary.com/dq8kucfgq/video/upload/Disen%CC%83o_sin_ti%CC%81tulo_2_fxgcbi.mp4" type="video/mp4" />
          </video>
          {/* Overlay to ensure readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/40 to-ink/80" />
        </motion.div>

        <div className="max-w-4xl mx-auto text-center space-y-16 relative z-10">
          <div className="space-y-6">
            <WordReveal text="VOLUNTEERING" className="uppercase tracking-[0.3em] text-[10px] text-accent font-bold justify-center" />
            <WordReveal text="STEM Education & Women in Engineering" className="font-headline text-4xl md:text-5xl text-bg leading-tight font-light justify-center" />
          </div>
          
          <FadeInUp delay={0.2}>
            <p className="font-body text-bg/80 text-xl md:text-2xl leading-relaxed italic font-light max-w-3xl mx-auto">
              "El voluntariado no es una etapa, es parte de quién soy y no pienso dejarlo atrás. En cinco años me veo participando en proyectos que me emocionen de verdad: voluntariados internacionales en tecnología con impacto social, programas que lleven educación STEM a comunidades en Colombia y en otros países, iniciativas de salud digital donde la ingeniería biomédica y el software se encuentran con quien más los necesita."
            </p>
          </FadeInUp>

          <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-accent/20">
            <FadeInUp delay={0.4}>
              <p className="text-bg font-headline text-2xl italic">Spanish</p>
              <p className="text-[10px] uppercase tracking-widest text-bg/60 font-bold">Native</p>
            </FadeInUp>
            <FadeInUp delay={0.5}>
              <p className="text-bg font-headline text-2xl italic">English</p>
              <p className="text-[10px] uppercase tracking-widest text-bg/60 font-bold">Intermediate Advanced</p>
            </FadeInUp>
            <FadeInUp delay={0.6}>
              <p className="text-bg font-headline text-2xl italic">French</p>
              <p className="text-[10px] uppercase tracking-widest text-bg/60 font-bold">Aspiration: Intermediate</p>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-48 px-6 bg-bg relative overflow-hidden" id="contact">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <WordReveal text="LET'S CONNECT" className="uppercase tracking-[0.3em] text-[10px] text-muted font-bold mb-12" />
          <WordReveal text="¿Tienes un reto que valga la pena construir?" className="font-headline text-5xl md:text-7xl mb-16 text-ink leading-tight font-light" />
          <div className="space-y-6 mb-24">
            <FadeInUp delay={0.2}>
              <a 
                className="inline-flex items-center gap-3 text-2xl md:text-3xl font-headline text-muted hover:text-ink transition-colors underline decoration-1 underline-offset-[12px] decoration-accent/30 hover:decoration-accent" 
                href="mailto:anacatalinat5@gmail.com"
              >
                anacatalinat5@gmail.com
                <ArrowUpRight className="w-6 h-6" />
              </a>
            </FadeInUp>
            <FadeInUp delay={0.3}>
              <p className="text-muted text-sm uppercase tracking-widest font-bold">Barranquilla, Colombia</p>
            </FadeInUp>
          </div>
          <FadeInUp delay={0.4}>
            <button className="bg-ink text-bg px-12 py-6 rounded-full text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-accent hover:text-ink transition-all duration-500 shadow-2xl shadow-ink/10">
              Trabajemos juntos
            </button>
          </FadeInUp>
        </div>
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-64 -left-64 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[120px]" 
        />
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 bg-bg border-t border-accent/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-24">
            <div className="space-y-6">
              <span className="font-headline italic text-2xl text-ink">Ana Catalina</span>
              <p className="text-muted text-sm leading-relaxed max-w-xs font-light">Software Engineer & AI Specialist. Explorando la intersección entre tecnología y humanidad.</p>
            </div>
            <div className="space-y-6">
              <p className="text-[10px] uppercase tracking-widest text-muted font-bold">Location</p>
              <p className="text-ink font-headline text-lg italic">Colombia — Barranquilla</p>
            </div>
            <div className="space-y-6">
              <p className="text-[10px] uppercase tracking-widest text-muted font-bold">Social</p>
              <div className="flex flex-col gap-4">
                <a className="flex items-center gap-3 text-muted hover:text-ink transition-colors text-sm font-light" href="#">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
                <a className="flex items-center gap-3 text-muted hover:text-ink transition-colors text-sm font-light" href="#">
                  <Github className="w-4 h-4" /> GitHub
                </a>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-accent/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-muted text-[10px] uppercase tracking-[0.3em] font-bold">© 2026 Ana Catalina Torres Oñate</p>
            <p className="text-muted text-[10px] uppercase tracking-[0.3em] font-bold">Curated with Intent</p>
          </div>
        </div>
      </footer>
    </div>
  );
}