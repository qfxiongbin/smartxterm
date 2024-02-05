<template>
  <div>
  <smart-terminal class="full-height-width"
    v-if="terminals[activeTerminalIndex]" 
    :link="terminals[activeTerminalIndex].link" 
    :terminalId="terminals[activeTerminalIndex].id"
    :key="terminals[activeTerminalIndex].id">
  </smart-terminal>
</div>
</template>

<script>
import SmartTerminal from '@/components/SmartTerminal.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
  name: 'TerminalPage',
  components: {
    SmartTerminal
  },
  setup() {
    const msg = 'Welcome to SmartXterm!'
    const store = useStore();
    const terminals = computed(() => store.state.terminals);
    const activeTerminalIndex = computed(() => store.state.activeTerminalIndex);
    return { msg,terminals,activeTerminalIndex }
  }
}
</script>

<style scoped>

.full-height-width {
  position: absolute;
  top: 5;
  right: 0;
  bottom: 0;
  left: 0;
}

</style>