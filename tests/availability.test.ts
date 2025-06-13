import {
  parseBlockedTimes,
  parseWeeklyBlockedTimes,
  isDateTimeBlocked,
} from "../src/lib/availability";
import { addMinutes } from "date-fns";

const baseIso = "2024-01-01T10:00:00Z";

describe("parseBlockedTimes", () => {
  it("returns empty array for empty input", () => {
    expect(parseBlockedTimes("")).toEqual([]);
  });

  it("parses multiple iso strings", () => {
    const blocks = parseBlockedTimes(`${baseIso},2024-01-02T11:00:00Z`);
    expect(blocks.length).toBe(2);
    expect(blocks[0]).toMatchObject({ id: "blk-0", dateTime: baseIso });
    expect(blocks[1].id).toBe("blk-1");
  });
});

describe("parseWeeklyBlockedTimes", () => {
  it("returns empty array for empty input", () => {
    expect(parseWeeklyBlockedTimes("")).toEqual([]);
  });

  it("parses weekday ranges", () => {
    const weekly = parseWeeklyBlockedTimes("1 09:00-10:00,3 14:00-15:00");
    expect(weekly.length).toBe(2);
    expect(weekly[0]).toMatchObject({
      id: "wblk-0",
      weekday: 1,
      start: "09:00",
      end: "10:00",
    });
    expect(weekly[1].weekday).toBe(3);
  });
});

describe("isDateTimeBlocked", () => {
  const blocks = parseBlockedTimes(baseIso);
  const weekly = parseWeeklyBlockedTimes("2 10:00-11:00");

  it("detects explicit block", () => {
    const date = new Date(baseIso);
    expect(isDateTimeBlocked(date, blocks, [])).toBe(true);
  });

  it("detects weekly block", () => {
    const tuesday = new Date("2024-01-02T10:30:00Z");
    expect(isDateTimeBlocked(tuesday, [], weekly)).toBe(true);
  });

  it("returns false when not blocked", () => {
    const date = addMinutes(new Date(baseIso), 120);
    expect(isDateTimeBlocked(date, blocks, weekly)).toBe(false);
  });
});
