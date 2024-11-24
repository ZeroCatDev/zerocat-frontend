<template>
  <v-container v-if="algolia_app_id && algolia_api_key && algolia_index_name">
    <ais-instant-search
      :search-client="searchClient"
      :index-name="algolia_index_name"
    >
      <ais-search-box
        ><template v-slot="{ isSearchStalled, refine }">
          <v-text-field
            clearable
            label="键入以搜索"
            variant="solo-filled"
            @input="refine($event.target.value)"
          >
            <template v-slot:loader>
              <v-progress-linear
                :active="isSearchStalled"
                indeterminate
              ></v-progress-linear> </template
          ></v-text-field>
        </template>
      </ais-search-box>
      <ais-hits>
        <template v-slot="{ items }">
          <v-row
            ><!--  -->
            <v-col
              cols="12"
              xs="12"
              sm="6"
              md="4"
              lg="3"
              xl="2"
              xxl="2"
              v-for="item in items"
              :key="item.objectID"
            >
              <v-card
                :to="'/projects/' + item.id"
                style="aspect-ratio: 4/3"
                rounded="lg"
              >
                <v-img
                  :src="'https://s4-1.wuyuan.1r.ink/scratch_slt/' + item.id"
                  class="align-end"
                  lazy-src="../assets/43-lazyload.png"
                  height="100%"
                  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                  cover
                >
                  <v-card-item>
                    <v-card-title>{{ item.title }}</v-card-title>
                    <v-card-subtitle>{{ item.description }}</v-card-subtitle>
                  </v-card-item>
                  <!--<v-card-text>
                    <v-chip size="small">{{ item.type }}</v-chip>
                  </v-card-text>-->
                </v-img>
                <!-- v-img 高度与 v-card-item 一致 -->
              </v-card>
            </v-col>
          </v-row>
        </template> </ais-hits
      ><v-row
        ><v-col>
          <ais-pagination>
            <template v-slot="{ currentRefinement, nbPages, refine }">
              <v-pagination
                :length="nbPages"
                rounded="circle"
                :v-model="currentRefinement"
                @update:model-value="refine($event)"
                @input="refine($event)"
              ></v-pagination> </template></ais-pagination></v-col
      ></v-row>
      <!--<br/>
<v-expansion-panels>
  <v-expansion-panel>
    <v-expansion-panel-title>高级设置</v-expansion-panel-title>
    <v-expansion-panel-text>
     <ais-hits-per-page :items="[
    { label: '8 结果每页', value: 8 },
    { label: '16 结果每页', value: 16, default: true },
    { label: '32 结果每页', value: 32 },
    { label: '64 结果每页', value: 64 },
    { label: '128 结果每页', value: 128 },
  ]">
        <template v-slot="{ items, refine }">
          <v-select value="16 结果每页" :items="items" item-title="label" item-value="value" :label="items.label"
            @update:model-value="
              refine($event);
            console.log(items);
            "></v-select>
        </template> </ais-hits-per-page>
      </v-expansion-panel-text>
  </v-expansion-panel>
</v-expansion-panels>--> </ais-instant-search
    ><br />Search by
    <v-btn
      variant="text"
      href="https://algolia.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <v-img
        src="../assets/Algolia-logo-blue.svg"
        height="1.5rem"
        width="5rem"
      ></v-img>
    </v-btn>
  </v-container>
</template>

<script>
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { useMeta } from 'vue-meta';

export default {
  setup() {
    useMeta({
      title: 'ZeroCat - Algolia Search',
      meta: [
        { name: 'description', content: 'Search projects using Algolia on ZeroCat.' },
        { name: 'keywords', content: 'ZeroCat, Algolia, search, projects' }
      ]
    });
  },
  data() {
    return {
      algolia_index_name: import.meta.env.VITE_APP_ALGOLIA_INDEX_NAME,
      algolia_app_id: import.meta.env.VITE_APP_ALGOLIA_APP_ID,
      algolia_api_key: import.meta.env.VITE_APP_ALGOLIA_API_KEY,
      searchClient: algoliasearch(
        import.meta.env.VITE_APP_ALGOLIA_APP_ID,
        import.meta.env.VITE_APP_ALGOLIA_API_KEY
      ),
    };
  },
};
</script>
