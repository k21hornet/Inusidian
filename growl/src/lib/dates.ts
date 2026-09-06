const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toJstParts(epochMs: number) {
  const jst = new Date(epochMs + JST_OFFSET_MS);
  return {
    year: jst.getUTCFullYear(),
    month: jst.getUTCMonth() + 1,
    day: jst.getUTCDate(),
    hour: jst.getUTCHours(),
    minute: jst.getUTCMinutes(),
    second: jst.getUTCSeconds(),
  };
}

function toJstDateString(epochMs: number): string {
  const { year, month, day } = toJstParts(epochMs);
  return `${year}-${pad(month)}-${pad(day)}`;
}

function toJstDateTimeString(epochMs: number): string {
  const { year, month, day, hour, minute, second } = toJstParts(epochMs);
  return `${year}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}:${pad(second)}`;
}

export function today(): string {
  return toJstDateString(Date.now());
}

export function nowDateTime(): string {
  return toJstDateTimeString(Date.now());
}

export function addDays(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const jstMidnightAsUtcMs = Date.UTC(year!, month! - 1, day!) - JST_OFFSET_MS;
  return toJstDateString(jstMidnightAsUtcMs + days * 24 * 60 * 60 * 1000);
}

export function startOfJstDay(dateStr: string): string {
  return `${dateStr} 00:00:00`;
}

export function toIsoLocal(mysqlDateTime: string): string {
  return mysqlDateTime.replace(" ", "T");
}

export function fromIsoLocal(isoLocal: string): string {
  return isoLocal.replace("T", " ");
}
