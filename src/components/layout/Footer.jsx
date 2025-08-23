import React from 'react';
import { Instagram, Linkedin, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export const Footer = ({ onLinkClick, logoUrl }) => {
  const handleSocialClick = (platform) => {
    toast({
      title: `🚧 Our ${platform} page isn't live yet, but stay tuned! 🚀`
    });
  };

  return (
    <footer className="bg-background py-16 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="w-24">
              <img src={logoUrl} alt="Kaagaz Logo" className="w-full h-auto" />
            </div>
            <p className="text-muted-foreground leading-relaxed">
              We Don’t Just Talk. We Leave Marks.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=61579642505982" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-kaagaz-red transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/kaagaz_studios" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-kaagaz-red transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/kaagazco" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-kaagaz-red transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <span className="font-semibold text-foreground mb-4 block">Quick Links</span>
            <ul className="space-y-2">
              <li><button onClick={() => onLinkClick('services')} className="text-muted-foreground hover:text-kaagaz-red transition-colors">Services</button></li>
              <li><button onClick={() => onLinkClick('portfolio')} className="text-muted-foreground hover:text-kaagaz-red transition-colors">Portfolio</button></li>
              <li><button onClick={() => onLinkClick('contact')} className="text-muted-foreground hover:text-kaagaz-red transition-colors">Let's Talk</button></li>
            </ul>
          </div>

          <div>
            <span className="font-semibold text-foreground mb-4 block">Company</span>
            <ul className="space-y-2">
              <li><button onClick={() => onLinkClick('about')} className="text-muted-foreground hover:text-kaagaz-red transition-colors">About Us</button></li>
              <li><button onClick={() => onLinkClick('careers')} className="text-muted-foreground hover:text-kaagaz-red transition-colors">Careers</button></li>
            </ul>
          </div>

          <div>
            <span className="font-semibold text-foreground mb-4 block">Contact</span>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail className="h-4 w-4 text-kaagaz-red" />
                <a href="mailto:info@kaagaz.co" className="hover:text-kaagaz-red transition-colors">info@kaagaz.co</a>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Phone className="h-4 w-4 text-kaagaz-red" />
                <a href="tel:+919149938056" className="hover:text-kaagaz-red transition-colors">+91 91499-38056</a>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <MapPin className="h-4 w-4 text-kaagaz-red" />
                <span>Udyog Vihar Phase 1, Gurugram - 122002</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-muted-foreground/60">
            © 2025 Kaagaz. All rights reserved. Crafted with heritage and innovation.
          </p>
        </div>
      </div>
    </footer>
  );
};