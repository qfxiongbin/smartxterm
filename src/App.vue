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
      <v-list dense nav v-if="sshLinks.length">
        <v-list-item v-for="link in sshLinks" :key="link.title" @click="navigate(link)">
          <v-list-item-title>{{ link.ip }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-list dense nav v-else>
        <v-list-item>
          <p class="empty-txt">暂无链接</p>
        </v-list-item>
      </v-list>
    </div>

    <!-- Third column for main content -->
    <div class="main-content">
      <smart-terminal class="full-height-width"></smart-terminal>
    </div>
    <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">添加 SSH 链接</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="newLink.ip" label="服务器 IP"></v-text-field>
              <v-text-field v-model="newLink.port" label="端口"></v-text-field>
              <v-text-field v-model="newLink.username" label="用户名"></v-text-field>
              <v-text-field v-model="newLink.password" label="密码" type="password"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">取消</v-btn>
        <v-btn color="blue darken-1" text @click="addLink">保存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import SmartTerminal from './components/SmartTerminal.vue';

export default {
  components: {
    SmartTerminal,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const sshLinks = computed(() => store.getters.sshLinks);
    const icons = ref(['mdi-home', 'mdi-account']);
    const selectedIcon = ref(icons.value[0]);
    const newLink = ref({
      ip: '',
      port: '',
      username: '',
      password: ''
    });
    const dialog = ref(false);
    const addLink = () => {
      store.commit('addSSHLink', newLink.value);
      newLink.value = { ip: '', port: '', username: '', password: '' };
      dialog.value = false;
    };

    const navigate = (path) => {
      router.push(path);
    };

    return {
      icons,
      selectedIcon,
      navigate,
      dialog,
      sshLinks,
      newLink,
      addLink
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
.empty-txt{
  text-align: center;
  color: #909399;
  font-size: 14px;
}
</style>