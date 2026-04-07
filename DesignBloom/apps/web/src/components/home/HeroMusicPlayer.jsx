import { useEffect, useRef, useState } from "react";
import { HERO_PLAYER_TRACKS } from "../../content/home-content";
import { extractEmbeddedFlacCoverUrl } from "../../utils/flacCover";

function PrevIcon() {
  return (
    <svg aria-hidden="true" height="24" viewBox="0 0 24 24" width="24">
      <rect fill="#111111" height="12" rx="1" width="2.4" x="6.4" y="6" />
      <path d="M16.8 6.2L9.4 12l7.4 5.8V6.2z" fill="#111111" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg aria-hidden="true" height="24" viewBox="0 0 24 24" width="24">
      <rect fill="#111111" height="12" rx="1" width="2.4" x="15.2" y="6" />
      <path d="M7.2 6.2L14.6 12l-7.4 5.8V6.2z" fill="#111111" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg aria-hidden="true" height="20" viewBox="0 0 20 20" width="20">
      <rect fill="#0f0f0f" height="12" rx="1.8" width="4" x="4" y="4" />
      <rect fill="#0f0f0f" height="12" rx="1.8" width="4" x="12" y="4" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg aria-hidden="true" height="20" viewBox="0 0 20 20" width="20">
      <path d="M6 4.2L15 10L6 15.8V4.2z" fill="#0f0f0f" />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg aria-hidden="true" height="24" viewBox="0 0 24 24" width="24">
      <path
        d="M4 10.2h3.3l4.2-3.6c.4-.3 1-.1 1 .5v9.8c0 .6-.6.8-1 .5l-4.2-3.6H4c-.6 0-1-.4-1-1v-1.6c0-.6.4-1 1-1z"
        fill="#ffffff"
      />
      <path
        d="M16.1 9.2c1.1.8 1.8 1.9 1.8 3.2s-.7 2.4-1.8 3.2"
        fill="none"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function formatTime(totalSeconds) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getTrackFilename(src) {
  return src.split("/").pop() ?? src;
}

function normalizeTrack(track, index) {
  const src = typeof track?.src === "string" ? track.src.trim() : "";
  const coverSrc = typeof track?.coverSrc === "string" ? track.coverSrc.trim() : "";
  const filename = src ? decodeURIComponent(getTrackFilename(src)) : `track-${index + 1}`;
  const title = typeof track?.title === "string" && track.title.trim() ? track.title.trim() : filename;
  const artist =
    typeof track?.artist === "string" && track.artist.trim()
      ? track.artist.trim()
      : "Music Library";
  const caption =
    typeof track?.caption === "string" && track.caption.trim()
      ? track.caption.trim()
      : `Source file: ${filename}`;

  return {
    title,
    artist,
    caption,
    coverSrc,
    src,
  };
}

const FALLBACK_TRACKS = HERO_PLAYER_TRACKS.map(normalizeTrack).filter((track) => track.src);

function HeroMusicPlayer() {
  const audioRef = useRef(null);
  const pendingPlayRef = useRef(false);
  const [tracks, setTracks] = useState([]);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(34 / 58);
  const [errorMessage, setErrorMessage] = useState("");
  const [libraryReady, setLibraryReady] = useState(false);
  const [coverUrl, setCoverUrl] = useState("");

  const hasTracks = tracks.length > 0;
  const currentTrack = hasTracks ? tracks[trackIndex] ?? tracks[0] : null;
  const progressPercent = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;
  const volumePercent = Math.round(volume * 100);

  useEffect(() => {
    let isDisposed = false;
    const controller = new AbortController();

    void (async () => {
      try {
        const response = await fetch("/api/music", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load music library: ${response.status}`);
        }

        const result = await response.json();

        if (!Array.isArray(result.tracks)) {
          throw new Error("Music library response is invalid");
        }

        const nextTracks = result.tracks.map(normalizeTrack).filter((track) => track.src);

        if (isDisposed) {
          return;
        }

        setTracks(nextTracks);
        setErrorMessage("");
      } catch (error) {
        if (isDisposed || controller.signal.aborted) {
          return;
        }

        setTracks(FALLBACK_TRACKS);
      } finally {
        if (!isDisposed) {
          setLibraryReady(true);
        }
      }
    })();

    return () => {
      isDisposed = true;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    setTrackIndex((current) => {
      if (tracks.length === 0) {
        return 0;
      }

      return current < tracks.length ? current : 0;
    });

    if (tracks.length > 0) {
      return;
    }

    pendingPlayRef.current = false;
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setErrorMessage("");

    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [tracks.length]);

  useEffect(() => {
    let isDisposed = false;
    let generatedCoverUrl = "";
    const controller = new AbortController();

    if (!currentTrack) {
      setCoverUrl("");
      return undefined;
    }

    if (currentTrack.coverSrc) {
      setCoverUrl(currentTrack.coverSrc);
      return undefined;
    }

    if (!/\.flac$/i.test(currentTrack.src)) {
      setCoverUrl("");
      return undefined;
    }

    void (async () => {
      try {
        const nextCoverUrl = await extractEmbeddedFlacCoverUrl(currentTrack.src, controller.signal);

        if (isDisposed) {
          if (nextCoverUrl) {
            URL.revokeObjectURL(nextCoverUrl);
          }

          return;
        }

        generatedCoverUrl = nextCoverUrl ?? "";
        setCoverUrl(nextCoverUrl ?? "");
      } catch {
        if (!isDisposed) {
          setCoverUrl("");
        }
      }
    })();

    return () => {
      isDisposed = true;
      controller.abort();

      if (generatedCoverUrl) {
        URL.revokeObjectURL(generatedCoverUrl);
      }
    };
  }, [currentTrack]);

  const attemptPlayback = (audioElement) => {
    if (!currentTrack) {
      return;
    }

    setErrorMessage("");

    const playPromise = audioElement.play();

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        pendingPlayRef.current = false;
        setIsPlaying(false);
        setErrorMessage(
          `Missing ${getTrackFilename(currentTrack.src)}. Put your audio file in /audio.`,
        );
      });
    }
  };

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (!audioElement || !currentTrack) {
      return;
    }

    setCurrentTime(0);
    setDuration(0);
    setErrorMessage("");

    if (pendingPlayRef.current) {
      pendingPlayRef.current = false;
      attemptPlayback(audioElement);
    }
  }, [trackIndex]);

  const handleTogglePlay = () => {
    const audioElement = audioRef.current;

    if (!audioElement || !currentTrack) {
      return;
    }

    if (isPlaying) {
      audioElement.pause();
      return;
    }

    attemptPlayback(audioElement);
  };

  const handlePreviousTrack = () => {
    const audioElement = audioRef.current;

    if (!currentTrack || tracks.length === 0) {
      return;
    }

    if (audioElement && currentTime > 3) {
      audioElement.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    pendingPlayRef.current = isPlaying;
    setTrackIndex((current) => (current - 1 + tracks.length) % tracks.length);
  };

  const handleNextTrack = () => {
    if (!currentTrack || tracks.length === 0) {
      return;
    }

    pendingPlayRef.current = isPlaying;
    setTrackIndex((current) => (current + 1) % tracks.length);
  };

  const handleSeek = (event) => {
    const audioElement = audioRef.current;

    if (!audioElement) {
      return;
    }

    const nextTime = Number(event.target.value);
    audioElement.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleVolumeChange = (event) => {
    setVolume(Number(event.target.value));
  };

  const albumStyle = coverUrl
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.04) 0%, rgba(0, 0, 0, 0.28) 100%), url("${coverUrl}")`,
      }
    : undefined;

  return (
    <div
      className={`player-card${isPlaying ? " is-playing" : ""}`.trim()}
      title={currentTrack ? `Current source: ${decodeURIComponent(getTrackFilename(currentTrack.src))}` : "No audio synced"}
    >
      {currentTrack ? (
        <audio
          key={currentTrack.src}
          onDurationChange={(event) => {
            const nextDuration = event.currentTarget.duration;
            setDuration(Number.isFinite(nextDuration) ? nextDuration : 0);
          }}
          onEnded={() => {
            pendingPlayRef.current = true;
            setTrackIndex((current) => (current + 1) % tracks.length);
          }}
          onError={() => {
            setIsPlaying(false);
            setErrorMessage(
              `Missing ${decodeURIComponent(getTrackFilename(currentTrack.src))}. Put your audio file in /audio.`,
            );
          }}
          onLoadedMetadata={(event) => {
            const nextDuration = event.currentTarget.duration;
            setDuration(Number.isFinite(nextDuration) ? nextDuration : 0);
            setErrorMessage("");
          }}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
          preload="metadata"
          ref={audioRef}
          src={currentTrack.src}
        />
      ) : null}

      <div aria-live="polite" className="sr-only">
        {errorMessage ||
          (currentTrack
            ? `Current audio source ${decodeURIComponent(getTrackFilename(currentTrack.src))}`
            : libraryReady
              ? "No audio files were synced from the music library."
              : "Syncing music library.")}
      </div>

      <div className="player-top">
        <div className="player-album" aria-hidden="true" style={albumStyle} />

        <div className="player-meta">
          <p className="player-track">{currentTrack?.title ?? (libraryReady ? "No music found" : "Syncing music library")}</p>
          <p className="player-artist">
            {currentTrack?.artist ?? "apps/web/public/audio"}
          </p>
          <p className="player-caption">
            {currentTrack?.caption ??
              "The backend will read audio filenames from the folder and expose them through /api/music."}
          </p>
        </div>
      </div>

      <div className="player-progress">
        <div className="progress-rail">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          <span
            className="progress-handle"
            style={{ left: duration > 0 ? `clamp(5px, ${progressPercent}%, calc(100% - 5px))` : "5px" }}
          />
          <input
            aria-label="Seek through current track"
            className="rail-input"
            disabled={!currentTrack || duration <= 0}
            max={duration || 0}
            min="0"
            onChange={handleSeek}
            step="0.1"
            type="range"
            value={Math.min(currentTime, duration || 0)}
          />
        </div>

        <div className="player-time">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-controls">
        <div className="player-controls-main">
          <button
            aria-label="Previous track"
            className="control-button prev"
            disabled={!currentTrack}
            onClick={handlePreviousTrack}
            type="button"
          >
            <PrevIcon />
          </button>

          <button
            aria-label={isPlaying ? "Pause current track" : "Play current track"}
            className={`control-button play ${isPlaying ? "is-active" : "is-paused"}`.trim()}
            disabled={!currentTrack}
            onClick={handleTogglePlay}
            type="button"
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          <button
            aria-label="Next track"
            className="control-button next"
            disabled={!currentTrack}
            onClick={handleNextTrack}
            type="button"
          >
            <NextIcon />
          </button>
        </div>

        <span className="intent-pill">HIGH INTENT</span>

        <div className="player-volume">
          <span className="speaker-icon" aria-hidden="true">
            <VolumeIcon />
          </span>

          <div className="volume-rail">
            <span className="volume-fill" style={{ width: `${volumePercent}%` }} />
            <input
              aria-label="Adjust playback volume"
              className="rail-input"
              max="1"
              min="0"
              onChange={handleVolumeChange}
              step="0.01"
              type="range"
              value={volume}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroMusicPlayer;
