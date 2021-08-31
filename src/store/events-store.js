import { corsBridge, paymobApi } from "../api/client";
import endpoints from "../../public/endpoints.json";
import getPaymobIFrameToken from "../api/paymob_request";
import {
  formatDate,
  formatStart,
  getDateRangesIntersection,
  getServiceId,
  getStaffId
} from "./../functions/index";
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
  resetSelectedEvent(state) {
    state.selectedEvent = {};
  },
  deleteEvent(state, payload) {
    state.eventsArr = state.eventsArr.filter(e => e.id != payload.id);
  },
  disableEvent(state, payload) {
    state.eventsArr.map((event, i) => {
      if (event.id == payload.id) {
        console.log("i:", i);
        state.eventsArr[i] = payload;
      }
    });
  }
};
const actions = {
  getAllEvents({ commit }, payload) {
    return new Promise((resolve, reject) => {
      let { start, end, court } = payload;
      // Add a week after and a week before when getting data to make it faster in loading
      let startDate = new Date(start).setDate(new Date(start).getDate() - 8);

      let endDate = new Date(end).setDate(new Date(end).getDate() + 8);

      let body = {
        StaffList: getStaffId(court),
        Start: formatDate(startDate),
        End: formatDate(endDate),
        TimeZone: "Africa/Cairo"
      };
      corsBridge
        .post(endpoints.getStaffAvailability, body)
        .then(async events => {
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
          resolve();
        });
    });
  },
  pay({ dispatch, commit }, payload) {
    let { CustomerName, CustomerEmail, CustomerPhone, courtName } = payload;
    let Start = formatStart(new Date(state.selectedEvent.start));
    let body = {
      ServiceId: getServiceId(courtName, true),
      StaffList: getStaffId(courtName),
      CustomerName,
      CustomerEmail,
      CustomerPhone,
      Start,
      StartInCustomerTimeZone: Start,
      CustomerTimeZone: "Egypt Standard Time"
    };
    // setTimeout(() => {
    return new Promise((resolve, reject) => {
      getPaymobIFrameToken(300, body, courtName)
        .then(iframeToken => {
          commit("updateIframeToken", iframeToken);
          resolve();
        })
        .catch(err => {
          reject(err.response.data.items.name); //returns y in .catch
        });
    });
    // }, 50);
  },

  bookEvent({ commit, getters }, payload) {
    let { CustomerName, CustomerEmail, CustomerPhone, courtName } = payload;
    let Start = formatStart(new Date(state.selectedEvent.start));
    let body = {
      ServiceId: getServiceId(courtName, false),
      StaffList: getStaffId(courtName),
      CustomerName,
      CustomerEmail,
      CustomerPhone,
      CustomerNotes: "UnPaid",
      Start,
      StartInCustomerTimeZone: Start,
      CustomerTimeZone: "Egypt Standard Time"
    };
    return new Promise((resolve, reject) => {
      corsBridge
        .post(endpoints.CreateBooking, body)
        .then(res => {
          resolve(res.data); //returns x in .then
        })
        .catch(e => {
          reject(e.response.data);
        });
    });
  },

  updateSelectedEvent({ commit }, payload) {
    commit("updateSelectedEvent", payload);
  },
  disableEvent({ commit }, payload) {
    commit("disableEvent", payload);
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
  },
  resetSelectedEvent({ commit }) {
    commit("resetSelectedEvent");
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
