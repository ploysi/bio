import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import {
  FaEye,
  FaPause,
  FaPlay,
  FaTiktok,
  FaTwitch,
  FaVolumeHigh,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { profile, type SocialPlatform, type TrackConfig } from "./profile";

const icons: Record<SocialPlatform, IconType> = {
  youtube: FaYoutube,
  tiktok: FaTiktok,
  twitch: FaTwitch,
  x: FaXTwitter,
};

type SocialOpenHandler = (platform: SocialPlatform, href: string) => void;

function IntroOverlay({
  leaving,
  onEnter,
}: {
  leaving: boolean;
  onEnter: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        onEnter();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onEnter]);

  return (
    <button
      className={`intro ${leaving ? "intro--leaving" : ""}`}
      onClick={onEnter}
      type="button"
    >
      <span className="intro__system-title" aria-hidden="true">
        ploysi.xyz
      </span>
      <span className="intro__copy">
        <span className="intro__bracket intro__bracket--left">[</span>
        <span className="intro__label">click to enter</span>
        <span className="intro__bracket intro__bracket--right">]</span>
        <span className="intro__hint">or press enter</span>
      </span>
    </button>
  );
}

function IdentityLinks({ onOpen }: { onOpen: SocialOpenHandler }) {
  return (
    <nav className="identity-links" aria-label="Links and identity">
      <div className="identity-links__grid">
        {profile.socials.map(({ platform, href }, index) => {
          const Icon = icons[platform];
          const label = `${platform} ${String(index + 1).padStart(2, "0")}`;

          if (!href) {
            return (
              <span
                aria-label={`${label} not linked`}
                className="identity-link identity-link--disabled"
                key={platform}
                role="img"
              >
                <Icon aria-hidden="true" />
              </span>
            );
          }

          return (
            <a
              aria-label={`Open ${platform}`}
              className="identity-link"
              href={href}
              key={platform}
              onClick={(event) => {
                event.preventDefault();
                onOpen(platform, href);
              }}
              rel="noreferrer"
              target="_blank"
              title={platform}
            >
              <Icon aria-hidden="true" />
            </a>
          );
        })}
      </div>
    </nav>
  );
}

function MusicPlayer({
  entered,
  track,
}: {
  entered: boolean;
  track: TrackConfig;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.72);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !entered || !track.autoplayOnEnter) {
      return;
    }

    void audio.play().catch(() => setIsPlaying(false));
  }, [entered, track.autoplayOnEnter]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  if (!track.src) {
    return (
      <section className="music-player music-player--empty" aria-label="Music player">
        <span className="music-player__label">now playing</span>
        <strong>no track selected</strong>
      </section>
    );
  }

  const togglePlayback = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (audio.paused) {
      void audio.play();
    } else {
      audio.pause();
    }
  };
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const trackLabel = track.artist ? `${track.artist} - ${track.title}` : track.title;
  const formatTime = (time: number) => {
    if (!Number.isFinite(time) || time <= 0) {
      return "0:00";
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  return (
    <section
      className={`music-player ${isPlaying ? "music-player--playing" : ""}`}
      aria-label="Music player"
    >
      <audio
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        preload="metadata"
        ref={audioRef}
        src={track.src}
      />
      {track.coverUrl ? (
        <img
          alt=""
          className="music-player__cover"
          draggable="false"
          src={track.coverUrl}
        />
      ) : (
        <span className="music-player__cover" aria-hidden="true" />
      )}
      <button
        aria-label={isPlaying ? "Pause track" : "Play track"}
        className="music-player__toggle"
        onClick={togglePlayback}
        type="button"
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
      <span className="music-player__copy">
        <small className="music-player__label">now playing</small>
        {track.spotifyUrl ? (
          <a href={track.spotifyUrl} rel="noreferrer" target="_blank">
            {trackLabel}
          </a>
        ) : (
          <strong>{trackLabel}</strong>
        )}
        <span className="music-player__progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </span>
        <span className="music-player__time" aria-hidden="true">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </span>
      </span>
      <span className="music-player__meter" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <label className="music-player__volume" aria-label="Volume">
        <FaVolumeHigh aria-hidden="true" />
        <input
          aria-label="Volume"
          max="1"
          min="0"
          onChange={(event) => setVolume(Number(event.currentTarget.value))}
          onInput={(event) => setVolume(Number(event.currentTarget.value))}
          step="0.01"
          type="range"
          value={volume}
        />
      </label>
    </section>
  );
}

function ProfileCard({
  onSocialOpen,
  onPointerMove,
  onPointerLeave,
}: {
  onSocialOpen: SocialOpenHandler;
  onPointerMove: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
}) {
  return (
    <main
      className="profile-card"
      aria-label={`${profile.name}'s bio`}
      onPointerLeave={onPointerLeave}
      onPointerMove={onPointerMove}
    >
      <h1 data-text={profile.name}>{profile.name}</h1>
      <IdentityLinks onOpen={onSocialOpen} />
      <div className="profile-card__footer">
        <span className="footer-mark">
          active
          <span aria-hidden="true">·</span>
        </span>
        <span className="views" aria-label={profile.views}>
          <FaEye aria-hidden="true" />
          {profile.views}
        </span>
      </div>
    </main>
  );
}

function Backdrop() {
  const particles = Array.from({ length: 42 }, (_, index) => index);

  return (
    <div className="backdrop" aria-hidden="true">
      <span className="backdrop__glow" />
      <span className="backdrop-particles">
        {particles.map((particle) => (
          <i key={particle} />
        ))}
      </span>
    </div>
  );
}

function CursorTrail() {
  const [points, setPoints] = useState<Array<{ id: number; x: number; y: number }>>(
    [],
  );
  const nextId = useRef(0);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      setPoints((current) => [
        ...current.slice(-9),
        { id: nextId.current++, x: event.clientX, y: event.clientY },
      ]);
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <span className="cursor-trail" aria-hidden="true">
      {points.map((point, index) => (
        <i
          key={point.id}
          style={
            {
              "--cursor-x": `${point.x}px`,
              "--cursor-y": `${point.y}px`,
              "--cursor-index": index,
            } as CSSProperties
          }
        />
      ))}
    </span>
  );
}

