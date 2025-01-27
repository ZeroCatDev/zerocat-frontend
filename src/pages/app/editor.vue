<template>
  <v-container>
    <!-- 项目信息 -->
    <v-text-field v-model="project.id" label="项目ID"></v-text-field>
    <v-textarea v-model="project.file" label="项目文件"></v-textarea>
    <v-btn @click="savefile()">保存文件</v-btn>

    <!-- 提交信息 -->
    <v-text-field v-model="commitinfo.branch" label="分支"></v-text-field>
    <v-text-field v-model="commitinfo.message" label="提交信息"></v-text-field>
    <v-text-field v-model="commitinfo.parent_commit" label="父提交"></v-text-field>
    <v-text-field v-model="commitinfo.accessFileToken" label="文件token"></v-text-field>
    <v-btn @click="commit()">提交</v-btn>
<br/><br/>
    <!-- 获取信息 -->
    <v-btn @click="getBranchs()">获取branch信息</v-btn><v-btn @click="branches=[]">清空</v-btn>

    <!-- 分支列表 -->
    <v-list>
      <v-list-item
        v-for="item in branches"
        :key="item"
        :title="item.name"
        :subtitle="JSON.stringify(item)"
      ></v-list-item>
    </v-list>
    <br />

    <!-- 分支历史 -->
    <v-text-field v-model="branchhistorybranch" label="分支"></v-text-field>
    <v-btn @click="getbranchhistory()">获取分支提交记录信息</v-btn><v-btn @click="branchhistory=[]">清空</v-btn>
    <v-list>
      <v-list-item
        v-for="item in branchhistory"
        :key="item"
        :title="item.id"
        :subtitle="JSON.stringify(item)"
      ></v-list-item>
    </v-list>
    <v-btn @click="getprojectinfo()">获取项目信息</v-btn>

    <br /><br/>

    <!-- 项目文件 -->
    <v-text-field v-model="projectplayerbranch" label="分支"></v-text-field>
    <v-text-field v-model="projectplayerbranchid" label="分支ID"></v-text-field>
    <p>/{{ project.id }}/{{ projectplayerbranch }}/{{ projectplayerbranchid }}</p>
    <v-btn @click="getprojectfile()">获取项目文件</v-btn><br/><br/>
    <v-text-field v-model="projectplayerfileid" label="项目文件ID"></v-text-field>
    <v-text-field v-model="projectplayerfileak" label="项目文件Token"></v-text-field>
    <v-textarea v-model="projectplayer"></v-textarea>
    <v-textarea v-model="projectplayerbranchinfo"></v-textarea>


    <!-- 调试日志 -->
     <v-btn @click="debuglog=''">清空</v-btn>
    <v-list>
      <v-list-item v-for="item in debuglog.split('\n')">{{ item }}</v-list-item>
    </v-list>
    <br />
  </v-container>
</template>

<script>
import { getProjectInfo } from "@/stores/project.js";

import {
  saveFile,
  commit,
  getBranchs,
  getProjectFile,
  getBranchHistory,

} from "@/services/projectService.js";

export default {
  data() {
    return {
      project: {
        file: "",
        id: "120",
      },
      debuglog: "",
      accessFileToken: "",
      commitinfo: {
        branch: "main",
        accessFileToken: "",
        message: "commit",
        parent_commit: "main",
      },
      projectplayerbranchid: "",
      projectplayerbranch: "main",
      projectplayerfile: "",
      projectplayerfileid: "",
      projectplayerfileak: "",
      projectplayerbranchinfo: "",
      branches: [],
      projectplayer: `/scratch/embed.html?id=[id]&branch=main&ref=latest&embed=true`,
      branchhistorybranch: "main",
      branchhistory: [],
    };
  },
  methods: {
    async savefile() {
      const res = await saveFile(this.project.file);
      this.debuglog = this.debuglog + JSON.stringify(res) + "\n";
      this.commitinfo.accessFileToken = res.accessFileToken;
    },
    async commit() {
      const res = await commit(this.project.id, this.commitinfo);
      this.debuglog = this.debuglog + JSON.stringify(res) + "\n";
      this.projectplayerbranchid = res.data.id;
    },
    async getBranchs() {
      const res = await getBranchInfo(this.project.id);
      this.debuglog = this.debuglog + JSON.stringify(res) + "\n";
      this.branches = res.data;
    },
    async getprojectinfo() {
      const res = await getProjectInfo(this.project.id);
      this.debuglog = this.debuglog + JSON.stringify(res) + "\n";
    },
    async getprojectfile() {
      const res = await getProjectFile(
        this.project.id,
        this.projectplayerbranch,
        this.projectplayerbranchid
      );
      this.debuglog = this.debuglog + JSON.stringify(res.projectFileData) + "\n";
      this.projectplayerfile = res.projectFileData;
      this.projectplayerfileid = res.projectFileData.commit.commit_file;
      this.projectplayerfileak = res.projectFileData.accessFileToken;
      this.debuglog = this.debuglog + JSON.stringify(res.fileData) + "\n";
      this.projectplayer = JSON.stringify(res.fileData);
      this.projectplayerbranchinfo=JSON.stringify(res.branchInfo.data);
    },
    async getbranchhistory() {
      const res = await getBranchHistory(this.project.id, this.branchhistorybranch);
      this.debuglog = this.debuglog + JSON.stringify(res) + "\n";
      this.branchhistory = res.data;
    },
  },
};
</script>
