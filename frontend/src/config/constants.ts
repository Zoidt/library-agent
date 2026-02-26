export const BOT_CONFIG = {
  name: "ARCH1V3",
  avatar: "",
  description: "Knowledge Base v2.0 — Neural Query Protocol Active",
} as const;

// Get your Client ID from Botpress Dashboard → Your Bot → Webchat → Client ID
// Set VITE_CLIENT_ID in a .env file in this directory
export const CLIENT_ID = import.meta.env.VITE_CLIENT_ID as string;
