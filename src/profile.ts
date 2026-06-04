export type SocialPlatform = "youtube" | "tiktok" | "twitch" | "x";

export type SocialLink = {
  platform: SocialPlatform;
  href: string;
};

export type TrackConfig = {
  title: string;
  artist?: string;
  src: string;
  autoplayOnEnter: boolean;
};

export type StatusItem = {
  label: string;
  value: string;
};

export type ProfileConfig = {
  name: string;
  bio: string;
  views: string;
  status: StatusItem[];
  socials: SocialLink[];
  track: TrackConfig;
};

export const profile: ProfileConfig = {
  name: "ploysi",
  bio: "digital shadow in a noisy world",
  views: "1,337 views",
  status: [
    { label: "status", value: "online" },
    { label: "mood", value: "quiet" },
    { label: "mode", value: "creating" },
  ],
  socials: [
    { platform: "youtube", href: "https://www.youtube.com/@Ploysi" },
    { platform: "tiktok", href: "https://www.tiktok.com/@ploysik" },
    { platform: "twitch", href: "http://twitch.tv/ploysi_" },
    { platform: "x", href: "https://x.com/ploysi123" },
  ],
  track: {
    title: "now playing",
    artist: "",
    src: "",
    autoplayOnEnter: true,
  },
};
