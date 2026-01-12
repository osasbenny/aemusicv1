import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Music, ShoppingCart, Play, Handshake } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

export default function Beats() {
  const [genre, setGenre] = useState<string>("");
  const [mood, setMood] = useState<string>("");
  const [minBpm, setMinBpm] = useState<string>("");
  const [maxBpm, setMaxBpm] = useState<string>("");

  const { data: beats, isLoading } = trpc.beats.filter.useQuery({
    genre: genre || undefined,
    mood: mood || undefined,
    minBpm: minBpm ? parseInt(minBpm) : undefined,
    maxBpm: maxBpm ? parseInt(maxBpm) : undefined,
  });

  const createCheckout = trpc.beats.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        toast.success("Redirecting to checkout...");
        window.open(data.checkoutUrl, "_blank");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create checkout session");
    },
  });

  const handlePurchase = (beatId: number) => {
    createCheckout.mutate({ beatId });
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-20">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-4">Beat Store</h1>
            <p className="text-lg text-muted-foreground">Browse our collection of premium beats</p>
          </div>

          {/* Filters */}
          <Card className="p-6 bg-card mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Genre</label>
                <Select value={genre} onValueChange={setGenre}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Genres" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    <SelectItem value="Hip Hop">Hip Hop</SelectItem>
                    <SelectItem value="Trap">Trap</SelectItem>
                    <SelectItem value="R&B">R&B</SelectItem>
                    <SelectItem value="Pop">Pop</SelectItem>
                    <SelectItem value="Electronic">Electronic</SelectItem>
                    <SelectItem value="Lo-Fi">Lo-Fi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Mood</label>
                <Select value={mood} onValueChange={setMood}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Moods" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Moods</SelectItem>
                    <SelectItem value="Energetic">Energetic</SelectItem>
                    <SelectItem value="Chill">Chill</SelectItem>
                    <SelectItem value="Dark">Dark</SelectItem>
                    <SelectItem value="Uplifting">Uplifting</SelectItem>
                    <SelectItem value="Melancholic">Melancholic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Min BPM</label>
                <Input
                  type="number"
                  placeholder="60"
                  value={minBpm}
                  onChange={(e) => setMinBpm(e.target.value)}
                  className="bg-background"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Max BPM</label>
                <Input
                  type="number"
                  placeholder="180"
                  value={maxBpm}
                  onChange={(e) => setMaxBpm(e.target.value)}
                  className="bg-background"
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setGenre("");
                  setMood("");
                  setMinBpm("");
                  setMaxBpm("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </Card>

          {/* Beats Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="p-6 bg-card animate-pulse">
                  <div className="h-48 bg-muted rounded-lg mb-4"></div>
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </Card>
              ))}
            </div>
          ) : beats && beats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {beats.map((beat) => (
                <Card key={beat.id} className="p-6 bg-card border-border hover:border-primary transition-smooth group">
                  <div className="aspect-square bg-gradient-purple rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    {beat.coverImageUrl ? (
                      <img src={beat.coverImageUrl} alt={beat.title} className="w-full h-full object-cover" />
                    ) : (
                      <Music className="w-16 h-16 text-primary-foreground" />
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-smooth">
                    {beat.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-4">
                    <div>
                      <span className="font-medium">Genre:</span> {beat.genre}
                    </div>
                    <div>
                      <span className="font-medium">BPM:</span> {beat.bpm}
                    </div>
                    <div>
                      <span className="font-medium">Mood:</span> {beat.mood}
                    </div>
                    <div>
                      <span className="font-medium">License:</span> {beat.licenseType}
                    </div>
                  </div>

                  {beat.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{beat.description}</p>
                  )}

                  <div className="mb-4">
                    <audio 
                      id={`audio-${beat.id}`} 
                      controls 
                      className="w-full h-10"
                      onLoadedMetadata={(e) => {
                        const audio = e.currentTarget;
                        // Limit preview to 30 seconds
                        audio.addEventListener('timeupdate', function(this: HTMLAudioElement) {
                          if (this.currentTime >= 30) {
                            this.pause();
                            this.currentTime = 0;
                            toast.info("Preview limited to 30 seconds. Purchase or collaborate to hear the full beat!");
                          }
                        });
                      }}
                    >
                      <source src={beat.audioUrl} type="audio/mpeg" />
                    </audio>
                    <p className="text-xs text-muted-foreground mt-1 text-center">30-second preview</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">${(beat.price / 100).toFixed(2)}</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        onClick={() => handlePurchase(beat.id)}
                        disabled={createCheckout.isPending}
                        className="glow-purple w-full"
                        size="sm"
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Purchase
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          const audio = document.getElementById(`audio-${beat.id}`) as HTMLAudioElement;
                          if (audio) {
                            if (audio.paused) {
                              audio.play();
                              toast.success("Playing preview...");
                            } else {
                              audio.pause();
                              toast.info("Preview paused");
                            }
                          }
                        }}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          toast.success("Redirecting to collaboration form...");
                          window.open(`https://aemusiclab.com/collaborate.php?beat=${encodeURIComponent(beat.title)}`, '_blank');
                        }}
                      >
                        <Handshake className="w-4 h-4 mr-1" />
                        Collab
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">No beats found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or check back later for new beats.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
