import React from 'react';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';

// Zoho event request form URL (override via VITE_ZOHO_EVENT_FORM_URL)
const ZOHO_FORM_URL = import.meta.env.VITE_ZOHO_EVENT_FORM_URL || 'https://calendar.zoho.in/eventreqForm/zz08021230882b6e84769c34252f871023d014b6632cf84f428ff2db06b88d77e35130db644be4f2a5ee306744494cb2241b479311?theme=9&l=en&tz=Asia/Kolkata';

export const ScheduleCall = ({ className = '' }) => {
  const openExternal = () => {
    try {
      trackEvent?.({ action: 'open_schedule_form', category: 'engagement', label: 'zoho_external' });
    } catch {}
    window.open(ZOHO_FORM_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button
      type="button"
      onClick={openExternal}
      className={className + ' bg-kaagaz-red hover:bg-kaagaz-red/90 text-white'}
    >
      Book Free Call
    </Button>
  );
};

export default ScheduleCall;
