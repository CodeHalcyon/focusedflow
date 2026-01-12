import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, BarChart3, Target, Trophy, ArrowRight, CheckCircle } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <header className="border-b border-border/40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">Focus</span>
          </div>
          <Link to="/auth">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="container mx-auto px-6 py-24 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Track your focus.
              <br />
              <span className="text-primary">Build your consistency.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              A minimal, distraction-free productivity app for remote developers. 
              Track work sessions, complete tasks, and build lasting work habits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/auth">
                <Button size="lg" className="gap-2">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border/40 bg-muted/30">
          <div className="container mx-auto px-6 py-20">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Everything you need. Nothing you don't.
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<Clock className="h-8 w-8" />}
                title="Work Timer"
                description="Track focus sessions with a beautiful real-time clock. Start, pause, and review your daily work time."
              />
              <FeatureCard
                icon={<Target className="h-8 w-8" />}
                title="Daily Goals"
                description="Set personalized focus time goals and track your progress throughout the day."
              />
              <FeatureCard
                icon={<BarChart3 className="h-8 w-8" />}
                title="Analytics"
                description="Visualize your productivity trends with weekly and monthly insights."
              />
              <FeatureCard
                icon={<Trophy className="h-8 w-8" />}
                title="Achievements"
                description="Unlock badges for milestones like work streaks, total hours, and task completions."
              />
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
              Built for developers who value simplicity
            </h2>
            <ul className="space-y-4">
              {[
                "Minimal, distraction-free interface",
                "Dark mode support",
                "Keyboard-friendly interactions",
                "Daily inspirational quotes",
                "Shareable stats cards",
                "Cross-device sync",
              ].map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-lg">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border/40 bg-primary/5">
          <div className="container mx-auto px-6 py-20 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to focus?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join developers building better work habits.
            </p>
            <Link to="/auth">
              <Button size="lg" className="gap-2">
                Start Tracking <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Focus. Built with care for remote developers.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl border border-border/60 bg-card hover:border-primary/40 transition-colors">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
