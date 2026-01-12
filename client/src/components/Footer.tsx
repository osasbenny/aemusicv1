import { Link } from "wouter";
import { Music2, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="AE Music Lab" className="h-10 w-auto" />
              <span className="text-xl font-bold">AE Music Lab</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your creative hub for premium beats and artist discovery.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Powered by</span>
              <span className="text-primary font-semibold">Armhen Entertainment</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/">
                  <a className="text-muted-foreground hover:text-primary transition-smooth">
                    Home
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/beats">
                  <a className="text-muted-foreground hover:text-primary transition-smooth">
                    Browse Beats
                  </a>
                </Link>
              </li>
              <li>
                <a href="https://aemusiclab.com/submit.php" className="text-muted-foreground hover:text-primary transition-smooth" target="_blank" rel="noopener noreferrer">
                  Submit Music
                </a>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-muted-foreground hover:text-primary transition-smooth">
                    About Us
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-muted-foreground hover:text-primary transition-smooth">
                    Contact
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                  Licensing Agreement
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Info@aemusiclab.com</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>+27 69 923 0893</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>19 Loop Street, Cape Town City Centre, Cape Town, South Africa</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>
              © {currentYear} AE Music Lab. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <span>Designed by</span>
              <a
                href="https://cactusdigitalmedia.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-accent transition-smooth font-semibold flex items-center gap-1"
              >
                Cactus Digital Media
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
