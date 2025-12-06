import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';
import { X, Loader2, CheckCircle2 } from 'lucide-react';

export const BrandAuditForm = ({ trigger, className = '' }) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    brandName: '',
    business: '',
    email: '',
    websiteUrl: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    salesChannel: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Track form submission
      trackEvent?.({ 
        action: 'brand_audit_submit', 
        category: 'engagement', 
        label: 'form_submission' 
      });

      // Submit to Vercel function
      const response = await fetch('/api/brand-audit-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Submission failed. Please try again.');
      }

      setSubmitSuccess(true);
      
      // Reset form after 3 seconds and close
      setTimeout(() => {
        setFormData({
          name: '',
          phone: '',
          brandName: '',
          business: '',
          email: '',
          websiteUrl: '',
          instagram: '',
          facebook: '',
          linkedin: '',
          salesChannel: ''
        });
        setSubmitSuccess(false);
        setOpen(false);
      }, 3000);

    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full px-4 py-2.5 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-kaagaz-red focus:border-transparent transition-all";
  const labelClasses = "block text-sm font-medium text-foreground mb-1.5";

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        {trigger || (
          <Button className={className + ' bg-kaagaz-red hover:bg-kaagaz-red/90 text-white'}>
            Book Your FREE Brand Audit
          </Button>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-2xl max-h-[90vh] bg-background border border-border rounded-xl shadow-2xl p-6 z-50 overflow-y-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-2xl font-bold text-foreground">
              FREE Brand Audit
            </Dialog.Title>
            <Dialog.Close asChild>
              <button 
                aria-label="Close" 
                className="text-muted-foreground hover:text-foreground transition-colors rounded-full p-1 hover:bg-muted"
              >
                <X size={24} />
              </button>
            </Dialog.Close>
          </div>

          <AnimatePresence mode="wait">
            {submitSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Thank You!</h3>
                <p className="text-muted-foreground max-w-md">
                  Your FREE brand audit has been initiated. We'll reach out if we need any additional details.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <p className="text-sm text-muted-foreground mb-6">
                  Fill out the form below to get your comprehensive brand audit. Our team will complete your audit within 3 working days.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className={labelClasses}>
                      Your Name <span className="text-kaagaz-red">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className={labelClasses}>
                      Phone Number <span className="text-kaagaz-red">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Brand Name */}
                  <div>
                    <label htmlFor="brandName" className={labelClasses}>
                      Brand Name <span className="text-kaagaz-red">*</span>
                    </label>
                    <input
                      type="text"
                      id="brandName"
                      name="brandName"
                      required
                      value={formData.brandName}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="Your Brand"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className={labelClasses}>
                      Email Address <span className="text-kaagaz-red">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* What do you do */}
                <div>
                  <label htmlFor="business" className={labelClasses}>
                    What do you do? <span className="text-kaagaz-red">*</span>
                  </label>
                  <textarea
                    id="business"
                    name="business"
                    required
                    value={formData.business}
                    onChange={handleChange}
                    rows="3"
                    className={inputClasses}
                    placeholder="Describe your business or services..."
                  />
                </div>

                {/* Website URL */}
                <div>
                  <label htmlFor="websiteUrl" className={labelClasses}>
                    Website URL
                  </label>
                  <input
                    type="url"
                    id="websiteUrl"
                    name="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="https://yourbrand.com"
                  />
                </div>

                {/* Social Media Handles */}
                <div className="space-y-4 pt-2">
                  <h4 className="font-medium text-foreground">Social Media (Optional)</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Instagram */}
                    <div>
                      <label htmlFor="instagram" className={labelClasses}>
                        Instagram Handle
                      </label>
                      <input
                        type="text"
                        id="instagram"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="@yourbrand"
                      />
                    </div>

                    {/* Facebook */}
                    <div>
                      <label htmlFor="facebook" className={labelClasses}>
                        Facebook Handle
                      </label>
                      <input
                        type="text"
                        id="facebook"
                        name="facebook"
                        value={formData.facebook}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="facebook.com/yourbrand"
                      />
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div>
                    <label htmlFor="linkedin" className={labelClasses}>
                      LinkedIn Handle
                    </label>
                    <input
                      type="text"
                      id="linkedin"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>

                {/* Where you sell */}
                <div>
                  <label htmlFor="salesChannel" className={labelClasses}>
                    Where do you sell? <span className="text-kaagaz-red">*</span>
                  </label>
                  <input
                    type="text"
                    id="salesChannel"
                    name="salesChannel"
                    required
                    value={formData.salesChannel}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="e.g., Website, Amazon, Physical Store, etc."
                  />
                </div>

                {submitError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
                    {submitError}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-kaagaz-red hover:bg-kaagaz-red/90 text-white font-semibold py-3"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit for FREE Audit'
                    )}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center pt-2">
                  Your audit will be completed in 3 working days. We'll contact you at the provided email address.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default BrandAuditForm;
