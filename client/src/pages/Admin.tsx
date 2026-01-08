import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, Upload, Trash2, Edit, Eye, Plus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Admin() {
  const { user, isAuthenticated, loading } = useAuth();
  const [isAddBeatOpen, setIsAddBeatOpen] = useState(false);

  // Form states for adding beat
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [mood, setMood] = useState("");
  const [bpm, setBpm] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [licenseType, setLicenseType] = useState("Basic");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const utils = trpc.useUtils();
  const { data: beats, isLoading: beatsLoading } = trpc.beats.list.useQuery();
  const { data: submissions, isLoading: submissionsLoading } = trpc.submissions.list.useQuery();

  const createBeat = trpc.beats.create.useMutation({
    onSuccess: () => {
      toast.success("Beat added successfully!");
      setIsAddBeatOpen(false);
      resetForm();
      utils.beats.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add beat");
    },
  });

  const deleteBeat = trpc.beats.delete.useMutation({
    onSuccess: () => {
      toast.success("Beat deleted successfully!");
      utils.beats.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete beat");
    },
  });

  const updateSubmissionStatus = trpc.submissions.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status updated!");
      utils.submissions.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update status");
    },
  });

  const resetForm = () => {
    setTitle("");
    setGenre("");
    setMood("");
    setBpm("");
    setPrice("");
    setDescription("");
    setLicenseType("Basic");
    setAudioFile(null);
    setCoverImage(null);
  };

  const handleAddBeat = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!audioFile) {
      toast.error("Please select an audio file");
      return;
    }

    // Convert files to base64
    const audioBase64 = await fileToBase64(audioFile);
    let coverBase64: string | undefined;
    let coverName: string | undefined;

    if (coverImage) {
      coverBase64 = await fileToBase64(coverImage);
      coverName = coverImage.name;
    }

    createBeat.mutate({
      title,
      genre,
      mood,
      bpm: parseInt(bpm),
      price: Math.round(parseFloat(price) * 100), // Convert to cents
      description: description || undefined,
      audioFile: audioBase64,
      audioFileName: audioFile.name,
      coverImage: coverBase64,
      coverImageName: coverName,
      licenseType,
    });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result?.toString().split(",")[1];
        if (base64) resolve(base64);
        else reject(new Error("Failed to read file"));
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">Please log in to access the admin dashboard.</p>
          <Button onClick={() => (window.location.href = getLoginUrl())} className="gradient-purple">
            Log In
          </Button>
        </Card>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-6">You don't have permission to access this page.</p>
          <Button onClick={() => (window.location.href = "/")} variant="outline">
            Go Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-20">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage beats and submissions</p>
          </div>

          <Tabs defaultValue="beats" className="space-y-6">
            <TabsList>
              <TabsTrigger value="beats">Beats Management</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
            </TabsList>

            {/* Beats Tab */}
            <TabsContent value="beats" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Beats</h2>
                <Dialog open={isAddBeatOpen} onOpenChange={setIsAddBeatOpen}>
                  <DialogTrigger asChild>
                    <Button className="gradient-purple">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Beat
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Beat</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddBeat} className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                          className="mt-2"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="genre">Genre *</Label>
                          <Input
                            id="genre"
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                            required
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="mood">Mood *</Label>
                          <Input
                            id="mood"
                            value={mood}
                            onChange={(e) => setMood(e.target.value)}
                            required
                            className="mt-2"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="bpm">BPM *</Label>
                          <Input
                            id="bpm"
                            type="number"
                            value={bpm}
                            onChange={(e) => setBpm(e.target.value)}
                            required
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="price">Price (USD) *</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            className="mt-2"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="licenseType">License Type</Label>
                        <Select value={licenseType} onValueChange={setLicenseType}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Basic">Basic</SelectItem>
                            <SelectItem value="Premium">Premium</SelectItem>
                            <SelectItem value="Exclusive">Exclusive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="audioFile">Audio File * (MP3/WAV)</Label>
                        <Input
                          id="audioFile"
                          type="file"
                          accept="audio/mpeg,audio/wav"
                          onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                          required
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="coverImage">Cover Image (Optional)</Label>
                        <Input
                          id="coverImage"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                          className="mt-2"
                        />
                      </div>

                      <Button type="submit" disabled={createBeat.isPending} className="w-full gradient-purple">
                        {createBeat.isPending ? "Adding..." : "Add Beat"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {beatsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                </div>
              ) : beats && beats.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {beats.map((beat) => (
                    <Card key={beat.id} className="p-6 bg-card">
                      <div className="aspect-square bg-gradient-purple rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                        {beat.coverImageUrl ? (
                          <img src={beat.coverImageUrl} alt={beat.title} className="w-full h-full object-cover" />
                        ) : (
                          <Music className="w-16 h-16 text-primary-foreground" />
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">{beat.title}</h3>
                      <div className="text-sm text-muted-foreground space-y-1 mb-4">
                        <p>Genre: {beat.genre} | BPM: {beat.bpm}</p>
                        <p>Price: ${(beat.price / 100).toFixed(2)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this beat?")) {
                              deleteBeat.mutate({ id: beat.id });
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No beats yet. Add your first beat!</p>
                </Card>
              )}
            </TabsContent>

            {/* Submissions Tab */}
            <TabsContent value="submissions" className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Music Submissions</h2>

              {submissionsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                </div>
              ) : submissions && submissions.length > 0 ? (
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <Card key={submission.id} className="p-6 bg-card">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-foreground mb-2">{submission.songTitle}</h3>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Artist: {submission.artistName}</p>
                            <p>Email: {submission.email}</p>
                            <p>Type: {submission.fileType}</p>
                            <p>Submitted: {new Date(submission.createdAt).toLocaleDateString()}</p>
                            {submission.message && <p className="mt-2">Message: {submission.message}</p>}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Select
                            value={submission.status}
                            onValueChange={(value) =>
                              updateSubmissionStatus.mutate({
                                id: submission.id,
                                status: value as "pending" | "reviewed" | "accepted" | "rejected",
                              })
                            }
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="reviewed">Reviewed</SelectItem>
                              <SelectItem value="accepted">Accepted</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="outline" size="sm" asChild>
                            <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer">
                              <Eye className="w-4 h-4 mr-2" />
                              View File
                            </a>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No submissions yet.</p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
