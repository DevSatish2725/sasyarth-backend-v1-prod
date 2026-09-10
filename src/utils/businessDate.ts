const GREENBRIDGE_TIMEZONE = "Asia/Kolkata";

const getBusinessDate = (offsetDays = 0): Date => {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: GREENBRIDGE_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(now);

  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const day = Number(parts.find((p) => p.type === "day")?.value);

  const date = new Date(Date.UTC(year, month - 1, day + offsetDays));

  return date;
};

export const getTodayBusinessDate = (): Date => {
  return getBusinessDate(0);
};

export const getYesterdayBusinessDate = (): Date => {
  return getBusinessDate(-1);
};

export const getTomorrowBusinessDate = (): Date => {
  return getBusinessDate(1);
};
