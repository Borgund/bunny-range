export default class Range {
  start: number;
  end: number;
  length: number;

  constructor(start: number = 0, end?: number) {
    if (start < 0) {
      throw new Error("Start value of a range needs to be a positive integer.");
    }
    if (end && start > end) {
      throw new Error(
        "Start value of a range needs to be smaller than or eaqual to the end of the range."
      );
    }
    this.start = start;
    this.end = end ?? start;
    this.length = this.end - this.start + 1;
  }
  toString() {
    return `${this.start}-${this.end}`;
  }
  toArray() {
    return Array.from(
      { length: this.length },
      (element, index) => index + this.start
    );
  }
  contains(number: number) {
    return this.start <= number && this.end >= number;
  }
  overlapsWith(range: Range) {
    if (this.start > range.end) return false;
    const compareStart = this.start <= range.end;
    const compareEnd = this.end >= range.start;
    return compareStart && compareEnd;
  }
  includes(range: Range) {
    if (this.start > range.end) return false;
    return this.start <= range.start && this.end >= range.end;
  }
  compare(range: Range) {
    if (this.start !== range.start) {
      return this.start - range.start;
    }
    return this.end - range.end;
  }
  equals(range: Range) {
    return this.start === range.start && this.end === range.end;
  }
  combine(range: Range) {
    if (this.equals(range) || this.includes(range)) return this;
    if (range.includes(this)) return range;
    // Made a decission here to let users combine any non-overlapping range as well.
    const start = Math.min(this.start, range.start);
    const end = Math.max(this.end, range.end);
    return new Range(start, end);
  }
  exclude(range: Range): Range[] | null {
    if (!this.overlapsWith(range)) {
      return [this];
    }
    if (this.equals(range) || range.includes(this)) {
      return null;
    }

    if (this.includes(range)) {
      const beforeExcludedRange = new Range(this.start, range.start - 1);
      if (range.end + 1 > this.end) {
        return [beforeExcludedRange];
      }
      const afterExcludedRange = new Range(range.end + 1, this.end);
      return [beforeExcludedRange, afterExcludedRange].filter(
        (range) => range.length > 0
      );
    }
    const overlapStart = Math.max(this.start, range.start);
    const overlapEnd = Math.min(this.end, range.end);
    if (this.start > range.start) {
      const afterExcluded = new Range(overlapEnd + 1, this.end);
      return [afterExcluded];
    } else {
      const beforeExcluded = new Range(this.start, overlapStart - 1);
      return [beforeExcluded];
    }
  }
  excludeArray(ranges: Range[]): Range[] {
    if (ranges.length < 1) return [this];
    for (const range of ranges) {
      if (this.overlapsWith(range)) {
        return this.exclude(range) ?? [];
      }
    }
    return [];
  }
}
