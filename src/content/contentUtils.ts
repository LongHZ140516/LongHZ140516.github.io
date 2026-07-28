export function slugFromPath(path: string): string {
  const filename = path.split("/").pop() ?? path;
  return filename.replace(/\.md$/i, "");
}

export function initialsForName(name: string): string {
  const words = name.trim().split(/\s+/);

  if (words.length > 1) {
    return words
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
}

export function assetUrl(path: string): string {
  if (/^(https?:|mailto:)/.test(path)) {
    return path;
  }

  return `${import.meta.env.BASE_URL}${path.replace(/^\.?\//, "")}`;
}

export function formatStarCount(value: number): string {
  if (value < 1_000) {
    return String(value);
  }

  if (value < 1_000_000) {
    const digits = value >= 10_000 ? 0 : 1;
    return `${(value / 1_000).toFixed(digits).replace(/\.0$/, "")}k`;
  }

  return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}m`;
}
