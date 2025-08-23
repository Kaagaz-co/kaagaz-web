import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

export const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "🚧 Form submission isn't implemented yet!",
      description: "But don't worry! You can request this feature in your next prompt! 🚀",
    });
  };

  return (
    <section id="contact" className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Let's <span className="gradient-text">Talk</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Have a project in mind or just want to say hello? We'd love to hear from you.
            Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </motion.div>

  {/* Contact info grid removed per request */}

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input placeholder="Your Name" className="bg-background/50 border-border focus:border-kaagaz-red focus:ring-kaagaz-red" />
            <Input type="email" placeholder="Your Email" className="bg-background/50 border-border focus:border-kaagaz-red focus:ring-kaagaz-red" />
          </div>
          <Input placeholder="Subject" className="bg-background/50 border-border focus:border-kaagaz-red focus:ring-kaagaz-red" />
          <Textarea placeholder="Your Message" rows={6} className="bg-background/50 border-border focus:border-kaagaz-red focus:ring-kaagaz-red" />
          <Button type="submit" size="lg" className="bg-kaagaz-red hover:bg-kaagaz-red/90 text-white w-full md:w-auto">
            Send Message
          </Button>
        </motion.form>
      </div>
    </section>
  );
};