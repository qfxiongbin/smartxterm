<template>
  <div id="app">
    <div ref="terminal" class="terminal"></div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Terminal } from 'xterm';
import { ipcRenderer } from 'electron';
import 'xterm/css/xterm.css';

export default {
  setup() {
    const terminal = ref(null);
    const prompt = '$ ';
    let command = '';

    onMounted(() => {
      terminal.value = new Terminal();
      terminal.value.open(document.querySelector('.terminal'));
      terminal.value.writeln('Welcome to xterm.js');
      terminal.value.write(prompt);

      terminal.value.onKey(({ key, domEvent }) => {
        if (domEvent.keyCode === 13) { // Enter key
          terminal.value.writeln('');
          ipcRenderer.send('execute-command', command);
          command = '';
          terminal.value.write(prompt);
        } else if (domEvent.keyCode === 8) { // Backspace key
          if (command.length > 0) {
            terminal.value.write('\b \b');
            command = command.slice(0, -1);
          }
        } else {
          terminal.value.write(key);
          command += key;
        }
      });

      // 监听来自主进程的命令输出
      ipcRenderer.on('command-output', (event, output) => {
        output.split('\n').forEach(line => {
          terminal.value.writeln(line);
        });
        terminal.value.write(prompt);
      });
    });

    return {
      terminal
    };
  }
};
</script>

<style>
.terminal {
  width: 100%;
  height: 100hv;
  border: 1px solid #ccc;
}
</style>
