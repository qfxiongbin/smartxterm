<template>
  <div id="app">
    <div 
    ref="smartterminal" 
    class="smartterminal" 
    :id="'smartterminal'+ terminalId"
    :style="{height: 'calc(100vh - 30px)'}"
    ></div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Terminal } from 'xterm';
import { ipcRenderer } from 'electron';
import 'xterm/css/xterm.css';
import { FitAddon } from 'xterm-addon-fit';

export default {
  
  props: {
    terminalId: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const xterm = ref(null);
    const fitAddon = ref(null);
    const channels = ref(null);

    const initConnect = () => {
      destoryTerm();
      ipcRenderer.invoke('terminal-create').then(res => {
        let pid = res;
        xterm.value = new Terminal();
        fitAddon.value = new FitAddon();
        xterm.value.loadAddon(fitAddon.value);
        xterm.value.open(document.getElementById('smartterminal' + props.terminalId));
        channels.value = ["terminal-incomingData-" + pid, "terminal-keystroke-" + pid, "terminal-resize-" + pid, "terminal-close-" + pid];
        xterm.value.onData((data) => {
          ipcRenderer.send(channels.value[1], data);
        })
        xterm.value.onResize((size) => {
          ipcRenderer.send(channels.value[2], size.cols, size.rows);
        })
        ipcRenderer.on(channels.value[0], (event, data) => {
          xterm.value.write(data);
        });
        window.onresize = function() {
          fitSize();
        }
        fitSize();
        xterm.value.focus();
      })
    };

    const destoryTerm = () => {
      if (xterm.value) {
        xterm.value.dispose();
        xterm.value = null;
      }
      if (fitAddon.value) {
        fitAddon.value.dispose();
        fitAddon.value = null;
      }
      if (channels.value) {
        ipcRenderer.send(channels.value[3]);
        ipcRenderer.removeAllListeners(channels.value[0]);
        channels.value = null;
      }
    };

    const fitSize = () => {
      if (fitAddon.value) {
        fitAddon.value.fit();
        ipcRenderer.send(channels.value[2], fitAddon.value.proposeDimensions().cols, fitAddon.value.proposeDimensions().rows);
      }
    };

    onMounted(() => {
      initConnect();
    });

    return {
      xterm,
      fitAddon,
      channels,
      initConnect,
      destoryTerm
    };
  }
};
</script>

<style>
</style>
