import { Appointment } from "./types";
import { format, addMinutes, parseISO } from "date-fns";

function escapeText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export function generateICS(appointments: Appointment[]): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PsiGuard//EN",
    "CALSCALE:GREGORIAN",
  ];

  appointments.forEach((a) => {
    const start = parseISO(a.dateTime);
    const end = addMinutes(start, a.durationMinutes);
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${a.id}`);
    lines.push(`DTSTAMP:${format(new Date(), "yyyyMMdd'T'HHmmss")}`);
    lines.push(`DTSTART:${format(start, "yyyyMMdd'T'HHmmss")}`);
    lines.push(`DTEND:${format(end, "yyyyMMdd'T'HHmmss")}`);
    lines.push(`SUMMARY:${escapeText(`Sessão com ${a.patientName}`)}`);
    if (a.notes) lines.push(`DESCRIPTION:${escapeText(a.notes)}`);
    lines.push("END:VEVENT");
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
