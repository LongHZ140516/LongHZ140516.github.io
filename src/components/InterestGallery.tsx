import { useState, type CSSProperties } from "react";
import { ArrowUpRight, ImageBroken } from "@phosphor-icons/react";
import type { Interest, InterestItem } from "../content/types";

interface InterestGalleryProps {
  interest: Interest;
}

function GalleryItem({
  item,
  duplicate = false,
}: {
  item: InterestItem;
  duplicate?: boolean;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <a
      className="gallery-card"
      href={item.href}
      target="_blank"
      rel="noreferrer"
      tabIndex={duplicate ? -1 : undefined}
      aria-hidden={duplicate || undefined}
      aria-label={`${item.name}, ${item.meta}`}
    >
      {imageFailed ? (
        <span className="gallery-card__fallback">
          <ImageBroken size={28} weight="regular" aria-hidden="true" />
          {item.name}
        </span>
      ) : (
        <img
          src={item.image}
          alt={duplicate ? "" : item.imageAlt}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
        />
      )}
      <span className="gallery-card__caption">
        <strong>{item.name}</strong>
        <span>{item.meta}</span>
      </span>
    </a>
  );
}

export function InterestGallery({ interest }: InterestGalleryProps) {
  const marqueeStyle = {
    "--marquee-duration": `${interest.duration}s`,
  } as CSSProperties;

  return (
    <article className="interest-row">
      <div className="interest-label">
        <p>{interest.subtitle}</p>
        <h3>{interest.name}</h3>
        <p>{interest.description}</p>
        <a href={interest.href} target="_blank" rel="noreferrer">
          {interest.sourceLabel}
          <ArrowUpRight size={15} weight="regular" aria-hidden="true" />
        </a>
      </div>

      <div
        className="interest-marquee"
        style={marqueeStyle}
        aria-label={`${interest.name} gallery`}
      >
        <div className="interest-track">
          <div className="interest-set">
            {interest.items.map((item) => (
              <GalleryItem key={item.name} item={item} />
            ))}
          </div>
          <div className="interest-set" aria-hidden="true">
            {interest.items.map((item) => (
              <GalleryItem
                key={`${item.name}-duplicate`}
                item={item}
                duplicate
              />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
