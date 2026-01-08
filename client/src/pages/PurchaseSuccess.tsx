import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Download, Music } from "lucide-react";
import { Link } from "wouter";

export default function PurchaseSuccess() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-20">
        <div className="container">
          <Card className="max-w-2xl mx-auto p-12 bg-card text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary/20 rounded-full mb-6">
                <CheckCircle className="w-12 h-12 text-secondary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">Payment Successful!</h1>
              <p className="text-lg text-muted-foreground">
                Thank you for your purchase. Your beat is ready to download.
              </p>
            </div>

            <div className="bg-muted/20 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Music className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">What's Next?</h2>
              </div>
              <div className="text-left space-y-3 text-muted-foreground">
                <p className="flex items-start gap-2">
                  <span className="text-primary font-bold">1.</span>
                  Check your email for the download link and license agreement
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-primary font-bold">2.</span>
                  Download your beat files (you'll receive the full quality version)
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-primary font-bold">3.</span>
                  Review the license terms for usage rights
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-primary font-bold">4.</span>
                  Start creating your masterpiece!
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Need help? Contact us at{" "}
                <a href="mailto:support@aemusiclab.com" className="text-primary hover:underline">
                  support@aemusiclab.com
                </a>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/beats">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    Browse More Beats
                  </Button>
                </Link>
                <Link href="/">
                  <Button className="gradient-purple">Back to Home</Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
