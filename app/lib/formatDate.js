const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

export function formatRelativeTime(date) {
  const target = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(target.getTime())) {
    throw new TypeError("formatRelativeTime: invalid date");
  }

  const diffSeconds = Math.round((Date.now() - target.getTime()) / 1000);
  const abs = Math.abs(diffSeconds);
  const suffix = diffSeconds >= 0 ? "ago" : "from now";

  const [value, unit] =
    abs < MINUTE ? [abs, "second"] :
    abs < HOUR   ? [Math.floor(abs / MINUTE), "minute"] :
    abs < DAY    ? [Math.floor(abs / HOUR), "hour"] :
    abs < WEEK   ? [Math.floor(abs / DAY), "day"] :
    abs < MONTH  ? [Math.floor(abs / WEEK), "week"] :
    abs < YEAR   ? [Math.floor(abs / MONTH), "month"] :
                   [Math.floor(abs / YEAR), "year"];

  const plural = value === 1 ? "" : "s";
  return `${value} ${unit}${plural} ${suffix}`;
}

export function formatShortDate(date) {
  const target = date instanceof Date ? date : new Date(date);
  return target.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
