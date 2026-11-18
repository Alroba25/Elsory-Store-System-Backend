const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const parseDateOnly = (value) => {
  if (typeof value !== "string" || !DATE_PATTERN.test(value)) return null;

  const [year, month, day] = value.split("-").map(Number);
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > 31) return null;

  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(0, 0, 0, 0);

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
};

const utcMillis = ({ year, month, day, hour = 0, minute = 0, second = 0 }) => {
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(hour, minute, second, 0);
  return date.getTime();
};

const localMidnightToUtc = (dateParts, timeZone) => {
  const targetUtc = utcMillis(dateParts);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  let guess = targetUtc;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const parts = Object.fromEntries(
      formatter.formatToParts(new Date(guess)).map((part) => [part.type, part.value]),
    );
    const displayedAsUtc = utcMillis({
      year: Number(parts.year),
      month: Number(parts.month),
      day: Number(parts.day),
      hour: Number(parts.hour),
      minute: Number(parts.minute),
      second: Number(parts.second),
    });
    const correction = targetUtc - displayedAsUtc;
    guess += correction;
    if (correction === 0) break;
  }

  return new Date(guess);
};

const getReportDateRange = (from, to) => {
  const fromParts = parseDateOnly(from);
  const toParts = parseDateOnly(to);

  if (!fromParts || !toParts || from > to) return null;

  const timeZone = process.env.STORE_TIME_ZONE || "Africa/Cairo";
  const start = localMidnightToUtc(fromParts, timeZone);
  const nextDay = new Date(utcMillis(toParts));
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);
  const endExclusive = localMidnightToUtc(
    {
      year: nextDay.getUTCFullYear(),
      month: nextDay.getUTCMonth() + 1,
      day: nextDay.getUTCDate(),
    },
    timeZone,
  );

  return { start, endExclusive, timeZone };
};

module.exports = { getReportDateRange };
