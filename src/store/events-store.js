const state = {
  selectedEvent: {},
};
const mutations = {
  updateSelectedEvent(state, payload) {
    state.selectedEvent = payload;
  },
};
const actions = {
  updateSelectedEvent({ commit }, payload) {
    commit("updateSelectedEvent", payload);
  },
};
const getters = {
  devicesPerGrid: (state) => state.devicesPerGrid,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
