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
  FaVolumeXmark,
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

function IntroWaveform() {
  return (
    <span className="intro-waveform" aria-hidden="true">
      {Array.from({ length: 22 }, (_, index) => (
        <i key={index} style={{ "--bar-index": index } as CSSProperties} />
      ))}
    </span>
  );
}

function IntroOverlay({
  booting,
  leaving,
  onEnter,
}: {
  booting: boolean;
  leaving: boolean;
  onEnter: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !booting) {
        onEnter();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [booting, onEnter]);

  return (
    <button
      aria-live={booting ? "polite" : undefined}
      className={`intro ${booting ? "intro--booting" : ""} ${
        leaving ? "intro--leaving" : ""
      }`}
      onClick={onEnter}
      disabled={booting}
      type="button"
    >
      <span className="intro__dot-grid intro__dot-grid--top" />
      <span className="intro__dot-grid intro__dot-grid--bottom" />
      <span className="intro__system-title" aria-hidden="true">
        PLOYSI.SYS
      </span>
      <IntroWaveform />
      {booting ? (
        <span className="intro__boot">
          <span>loading ploysi.exe</span>
          <span>rendering shadow profile</span>
          <span>syncing particles</span>
        </span>
      ) : (
        <span className="intro__copy">
          <span className="intro__bracket intro__bracket--left">[</span>
          <span className="intro__label">click to enter</span>
          <span className="intro__bracket intro__bracket--right">]</span>
          <span className="intro__hint">or press enter</span>
        </span>
      )}
    </button>
  );
}

function SignalRail() {
  return (
    <aside className="signal-rail" aria-label="Signal identity panel">
      <span className="signal-rail__label">identity / signal</span>
      <div className="signal-rail__screen">
        <span className="signal-rail__readout">PLOYSI.SYS</span>
        <span className="signal-rail__pulse" aria-hidden="true" />
        <dl>
          <div>
            <dt>access</dt>
            <dd>public</dd>
          </div>
          <div>
            <dt>node</dt>
            <dd>online</dd>
          </div>
          <div>
            <dt>signal</dt>
            <dd>1337</dd>
          </div>
        </dl>
      </div>
    </aside>
  );
}

function ActivityLog() {
  return (
    <aside className="activity-log" aria-label="Activity log panel">
      <span className="activity-log__label">activity / live</span>
      <div className="activity-log__screen">
        <span className="activity-log__title">LIVE.LOG</span>
        <ol>
          <li>
            <span>00:13</span>
            <strong>profile rendered</strong>
          </li>
          <li>
            <span>00:18</span>
            <strong>links armed</strong>
          </li>
          <li>
            <span>00:21</span>
            <strong>signal clean</strong>
          </li>
          <li>
            <span>now</span>
            <strong>watching</strong>
          </li>
        </ol>
      </div>
    </aside>
  );
}

