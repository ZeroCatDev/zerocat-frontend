<template><v-progress-linear :active="ProjectsLoading" height="4" indeterminate></v-progress-linear>
    <div class="mb-2" v-if="showinfo == true || showinfo == 'true'">
        <v-chip><v-icon icon="mdi-counter" start></v-icon>共{{
            this.projectscount
        }}个作品
        </v-chip>
        <v-chip><v-icon icon="mdi-clock" start></v-icon>本页加载用时{{
            Math.abs(usetime / 1000)
        }}秒
        </v-chip>
    </div>
    <ProjectsCards :projects="projects" :actions='actions'></ProjectsCards>

    <v-pagination v-model="curPage" :length="totalPage" rounded="circle" :v-model="curPage"
        @update:model-value="onPageChange(curPage)" @input="onPageChange(curPage)"></v-pagination>
</template>

<script>
import request from "../axios/axios";
import ProjectsCards from "./ProjectsCards.vue";
export default {
    components: { ProjectsCards },
    props: {
        authorid: {
            type: String,
            default: "",
        },
        title: {
            type: String,
            default: "",
        },
        type: {
            type: String,
            default: "",
        },
        description: {
            type: String,
            default: "",
        },
        order: {
            type: String,
            default: "view_down",
        },
        source: {
            type: String,
            default: "",
        },
        state: {
            type: String,
            default: "",
        },
        tag: {
            type: String,
            default: '',
        },
        showinfo: {
            type: String,
            default: false,
        },
        actions: {
            type: Array,
            required: false
        }
    },

    data() {
        return {
            ProjectsLoading: false,
            projects: [],
            curPage: 1,
            totalPage: 1,
            limit: 8,
            typeitems: { all: "", scratch: "scratch", python: "python" },
            usetime: 0,
            projectscount: 0,
            search: {
                title: "",
                type: "",
                description: "",
                source: "",
                order: { name: "观看量升序", type: "view_up" },
                authorid: "",
                type: { name: "所有", type: "" },
                typeitems: [
                    { name: "所有", type: "" },
                    { name: "Scratch", type: "scratch" },
                    { name: "Python", type: "python" },
                ],
                orderitems: [
                    { name: "观看量升序", type: "view_up" },
                    { name: "观看量降序", type: "view_down" },
                    { name: "时间升序", type: "time_up" },
                    { name: "时间降序", type: "time_down" },
                    { name: "序号升序", type: "id_up" },
                    { name: "序号降序", type: "id_down" },
                ],
                state: ''
            },
        };
    },
    async created() {
        await this.getprojects();


    },
    methods: {
        async getprojects() {
            this.onPageChange(1);
        },
        async onPageChange(page) {
            this.usetime = Date.now();
            this.ProjectsLoading = true

            this.projects = await request({
                url: `/searchapi?search_userid=${this.authorid}&search_type=${this.type == "all" ? "" : this.type
                    }&search_title=${this.title}&search_source=${this.source
                    }&search_description=${this.description}&search_orderby=${this.order
                    }&search_state=${this.state}&search_tag=${this.tag}&curr=${page}&limit=${this.limit}`,
                method: "get",
            });
            this.totalPage = Math.ceil(
                this.projects.totalCount[0].totalCount / this.limit
            );
            this.projectscount = this.projects.totalCount[0].totalCount;
            this.curPage = page;
            console.log(this.projects);
            console.log(this.totalPage);
            this.ProjectsLoading = false
            this.usetime = Date.now() - this.usetime;
        },
    },
};
</script>
