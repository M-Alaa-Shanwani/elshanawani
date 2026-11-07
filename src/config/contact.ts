// Contact Configuration
// WhatsApp expects international format without '+' or leading '0':
// Egypt (01093299050) -> 201093299050
// Saudi Arabia (0571325956) -> 966571325956

export const CONTACT_CONFIG = {
  // Can be configured via environment variable or default value:
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '201093299050',
  displayPhoneNumber: import.meta.env.VITE_DISPLAY_PHONE || '+20 109 329 9050',
};
