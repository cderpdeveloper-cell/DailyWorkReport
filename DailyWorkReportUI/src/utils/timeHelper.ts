export const parseTime = (timeStr: string) => {
  if (!timeStr) return null;
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
  if (!match) return null;

  let [_, hours, minutes, period] = match;
  let h = parseInt(hours, 10);
  const m = parseInt(minutes, 10);

  if (period.toLowerCase() === "pm" && h < 12) h += 12;
  if (period.toLowerCase() === "am" && h === 12) h = 0;

  const date = new Date();
  date.setHours(h, m, 0, 0);
  return date;
};

export const calculateDuration = (inTime: string, outTime: string, is30MinBreak: boolean = false) => {
  const start = parseTime(inTime);
  const end = parseTime(outTime);

  if (!start || !end) return null;

  let diff = (end.getTime() - start.getTime()) / (1000 * 60); // minutes
  if (is30MinBreak) diff -= 30;
  if (diff < 0) diff = 0;

  return {
    totalMinutes: Math.floor(diff),
    decimalHours: parseFloat((diff / 60).toFixed(2)),
    hours: Math.floor(diff / 60),
    minutes: Math.floor(diff % 60),
  };
};
