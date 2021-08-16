import { corsBridge, paymobApi } from "../api/client";
import config from "../api/config";
import endpoints from "../api/endpoints";
import getPaymobIFrameToken from "../api/paymob_request";
import { getDateRangesIntersection } from "./../functions/index";
const state = {
  eventsArr: [],
  selectedEvent: {},
  iframeSrc:
    "https://accept.paymob.com/api/acceptance/iframes/249719?payment_token=",
  iFrameToken: null,
  Start_Time: "16",
  End_Time: "0"
};
const mutations = {
  updateIframeToken(state, payload) {
    state.iFrameToken = payload;
  },
  updateSelectedEvent(state, payload) {
    state.selectedEvent = payload;
  },
  updateEvents(state, payload) {
    state.eventsArr = payload;
  },
  deleteEvent(state, payload) {
    state.eventsArr = state.eventsArr.filter(e => e.id != payload.id);
  }
};
const actions = {
  getAllEvents({ commit }, payload) {
    let { start, end, court } = payload;
    let startDate = new Date(start);
    let endDate = new Date(new Date(end).setHours(23, 59));
    const formatDate = date => {
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
    let courtId =
      court == "WPT Court"
        ? [config.WPT_STAFF_ID]
        : court == "Panoramic Court"
        ? [config.PANORAMIC_STAFF_ID]
        : [config.WPT_STAFF_ID, config.PANORAMIC_STAFF_ID];

    let body = {
      StaffList: courtId,
      Start: formatDate(startDate),
      End: formatDate(endDate),
      TimeZone: "Africa/Cairo"
    };
    corsBridge.post(endpoints.getStaffAvailability, body).then(async events => {
      // let availableDates = events.data.StaffBookabilities[0].BookableTimeBlocks;

      let availableDates = [];
      await Promise.all(
        events.data.StaffBookabilities.map(StaffBookabilities => {
          return availableDates.push(StaffBookabilities.BookableTimeBlocks);
        })
      );

      let blocked = [];

      await Promise.all(
        // Filter Available Dates and convert the unavailable slots to events
        availableDates.map(courtAvailability => {
          courtAvailability.map((available, index, elements) => {
            if (index < elements.length - 1) {
              let slot = {
                start: available.End,
                end: elements[index + 1].Start
              };

              if (
                new Date(slot.start).getTime() ===
                  new Date(
                    new Date(slot.start).setHours(state.End_Time)
                  ).getTime() &&
                new Date(slot.end).getTime() ===
                  new Date(
                    new Date(slot.start).setHours(state.Start_Time)
                  ).getTime()
              ) {
                // If events in non-working hours .. neglect
              } else {
                return blocked.push(slot);
              }
            }
          });
        })
      );
      if (court == null) {
        // Let duplicated values only in blocked array

        blocked = getDateRangesIntersection(blocked);
      }

      blocked.forEach(event => {
        event.start = new Date(event.start).getTime();
        event.end = new Date(event.end).getTime();
        event.name = "Blocked";
        event.color = "#757575";
        event.timed = true;
        event.editable = false;
      });
      commit("updateEvents", blocked);
    });
  },
  bookEvent({ dispatch, commit }) {
    return new Promise((resolve, reject) => {
      getPaymobIFrameToken(300)
        .then(iframeToken => {
          commit("updateIframeToken", iframeToken);
          resolve();
        })
        // clientApi
        //   .post("reservation", {
        //     serviceId: 1,
        //     start: state.selectedEvent.start,
        //     end: state.selectedEvent.end,
        //   })
        //   .then((res) => {
        //     commit("updateIframeToken", res.data.iFrameToken);
        //     console.log("r:", res.data);

        //     dispatch("getAllEvents");
        //     resolve(res); //returns x in .then
        //   })
        .catch(err => {
          console.log("err:", err.response.data);
          reject(err); //returns y in .catch
        });
    });
  },
  updateSelectedEvent({ commit }, payload) {
    commit("updateSelectedEvent", payload);
  },
  updateEvents({ commit }, payload) {
    commit("updateEvents", payload);
  },
  deleteEvent({ commit }, payload) {
    commit("deleteEvent", payload);
  },

  checkOverlapping({ dispatch }, payload) {
    const dateRangeOverlaps = (a_start, a_end, b_start, b_end) => {
      if (a_start < b_start && b_start < a_end) return true; // b starts in a
      if (a_start < b_end && b_end < a_end) return true; // b ends in a
      if (b_start < a_start && a_end < b_end) return true; // a in b
      if (a_start == b_start && a_end >= b_end) return true; //a = b
      if (b_start < a_start && a_end == b_end) return true;
      if (a_start == b_start && b_end >= a_end) return true;
      return false;
    };

    const { start, end, eventId } = payload;
    let allOtherEvents = state.eventsArr.filter(event => event.id != eventId);
    let allowed = allOtherEvents.map(event => {
      return dateRangeOverlaps(event.start, event.end, start, end);
    });
    return allowed.some(value => value);
  }
};
const getters = {
  getIframeSrc: state => {
    return state.iframeSrc + state.iFrameToken;
  },
  getDate: state => {
    let eventDate = new Date(state.selectedEvent.start);
    eventDate =
      eventDate.getFullYear() +
      "-" +
      (eventDate.getMonth() + 1) +
      "-" +
      eventDate.getDate();
    return eventDate;
  },
  getTimeFrom: state => {
    let date = new Date(state.selectedEvent.start);
    let hours = date.getHours();
    let minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    return `${hours}:${minutes}`;
  },
  getTimeTo: state => {
    let date = new Date(state.selectedEvent.end);
    let hours = date.getHours();
    let minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    return `${hours}:${minutes}`;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
