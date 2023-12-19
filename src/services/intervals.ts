import Range from "../models/range";

export function filterInterval(includes: Range[], excludes?: Range[]): Range[] {
  try {
    const combinedIncludes = combineRanges(includes);
    const combinedExcludes = combineRanges(excludes ?? []);
    const finalRanges = excludeRanges(combinedIncludes, combinedExcludes);
    const sortedResult = finalRanges.sort((a, b) => a.compare(b));
    return sortedResult;
  } catch (error) {
    console.error(error);
  }
  return [];
}

function combineRanges(ranges: Range[]) {
  if (ranges.length <= 1) return ranges;
  const combinedRanges = [];

  for (const range of ranges) {
    const lastCombinedRange = combinedRanges[combinedRanges.length - 1] as
      | Range
      | undefined;

    if (lastCombinedRange && lastCombinedRange.overlapsWith(range)) {
      const combinedRange = lastCombinedRange.combine(range);
      combinedRanges[combinedRanges.length - 1] = combinedRange;
    } else {
      combinedRanges.push(range);
    }
  }
  return combinedRanges;
}

function excludeRanges(includes: Range[], excludes: Range[]) {
  if (includes.length <= 0) return [];
  if (excludes.length <= 0) return includes;

  const result = includes.flatMap((range) => {
    return range.excludeArray(excludes);
  });
  return result;
}

function stringToRange(string: string) {
  const [start, end] = string.split("-").map(Number);
  if (!start || !end) {
    throw new Error(
      `Expected format a string with the format '#-#' but got ${string}`
    );
  }
  return new Range(start, end);
}

export function mapStringArrayToRangeArray(array: string[]) {
  if (array.length > 0) return array.map(stringToRange);
  else return [];
}
