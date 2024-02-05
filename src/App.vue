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
        <v-toolbar-title>SSH</v-toolbar-title>
        <v-btn icon>
          <v-icon @click="showAddDialog">mdi-plus</v-icon>
        </v-btn>
      </v-toolbar>
      <v-list dense nav v-if="sshLinks.length">
        <v-list-item v-for="(link, index) in sshLinks" :key="link.ip" @click="doConnect(link)">
          <v-row align="center">
            <v-col cols="7">
              <v-list-item-title>{{ link.ip }}</v-list-item-title>
            </v-col>
            <v-col cols="2">
              <img src="@/assets/edit.png" class="operator-icon" @click.stop="editLink(index)">
            </v-col>
            <v-col cols="2">
              <img src="@/assets/delete.png" class="operator-icon" @click.stop="deleteLink(index)">
            </v-col>
          </v-row>
        </v-list-item>
      </v-list>
      <v-list dense nav v-else>
        <v-list-item>
          <p class="empty-txt">暂无服务器信息</p>
        </v-list-item>
      </v-list>
    </div>

    <!-- Third column for main content -->
    <div class="main-content">
      <v-chip v-for="(terminal, index) in terminals" :key="terminal.id" @contextmenu.prevent="openContextMenu(index)"
        label closable @click:close="closeTerminal(index)" @click="changeTerminal(index)" style="margin-left:5px">{{
          terminal.link.ip }}</v-chip>
      <keep-alive :include="includes">
        <smart-terminal class="full-height-width" v-if="terminals[activeTerminalIndex]"
          :link="terminals[activeTerminalIndex].link" :terminalId="terminals[activeTerminalIndex].id"
          :key="terminals[activeTerminalIndex].id">
        </smart-terminal>
      </keep-alive>
    </div>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ addDialogText }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="newLink.ip" label="服务器 IP"
                    :rules="[v => !!v || 'IP is required', v => /(\d{1,3}\.){3}\d{1,3}/.test(v) || 'IP is not valid']"></v-text-field>
                  <v-text-field v-model="newLink.port" label="端口"
                    :rules="[v => !!v || 'Port is required', v => (v > 0 && v <= 65535) || 'Port is not valid']"></v-text-field>
                  <v-text-field v-model="newLink.username" label="用户名"></v-text-field>
                  <v-text-field v-model="newLink.password" label="密码" type="password"></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">取消</v-btn>
          <v-btn color="blue darken-1" text @click="addLink">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirmDialog" persistent max-width="300px">
      <v-card>
        <v-card-title class="headline">确认删除</v-card-title>
        <v-card-text>你确定要删除这个链接吗？</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="confirmDialog = false">取消</v-btn>
          <v-btn color="red darken-1" text @click="confirmDelete">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import SmartTerminal from './components/SmartTerminal.vue';
import { v4 as uuidv4 } from 'uuid';

export default {
  components: {
    SmartTerminal,
  },
  setup() {
    const store = useStore();
    const sshLinks = computed(() => store.getters.sshLinks);
    const currentLink = ref(null);
    const showXterm = ref(true);
    const confirmDialog = ref(false);
    const activeTerminalIndex = computed(() => store.state.activeTerminalIndex);
    const terminals = computed(() => store.state.terminals);
    const includes = ref([]);
    const changeTerminal = (index) => {
      store.commit('setActiveTerminalIndex', index);
    };
    const closeTerminal = (index) => {
      store.commit('removeTerminal', index);
      if (terminals.value.length) {
        store.commit('setActiveTerminalIndex', terminals.value.length - 1);
      }

      console.log('activeTerminalIndex', activeTerminalIndex.value);
      if (!terminals.value.length) {
        store.commit('setActiveTerminalIndex', null);
      }
    };
    const addDialogText = ref('添加 SSH 链接');
    const valid = ref(false);
    let editIndex = null;
    let deleteIndex = null;
    const newLink = ref({
      ip: '',
      port: '',
      username: '',
      password: ''
    });
    const dialog = ref(false);

    const showAddDialog = () => {
      addDialogText.value = '添加 SSH 链接';
      newLink.value = { ip: '', port: '', username: '', password: '' };
      dialog.value = true;
    };

    const addLink = () => {
      if (!valid.value) {
        return;
      }
      if (editIndex !== null) {
        store.commit('editSSHLink', { index: editIndex, link: newLink.value });
        editIndex = null;
        newLink.value = { ip: '', port: '', username: '', password: '' };
        dialog.value = false;
        return;
      }
      store.commit('addSSHLink', newLink.value);
      newLink.value = { ip: '', port: '', username: '', password: '' };
      dialog.value = false;
    };

    const editLink = (index) => {
      editIndex = index;
      newLink.value = { ...sshLinks.value[index] };
      addDialogText.value = '编辑 SSH 链接';
      dialog.value = true;
    };

    const deleteLink = (index) => {
        deleteIndex = index;
        confirmDialog.value = true;
    };

    const confirmDelete = () => {
        store.commit('deleteLink', deleteIndex);    
    };

    const doConnect = (link) => {
        //给 showXterm 赋值 false 再赋值 true，是为了触发 SmartTerminal 组件的 setup 函数
        currentLink.value = link;
        let uuid = uuidv4();
        // 需要创建新的 对象存进 terminals
        let terminal = {
          id: uuid,
          link: link
        };
        store.commit('addTerminal', terminal);
        includes.value.push(uuid);
    };

    return {
      valid,
      dialog,
      showXterm,
      sshLinks,
      newLink,
      currentLink,
      confirmDialog,
      addDialogText,
      terminals,
      activeTerminalIndex,
      includes,
      showAddDialog,
      addLink,
      editLink,
      deleteLink,
      confirmDelete,
      doConnect,
      changeTerminal,
      closeTerminal
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

.operator-icon {
  width: 20px;
  height: 20px;
  margin-top: 10px;
  margin-left: 10px;
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
  width: 280px; /* Adjust this value as needed */
  border-right: 1px solid #bdbaba;
  /* ... other styles ... */
}
.borderd-right {
  border-right: 1px solid #9b9898; /* Adjust as needed */
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
  top: 5;
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