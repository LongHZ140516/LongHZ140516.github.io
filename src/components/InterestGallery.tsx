import { useState, type CSSProperties } from "react";
import { ImageBroken } from "@phosphor-icons/react";
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
    <figure
      className="gallery-card"
      aria-hidden={duplicate || undefined}
      aria-label={duplicate ? undefined : `${item.name}, ${item.meta}`}
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
      <figcaption className="gallery-card__caption">
        <strong>{item.name}</strong>
        <span>{item.meta}</span>
      </figcaption>
    </figure>
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
