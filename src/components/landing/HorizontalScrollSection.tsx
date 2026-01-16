import { useRef, useLayoutEffect, ReactNode } from "react";
import { Clock, Target, BarChart3, Trophy, Zap, Shield } from "lucide-react";
import { TiltCard } from "./TiltCard";

const features = [
  {
    icon: <Clock className="h-10 w-10" />,
    title: "Smart Timer",
    description: "One-click focus sessions with beautiful real-time tracking",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: <Target className="h-10 w-10" />,
    title: "Daily Goals",
    description: "Set and crush personalized deep work targets",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: <BarChart3 className="h-10 w-10" />,
    title: "Rich Analytics",
    description: "Visualize patterns and optimize your schedule",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: <Trophy className="h-10 w-10" />,
    title: "Achievements",
    description: "Earn badges for milestones and streaks",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: <Zap className="h-10 w-10" />,
    title: "Keyboard First",
    description: "Power user shortcuts for maximum efficiency",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: <Shield className="h-10 w-10" />,
    title: "Privacy First",
    description: "Your data stays yours, always encrypted",
    color: "from-slate-500 to-zinc-500",
  },
];

export function HorizontalScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx: ReturnType<typeof import("gsap").gsap.context> | undefined;

    const initScrollAnimation = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!containerRef.current || !scrollRef.current) return;

      ctx = gsap.context(() => {
        const scrollWidth = scrollRef.current!.scrollWidth;
        const viewportWidth = window.innerWidth;
        const scrollDistance = scrollWidth - viewportWidth + 100;

        gsap.to(scrollRef.current, {
          x: -scrollDistance,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: () => `+=${scrollDistance}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });
      });
    };

    initScrollAnimation();

    return () => {
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden bg-muted/20">
      <div className="absolute inset-0 flex items-center">
        <div ref={scrollRef} className="flex gap-8 pl-[10vw] pr-[50vw]">
          {/* Section intro */}
          <div className="flex-shrink-0 w-[40vw] flex flex-col justify-center pr-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Features that <span className="text-gradient">actually help</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              No bloat. No distractions. Just the tools you need to stay focused and build lasting habits.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="animate-pulse">←</span>
              <span>Scroll to explore</span>
            </div>
          </div>

          {/* Feature cards */}
          {features.map((feature, index) => (
            <TiltCard
              key={feature.title}
              className="flex-shrink-0 w-[350px]"
              maxTilt={8}
            >
              <div className="h-[400px] p-8 rounded-2xl border border-border/60 bg-card flex flex-col group hover:border-primary/40 transition-colors duration-300">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed flex-grow">
                  {feature.description}
                </p>
                <div className="mt-6 pt-4 border-t border-border/40">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    Feature {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
