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
    let commandHistory = []; // 命令历史
    let commandHistoryIndex = -1; // 当前浏览的命令历史索引

    onMounted(() => {
      terminal.value = new Terminal();
      terminal.value.open(document.querySelector('.terminal'));
      terminal.value.writeln('Welcome to xterm.js');
      terminal.value.write(prompt);

      terminal.value.onKey(({ key, domEvent }) => {
        const keyCode = domEvent.keyCode;
        const isEnter = keyCode === 13;
        const isBackspace = keyCode === 8;
        const isArrowUp = keyCode === 38;
        const isArrowDown = keyCode === 40;
        const tabKeyCode = keyCode === 9;

        if (isEnter) {
          terminal.value.writeln('');
          executeCommand(command);
          commandHistory.push(command); // 添加命令到历史
          commandHistoryIndex = commandHistory.length; // 重置命令历史索引
          command = '';
          terminal.value.write(prompt);
        } else if (isBackspace) {
          if (command.length > 0) {
            terminal.value.write('\b \b');
            command = command.slice(0, -1);
          }
        } else if (isArrowUp || isArrowDown) {
          if (commandHistory.length > 0) {
            commandHistoryIndex += isArrowUp ? -1 : 1;
            // 防止索引越界
            commandHistoryIndex = Math.max(0, Math.min(commandHistoryIndex, commandHistory.length - 1));
            command = commandHistory[commandHistoryIndex];
            terminal.value.clear();
            if (command) {
              terminal.value.write('\x1B[2K\r');
              terminal.value.write(prompt + command);
            }
          }
        } else if (tabKeyCode) {
          // tab 补全逻辑
          domEvent.preventDefault(); // 阻止 Tab 的默认行为
          ipcRenderer.send('autocomplete-command', command);
        } 
        else {
          terminal.value.write(key);
          command += key;
        }
      });

      ipcRenderer.on('command-output', (event, output) => {
        output.split('\n').forEach(line => {
          terminal.value.writeln(line);
        });
        terminal.value.write(prompt);
      });

      ipcRenderer.on('autocomplete-result', (event, output) => {
        output.split('\n').forEach(line => {
          terminal.value.writeln(line);
        });
        terminal.value.write(prompt);
      });
    });

    const executeCommand = (command) => {
      // 安全检查或命令过滤逻辑
      ipcRenderer.send('execute-command', command);
    };

    return {
      terminal
    };
  }
};
</script>

<style>
.terminal {
  width: 100%;
  height: 100vh;
  border: 1px solid #ccc;
}
</style>
