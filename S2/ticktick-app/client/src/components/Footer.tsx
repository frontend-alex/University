import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MapPin,
  Mail,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { NavbarLogo } from "./Navbar";

const Footer = () => {
  return (
    <footer className="py-12 mt-auto border-t z-10 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <NavbarLogo />
            <p className="text-muted-foreground text-sm">
              TaskTide helps you stay productive and focused with beautifully simple task management. Organize your day, every day.
            </p>
            <div className="flex gap-4 mt-2">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <Button key={i} variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">{Icon.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-medium text-base">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Home</Link>
              <Link to="/features" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Features</Link>
              <Link to="/pricing" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Pricing</Link>
              <Link to="/about" className="text-muted-foreground text-sm hover:text-foreground transition-colors">About Us</Link>
              <Link to="/contact" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Contact</Link>
              <Link to="/careers" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Careers</Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-4">
            <h3 className="font-medium text-base">Contact Us</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  42 Productivity Ave, Focus City, FC 98765
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href="mailto:support@tasktide.app"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  support@tasktide.app
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  <p>Mon–Fri: 9:00 AM – 6:00 PM</p>
                  <p>Support closed on weekends</p>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4">
            <h3 className="font-medium text-base">Stay Updated</h3>
            <p className="text-muted-foreground text-sm">
              Get productivity tips, feature updates, and app news straight to your inbox.
            </p>
            <div className="flex gap-2">
              <Input type="email" placeholder="Your email" className="h-9" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TaskTide. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
            <Link to="/sitemap" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
