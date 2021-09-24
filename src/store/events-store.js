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
        // console.log("i:", i);
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

      corsBridge
        .get(endpoints.getStaffAvailability + 1, {
          params: {
            startDate: formatDate(startDate),
            endDate: formatDate(endDate)
          }
        })
        .then(async events => {
          // let availableDates = events.data.StaffBookabilities[0].BookableTimeBlocks;

          let blocked = [];
          await Promise.all(
            events.data.data.map(reservations => {
              return blocked.push(reservations);
            })
          );

          // if (court == null) {
          //   // Let duplicated values only in blocked array

          //   blocked = getDateRangesIntersection(blocked);
          // }

          blocked.forEach(event => {
            event.start = new Date(event.start).getTime();
            event.end = new Date(event.end).getTime();
            event.name = "Blocked";
            event.color = `${event.Transactions ? "#757575" : "#85BFDA"}`;
            event.timed = true;
            event.editable = false;
          });
          blocked.forEach(event => {
            // filterUnavailableHours()
            // If event starts before start time eg.4 pm
            let startHour = new Date(event.start).getHours();
            if (startHour < state.Start_Time) {
              let difference =
                state.Start_Time - new Date(event.start).getHours();

              event.start = new Date().setTime(
                new Date(event.start).getTime() + difference * 60 * 60 * 1000
              );
            }
            if (new Date(event.start).getDay() < new Date(event.end).getDay()) {
              event.end = new Date().setTime(
                new Date(event.end).getTime() -
                  state.Start_Time * 60 * 60 * 1000 -
                  1 * 1000
              );
            }
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
    let body = {
      serviceId: 1,
      start: state.selectedEvent.start,
      end: state.selectedEvent.end
    };
    return new Promise((resolve, reject) => {
      corsBridge
        .post(endpoints.CreateBooking, body)
        .then(res => {
          resolve(res.data);
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
