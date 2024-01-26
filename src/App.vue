<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <v-row>
          <!-- First column for icon menu -->
          <div class="grey darken-2 menu-column" style="width: 65px">
            <div class="menu-wrapper">
              <v-list dense nav>
                <v-list-item v-for="icon in icons" :key="icon" @click="selectedIcon = icon">
                  <v-icon>{{ icon }}</v-icon>
                </v-list-item>
              </v-list>
            </div>
            <!-- Add a settings icon at the bottom -->
            <v-list-item class="settings-icon" @click="navigateToSettings">
              <v-icon>mdi-cog</v-icon>
            </v-list-item>
          </div>

          <!-- Second column for sub-menu -->
          <v-col cols="3" class="grey darken-1 border-right">
            <v-list dense nav>
              <v-list-item v-for="link in links[selectedIcon]" :key="link.title" @click="navigate(link.path)">
                <v-list-item-title>{{ link.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>

          <!-- Third column for main content -->
          <v-col cols="7" class="grey lighten-1">
            Main Content
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const icons = ref(['mdi-home', 'mdi-account']);
    const selectedIcon = ref(icons.value[0]);
    const links = ref({
      'mdi-home': [
        { title: 'Home 1', path: '/home1' },
        { title: 'Home 2', path: '/home2' },
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

    const navigateToSettings = () => {
      router.push('/settings');
    };

    return { icons, selectedIcon, links, navigate, navigateToSettings };
  }
}
</script>

<style scoped>
.menu-column {
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #F2F6FC; /* Add this line */
}

.menu-wrapper {
  flex-grow: 1;
}

.settings-icon {
  position: relative;
  width: 100%;
}
.border-right {
  border-right: 1px solid #F2F6FC; /* Add this line */
}
</style>