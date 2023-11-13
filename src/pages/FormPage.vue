<template>
  <q-header elevated class="bg-primary text-dark" height-hint="98" bordered>
      <q-toolbar>
        <q-btn dense flat round class="text-white" icon="arrow_back" @click="goBack()" />
        <q-toolbar-title class="text-center">
        </q-toolbar-title>
        <div class="q-gutter-sm">
            <q-btn push color="negative" v-if="id" label="Delete" @click="removeMovie()" />
            <q-btn push color="positive" label="Save" @click="createMovie()" />
        </div>
      </q-toolbar>
  </q-header>

  <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
    <!-- drawer content -->
  </q-drawer>

  <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
    <!-- drawer content -->
  </q-drawer>

  <q-page-container>
    <q-page class="flex flex-center">
        <div class="q-pa-md fit flex flex-center">
            <div class="q-gutter-y-md column fit" style="max-width: 400px">
                <q-input outlined v-model="title" dense label="Title" />
                <q-input outlined v-model="director" dense label="Director" />
                <q-input outlined v-model="summary" dense label="Summary" type="textarea" />
                <div class="q-gutter-sm">
                    <q-btn push :color="genres.includes('Action') ? 'primary' : 'dark'" label="Action" @click="toggleGenres('Action')" />
                    <q-btn push :color="genres.includes('Animation') ? 'primary' : 'dark'" label="Animation" @click="toggleGenres('Animation')" />
                    <q-btn push :color="genres.includes('Drama') ? 'primary' : 'dark'" label="Drama" @click="toggleGenres('Drama')" />
                    <q-btn push :color="genres.includes('Sci-Fi') ? 'primary' : 'dark'" label="Sci-Fi" @click="toggleGenres('Sci-Fi')" />
                    <q-btn push :color="genres.includes('Horror') ? 'primary' : 'dark'" label="Horror" @click="toggleGenres('Horror')" />
                </div>
            </div>
            <q-inner-loading
                :showing="loading"
                label="Please wait..."
                label-class="text-teal"
                label-style="font-size: 1.1em"
            />

            <q-dialog v-model="showModal" persistent transition-show="scale" transition-hide="scale">
                <q-card class="bg-red text-white" style="width: 300px">
                    <q-card-section>
                    <div class="text-h6">Something went wrong!</div>
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                        {{ errorMessage }}
                    </q-card-section>

                    <q-card-actions align="right" class="bg-white text-teal">
                    <q-btn flat label="OK" v-close-popup />
                    </q-card-actions>
                </q-card>
                </q-dialog>
        </div>
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from 'vue'
import { databases, Query, APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID } from '../lib/appwrite';

export default defineComponent({
    name: 'FormPage',
    components: {},
    data() {
        return {
            id: null,
            movie: null,
            title: "",
            director: "",
            summary: "",
            genres: [],
            loading: false,
            showModal: false,
            errorMessage: "",
        };
    },
    methods: {
        goBack() {
            this.$router.push('/');
        },
        toggleGenres(item) {
            if (this.genres.includes(item)) {
                let index = this.genres.findIndex(it => it == item);
                this.genres.splice(index, 1);
                return;
            }
            this.genres.push(item);
        },
        async getMovie() {
            this.loading = true;
            const data = await databases.getDocument(
                APPWRITE_DATABASE_ID,
                APPWRITE_COLLECTION_ID,
                this.id
            );
            this.movie = data;
            this.title = data.title;
            this.director = data.director;
            this.summary = data.summary;
            this.genres = data.genres;
            this.loading = false;
        },
        async removeMovie() {
            this.loading = true;
            const data = await databases.deleteDocument(
                APPWRITE_DATABASE_ID,
                APPWRITE_COLLECTION_ID,
                this.id
            );
            console.log(data);
            this.loading = false;
            this.goBack();
        },
        async createMovie() {
            try {
                if (!this.title) return;
                if (!this.director) return;
                this.loading = true;
                const payload = {
                    title: this.title,
                    director: this.director,
                    summary: this.summary,
                    genres: this.genres,
                }
                if (this.id) {
                    await databases.updateDocument(
                        APPWRITE_DATABASE_ID,
                        APPWRITE_COLLECTION_ID,
                        this.id,
                        payload
                    );
                } else {
                    await databases.createDocument(
                        APPWRITE_DATABASE_ID,
                        APPWRITE_COLLECTION_ID,
                        "",
                        payload
                    );
                }
                this.loading = false;
                this.goBack();
            } catch (error) {
                this.loading = false;
                console.log(error);
                this.showModal = true;
                this.errorMessage = error;
            }
        },
    },
    async created() {
        this.id = this.$route.params.id;
        if(this.id) this.getMovie();
    },
});
</script>
