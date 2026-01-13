import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Clock, BarChart3, Target, Trophy, ArrowRight, CheckCircle, 
  Zap, Shield, Smartphone, Moon, Share2, Users, Play, Star
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1.2, delay: 0.3, ease: "power3.out" }
      );

      // Floating animation for hero visual
      gsap.to(".hero-visual", {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Stats counter animation
      gsap.fromTo(
        ".stat-item",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
          }
        }
      );

      // Feature cards stagger animation
      gsap.fromTo(
        ".feature-card",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 75%",
          }
        }
      );

      // How it works steps
      gsap.fromTo(
        ".step-item",
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: howItWorksRef.current,
            start: "top 75%",
          }
        }
      );

      // Testimonials
      gsap.fromTo(
        ".testimonial-card",
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: testimonialsRef.current,
            start: "top 80%",
          }
        }
      );

      // CTA section
      gsap.fromTo(
        ".cta-content",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group" aria-label="Focus - Home">
            <div className="relative">
              <Clock className="h-7 w-7 text-primary transition-transform duration-300 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-xl font-bold tracking-tight">Focus</span>
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
          <Link to="/auth">
            <Button variant="default" size="sm" className="group relative overflow-hidden">
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </Link>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section ref={heroRef} className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                  Master Your Focus.
                  <br />
                  <span className="text-gradient">Build Lasting Habits.</span>
                </h1>
                <p className="hero-subtitle text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                  Focus is the productivity companion designed for remote developers who want clarity, 
                  consistency, and motivation. Track your deep work sessions, complete meaningful tasks, 
                  and watch your productivity streaks grow day by day.
                </p>
                <div className="hero-cta flex flex-col sm:flex-row gap-4">
                  <Link to="/auth">
                    <Button size="lg" className="gap-2 group w-full sm:w-auto">
                      Start Free Today
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <a href="#how-it-works">
                    <Button size="lg" variant="outline" className="gap-2 group w-full sm:w-auto">
                      <Play className="h-4 w-4" />
                      See How It Works
                    </Button>
                  </a>
                </div>
              </div>
              
              {/* Hero Visual - App Preview */}
              <div className="hero-visual relative">
                <div className="relative glass rounded-2xl p-8 glow-primary">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Today's Focus</span>
                      <span className="text-xs text-primary font-medium">● Live</span>
                    </div>
                    <div className="text-center py-8">
                      <div className="font-mono text-6xl md:text-7xl font-bold text-gradient">
                        04:32:15
                      </div>
                      <p className="text-muted-foreground mt-3">Deep work session in progress</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <CheckCircle className="h-5 w-5 text-success" />
                        <span className="text-sm">Review pull requests</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <CheckCircle className="h-5 w-5 text-success" />
                        <span className="text-sm">Ship feature update</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg border border-primary/30">
                        <div className="h-5 w-5 rounded border-2 border-muted-foreground" />
                        <span className="text-sm">Write documentation</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="py-16 border-y border-border/40 bg-muted/20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatItem value="10,000+" label="Developers" />
              <StatItem value="2M+" label="Hours Tracked" />
              <StatItem value="98%" label="Satisfaction" />
              <StatItem value="150+" label="Countries" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" ref={featuresRef} className="py-24 md:py-32">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need to Stay Focused
              </h2>
              <p className="text-muted-foreground text-lg">
                Powerful features designed with simplicity in mind. No clutter, no distractions—just 
                the tools you need to do your best work and track your progress over time.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard
                icon={<Clock className="h-7 w-7" />}
                title="Smart Work Timer"
                description="Start and stop your focus sessions with a single click. The beautiful real-time clock keeps you aware of time without being distracting."
              />
              <FeatureCard
                icon={<Target className="h-7 w-7" />}
                title="Daily Focus Goals"
                description="Set personalized daily targets for your deep work time. Watch your progress bar fill up as you build momentum throughout the day."
              />
              <FeatureCard
                icon={<BarChart3 className="h-7 w-7" />}
                title="Detailed Analytics"
                description="Visualize your productivity patterns with weekly and monthly charts. Understand when you're most productive and optimize your schedule."
              />
              <FeatureCard
                icon={<Trophy className="h-7 w-7" />}
                title="Achievement System"
                description="Earn badges for milestones like maintaining work streaks, logging total hours, and completing tasks. Gamification that actually motivates."
              />
              <FeatureCard
                icon={<Moon className="h-7 w-7" />}
                title="Dark Mode"
                description="Easy on the eyes during late-night coding sessions. Seamlessly switch between light and dark themes based on your preference."
              />
              <FeatureCard
                icon={<Zap className="h-7 w-7" />}
                title="Keyboard Shortcuts"
                description="Power users love efficiency. Control your timer and tasks without ever reaching for the mouse with intuitive keyboard commands."
              />
              <FeatureCard
                icon={<Share2 className="h-7 w-7" />}
                title="Shareable Stats"
                description="Generate beautiful stats cards to share your productivity wins on social media. Inspire others and hold yourself accountable."
              />
              <FeatureCard
                icon={<Shield className="h-7 w-7" />}
                title="Privacy First"
                description="Your data belongs to you. We use secure cloud sync to keep your information safe across devices without compromising privacy."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" ref={howItWorksRef} className="py-24 md:py-32 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Simple Workflow, Powerful Results
              </h2>
              <p className="text-muted-foreground text-lg">
                Getting started takes less than a minute. Here's how Focus transforms your workday 
                into measurable progress you can see and feel.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-8">
              <StepItem 
                number="01" 
                title="Start Your Focus Session"
                description="Click the start button when you're ready to work. The timer begins tracking your deep work session in real-time, helping you stay present and committed to the task at hand."
              />
              <StepItem 
                number="02" 
                title="Log Your Completed Tasks"
                description="As you finish tasks, add them to your daily log. Simple text entries keep the friction low so you can get back to work quickly. Check them off for that satisfying sense of completion."
              />
              <StepItem 
                number="03" 
                title="Review Your Progress"
                description="End your day by reviewing how much time you worked and what you accomplished. Visit the analytics dashboard to see trends, celebrate streaks, and identify patterns in your productivity."
              />
              <StepItem 
                number="04" 
                title="Build Consistency Over Time"
                description="Watch your productivity compound. Daily quotes keep you motivated, achievements reward your consistency, and the visual feedback loop helps you build lasting work habits that stick."
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section ref={testimonialsRef} className="py-24 md:py-32">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Loved by Remote Developers
              </h2>
              <p className="text-muted-foreground text-lg">
                Join thousands of developers who have transformed their work habits with Focus.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <TestimonialCard
                quote="Focus helped me realize I was only doing 4 hours of real deep work. Now I consistently hit 6+ hours daily and my output has doubled."
                author="Sarah Chen"
                role="Senior Frontend Developer"
                stars={5}
              />
              <TestimonialCard
                quote="The achievement system sounds gimmicky but it genuinely works. I've maintained a 45-day streak and don't want to break it."
                author="Marcus Johnson"
                role="Full-Stack Engineer"
                stars={5}
              />
              <TestimonialCard
                quote="Finally, a productivity tool that doesn't try to do everything. Clean, minimal, and it actually helps me focus on what matters."
                author="Elena Rodriguez"
                role="DevOps Specialist"
                stars={5}
              />
            </div>
          </div>
        </section>

        {/* Benefits List Section */}
        <section className="py-24 md:py-32 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Why Developers Choose Focus
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  We built Focus because we needed it ourselves. As remote developers, we understand 
                  the challenges of staying productive without the structure of an office. Focus 
                  provides just enough accountability without becoming another distraction.
                </p>
                <ul className="space-y-4">
                  {[
                    "Minimal, distraction-free interface that respects your attention",
                    "Beautiful dark mode for comfortable late-night coding sessions",
                    "Keyboard shortcuts for power users who value efficiency",
                    "Daily inspirational quotes to keep you motivated",
                    "Shareable stats cards to celebrate wins publicly",
                    "Secure cross-device sync so your data follows you",
                  ].map((benefit, index) => (
                    <li 
                      key={benefit} 
                      className="flex items-start gap-3 text-base group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110" />
                      <span className="group-hover:text-foreground transition-colors">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="glass rounded-2xl p-6 glow-secondary">
                  <img 
                    src="/og-image.png" 
                    alt="Focus app analytics dashboard showing weekly productivity trends with colorful bar charts and streak counter displaying developer work hours" 
                    className="rounded-lg w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section ref={ctaRef} className="py-24 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="container mx-auto px-6 text-center cta-content">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Workday?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              Join over 10,000 developers who have taken control of their focus. 
              Start tracking your deep work sessions today—completely free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="gap-2 group">
                  Create Free Account
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/analytics">
                <Button size="lg" variant="outline" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  View Sample Analytics
                </Button>
              </Link>
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
                and want to build consistent work habits that last.
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

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="stat-item text-center group cursor-default">
      <div className="text-3xl md:text-4xl font-bold text-gradient transition-transform duration-300 group-hover:scale-105">
        {value}
      </div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="feature-card group p-6 rounded-xl border border-border/60 bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
      <div className="text-primary mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function StepItem({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="step-item flex gap-6 group">
      <div className="flex-shrink-0">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
          {number}
        </div>
      </div>
      <div className="pt-2">
        <h3 className="font-semibold text-xl mb-2">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function TestimonialCard({ quote, author, role, stars }: { quote: string; author: string; role: string; stars: number }) {
  return (
    <div className="testimonial-card p-6 rounded-xl border border-border/60 bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
      <div className="flex gap-1 mb-4">
        {Array.from({ length: stars }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
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
