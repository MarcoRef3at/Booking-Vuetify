import { corsBridge, paymobApi } from "../api/client";
import endpoints from "../api/endpoints";
import getPaymobIFrameToken from "../api/paymob_request";
import { dateRangeOverlaps } from "./../functions/index";
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
  getAllEvents({ commit }) {
    console.log("getall");
    let body = {
      StaffList: ["hmiVSgFlkUe/rjYjFAEs/g=="],
      Start: "2021-08-08T00:00:00",
      End: "2021-08-15T00:00:00",
      TimeZone: "Africa/Cairo"
    };

    corsBridge.post(endpoints.getStaffAvailability, body).then(async events => {
      let availableDates = events.data.StaffBookabilities[0].BookableTimeBlocks;

      let blocked = [];
      await Promise.all(
        // Filter Available Dates and convert the unavailable slots to events
        availableDates.map((available, index, elements) => {
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
        })
      );
      console.log("blocked:", blocked);

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
