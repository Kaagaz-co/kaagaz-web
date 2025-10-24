# Scheduling Call Integration

A "Schedule a 30 min Call" button was added (component: `src/components/ScheduleCall.jsx`) and embedded in the Contact section.

## Environment Variable
Set a real Calendly (or other scheduling) URL:
```
VITE_CALENDLY_URL=https://calendly.com/your-org/30min
```
Add this to `.env.local` for local dev or your deployment environment variables.

If not set, it falls back to `https://calendly.com/your-placeholder/30min`.

## How It Works
- Calendly widget assets are loaded in `index.html` head.
- Button calls `window.Calendly.initPopupWidget({ url })` if script has loaded.
- Fallback opens the URL in a new tab if script is not yet ready.

## Customization
- Change button text by editing the children of `<ScheduleCall />`.
- Add variants (outline, ghost) by passing `variant` prop and adjusting styles.
- To switch providers, replace the `openCalendly` callback with your provider’s embed code.

## Testing
1. Set your env var.
2. Run `npm run dev`.
3. Click the button under the Contact heading.
4. Popup should appear. If not, check console for Calendly script load issues.

## Accessibility
- Popup is external; ensure Calendly embed complies. Consider adding an aria-label to the button if you change text to an icon only.

## Next Steps (Optional)
- Add a header nav item for scheduling.
- Track click events via analytics (`trackEvent`).
- Lazy load Calendly script only when button becomes visible.
