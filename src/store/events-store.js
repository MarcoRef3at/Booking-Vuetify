import clientApi from "../api/client";
const state = {
  eventsArr: [],
  selectedEvent: {},
  iframeSrc:
    "https://accept.paymob.com/api/acceptance/iframes/249719?payment_token=",
  iFrameToken: null
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
    clientApi.get("reservation").then(events => {
      events.data.data.forEach(event => {
        event.start = new Date(event.start).getTime();
        event.end = new Date(event.end).getTime();
        event.name = "Blocked";
        event.color = "#757575";
        event.timed = true;
        event.editable = false;
      });
      commit("updateEvents", events.data.data);
    });
  },
  bookEvent({ dispatch, commit }) {
    return new Promise((resolve, reject) => {
      clientApi
        .post("reservation", {
          serviceId: 1,
          start: state.selectedEvent.start,
          end: state.selectedEvent.end
        })
        .then(res => {
          commit("updateIframeToken", res.data.iFrameToken);
          console.log("r:", res.data);

          dispatch("getAllEvents");
          resolve(res); //returns x in .then
        })
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
