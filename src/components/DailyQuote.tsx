import { getDailyQuote } from '@/data/quotes';
import { Quote } from 'lucide-react';

export function DailyQuote() {
  const quote = getDailyQuote();

  return (
    <div className="animate-fade-in text-center max-w-lg mx-auto">
      <Quote className="h-5 w-5 text-primary/50 mx-auto mb-3" />
      <blockquote className="text-lg text-foreground/80 italic leading-relaxed">
        "{quote.text}"
      </blockquote>
      <cite className="block mt-2 text-sm text-muted-foreground not-italic">
        — {quote.author}
      </cite>
    </div>
  );
}
