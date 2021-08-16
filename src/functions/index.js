import config from "../api/config";

let intersections = [];
export const getDateRangesIntersection = timeEntries => {
  let i = 0,
    j = 0;
  let timeIntervals = timeEntries.filter(
    entry => entry.start != null && entry.end != null
  );

  if (timeIntervals != null && timeIntervals.length > 1)
    for (i = 0; i < timeIntervals.length - 1; i += 1) {
      for (j = i + 1; j < timeIntervals.length; j += 1) {
        if (
          dateRangeOverlaps(
            new Date(timeIntervals[i].start).getTime(),
            new Date(timeIntervals[i].end).getTime(),
            new Date(timeIntervals[j].start).getTime(),
            new Date(timeIntervals[j].end).getTime()
          )
        )
          return intersections;
      }
    }
  return intersections;
};

const dateRangeOverlaps = (a_start, a_end, b_start, b_end) => {
  if (
    (a_start < b_start && b_start < a_end) ||
    (a_start < b_end && b_end < a_end) ||
    (b_start < a_start && a_end < b_end) ||
    (a_start == b_start && a_end >= b_end) ||
    (b_start < a_start && a_end == b_end) ||
    (a_start == b_start && b_end >= a_end)
  ) {
    return intersections.push(
      getIntersection(
        { start: a_start, end: a_end },
        { start: b_start, end: b_end }
      )
    );
  }

  return false;
};

const getIntersection = (a, b) => {
  let min = a.start < b.start ? a : b;
  let max = min == a ? b : a;

  //min ends before max starts -> no intersection
  if (min.end < max.start) return null; //the ranges don't intersect

  return {
    start: max.start,
    end: min.end < max.end ? min.end : max.end
  };
};

export const formatDate = date => {
  let year = JSON.stringify(new Date(date).getFullYear());

  let month = new Date(date).getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  let day = new Date(date).getDate();
  if (day < 10) {
    day = `0${day}`;
  }
  return `${year}-${month}-${day}T00:00:00`;
};

export const formatStart = date => {
  let year = JSON.stringify(new Date(date).getFullYear());

  let month = new Date(date).getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  let day = new Date(date).getDate();
  if (day < 10) {
    day = `0${day}`;
  }
  let hours = (date.getHours() < 10 ? "0" : "") + date.getHours();
  let minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
  return `${year}-${month}-${day}T${hours}:${minutes}:00`;
};

export const getStaffId = court => {
  let courtId =
    court == "WPT Court"
      ? [config.WPT_STAFF_ID]
      : court == "Panoramic Court"
      ? [config.PANORAMIC_STAFF_ID]
      : [config.WPT_STAFF_ID, config.PANORAMIC_STAFF_ID];
  return courtId;
};
