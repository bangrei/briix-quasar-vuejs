<template>
  <q-header elevated class="bg-primary text-dark" height-hint="98" bordered>
      <q-toolbar>
        <q-toolbar-title class="text-center text-white">
          Movies Collection
        </q-toolbar-title>
      </q-toolbar>
  </q-header>

  <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
    <!-- drawer content -->
  </q-drawer>

  <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
    <!-- drawer content -->
  </q-drawer>

  <q-page-container>
    <q-page class="fit">
      <div class="q-pa-md q-gutter-md flex flex-center column fit">
        <q-input outlined rounded dense v-model="searchKey" label="Search by title..." class="q-pt-md q-pb-md fit" style="max-width: 600px" />
        <q-list bordered rounded class="rounded-borders fit" style="max-width: 600px" 
          v-for="(movie, index) in filterMovies" :key="index"
          @click="editForm(movie)"
          >
          <q-item-label header>
            <span class="text-weight-bold">{{ movie.title }}</span>
            <q-item-label lines="2">{{ movie.director }}</q-item-label>
          </q-item-label>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label caption lines="3">
                {{ movie.summary }}
              </q-item-label>
            </q-item-section>

            <q-item-section side top class="q-mt-xl">
              {{ movie.genres.join(' / ') }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <q-inner-loading
          :showing="loading"
          label="Please wait..."
          label-class="text-teal"
          label-style="font-size: 1.1em"
      />
      
      <q-fab class="absolute-bottom-right q-pr-xl q-pb-xl" @click="openForm()" />
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from 'vue'
import { databases, Query, APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID } from '../lib/appwrite';

export default defineComponent({
  name: 'IndexPage',
  components: {},
  data() {
    return {
      movies: [],
      searchKey: "",
      loading: false,
    };
  },
  computed: {
    filterMovies() {
      if (!this.searchKey) return this.movies;
      return this.movies.filter((movie) => {
        return movie.title.toLowerCase().indexOf(this.searchKey.toLowerCase()) > -1;
      });
    }
  },
  methods: {
    openForm() {
        this.$router.push('/movie/new');
    },
    editForm(movie) {
        this.$router.push(`/movie/${movie.$id}`);
    },
    async getMovies() {
      this.loading = true;
      const data = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        [Query.orderAsc("title"),]
      );
      let docs = data.documents;
      this.movies = docs || [];
      this.loading = false;
    }
  },
  async created() {
    this.getMovies();
  },
});
</script>
