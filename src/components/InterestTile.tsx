import { useState } from "react";
import { ArrowUpRight, ImageBroken } from "@phosphor-icons/react";
import type { Interest } from "../content/types";

interface InterestTileProps {
  interest: Interest;
}

export function InterestTile({ interest }: InterestTileProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="interest-tile">
      <a
        className={`interest-image${
          imageFailed ? " interest-image--failed" : ""
        }`}
        href={interest.href}
        target="_blank"
        rel="noreferrer"
        aria-label={`${interest.sourceLabel}: ${interest.name}`}
      >
        {imageFailed ? (
          <span className="image-fallback">
            <ImageBroken size={30} weight="regular" aria-hidden="true" />
            Image link unavailable
          </span>
        ) : (
          <img
            src={interest.image}
            alt={interest.imageAlt}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
          />
        )}
      </a>
      <div className="interest-copy">
        <p>{interest.subtitle}</p>
        <h3>{interest.name}</h3>
        <p>{interest.description}</p>
        <a href={interest.href} target="_blank" rel="noreferrer">
          {interest.sourceLabel}
          <ArrowUpRight size={15} weight="regular" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
