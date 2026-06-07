export type SocialPlatform = "youtube" | "tiktok" | "twitch" | "x";

export type SocialLink = {
  platform: SocialPlatform;
  href: string;
};

export type TrackConfig = {
  title: string;
  artist?: string;
  src: string;
  coverUrl?: string;
  spotifyUrl?: string;
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
    title: "i love u. - slowed + reverb",
    artist: "wiv",
    src: "./audio/wiv-i-love-u-slowed-reverb.mp3",
    coverUrl: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02e57698883e7259c2218dd1f3",
    spotifyUrl: "https://open.spotify.com/track/1gCpf5jhAqegPJeXG0BCn5",
    autoplayOnEnter: true,
  },
};
