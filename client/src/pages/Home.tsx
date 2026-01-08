import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Music, Upload, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { data: beats, isLoading } = trpc.beats.list.useQuery();
  const featuredBeats = beats?.slice(0, 3) || [];

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 gradient-hero">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Powered by Armhen Entertainment</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
              Welcome to{" "}
              <span className="gradient-purple bg-clip-text text-transparent">AE Music Lab</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Your creative hub for premium beats and artist discovery. Buy exclusive beats or submit your music to get discovered.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/beats">
                <Button size="lg" className="text-lg px-8 py-6 glow-purple">
                  <Music className="w-5 h-5 mr-2" />
                  Browse Beats
                </Button>
              </Link>
              <Link href="/submit">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
                  <Upload className="w-5 h-5 mr-2" />
                  Submit Your Music
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Beats Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Featured Beats</h2>
            <p className="text-lg text-muted-foreground">Discover our latest and most popular beats</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 bg-card animate-pulse">
                  <div className="h-48 bg-muted rounded-lg mb-4"></div>
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </Card>
              ))}
            </div>
          ) : featuredBeats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredBeats.map((beat) => (
                <Card key={beat.id} className="p-6 bg-card border-border hover:border-primary transition-smooth group">
                  <div className="aspect-square bg-gradient-purple rounded-lg mb-4 flex items-center justify-center">
                    {beat.coverImageUrl ? (
                      <img src={beat.coverImageUrl} alt={beat.title} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Music className="w-16 h-16 text-primary-foreground" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-smooth">
                    {beat.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{beat.genre}</span>
                    <span>{beat.bpm} BPM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">${(beat.price / 100).toFixed(2)}</span>
                    <audio controls className="w-32 h-8">
                      <source src={beat.audioUrl} type="audio/mpeg" />
                    </audio>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <p>No beats available yet. Check back soon!</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/beats">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                View All Beats
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-bold text-foreground">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground">
              Whether you're looking for the perfect beat or want to showcase your talent, AE Music Lab is here for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/beats">
                <Button size="lg" className="gradient-purple">
                  Explore Beat Store
                </Button>
              </Link>
              <Link href="/submit">
                <Button size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
                  Submit Your Track
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-background border-t border-border">
        <div className="container text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AE Music Lab - A Division of Armhen Entertainment. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
