import { expect, test, describe } from "bun:test";
import {
  filterInterval,
  mapStringArrayToRangeArray,
} from "../services/intervals";

describe("Example tests", () => {
  test("Example 1", () => {
    const includes = mapStringArrayToRangeArray(["10-100"]);
    const excludes = mapStringArrayToRangeArray(["20-30"]);

    const result = filterInterval(includes, excludes);

    expect(result).toBeArray();
    expect(result).toBeArrayOfSize(2);
    expect(result[0].start).toBe(10);
    expect(result[0].end).toBe(19);
    expect(result[0].length).toBe(10);

    expect(result[1].start).toBe(31);
    expect(result[1].end).toBe(100);
    expect(result[1].length).toBe(70);
  });

  test("Example 2", () => {
    const includes = mapStringArrayToRangeArray(["50-5000", "10-100"]);
    const excludes = mapStringArrayToRangeArray([]);

    const result = filterInterval(includes, excludes);

    expect(result).toBeArray();
    expect(result).toBeArrayOfSize(1);
    expect(result[0].start).toBe(10);
    expect(result[0].end).toBe(5000);
    expect(result[0].length).toBe(4991);
  });

  test("Example 3", () => {
    const includes = mapStringArrayToRangeArray(["200-300", "50-150"]);
    const excludes = mapStringArrayToRangeArray(["95-205"]);

    const result = filterInterval(includes, excludes);

    expect(result).toBeArray();
    expect(result).toBeArrayOfSize(2);
    expect(result[0].start).toBe(50);
    expect(result[0].end).toBe(94);
    expect(result[0].length).toBe(45);

    expect(result[1].start).toBe(206);
    expect(result[1].end).toBe(300);
    expect(result[1].length).toBe(95);
  });

  test("Example 3", () => {
    const includes = mapStringArrayToRangeArray([
      "200-300",
      "10-100",
      "400-500",
    ]);
    const excludes = mapStringArrayToRangeArray([
      "410-420",
      "95-205",
      "100-150",
    ]);

    const result = filterInterval(includes, excludes);

    expect(result).toBeArray();
    expect(result).toBeArrayOfSize(4);
    expect(result[0].start).toBe(10);
    expect(result[0].end).toBe(94);
    expect(result[0].length).toBe(85);

    expect(result[1].start).toBe(206);
    expect(result[1].end).toBe(300);
    expect(result[1].length).toBe(95);

    expect(result[2].start).toBe(400);
    expect(result[2].end).toBe(409);
    expect(result[2].length).toBe(10);

    expect(result[3].start).toBe(421);
    expect(result[3].end).toBe(500);
    expect(result[3].length).toBe(80);
  });
});
