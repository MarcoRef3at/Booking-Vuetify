const state = {
  eventsArr: [],
  selectedEvent: {}
};
const mutations = {
  updateSelectedEvent(state, payload) {
    state.selectedEvent = payload;
  },
  updateEvents(state, payload) {
    state.eventsArr = payload;
  }
};
const actions = {
  updateSelectedEvent({ commit }, payload) {
    commit("updateSelectedEvent", payload);
  },
  updateEvents({ commit }, payload) {
    commit("updateEvents", payload);
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
