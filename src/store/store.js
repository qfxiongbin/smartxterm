import { createStore } from 'vuex';

export default createStore({
  state: {
    sshLinks:  JSON.parse(localStorage.getItem('sshLinks')) || [],
    terminals: [],
    activeTerminalIndex: null, 
  },
  mutations: {
    addSSHLink(state, link) {
      state.sshLinks.push(link);
      localStorage.setItem('sshLinks', JSON.stringify(state.sshLinks));
    },

    editSSHLink(state, { link, index }) {
      state.sshLinks[index] = link;
      localStorage.setItem('sshLinks', JSON.stringify(state.sshLinks));
    },

    deleteLink(state, index) {
      state.sshLinks.splice(index, 1);
      localStorage.setItem('sshLinks', JSON.stringify(state.sshLinks));
    },

    addTerminal(state, terminal) {
      state.terminals.push(terminal);
      state.activeTerminalIndex = state.terminals.length - 1;
    },
    removeTerminal(state, index) {
      state.terminals.splice(index, 1);
      if (index === state.activeTerminalIndex) {
        state.activeTerminalIndex = null;
      }
    },
    setActiveTerminalIndex(state, index) {
      state.activeTerminalIndex = index;
    },
  },
  getters: {
    sshLinks: state => state.sshLinks
  }
});