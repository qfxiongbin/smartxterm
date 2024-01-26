<template>
  <div class="container">
    <!-- First column for icon menu -->
    <div class="grey darken-2 menu-column">
      <img src="@/assets/logo.png" alt="App Logo" class="logo">
      <div class="menu-wrapper">
        <v-list dense nav>
          <v-list-item>
            <img src="@/assets/ssh.png" alt="SSH Icon" class="sub-icon">
            <img src="@/assets/SFTP.png" alt="SFTP Icon" class="sub-icon">
          </v-list-item>
        </v-list>
      </div>
      <!-- Add a settings icon at the bottom -->
      <v-list-item class="settings-icon" @click="navigateToSettings">
        <v-icon>mdi-cog</v-icon>
      </v-list-item>
    </div>

    <!-- Second column for sub-menu -->
    <div class="grey darken-1 border-right sub-menu">
      <v-toolbar flat>
        <v-toolbar-title>SSH链接</v-toolbar-title>
        <v-btn icon>
          <v-icon @click="dialog = true">mdi-plus</v-icon>
        </v-btn>
      </v-toolbar>
      <v-list dense nav>
        <v-list-item v-for="link in links[selectedIcon]" :key="link.title" @click="navigate(link.path)">
          <v-list-item-title>{{ link.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </div>

    <!-- Third column for main content -->
    <div class="main-content">
      <smart-terminal class="full-height-width"></smart-terminal>
    </div>
    <v-dialog v-model="dialog" width="80%">
      <v-card>
        <v-card-title class="headline">添加服务器信息</v-card-title>
        <v-card-text>Some text...</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SmartTerminal from './components/SmartTerminal.vue';

export default {
  components: {
    SmartTerminal,
  },
  setup() {
    const icons = ref(['mdi-home', 'mdi-account']);
    const selectedIcon = ref(icons.value[0]);
    const dialog = ref(false);
    const links = ref({
      'mdi-home': [
        { title: '本地链接', path: '/home1' },
        { title: '172.168.16.245', path: '/home2' },
      ],
      'mdi-account': [
        { title: 'Account 1', path: '/account1' },
        { title: 'Account 2', path: '/account2' },
      ],
    });

    const router = useRouter();

    const navigate = (path) => {
      router.push(path);
    };

    return {
      icons,
      selectedIcon,
      links,
      navigate,
      dialog
    };
  },
};
</script>

<style scoped>
.logo {
  width: 50px;
  height: 50px;
  margin: 10px auto;
}
.sub-icon {
  margin-top: 15px;
  width: 30px;
  height: 30px;

}
.container {
  display: flex;
  height: 100vh;
}

.menu-column {
  width: 65px;
  border-right: 1px solid rgb(228, 226, 226);
}

.sub-menu {
  width: 200px; /* Adjust this value as needed */
  /* ... other styles ... */
}

.main-content {
  flex-grow: 1;
  position: relative;
}
.settings-icon {
  position: absolute;
  bottom: 0;
  /* ... other styles ... */
}

.full-height-width {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.full-width {
  width: 100%;
}

.bordered {
  border: 1px solid #000; /* Adjust as needed */
}

.button {
  padding: 10px;
  text-align: center;
  cursor: pointer;
}
</style>