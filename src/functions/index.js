export const dateRangeOverlaps = (a_start, a_end, b_start, b_end) => {
  if (a_start < b_start && b_start < a_end) return true; // b starts in a
  if (a_start < b_end && b_end < a_end) return true; // b ends in a
  if (b_start < a_start && a_end < b_end) return true; // a in b
  if (a_start == b_start && a_end >= b_end) return true; //a = b
  if (b_start < a_start && a_end == b_end) return true;
  if (a_start == b_start && b_end >= a_end) return true;
  return false;
};
