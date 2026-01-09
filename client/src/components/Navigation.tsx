import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Music2, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-3 hover:opacity-80 transition-smooth">
              <img src="/logo.png" alt="AE Music Lab - The Science of Sounds" className="h-12 w-auto" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground">AE Music Lab</span>
                <span className="text-xs text-muted-foreground italic">The Science of Sounds</span>
              </div>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/">
              <a className="text-foreground hover:text-primary transition-smooth">Home</a>
            </Link>
            <Link href="/beats">
              <a className="text-foreground hover:text-primary transition-smooth">Beats</a>
            </Link>
            <Link href="/submit">
              <a className="text-foreground hover:text-primary transition-smooth">Submit Music</a>
            </Link>
            <Link href="/about">
              <a className="text-foreground hover:text-primary transition-smooth">About</a>
            </Link>
            <Link href="/contact">
              <a className="text-foreground hover:text-primary transition-smooth">Contact</a>
            </Link>
            {isAuthenticated && user?.role === "admin" && (
              <Link href="/admin">
                <a className="text-foreground hover:text-primary transition-smooth">Admin</a>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link href="/">
              <a
                className="block text-foreground hover:text-primary transition-smooth"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </a>
            </Link>
            <Link href="/beats">
              <a
                className="block text-foreground hover:text-primary transition-smooth"
                onClick={() => setMobileMenuOpen(false)}
              >
                Beats
              </a>
            </Link>
            <Link href="/submit">
              <a
                className="block text-foreground hover:text-primary transition-smooth"
                onClick={() => setMobileMenuOpen(false)}
              >
                Submit Music
              </a>
            </Link>
            <Link href="/about">
              <a
                className="block text-foreground hover:text-primary transition-smooth"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
            </Link>
            <Link href="/contact">
              <a
                className="block text-foreground hover:text-primary transition-smooth"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
            </Link>
            {isAuthenticated && user?.role === "admin" && (
              <Link href="/admin">
                <a
                  className="block text-foreground hover:text-primary transition-smooth"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </a>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
