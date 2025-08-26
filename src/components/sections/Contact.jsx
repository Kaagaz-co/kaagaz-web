import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

export const Contact = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    // Add a subject for the email
    if (!data.get('_subject')) data.set('_subject', 'New contact form submission');
    try {
      const res = await fetch('https://formsubmit.co/ajax/info@kaagaz.co', {
        method: 'POST',
        body: data,
      });
      if (!res.ok) throw new Error('Formsubmit error');
      form.reset();
      toast({ title: 'Thanks! Your message was sent.', description: "We'll get back to you shortly." });
    } catch (err) {
      toast({ title: 'Submission failed', description: 'Please try again or email us at info@kaagaz.co' });
    }
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
            Got an idea? A crazy project? Or just feel like saying hi? Hit us up we love a good chat. Fill the form below and we’ll get back to you before you know it.
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
          {/* Hidden config for Formsubmit */}
          <input type="hidden" name="_subject" value="New contact form submission" />
          <input type="hidden" name="_template" value="table" />
          <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input name="name" placeholder="Your Name" className="bg-background/50 border-border focus:border-kaagaz-red focus:ring-kaagaz-red" />
            <Input name="email" type="email" placeholder="Your Email" className="bg-background/50 border-border focus:border-kaagaz-red focus:ring-kaagaz-red" />
          </div>
          <Input name="subject" placeholder="Subject" className="bg-background/50 border-border focus:border-kaagaz-red focus:ring-kaagaz-red" />
          <Textarea name="message" placeholder="Your Message" rows={6} className="bg-background/50 border-border focus:border-kaagaz-red focus:ring-kaagaz-red" />
          <Button type="submit" size="lg" className="bg-kaagaz-red hover:bg-kaagaz-red/90 text-white w-full md:w-auto">
            Send Message
          </Button>
        </motion.form>
      </div>
    </section>
  );
};