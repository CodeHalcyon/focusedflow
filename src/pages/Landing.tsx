import { useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Clock, BarChart3, ArrowRight, CheckCircle, 
  Play, Star, Sparkles
} from "lucide-react";
import { CursorSpotlight } from "@/components/landing/CursorSpotlight";
import { MagneticButton } from "@/components/landing/MagneticButton";
import { TiltCard } from "@/components/landing/TiltCard";
import { InteractiveHeroTimer } from "@/components/landing/InteractiveHeroTimer";
import { HorizontalScrollSection } from "@/components/landing/HorizontalScrollSection";
import { ScrollProgress } from "@/components/landing/ScrollProgress";

export default function Landing() {
  // Dynamically import and register GSAP to avoid React hook conflicts
  useLayoutEffect(() => {
    let ctx: ReturnType<typeof import("gsap").gsap.context> | undefined;
    
    const initGSAP = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      
      ctx = gsap.context(() => {
        // Hero animations
        gsap.fromTo(
          ".hero-title",
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
        );
        gsap.fromTo(
          ".hero-subtitle",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power3.out" }
        );
        gsap.fromTo(
          ".hero-cta",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: "power3.out" }
        );
        gsap.fromTo(
          ".hero-visual",
          { opacity: 0, scale: 0.9, rotateX: 10 },
          { opacity: 1, scale: 1, rotateX: 0, duration: 1.2, delay: 0.3, ease: "power3.out" }
        );

        // Parallax floating elements
        gsap.to(".float-1", {
          y: -30,
          rotation: 5,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
        gsap.to(".float-2", {
          y: 20,
          rotation: -5,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.5
        });
        gsap.to(".float-3", {
          y: -15,
          x: 10,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1
        });

        // How it works - stagger with scale
        gsap.fromTo(
          ".step-item",
          { opacity: 0, x: -60, scale: 0.9 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: ".how-it-works-section",
              start: "top 75%",
            }
          }
        );

        // Testimonials with rotation
        gsap.fromTo(
          ".testimonial-card",
          { opacity: 0, y: 60, rotateY: -15 },
          {
            opacity: 1,
            y: 0,
            rotateY: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".testimonials-section",
              start: "top 80%",
            }
          }
        );

        // CTA with scale pulse
        gsap.fromTo(
          ".cta-content",
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "elastic.out(1, 0.5)",
            scrollTrigger: {
              trigger: ".cta-section",
              start: "top 85%",
            }
          }
        );

        // Benefits list items
        gsap.fromTo(
          ".benefit-item",
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".benefits-section",
              start: "top 75%",
            }
          }
        );
      });
    };
    
    initGSAP();
    
    return () => {
      ctx?.revert();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <CursorSpotlight />
      <ScrollProgress />
      
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group" aria-label="Focus - Home">
            <span className="text-xl font-bold tracking-tight">StayRAw</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group">
              How it Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
            <Link to="/analytics" className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group">
              Analytics
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>
          <MagneticButton>
            <Link to="/auth">
              <Button variant="default" size="sm" className="group relative overflow-hidden">
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
          </MagneticButton>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero-section relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="float-1 absolute top-32 left-[15%] w-20 h-20 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
          <div className="float-2 absolute top-48 right-[20%] w-32 h-32 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="float-3 absolute bottom-20 left-[30%] w-24 h-24 bg-primary/15 rounded-full blur-2xl pointer-events-none" />
          
          {/* Decorative grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
          
          <div className="container mx-auto px-6 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
                  <Sparkles className="h-4 w-4" />
                  <span>Built for deep work</span>
                </div>
                <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                  Master Your Focus.
                  <br />
                  <span className="text-gradient">Build Lasting Habits.</span>
                </h1>
                <p className="hero-subtitle text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                  The productivity companion for developers who want clarity, consistency, and motivation. 
                  Track deep work sessions, complete meaningful tasks, and watch your streaks grow.
                </p>
                <div className="hero-cta flex flex-col sm:flex-row gap-4">
                  <MagneticButton strength={0.2}>
                    <Link to="/auth">
                      <Button size="lg" className="gap-2 group w-full sm:w-auto relative overflow-hidden">
                        <span className="relative z-10 flex items-center gap-2">
                          Start Free Today
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </Button>
                    </Link>
                  </MagneticButton>
                  <MagneticButton strength={0.2}>
                    <a href="#how-it-works">
                      <Button size="lg" variant="outline" className="gap-2 group w-full sm:w-auto hover:border-primary/50">
                        <Play className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                        See How It Works
                      </Button>
                    </a>
                  </MagneticButton>
                </div>
              </div>
              
              {/* Interactive Hero Timer */}
              <div className="hero-visual" style={{ perspective: "1000px" }}>
                <InteractiveHeroTimer />
              </div>
            </div>
          </div>
        </section>

        {/* Horizontal Scroll Features Section */}
        <section id="features">
          <HorizontalScrollSection />
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="how-it-works-section py-24 md:py-32 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Simple Workflow, Powerful Results
              </h2>
              <p className="text-muted-foreground text-lg">
                Getting started takes less than a minute. Here's how Focus transforms your workday.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-8">
              <StepItem 
                number="01" 
                title="Start Your Focus Session"
                description="Click start when you're ready. The timer tracks your deep work in real-time, helping you stay present and committed."
              />
              <StepItem 
                number="02" 
                title="Log Your Completed Tasks"
                description="Add tasks as you finish them. Simple entries keep friction low so you can get back to work quickly."
              />
              <StepItem 
                number="03" 
                title="Review Your Progress"
                description="End your day by reviewing time worked and tasks completed. Visit analytics to see trends and celebrate streaks."
              />
              <StepItem 
                number="04" 
                title="Build Consistency Over Time"
                description="Watch productivity compound. Achievements reward consistency, visual feedback helps build lasting habits."
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section py-24 md:py-32">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Loved by Remote Developers
              </h2>
              <p className="text-muted-foreground text-lg">
                Join thousands of developers who have transformed their work habits.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <TiltCard className="testimonial-card" maxTilt={6}>
                <TestimonialContent
                  quote="Focus helped me realize I was only doing 4 hours of real deep work. Now I consistently hit 6+ hours daily."
                  author="Sarah Chen"
                  role="Senior Frontend Developer"
                  stars={5}
                />
              </TiltCard>
              <TiltCard className="testimonial-card" maxTilt={6}>
                <TestimonialContent
                  quote="The achievement system sounds gimmicky but it genuinely works. I've maintained a 45-day streak and don't want to break it."
                  author="Marcus Johnson"
                  role="Full-Stack Engineer"
                  stars={5}
                />
              </TiltCard>
              <TiltCard className="testimonial-card" maxTilt={6}>
                <TestimonialContent
                  quote="Finally, a productivity tool that doesn't try to do everything. Clean, minimal, and it actually helps me focus."
                  author="Elena Rodriguez"
                  role="DevOps Specialist"
                  stars={5}
                />
              </TiltCard>
            </div>
          </div>
        </section>

        {/* Benefits List Section */}
        <section className="benefits-section py-24 md:py-32 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Why Developers Choose Focus
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  We built Focus because we needed it ourselves. As remote developers, we understand 
                  the challenges of staying productive without office structure.
                </p>
                <ul className="space-y-4">
                  {[
                    "Minimal, distraction-free interface that respects your attention",
                    "Beautiful dark mode for comfortable late-night coding",
                    "Keyboard shortcuts for power users who value efficiency",
                    "Daily quotes to keep you motivated",
                    "Shareable stats cards to celebrate wins publicly",
                    "Secure cross-device sync so your data follows you",
                  ].map((benefit, index) => (
                    <li 
                      key={benefit} 
                      className="benefit-item flex items-start gap-3 text-base group cursor-default"
                    >
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
                      <span className="group-hover:text-foreground transition-colors">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <TiltCard maxTilt={5}>
                <div className="glass rounded-2xl p-6 glow-secondary">
                  <img 
                    src="/og-image.png" 
                    alt="Focus app analytics dashboard showing weekly productivity trends" 
                    className="rounded-lg w-full"
                  />
                </div>
              </TiltCard>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section py-24 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent pointer-events-none" />
          <div className="float-1 absolute bottom-10 left-1/4 w-40 h-40 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
          <div className="float-2 absolute top-10 right-1/4 w-32 h-32 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="container mx-auto px-6 text-center cta-content relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Workday?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              Join over 10,000 developers who have taken control of their focus. 
              Start tracking your deep work sessions today—completely free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagneticButton>
                <Link to="/auth">
                  <Button size="lg" className="gap-2 group">
                    Create Free Account
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link to="/analytics">
                  <Button size="lg" variant="outline" className="gap-2 hover:border-primary/50">
                    <BarChart3 className="h-4 w-4" />
                    View Sample Analytics
                  </Button>
                </Link>
              </MagneticButton>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <Clock className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">Focus</span>
              </Link>
              <p className="text-muted-foreground text-sm max-w-md">
                A minimal productivity app built with love for remote developers who value their time 
                and want to build consistent work habits.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
                <li><Link to="/analytics" className="hover:text-foreground transition-colors">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Get Started</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/auth" className="hover:text-foreground transition-colors">Sign Up</Link></li>
                <li><Link to="/auth" className="hover:text-foreground transition-colors">Log In</Link></li>
                <li><Link to="/app" className="hover:text-foreground transition-colors">Dashboard</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Focus. Built with care for remote developers everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}


function StepItem({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="step-item flex gap-6 group cursor-default">
      <div className="flex-shrink-0">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-primary/30">
          {number}
        </div>
      </div>
      <div className="pt-2">
        <h3 className="font-semibold text-xl mb-2 transition-colors group-hover:text-primary">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function TestimonialContent({ quote, author, role, stars }: { quote: string; author: string; role: string; stars: number }) {
  return (
    <div className="p-6 rounded-xl border border-border/60 bg-card h-full">
      <div className="flex gap-1 mb-4">
        {Array.from({ length: stars }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-primary text-primary transition-transform duration-200 hover:scale-125" />
        ))}
      </div>
      <p className="text-foreground mb-6 leading-relaxed">"{quote}"</p>
      <div>
        <div className="font-semibold">{author}</div>
        <div className="text-sm text-muted-foreground">{role}</div>
      </div>
    </div>
  );
}
