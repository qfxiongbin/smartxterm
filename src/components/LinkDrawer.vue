<template>
  <v-navigation-drawer>
    <v-list nav>
      <v-row>
        <v-col v-for="link in links" :key="link.title" @click="navigate(link.path)">
          <v-list-item>
            <v-list-item-icon>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ link.title }}</v-list-item-title>
          </v-list-item>
        </v-col>
      </v-row>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const links = ref([
      { title: 'Home', icon: 'mdi-home', path: '/' },
      { title: 'About', icon: 'mdi-information', path: '/about' },
      // Add more links as needed
    ]);

    const router = useRouter();

    const navigate = (path) => {
      router.push(path);
    };

    return { links, navigate };
  }
}
</script>