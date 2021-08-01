const state = {
  selectedEvent: {}
};
const mutations = {
  updateSelectedEvent(state, payload) {
    state.selectedEvent = payload;
  }
};
const actions = {
  updateSelectedEvent({ commit }, payload) {
    commit("updateSelectedEvent", payload);
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
  getTimeFrom: state => state.selectedEvent.start,
  getTimeTo: state => state.selectedEvent.end
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