function SocialFlash({ platform }: { platform: SocialPlatform | null }) {
  if (!platform) {
    return null;
  }

  return (
    <div className="social-flash" aria-live="polite">
      <span>opening {platform}</span>
    </div>
  );
}

export function App() {
  const [entered, setEntered] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [socialFlash, setSocialFlash] = useState<SocialPlatform | null>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const socialFlashTimeoutRef = useRef<number | undefined>(undefined);
  const enterProfile = useCallback(() => {
    if (entered) {
      return;
    }

    setEntered(true);
  }, [entered]);
  const handleSocialOpen = useCallback(
    (platform: SocialPlatform, href: string) => {
      window.clearTimeout(socialFlashTimeoutRef.current);
      const openedWindow = window.open("about:blank", "_blank");

      setSocialFlash(null);
      window.requestAnimationFrame(() => setSocialFlash(platform));

      socialFlashTimeoutRef.current = window.setTimeout(() => {
        setSocialFlash(null);

        if (openedWindow) {
          try {
            openedWindow.location.href = href;
            openedWindow.opener = null;
            return;
          } catch {
            openedWindow.close();
          }
        }

        window.open(href, "_blank", "noreferrer");
      }, 360);
    },
    [],
  );

  useEffect(
    () => () => {
      window.clearTimeout(socialFlashTimeoutRef.current);
    },
    [],
  );

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const gazeX = (event.clientX / window.innerWidth - 0.5) * 2;
      const gazeY = (event.clientY / window.innerHeight - 0.5) * 2;

      appRef.current?.style.setProperty(
        "--parallax-x",
        String(gazeX),
      );
      appRef.current?.style.setProperty(
        "--parallax-y",
        String(gazeY),
      );
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  const handleCardPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const bounds = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;

      event.currentTarget.style.setProperty("--card-rotate-x", `${-y * 2}deg`);
      event.currentTarget.style.setProperty("--card-rotate-y", `${x * 2}deg`);
    },
    [],
  );
  const resetCardTilt = useCallback(() => {
    document
      .querySelector<HTMLElement>(".profile-card")
      ?.style.removeProperty("--card-rotate-x");
    document
      .querySelector<HTMLElement>(".profile-card")
      ?.style.removeProperty("--card-rotate-y");
  }, []);

  useEffect(() => {
    if (!entered) {
      return;
    }

    const timeout = window.setTimeout(() => setShowIntro(false), 620);
    return () => window.clearTimeout(timeout);
  }, [entered]);

  return (
    <div
      className={`app ${entered ? "app--entered" : ""} ${
        entered ? "app--profile-ready" : ""
      }`}
      ref={appRef}
      style={
        {
          "--parallax-x": 0,
          "--parallax-y": 0,
        } as CSSProperties
      }
    >
      <CursorTrail />
      <Backdrop />
      <section className="profile-stage">
        <ProfileCard
          onSocialOpen={handleSocialOpen}
          onPointerLeave={resetCardTilt}
          onPointerMove={handleCardPointerMove}
        />
      </section>
      <MusicPlayer entered={entered} track={profile.track} />
      <SocialFlash platform={socialFlash} />
      {showIntro && (
        <IntroOverlay
          leaving={entered}
          onEnter={enterProfile}
        />
      )}
    </div>
  );
}
