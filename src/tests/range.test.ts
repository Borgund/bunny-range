import Range from "../models/range";

import { expect, test, describe } from "bun:test";

describe("Range Class Tests", () => {
  test("should be able to create a range with default values", () => {
    const range = new Range();
    expect(range.start).toEqual(0);
    expect(range.end).toEqual(0);
    expect(range.length).toEqual(1);
  });
  test("should be able to create a range with specified values", () => {
    const range = new Range(5, 10);
    expect(range.start).toEqual(5);
    expect(range.end).toEqual(10);
    expect(range.length).toEqual(6);
  });
  test("should throw an error for a negative start value", () => {
    expect(() => new Range(-5)).toThrow(
      "Start value of a range needs to be a positive integer."
    );
  });

  test("should detect overlapping ranges", () => {
    const range1 = new Range(5, 10);
    const range2 = new Range(8, 15);
    const range3 = new Range(15, 20);

    expect(range1.overlapsWith(range2)).toBeTruthy();
    expect(range1.overlapsWith(range3)).toBeFalsy();
  });

  test("should handle ranges with the same start and end as overlapping", () => {
    const range1 = new Range(5, 10);
    const range2 = new Range(5, 10);

    expect(range1.overlapsWith(range2)).toBeTruthy();
  });

  test("should detect if one range includes another", () => {
    const range1 = new Range(5, 15);
    const range2 = new Range(8, 10);
    const range3 = new Range(1, 20);

    expect(range1.includes(range2)).toBeTruthy();
    expect(range1.includes(range3)).toBeFalsy();
  });

  test("should handle ranges with the same start and end as included", () => {
    const range1 = new Range(5, 15);
    const range2 = new Range(5, 15);

    expect(range1.includes(range2)).toBeTruthy();
  });

  test("should correctly compare ranges with different start values", () => {
    const range1 = new Range(5, 10);
    const range2 = new Range(3, 8);

    const result = range1.compare(range2);
    expect(result).toBeGreaterThan(0);
  });

  test("should correctly compare ranges with different end values", () => {
    const range1 = new Range(5, 10);
    const range2 = new Range(5, 15);

    const result = range1.compare(range2);
    expect(result).toBeLessThan(0);
  });

  test("should correctly compare equal ranges", () => {
    const range1 = new Range(5, 10);
    const range2 = new Range(5, 10);

    const result = range1.compare(range2);
    expect(result).toBe(0);
  });

  test("should correctly compare ranges with the same start but different end values", () => {
    const range1 = new Range(5, 10);
    const range2 = new Range(5, 15);

    const result = range1.compare(range2);
    expect(result).toBeLessThan(0);
  });

  test("should correctly compare ranges with the same end but different start values", () => {
    const range1 = new Range(5, 10);
    const range2 = new Range(3, 10);

    const result = range1.compare(range2);
    expect(result).toBeGreaterThan(0);
  });

  test("should detect equal ranges", () => {
    const range1 = new Range(5, 10);
    const range2 = new Range(5, 10);
    const range3 = new Range(5, 15);
    const range4 = new Range(8, 10);

    expect(range1.equals(range2)).toBeTruthy();
    expect(range1.equals(range3)).toBeFalsy();
    expect(range2.equals(range3)).toBeFalsy();
    expect(range2.equals(range4)).toBeFalsy();
  });

  test("should combine overlapping ranges", () => {
    const range1 = new Range(5, 10);
    const range2 = new Range(8, 15);
    const range3 = new Range(15, 20);

    const combinedRange = range1.combine(range2);
    expect(combinedRange).toEqual(new Range(5, 15));

    const nonOverlappingRange = range1.combine(range3);
    expect(nonOverlappingRange).toEqual(new Range(5, 20));
  });

  test("should handle ranges with the same start and end as combined", () => {
    const range1 = new Range(5, 10);
    const range2 = new Range(5, 10);

    const combinedRange = range1.combine(range2);
    expect(combinedRange).toEqual(range1);
  });

  test("should handle non-overlapping ranges as combined", () => {
    const range1 = new Range(5, 10);
    const range2 = new Range(15, 20);

    const combinedRange = range1.combine(range2);
    expect(combinedRange).not.toEqual(range1);
    expect(combinedRange).not.toEqual(range2);
  });

  test("should handle exclusion when no overlap", () => {
    const range1 = new Range(2, 10);
    const range2 = new Range(11, 20);

    const result = range1.exclude(range2);
    expect(result).toEqual([range1]);
  });

  test("should be null when exclusion of one range that includes the other", () => {
    const range1 = new Range(5, 15);
    const range2 = new Range(4, 16);

    const result = range1.exclude(range2);
    expect(result).toBeNull();
  });

  test("should be null when excluding two equal ranges", () => {
    const range1 = new Range(5, 15);
    const range2 = new Range(5, 15);

    const result = range1.exclude(range2);
    expect(result).toBeNull();
  });

  test("should handle exclusion when exclusive range exceeds the other", () => {
    const range1 = new Range(5, 20);
    const range2 = new Range(6, 22);

    const result = range1.exclude(range2);
    expect(result?.toString()).toBe("5-5");
    expect(result?.length).toBe(1);
  });

  test("should handle exclusion when exclusive range proceeds the other", () => {
    const range1 = new Range(5, 10);
    const range2 = new Range(4, 8);

    const result = range1.exclude(range2);
    expect(result?.toString()).toBe("9-10");
    expect(result?.length).toBe(1);
  });
  test("should handle exclusion when exclusive range is entirely included in original range", () => {
    const range1 = new Range(1, 20);
    const range2 = new Range(5, 10);

    const result = range1.exclude(range2);
    expect(result).toBeArray();
    expect(result?.length).toBe(2);
    expect(result?.[0].start).toBe(1);
    expect(result?.[0].end).toBe(4);
    expect(result?.[1].start).toBe(11);
    expect(result?.[1].end).toBe(20);
  });

  test("should handle exclusion when exclusive range ends on the same number", () => {
    const range1 = new Range(1, 20);
    const range2 = new Range(5, 20);

    const result = range1.exclude(range2);
    expect(result).toBeArray();
    expect(result?.length).toBe(1);
    expect(result?.[0].start).toBe(1);
    expect(result?.[0].end).toBe(4);
  });

  test("should handle exclusion when exclusive range starts on the same number", () => {
    const range1 = new Range(1, 10);
    const range2 = new Range(1, 5);

    const result = range1.exclude(range2);
    expect(result).toBeArray();
    expect(result?.length).toBe(1);
    expect(result?.[0].start).toBe(6);
    expect(result?.[0].end).toBe(10);
  });
});
