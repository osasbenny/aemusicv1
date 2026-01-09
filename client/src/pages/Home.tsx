import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Music, Upload, Sparkles, TrendingUp, Users, Globe, DollarSign, Play, Pause } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Home() {
  const { data: beats, isLoading } = trpc.beats.list.useQuery();
  const featuredBeats = beats?.slice(0, 6) || [];
  const [playingId, setPlayingId] = useState<number | null>(null);

  const stats = [
    { label: "Beats Sold", value: "2M+", icon: Music, gradient: "from-purple-500 to-pink-500" },
    { label: "Active Users", value: "800K+", icon: Users, gradient: "from-cyan-500 to-blue-500" },
    { label: "Revenue Generated", value: "$50M+", icon: DollarSign, gradient: "from-green-500 to-emerald-500" },
    { label: "Countries", value: "100+", icon: Globe, gradient: "from-orange-500 to-red-500" },
  ];

  const moods = [
    { name: "Energetic", emoji: "⚡", color: "from-yellow-500 to-orange-500" },
    { name: "Dark", emoji: "😈", color: "from-purple-900 to-black" },
    { name: "Chill", emoji: "😎", color: "from-cyan-400 to-blue-500" },
    { name: "Aggressive", emoji: "😤", color: "from-red-600 to-orange-600" },
    { name: "Ambient", emoji: "😌", color: "from-indigo-400 to-purple-400" },
    { name: "Bouncy", emoji: "😄", color: "from-pink-500 to-rose-500" },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section with Background Image */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-bg.jpg" 
            alt="Music Producer" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"></div>
        </div>

        <div className="container relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Powered by Armhen Entertainment</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
              A Place To Buy Beats From{" "}
              <span className="gradient-purple bg-clip-text text-transparent">The World's Best Producers</span>
            </h1>
            
            <div className="space-y-3">
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Find the perfect beat for your project
              </p>
              <p className="text-lg md:text-xl text-cyan-400 font-semibold italic">
                The Science of Sounds
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/beats">
                <Button size="lg" className="text-lg px-8 py-6 glow-purple bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Music className="w-5 h-5 mr-2" />
                  Explore Beats
                </Button>
              </Link>
              <Link href="/submit">
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                  <Upload className="w-5 h-5 mr-2" />
                  Sell Your Beats
                </Button>
              </Link>
            </div>

            {/* Media Mentions */}
            <div className="pt-12">
              <p className="text-sm text-muted-foreground mb-4">Who's Talking About Us</p>
              <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
                <span className="text-2xl font-bold">Forbes</span>
                <span className="text-2xl font-bold">CNBC</span>
                <span className="text-2xl font-bold">Billboard</span>
                <span className="text-2xl font-bold">Complex</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background/50 backdrop-blur-sm">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`p-6 bg-gradient-to-br ${stat.gradient} border-0 text-white`}>
                  <div className="flex items-center gap-3 mb-2">
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Selling Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img 
                src="/producer-workspace.jpg" 
                alt="Producer Workspace" 
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-bold">
                Start Selling Your Beats Today
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need is right here, with tools and features tailored for both newcomers and chart-topping producers.
              </p>

              <div className="space-y-3">
                {[
                  "Upload Unlimited Beats",
                  "0% Commission on All Stores",
                  "Custom Licenses & Contracts",
                  "YouTube Content ID",
                  "Co-Producer Splits",
                  "And more..."
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                <Link href="/submit">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Sell Your Beats
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Beats */}
      <section className="py-20 bg-background/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Browse Beats</h2>
            <p className="text-lg text-muted-foreground">
              Quickly discover the perfect beats with our easy-to-use Browse page
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="h-48 bg-muted rounded-lg mb-4"></div>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBeats.map((beat, index) => (
                <motion.div
                  key={beat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-border/50 bg-card/50 backdrop-blur-sm">
                    <div className="aspect-square bg-gradient-to-br from-purple-600/20 to-cyan-500/20 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                      <Music className="w-16 h-16 text-primary" />
                      <Button
                        size="icon"
                        className="absolute bottom-4 right-4 rounded-full bg-primary hover:bg-primary/90"
                        onClick={() => setPlayingId(playingId === beat.id ? null : beat.id)}
                      >
                        {playingId === beat.id ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{beat.title}</h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <span>{beat.genre}</span>
                      <span>{beat.bpm} BPM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">${beat.price}</span>
                      <Link href={`/beats`}>
                        <Button size="sm" variant="outline">View Details</Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/beats">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Browse All Beats
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mood Selector */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Top Moods</h2>
            <p className="text-lg text-muted-foreground">
              How are you feeling today? Select a mood to see those type of beats
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {moods.map((mood, index) => (
              <motion.div
                key={mood.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
              >
                <Card className={`p-6 text-center hover:shadow-xl transition-all bg-gradient-to-br ${mood.color} border-0`}>
                  <div className="text-6xl mb-3">{mood.emoji}</div>
                  <div className="font-semibold text-white">{mood.name}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaboration Section */}
      <section className="py-20 bg-background/50">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Card className="p-8 h-full">
                <img 
                  src="/studio-collab.jpg" 
                  alt="Studio Collaboration" 
                  className="w-full h-48 object-cover rounded-lg mb-6"
                />
                <h3 className="text-2xl font-bold mb-3">You know what you're getting</h3>
                <p className="text-muted-foreground">
                  We make sure you know what you're getting and put all information up front like what files you'll receive and what terms of usage you'll get.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Card className="p-8 h-full bg-gradient-to-br from-purple-600/20 to-cyan-500/20">
                <div className="w-full h-48 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-lg mb-6 flex items-center justify-center">
                  <TrendingUp className="w-24 h-24 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Keeping the lawyers at bay</h3>
                <p className="text-muted-foreground">
                  Every purchase is legalized with an electronically signed contract from both parties. You're fully protected.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Card className="p-8 h-full">
                <div className="w-full h-48 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg mb-6 flex items-center justify-center">
                  <Play className="w-24 h-24 text-cyan-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Try before you buy</h3>
                <p className="text-muted-foreground">
                  Thousands of beats are offered for free download so you can try before you buy and makes sure the beat is right for you.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="p-12 bg-gradient-to-r from-purple-600 to-cyan-500 border-0 text-white text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to Start Your Music Journey?
              </h2>
              <p className="text-xl opacity-90">
                Join thousands of artists and producers who trust AE Music Lab
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/beats">
                  <Button size="lg" variant="secondary" className="text-lg px-8">
                    Browse Beats
                  </Button>
                </Link>
                <Link href="/submit">
                  <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-purple-600">
                    Submit Your Music
                  </Button>
                </Link>
              </div>
            </motion.div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
