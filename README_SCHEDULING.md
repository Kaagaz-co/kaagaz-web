# Scheduling (Zoho Event Request Form Integration)

We now embed the Zoho event request form (custom theme) inside a Radix Dialog so visitors can directly schedule a call. This replaces the prior calendar day-view embed.

## Component
`src/components/ScheduleCall.jsx` provides the button and modal.

## Environment Override
Default iframe URL embedded:
```
https://calendar.zoho.in/eventreqForm/zz08021230882b6e84769c34252f871023d014b6632cf84f428ff2db06b88d77e35130db644be4f2a5ee306744494cb2241b479311?theme=9&l=en&tz=Asia/Kolkata
```
Override via `.env.local`:
```
VITE_ZOHO_EVENT_FORM_URL=https://calendar.zoho.in/eventreqForm/<your-id>?theme=9&l=en&tz=Asia/Kolkata
```
Restart dev server after setting.

## Usage
Button is injected in the Contact section. Clicking it opens a modal with the scheduling form iframe.

## Customization
- Change dialog title: edit `Dialog.Title`.
- Adjust height: change iframe class `h-[350px]` / `md:h-[400px]`.
- Add tracking: wrap button click with analytics `trackEvent`.
- Add header nav item: import `ScheduleCall` and place a `<Dialog.Trigger>` there or create a secondary button that toggles shared dialog state.

## Accessibility
Radix Dialog handles focus trapping. Ensure descriptive `title` attribute remains on iframe. For screen readers, you may add `aria-label` to the iframe or provide alternative instructions.

## Fallback / No Script
If Zoho iframe fails to load, user can be given a mailto link; consider adding a small error boundary or timeout message.

## Next Enhancements
- Switch themes by adjusting `theme=` param; provide multiple theme buttons for user preference.
- Lazy load iframe only after opening dialog (currently immediate when dialog opens which is acceptable).
- Dark theme styling for iframe area using a surrounding container.