import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Message sent! We'll get back to you soon.");
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-20">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-4">Get In Touch</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions or want to collaborate? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card className="p-8 bg-card">
              <h2 className="text-2xl font-bold text-foreground mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-background mt-2"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
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
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="bg-background mt-2"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="bg-background mt-2 min-h-32"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full gradient-purple">
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Card>

            {/* Contact Info & Social */}
            <div className="space-y-6">
              {/* Email */}
              <Card className="p-8 bg-card">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Email Us</h3>
                    <p className="text-muted-foreground mb-2">
                      For business inquiries, support, or general questions:
                    </p>
                    <a
                      href="mailto:contact@aemusiclab.com"
                      className="text-primary hover:text-primary/80 transition-smooth"
                    >
                      contact@aemusiclab.com
                    </a>
                  </div>
                </div>
              </Card>

              {/* Social Media */}
              <Card className="p-8 bg-card">
                <h3 className="text-xl font-bold text-foreground mb-6">Follow Us</h3>
                <div className="space-y-4">
                  <a
                    href="https://instagram.com/aemusiclab"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-foreground hover:text-primary transition-smooth"
                  >
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Instagram className="w-5 h-5 text-primary" />
                    </div>
                    <span>@aemusiclab</span>
                  </a>

                  <a
                    href="https://twitter.com/aemusiclab"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-foreground hover:text-primary transition-smooth"
                  >
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Twitter className="w-5 h-5 text-primary" />
                    </div>
                    <span>@aemusiclab</span>
                  </a>

                  <a
                    href="https://facebook.com/aemusiclab"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-foreground hover:text-primary transition-smooth"
                  >
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Facebook className="w-5 h-5 text-primary" />
                    </div>
                    <span>AE Music Lab</span>
                  </a>

                  <a
                    href="https://youtube.com/@aemusiclab"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-foreground hover:text-primary transition-smooth"
                  >
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Youtube className="w-5 h-5 text-primary" />
                    </div>
                    <span>AE Music Lab</span>
                  </a>
                </div>
              </Card>

              {/* Business Hours */}
              <Card className="p-8 bg-card">
                <h3 className="text-xl font-bold text-foreground mb-4">Response Time</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We typically respond to inquiries within 24-48 hours during business days. For urgent matters, please mark your subject line with "URGENT".
                </p>
              </Card>
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
