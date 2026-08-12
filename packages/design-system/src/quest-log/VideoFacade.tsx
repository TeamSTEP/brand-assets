import { useState } from "react";
import { IconButton } from "../primitives/IconButton.js";
import "./VideoFacade.css";

/**
 * Props for {@link VideoFacade}.
 *
 * @public
 */
export interface VideoFacadeProps {
  /** Poster image URL shown before play. */
  posterSrc: string;
  /** Accessible alt text for the poster / video. */
  posterAlt: string;
  /** Looping gameplay clip shown before the trailer is requested. */
  loopSrc?: string;
  /** YouTube watch URL — iframe loads only after the visitor clicks play. */
  trailerUrl?: string;
}

function toYouTubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Poster + optional muted WebM loop with a click-to-load YouTube trailer. Keeps the initial
 * page weight low — the iframe mounts only after interaction.
 *
 * @public
 */
export function VideoFacade({ posterSrc, posterAlt, loopSrc, trailerUrl }: VideoFacadeProps) {
  const [showTrailer, setShowTrailer] = useState(false);
  const embedUrl = trailerUrl ? toYouTubeEmbedUrl(trailerUrl) : null;

  return (
    <div className="ds-video-facade">
      {loopSrc && !showTrailer ? (
        <video
          className="ds-video-facade__media"
          src={loopSrc}
          poster={posterSrc}
          autoPlay
          loop
          muted
          playsInline
          aria-label={posterAlt}
        />
      ) : (
        <img className="ds-video-facade__media" src={posterSrc} alt={posterAlt} />
      )}

      {embedUrl && !showTrailer ? (
        <IconButton size="lg" icon="play" aria-label="Play trailer" onClick={() => setShowTrailer(true)} />
      ) : null}

      {embedUrl && showTrailer ? (
        <iframe
          className="ds-video-facade__iframe"
          src={`${embedUrl}?autoplay=1`}
          title={`${posterAlt} trailer`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : null}
    </div>
  );
}
