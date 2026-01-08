import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

export default function Submit() {
  const [artistName, setArtistName] = useState("");
  const [email, setEmail] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const createSubmission = trpc.submissions.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Submission received! We'll review it and get back to you soon.");
      // Reset form
      setArtistName("");
      setEmail("");
      setSongTitle("");
      setMessage("");
      setFile(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit. Please try again.");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file size (16MB limit)
      if (selectedFile.size > 16 * 1024 * 1024) {
        toast.error("File size must be less than 16MB");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result?.toString().split(",")[1];
      if (!base64) {
        toast.error("Failed to read file");
        return;
      }

      const fileType = file.type.startsWith("audio") ? "audio" : "video";

      createSubmission.mutate({
        artistName,
        email,
        songTitle,
        message: message || undefined,
        file: base64,
        fileName: file.name,
        fileType,
      });
    };
    reader.readAsDataURL(file);
  };

  if (submitted) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="container">
            <Card className="max-w-2xl mx-auto p-12 bg-card text-center">
              <CheckCircle className="w-20 h-20 text-secondary mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-foreground mb-4">Submission Received!</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Thank you for submitting your music to AE Music Lab. Our team will review your submission and get back to you via email within 3-5 business days.
              </p>
              <Button onClick={() => setSubmitted(false)} className="gradient-purple">
                Submit Another Track
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-20">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-4">Submit Your Music</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Share your talent with us. Upload your track and we'll review it for potential collaboration or feature opportunities.
            </p>
          </div>

          {/* Form */}
          <Card className="max-w-2xl mx-auto p-8 bg-card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="artistName">Artist Name *</Label>
                <Input
                  id="artistName"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  required
                  className="bg-background mt-2"
                  placeholder="Your artist or band name"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background mt-2"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <Label htmlFor="songTitle">Song Title *</Label>
                <Input
                  id="songTitle"
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  required
                  className="bg-background mt-2"
                  placeholder="Name of your track"
                />
              </div>

              <div>
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-background mt-2 min-h-32"
                  placeholder="Tell us about your music, inspiration, or anything else you'd like to share..."
                />
              </div>

              <div>
                <Label htmlFor="file">Upload File * (MP3, WAV, or MP4)</Label>
                <div className="mt-2">
                  <label
                    htmlFor="file"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-smooth bg-background"
                  >
                    <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      {file ? file.name : "Click to upload or drag and drop"}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">Max file size: 16MB</span>
                  </label>
                  <input
                    id="file"
                    type="file"
                    accept="audio/mpeg,audio/wav,video/mp4"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                </div>
              </div>

              {/* Terms */}
              <div className="p-4 bg-muted/20 rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-2">Submission Terms</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• You confirm that you own all rights to the submitted music</li>
                  <li>• Submissions are reviewed within 3-5 business days</li>
                  <li>• We'll contact you via email with feedback or opportunities</li>
                  <li>• Not all submissions will receive a response</li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={createSubmission.isPending}
                className="w-full gradient-purple text-lg py-6"
              >
                {createSubmission.isPending ? "Submitting..." : "Submit Your Music"}
              </Button>
            </form>
          </Card>
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
