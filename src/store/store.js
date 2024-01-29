import { createStore } from 'vuex';

export default createStore({
  state: {
    sshLinks:  JSON.parse(localStorage.getItem('sshLinks')) || []

  },
  mutations: {
    addSSHLink(state, link) {
      state.sshLinks.push(link);
      localStorage.setItem('sshLinks', JSON.stringify(state.sshLinks));
    }
  },
  getters: {
    sshLinks: state => state.sshLinks
  }
});