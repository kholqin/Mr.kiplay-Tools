import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mrkiplay.securityintel",
  appName: "Mr.Kiplay Security Intelligence",
  webDir: "dist/public",
  bundledWebRuntime: false,
  server: {
    url:
      process.env.MRKIPLAY_WEB_URL || "https://mrkiplay-3eep3u8b.manus.space",
    cleartext: false,
    androidScheme: "https",
  },
};

export default config;
