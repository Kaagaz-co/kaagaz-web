import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import * as Dialog from '@radix-ui/react-dialog';

// Zoho event request form URL (override via VITE_ZOHO_EVENT_FORM_URL). Provided default sets theme 9.
const ZOHO_IFRAME_URL = import.meta.env.VITE_ZOHO_EVENT_FORM_URL || 'https://calendar.zoho.in/eventreqForm/zz08021230882b6e84769c34252f871023d014b6632cf84f428ff2db06b88d77e35130db644be4f2a5ee306744494cb2241b479311?theme=9&l=en&tz=Asia/Kolkata';

export const ScheduleCall = ({ className = '' }) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const iframeRef = useRef(null);

  // Timeout if iframe stays blank beyond threshold
  useEffect(() => {
    const t = setTimeout(() => {
      if (!loaded) {
        setErrored(true);
      }
    }, 10000); // 10s
    return () => clearTimeout(t);
  }, [loaded]);

  const handleReload = () => {
    setErrored(false);
    setLoaded(false);
    if (iframeRef.current) {
      iframeRef.current.src = ZOHO_IFRAME_URL + (ZOHO_IFRAME_URL.includes('?') ? '&' : '?') + 'r=' + Date.now();
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          type="button"
          className={className + ' bg-kaagaz-red hover:bg-kaagaz-red/90 text-white'}
        >
          Schedule a Call
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-3xl bg-background border border-border rounded-xl shadow-xl p-4 z-50 focus:outline-none">
          <div className="flex justify-between items-center mb-2">
            <Dialog.Title className="text-xl font-semibold">Schedule a Call</Dialog.Title>
            <Dialog.Close asChild>
              <button aria-label="Close" className="text-muted-foreground hover:text-foreground transition-colors">✕</button>
            </Dialog.Close>
          </div>
          <div className="rounded-lg overflow-hidden relative bg-black/5">
            {!loaded && !errored && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground animate-pulse">
                <div className="h-10 w-10 border-4 border-kaagaz-red/30 border-t-kaagaz-red rounded-full animate-spin" />
                <span>Loading form…</span>
              </div>
            )}
            {errored && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center p-4">
                <p className="text-sm text-muted-foreground">The form didn’t load. Possible network, ad blocker, or third‑party restriction.</p>
                <div className="flex gap-3">
                  <button onClick={handleReload} className="px-4 py-2 rounded-md bg-kaagaz-red text-white text-sm hover:bg-kaagaz-red/90">Retry</button>
                  <a href={ZOHO_IFRAME_URL} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-md border border-border text-sm hover:bg-background">Open Directly</a>
                </div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={ZOHO_IFRAME_URL}
              title="Kaagaz Scheduling Form"
              frameBorder="0"
              scrolling="no"
              marginWidth="0"
              marginHeight="0"
              allowTransparency="true"
              className="w-full h-[350px] md:h-[400px]"
              onLoad={() => setLoaded(true)}
            />
          </div>
          <div className="mt-4 text-center text-xs text-muted-foreground">Powered by Zoho Calendar</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ScheduleCall;