function StatusPanel() {
  return (
    <dl className="status-panel" aria-label="Profile status">
      {profile.status.map(({ label, value }) => (
        <div className="status-panel__item" key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function IdentityLinks({ onOpen }: { onOpen: SocialOpenHandler }) {
  return (
    <nav className="identity-links" aria-label="Links and identity">
      <span className="identity-links__title">links / identity</span>
      <div className="identity-links__grid">
        {profile.socials.map(({ platform, href }, index) => {
          const Icon = icons[platform];

          if (!href) {
            return (
              <span
                aria-disabled="true"
                className="identity-link identity-link--disabled"
                key={platform}
              >
                <span className="identity-link__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="identity-link__copy">
                  <strong>{platform}</strong>
                  <small>not linked</small>
                </span>
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
            >
              <span className="identity-link__index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="identity-link__copy">
                <strong>{platform}</strong>
                <small>open channel</small>
              </span>
              <Icon aria-hidden="true" />
            </a>
          );
        })}
      </div>
    </nav>
  );
}

function Player({
  entered,
  muted,
  track,
}: {
  entered: boolean;
  muted: boolean;
  track: TrackConfig;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !entered || !track.autoplayOnEnter) {
      return;
    }

    void audio.play().catch(() => setIsPlaying(false));
  }, [entered, track.autoplayOnEnter]);

  if (!track.src) {
    return null;
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

  return (
    <div className="player">
      <audio
        muted={muted}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        preload="metadata"
        ref={audioRef}
        src={track.src}
      />
      <button
        aria-label={isPlaying ? "Pause track" : "Play track"}
        className="player__toggle"
        onClick={togglePlayback}
        type="button"
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
      <span className="player__bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="player__details">
        <strong>{track.title}</strong>
        {track.artist && <small>{track.artist}</small>}
      </span>
      <FaVolumeHigh className="player__volume" aria-hidden="true" />
    </div>
  );
}

function ProfileCard({
  entered,
  muted,
  onSocialOpen,
  onPointerMove,
  onPointerLeave,
}: {
  entered: boolean;
  muted: boolean;
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
      <span className="card-corner card-corner--top" aria-hidden="true" />
      <span className="card-corner card-corner--bottom" aria-hidden="true" />
      <span className="profile-card__mark" aria-hidden="true">
        P
      </span>

      <p className="profile-card__handle">@{profile.name}</p>
      <h1 data-text={profile.name}>{profile.name}</h1>
      <p className="profile-card__bio">{profile.bio}</p>
      <StatusPanel />
      <IdentityLinks onOpen={onSocialOpen} />
      <Player entered={entered} muted={muted} track={profile.track} />
      <div className="profile-card__footer">
        <span className="footer-mark">PLOYSI.SYS / ACTIVE</span>
        <span className="views">
          <FaEye aria-hidden="true" />
          {profile.views}
        </span>
      </div>
    </main>
  );
}

function CrtTransition({ platform }: { platform: SocialPlatform | null }) {
  if (!platform) {
    return null;
  }

  return (
    <div className="crt-transition" aria-live="polite" aria-label="Opening link">
      <span>opening {platform}...</span>
    </div>
  );
}

function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <span className="rail rail--left" />
      <span className="rail rail--right" />
      <span className="halftone halftone--one" />
      <span className="halftone halftone--two" />
      <span className="halftone halftone--three" />
      <span className="pixel-spray pixel-spray--one" />
      <span className="pixel-spray pixel-spray--two" />
      <span className="backdrop__word">PLOYSI</span>
      <span className="backdrop__system backdrop__system--sys">SYS</span>
      <span className="backdrop__system backdrop__system--online">ONLINE</span>
      <span className="backdrop__system backdrop__system--node">NODE 07</span>
      <span className="backdrop__index">01 / WEB PROFILE</span>
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
      const point = { id: nextId.current++, x: event.clientX, y: event.clientY };
      setPoints((current) => [...current.slice(-8), point]);
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

export function App() {
  const [entered, setEntered] = useState(false);
  const [booting, setBooting] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [muted, setMuted] = useState(false);
  const [crtPlatform, setCrtPlatform] = useState<SocialPlatform | null>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const crtTimeoutRef = useRef<number | undefined>(undefined);
  const hasAudio = Boolean(profile.track.src);
  const playEnterSound = useCallback(() => {
    const AudioContextClass =
      window.AudioContext ||
      (
        window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }
      ).webkitAudioContext;

    if (!AudioContextClass) {
      return;
    }

    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(170, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      88,
      context.currentTime + 0.08,
    );
    gain.gain.setValueAtTime(0.028, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.1);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.1);
    oscillator.addEventListener("ended", () => void context.close());
  }, []);
  const enterProfile = useCallback(() => {
    if (entered) {
      return;
    }

    setEntered(true);
    setBooting(true);
    playEnterSound();
  }, [entered, playEnterSound]);
  const handleSocialOpen = useCallback(
    (platform: SocialPlatform, href: string) => {
      window.clearTimeout(crtTimeoutRef.current);
      playEnterSound();
      setCrtPlatform(null);

      const openedWindow = window.open("about:blank", "_blank");

      window.requestAnimationFrame(() => {
        setCrtPlatform(platform);
      });

      crtTimeoutRef.current = window.setTimeout(() => {
        setCrtPlatform(null);

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
      }, 460);
    },
    [playEnterSound],
  );

  useEffect(() => {
    const handleInteractiveClick = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Element) || !target.closest("a, button")) {
        return;
      }

      if (target.closest(".intro")) {
        return;
      }

      if (target.closest(".identity-link")) {
        return;
      }

      playEnterSound();
    };

    document.addEventListener("click", handleInteractiveClick);
    return () => document.removeEventListener("click", handleInteractiveClick);
  }, [playEnterSound]);

  useEffect(
    () => () => {
      window.clearTimeout(crtTimeoutRef.current);
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
      appRef.current?.style.setProperty("--gaze-x", String(gazeX));
      appRef.current?.style.setProperty("--gaze-y", String(gazeY));
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

    const timeout = window.setTimeout(() => setBooting(false), 1280);
    return () => window.clearTimeout(timeout);
  }, [entered]);

  useEffect(() => {
    if (!entered || booting) {
      return;
    }

    const timeout = window.setTimeout(() => setShowIntro(false), 620);
    return () => window.clearTimeout(timeout);
  }, [booting, entered]);

  return (
    <div
      className={`app ${entered ? "app--entered" : ""} ${
        entered && !booting ? "app--profile-ready" : ""
      } ${booting ? "app--booting" : ""}`}
      ref={appRef}
      style={
        {
          "--gaze-x": 0,
          "--gaze-y": 0,
          "--parallax-x": 0,
          "--parallax-y": 0,
        } as CSSProperties
      }
    >
      <CursorTrail />
      <Backdrop />
      <section className="profile-stage">
        <SignalRail />
        <ProfileCard
          entered={entered}
          muted={muted}
          onSocialOpen={handleSocialOpen}
          onPointerLeave={resetCardTilt}
          onPointerMove={handleCardPointerMove}
        />
        <ActivityLog />
      </section>
      <CrtTransition platform={crtPlatform} />
      <button
        aria-label={
          hasAudio ? (muted ? "Unmute audio" : "Mute audio") : "Audio unavailable"
        }
        className="mute-toggle"
        disabled={!hasAudio}
        onClick={() => setMuted((current) => !current)}
        type="button"
      >
        {muted || !hasAudio ? <FaVolumeXmark /> : <FaVolumeHigh />}
      </button>
      {showIntro && (
        <IntroOverlay
          booting={booting}
          leaving={entered && !booting}
          onEnter={enterProfile}
        />
      )}
    </div>
  );
}
