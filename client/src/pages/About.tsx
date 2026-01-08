import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Music, Users, Sparkles, Target } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-20">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-foreground mb-4">About AE Music Lab</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A creative hub under Armhen Entertainment, dedicated to talent discovery, beat production, and collaboration.
            </p>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Vision */}
            <Card className="p-8 bg-card">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-3">Our Vision</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    AE Music Lab exists to bridge the gap between talented artists and high-quality production. We believe that every artist deserves access to professional beats and every producer deserves a platform to showcase their work. Our mission is to create a thriving ecosystem where creativity meets opportunity.
                  </p>
                </div>
              </div>
            </Card>

            {/* What We Do */}
            <Card className="p-8 bg-card">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Music className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-3">What We Do</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    AE Music Lab operates as a dual-purpose platform:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <h3 className="font-semibold text-foreground">Beat Marketplace</h3>
                        <p className="text-muted-foreground">
                          Browse and purchase premium beats crafted by professional producers. Each beat comes with flexible licensing options to suit your project needs.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                      <div>
                        <h3 className="font-semibold text-foreground">Artist Submission Platform</h3>
                        <p className="text-muted-foreground">
                          Submit your original music for review. We actively scout for emerging talent and provide opportunities for collaboration, features, and exposure.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Armhen Entertainment */}
            <Card className="p-8 bg-card">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-3">Part of Armhen Entertainment</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    AE Music Lab is a proud division of Armhen Entertainment, a forward-thinking entertainment company committed to nurturing creative talent across multiple disciplines. Under the Armhen umbrella, we benefit from industry expertise, professional resources, and a network of creative professionals dedicated to elevating artists and producers to new heights.
                  </p>
                </div>
              </div>
            </Card>

            {/* Our Commitment */}
            <Card className="p-8 bg-card">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Users className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-3">Our Commitment</h2>
                  <div className="space-y-3 text-muted-foreground leading-relaxed">
                    <p>
                      <strong className="text-foreground">Quality:</strong> Every beat in our store meets rigorous production standards. We curate our catalog to ensure you're getting professional-grade instrumentals.
                    </p>
                    <p>
                      <strong className="text-foreground">Discovery:</strong> We actively review submissions and provide constructive feedback. Talented artists who submit through our platform gain access to collaboration opportunities and potential features.
                    </p>
                    <p>
                      <strong className="text-foreground">Community:</strong> We're building a community of artists, producers, and music enthusiasts who support each other's creative journeys.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Call to Action */}
            <div className="text-center py-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Join Us?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Whether you're looking for the perfect beat or ready to share your music with the world, we're here to help you succeed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/beats" className="inline-block">
                  <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-smooth">
                    Explore Beats
                  </button>
                </a>
                <a href="/submit" className="inline-block">
                  <button className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:opacity-90 transition-smooth">
                    Submit Your Music
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-background border-t border-border">
        <div className="container text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AE Music Lab - A Division of Armhen Entertainment. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
