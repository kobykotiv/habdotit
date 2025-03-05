import webPush from 'web-push';

// ...existing code...
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

if (!VAPID_PUBLIC_KEY || Buffer.from(VAPID_PUBLIC_KEY, 'base64').length !== 65) {
  throw new Error("Invalid VAPID public key. Ensure it is correctly set and decodes to 65 bytes.");
}

webPush.setVapidDetails("mailto:example@example.com", VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

// ...existing code...
