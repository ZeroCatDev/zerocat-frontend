<template>
  <v-container>
    <v-file-input
      id="file1"
      truncate-length="22"
      label="scratch项目1"
      :disabled="progresstext == '完成！'"
    ></v-file-input>
    <v-file-input
      id="file2"
      truncate-length="22"
      label="scratch项目2"
      :disabled="progresstext == '完成！'"
    ></v-file-input>
    <v-btn
      color="primary"
      elevation="2"
      class="mx-5"
      @click="convertFiles()"
      v-text="progresstext"
      :disabled="progresstext == '完成！'"
    ></v-btn
    ><br />
    <!--   <div class="h6" id="show"></div>-->
    <br /><br />
    <v-card
      :title="`${(final * 100).toFixed(0)}%的概率为抄袭`"
      subtitle="推测数据，请以实际为准" border
    >
      <v-row>
        <v-col cols="6">
          <v-card
            :title="name1"
            :subtitle="'素材总数' + resultjson.assets.objectAmount0"
          >
            <v-card-text>
              {{
                (
                  (resultjson.assets.objectSameAmount0 /
                    resultjson.assets.objectAmount0) *
                  100
                ).toFixed(4)
              }}%（{{ resultjson.assets.objectSameAmount0 }}/{{
                resultjson.assets.objectAmount0
              }}）的素材与右侧相同

              <br />
              {{
                ((proj0samularty / resultjson.code.code0length) * 100).toFixed(
                  4
                )
              }}%（{{ proj0samularty }}/{{
                resultjson.code.code0length
              }}）的项目树与右侧相同
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card
            :title="name2"
            :subtitle="'素材总数' + resultjson.assets.objectAmount1"
          >
            <v-card-text>
              {{
                (
                  (resultjson.assets.objectSameAmount1 /
                    resultjson.assets.objectAmount1) *
                  100
                ).toFixed(4)
              }}（{{ resultjson.assets.objectSameAmount1 }}/{{
                resultjson.assets.objectAmount1
              }}）的素材与左侧相同

              <br />
              {{
                ((proj1samularty / resultjson.code.code1length) * 100).toFixed(
                  4
                )
              }}%（{{ proj1samularty }}/{{
                resultjson.code.code1length
              }}）的项目树与左侧相同
            </v-card-text></v-card
          >
        </v-col>
      </v-row>
      <v-card-text>
        <h2>共{{ resultjson.assets.objectSameAmount1 }}条素材相同</h2>
        <h2>共{{ resultjson.code.code0.length }}条项目树相同</h2>
        相同的素材：
        <div v-for="item in resultjson.assets.objectSame0" :key="item">
          {{ item }}
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="printpage()">打印</v-btn>
      </v-card-actions> </v-card
    ><br />
    <v-card border>
      <v-card-title>关于</v-card-title>
      <v-card-subtitle>致谢~</v-card-subtitle>
      <v-card-text>
        本工具使用由<a href="https://github.com/Steve-xmh">Steve-xmh</a>开发的<a
          href="https://github.com/Steve-xmh/scratch-source-comparer"
          >scratch-source-comparer</a
        >进行比对，网页版本由<a href="https://github.com/52black">52black</a
        >制作，开源于<a
          href="https://github.com/52black/scratch-source-comparer-web"
          >Github</a
        >
        <br />在此感谢 Steve-xmh , 52black 以及这些项目的贡献者们
        <br />此版本由孙悟元制作，同ZeroCatNext一同开源于<a
          href="https://github.com/sunwuyuan/zerocatnext"
          >Github</a
        >
        <br />本项目目前使用GPLv3许可证，本项目与AGPLv3的特殊限制无关。
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useHead } from "@unhead/vue";
    useHead({
      title: '比较器',

    });

var blob1;
var blob2;
var name1 = "项目1";
var name2 = "项目2";
var name2;
var final = ref(0);
var resultjson = ref({
  assets: {
    objectSameAmount0: 0,
    objectSameAmount1: 0,
    objectAmount0: 0,
    objectAmount1: 0,
    objectSame0: [],
    objectSame1: [],
    objectSameKey0: {},
    objectSameKey1: {},
  },
  code: {
    code0length: 0,
    code1length: 0,
    code0: { same: {}, length: 0 },
    code1: { same: {}, length: 0 },
  },
});
var proj0samularty = 0;
var proj1samularty = 0;
var progresstext = ref("开始比对");
function printpage() {
  window.print();
}
async function c() {
  if (blob1 && blob2) {
    let result = await compare(blob1, blob2, (d) => {
      console.log((progresstext.value = d.text));
    });
    for (const block in result.code.code0.same) {
      if (block !== "length") {
        proj0samularty += result.code.code0.same[block].simularty;
      }
    }
    for (const block in result.code.code1.same) {
      if (block !== "length") {
        proj1samularty += result.code.code1.same[block].simularty;
      }
    }

    final.value =
      (result.assets.objectSameAmount0 / result.assets.objectAmount1) * 0.3 +
      (proj1samularty / result.code.code1length) * 0.7;
    console.log((resultjson.value = result));

    var s = `
    <br><span class="s">项目1:  </span>                                   <span class="j"> ${name1}</span>
    <br><span class="s">项目2:  </span>                                   <span class="j"> ${name2}</span>
    <br><span class="s">项目1 的相同素材总数:  </span>                   <span class="j"> ${
      result.assets.objectSameAmount0
    }</span>
    <br><span class="s">项目2 的相同素材总数:  </span>                   <span class="j"> ${
      result.assets.objectSameAmount1
    }</span>
    <br><span class="s">项目1 的素材总数:  </span>              <span class="j"> ${
      result.assets.objectAmount0
    }</span>
    <br><span class="s">项目2 的素材总数:  </span>              <span class="j"> ${
      result.assets.objectAmount1
    }</span>
    <br><span class="s">项目1 相同素材占比:  </span>            <span class="j"> ${+(
      (result.assets.objectSameAmount0 / result.assets.objectAmount0) *
      100
    ).toFixed(4)}%</span>
    <br><span class="s">项目2 相同素材占比:  </span>            <span class="j"> ${+(
      (result.assets.objectSameAmount1 / result.assets.objectAmount1) *
      100
    ).toFixed(4)}%</span>
    `;
    // for (const key in result.assets.objectSameKey0) {
    //     s += `  - <span class="j"> ${result.assets.objectSameKey0[key]}</span>`
    // }
    s += `<br><span class="s">素材相同数的总数: </span> <span class="j"> ${result.assets.objectSameAmount1}</span>
    <br><span class="s">相同列表:</span>     `;
    for (const key in result.assets.objectSameKey1) {
      s += `  - <span class="j"> ${result.assets.objectSameKey0[key]}</span>`;
    }
    s += `
    <br><span class="s">项目1 的项目树总数:  </span>            <span class="j"> ${
      result.code.code0length
    }</span>
    <br><span class="s">项目2 的项目树总数:  </span>            <span class="j"> ${
      result.code.code1length
    }</span>
    <br><span class="s">项目1 的项目树相同总数:  </span>       <span class="j"> ${
      result.code.code0.length
    }</span>
    <br><span class="s">项目2 的项目树相同总数:  </span>       <span class="j"> ${
      result.code.code1.length
    }</span>
    <br><span class="s">项目1 的项目树相同占比:  </span>    <span class="j"> ${+(
      (proj0samularty / result.code.code0length) *
      100
    ).toFixed(4)}%</span>
    <br><span class="s">项目2 的项目树相同占比:  </span>    <span class="j"> ${+(
      (proj1samularty / result.code.code1length) *
      100
    ).toFixed(4)}%</span>
    <br><span class="s">项目 抄袭可能性:  </span>                           <span class="j"> ${
      final * 100
    }%</span>`;
  }
  //document.getElementById("show").innerHTML = s;
}
function convertFiles() {
  const file1 = document.getElementById("file1").files[0];
  const file2 = document.getElementById("file2").files[0];

  const reader1 = new FileReader();
  reader1.readAsArrayBuffer(file1);
  name1 = file1.name;
  reader1.onload = async function () {
    blob1 = new Blob([reader1.result], { type: file1.type });
    console.log("Blob 1:", blob1);
    await c();
  };

  const reader2 = new FileReader();
  reader2.readAsArrayBuffer(file2);
  name2 = file2.name;
  reader2.onload = async function () {
    blob2 = new Blob([reader2.result], { type: file2.type });
    console.log("Blob 2:", blob2);
    await c();
  };
}
// 将模块链接成一个树表
function fixBlock(block, blocks) {
  if (typeof block !== "object") throw new Error("没有传入模块参数！");
  if (typeof blocks !== "object") throw new Error("没有传入模块表参数！");

  const b = new Block(block);
  if (b.next) {
    b.next = fixBlock(blocks[b.next], blocks);
    b.next.parent = b;
  }
  if (b.inputs.SUBSTACK && b.inputs.SUBSTACK[1]) {
    b.inputs.SUBSTACK[1] = fixBlock(blocks[b.inputs.SUBSTACK[1]], blocks);
    b.inputs.SUBSTACK[1].parent = b;
  } else {
    b.inputs.SUBSTACK = undefined;
  }

  if (b.inputs.SUBSTACK2 && b.inputs.SUBSTACK2[1]) {
    b.inputs.SUBSTACK2[1] = fixBlock(blocks[b.inputs.SUBSTACK2[1]], blocks);
    b.inputs.SUBSTACK2[1].parent = b;
  } else {
    b.inputs.SUBSTACK2 = undefined;
  }

  return b;
}
var ignoreMD5List = [
  "83a9787d4cb6f3b7632b4ddfebf74367",
  "83c36d806dc92327b9e7049a565c6bff",
  "cd21514d0531fdffb22204e0ec5ed84a",
  "b7853f557e4426412e64bb3da6531a99",
  "ee1c4946b2fbefa4479c1cd60653fb46",
  "d6118ccd46404fb73d4e9454d610b9ac",
  "8b8a0a49e7f5ece89ada8c069bf5a7ff",
  "547019f968041480c14ddf76113bae3d",
  "7085b3e5732e3689a4ba6a8ad98be814",
  "9e4bdaa40445a5cf843ffb031838b295",
  "b578feebd8a0bdba72e38dc61887cce1",
  "d8e8f89e256b5c131593c0919581a34f",
  "",
];
import md5 from "crypto-js/md5";
import prettydiff from "prettydiff";
prettydiff.options = {};
import JSZip from "jszip";
var jszip = JSZip;
/** @returns {Promise<void>} */
const waitTick = () => new Promise((resolve) => setTimeout(resolve, 0));

// The md5 inside this list will be ignored in compare.

class Block {
  // 传入工程模块原型创建模块对象
  constructor(protoBlock) {
    this.opcode = protoBlock.opcode;
    this.next = protoBlock.next;
    this.parent = protoBlock.parent;
    this.inputs = protoBlock.inputs;
    this.fields = protoBlock.fields;
    this.shadow = protoBlock.shadow;
    this.topLevel = protoBlock.topLevel;
    this.x = protoBlock.x;
    this.y = protoBlock.y;
  }

  get type() {
    return "steve-block";
  }
  // 转换成字符串
  toFormatedString(indent = 0) {
    let ret = `${this.topLevel ? "function " : ""}${this.opcode}()${
      this.topLevel ? "" : ";"
    }`;
    if (this.opcode === "control_if" || this.opcode === "control_if_else") {
      ret = "if(true){";
    } else if (
      this.opcode === "control_forever" ||
      this.opcode === "control_repeat" ||
      this.opcode === "control_repeat_until" ||
      this.opcode === "control_while" ||
      this.opcode === "control_for_each"
    ) {
      ret = "while(true)";
    }
    if (this.topLevel) ret += "{";
    if (this.next) {
      ret += ` ${this.next.toFormatedString(indent + 1)}`;
    }
    if (this.inputs.SUBSTACK) {
      ret += `{${this.inputs.SUBSTACK[1].toFormatedString(indent + 1)}}`;
    }
    if (this.inputs.SUBSTACK2) {
      ret += `else{${this.inputs.SUBSTACK2[1].toFormatedString(indent + 1)}}`;
    }
    if (
      this.topLevel ||
      this.opcode === "control_if" ||
      this.opcode === "control_if_else"
    )
      ret += `${"\t".repeat(indent)}}`;
    return ret;
  }
}

async function compareCode(project0, project1, progress = () => {}) {
  let total = 0;
  let cur = 0;
  async function makeCodeTree(project) {
    const array = [];
    for (const target of project.targets) {
      for (const id in target.blocks) {
        // await waitTick()
        const block = target.blocks[id];
        if (block instanceof Object && !(block instanceof Array)) {
          // Array is an independent variable
          if (
            block.opcode &&
            block.opcode.startsWith("event_") &&
            block.opcode !== "event_broadcastandwait" &&
            block.opcode !== "event_broadcast"
          ) {
            // Event hat block
            array.push({
              id,
              code: fixBlock(block, target.blocks).toFormatedString(),
            });
            total++;
            progress({
              text: `正在构建伪代码 (${total})`,
              progress: 50 + total * 0.02,
            });
          } else if (block.opcode) {
            switch (
              block.opcode // Some special hat blocks.
            ) {
              case "procedures_definition":
              case "control_start_as_clone":
                array.push({
                  id,
                  code: fixBlock(block, target.blocks).toFormatedString(),
                });
                total++;
                progress({
                  text: `正在构建伪代码 (${total})`,
                  progress: 50 + total * 0.02,
                });
                break;
              default:
            }
          }
        }
      }
    }
    return array;
  }
  async function compareTree(codeTrees0, codeTrees1) {
    const result = { same: {}, length: 0 };
    const sameObj = result.same;
    for (const tree0 of codeTrees0) {
      prettydiff.options.source = tree0.code;
      let samest = null;
      for (const tree1 of codeTrees1) {
        // await waitTick()
        let equalsLines = 0;
        let changedLine = 0;
        if (tree0.code === tree1.code) {
          sameObj[tree0.id] = {
            simularTo: tree1.id,
            code0: tree0.code,
            code1: tree1.code,
            // isEqual: true,
            simularty: 1, // They are the same
          };
          result.length++;
          break;
        } else {
          // Use prettydiff
          try {
            prettydiff.options.diff = tree1.code;
            const prettyResult = JSON.parse(prettydiff());
            prettyResult.diff.forEach((v) => {
              switch (v[0]) {
                case "=":
                  equalsLines++;
                // eslint-disable-next-line no-fallthrough
                case "+":
                case "r":
                  changedLine++;
                  break;
                case "-":
                  changedLine--;
                  break;
              }
            });
            if (
              (!samest || equalsLines / changedLine > samest.simularty) &&
              equalsLines < changedLine
            ) {
              samest = {
                simularTo: tree1.id,
                simularty: equalsLines / changedLine,
                code0: tree0.code,
                code1: tree1.code,
              };
            }
          } catch (err) {
            // console.warn(err)
            samest = null;
          }
          // console.log(prettyResult)
        }
      }
      if (!sameObj[tree0.id] && samest && samest.simularty > 0.8) {
        sameObj[tree0.id] = {
          simularTo: samest.simularTo,
          simularty: samest.simularty,
          code0: samest.code0,
          code1: samest.code1,
        };
        result.length++;
      }
      cur++;
      progress({
        text: `正在比对代码 (${cur}/${total})`,
        progress: 60 + (cur / total) * 35,
      });
    }
    return result;
  }
  const result = {};
  const codeTrees0 = await makeCodeTree(project0);
  const codeTrees1 = await makeCodeTree(project1);
  prettydiff.options.diff_format = "json";
  result.code0length = codeTrees0.length;
  result.code1length = codeTrees1.length;
  result.code0 = await compareTree(codeTrees0, codeTrees1);
  result.code1 = await compareTree(codeTrees1, codeTrees0);
  // console.log(codeTrees0[0])
  return result;
}

/**
 * Compare the same between two objects
 * @param {Object} o0 First object
 * @param {Array<any>} o1 Second object
 * @param {Hash} h0 Second object
 * @param {Object<string,Hash>} h1 Second object
 * @returns {Promise<{o0:number,o1:number,o0l:number,o1l:number}>} The result
 */
async function compareAssets({ o0, o1, h0, h1, progress = () => {} }) {
  console.log(o0, o1);
  const result = {
    objectSameAmount0: 0,
    objectSameAmount1: 0,
    objectAmount0: 0,
    objectAmount1: 0,
    objectSame0: [],
    objectSame1: [],
    objectSameKey0: {},
    objectSameKey1: {},
  };

  for (const okey in o0) {
    // console.log(okey)
    const item = okey;
    result.objectAmount0++;
    if (ignoreMD5List.indexOf(item) !== -1) continue;
    for (const key in o1) {
      // await waitTick()
      const comp = key;
      if (comp == item) {
        result.objectSame0.push(item);
        result.objectSameKey0[item] = okey;
        result.objectSameAmount0++;
        break;
      }
    }
  }
  for (const okey in o1) {
    // console.log(okey)
    const item = okey;
    result.objectAmount1++;
    if (ignoreMD5List.indexOf(item) !== -1) continue;
    for (const key in o0) {
      // await waitTick()
      const comp = key;
      if (comp == item) {
        result.objectSame1.push(item);
        result.objectSameKey1[item] = okey;
        result.objectSameAmount1++;
        break;
      }
    }
  }
  return result;
}

async function transferSb2IfNeed(proj) {
  // const projJSON = JSON.parse(await proj.file('project.json').async('string'))
  // if (projJSON.objName !== undefined) {
  //     const vm = new VisualMachine()
  //     await vm.loadProject(projJSON)
  //     proj.file('project.json', vm.toJSON())
  //     return jszip.loadAsync(vm.saveProjectSb3())
  // }
}

/**
 * Compare two project, return a result object.
 * @param {Buffer|ArrayBuffer|String|Blob|ReadableStream} project0 The project to compare.
 * @param {Buffer|ArrayBuffer|String|Blob|ReadableStream} project1 The project to be compared.
 * @param {Function} progress A function which will be invoked while comparing, taking a progress message as an argument.
 * @returns {Promise<Object>} The result.
 */
async function compare(project0, project1, progress = () => {}) {
  progress({ text: "正在转换工程版本", progress: 0 });
  // minilog.disable()
  const [zip0, zip1] = await Promise.all([
    jszip.loadAsync(project0),
    jszip.loadAsync(project1),
  ]);
  transferSb2IfNeed(zip0);
  transferSb2IfNeed(zip1);
  progress({ text: "正在打开", progress: 0 });
  const md50 = {};
  const md51 = {};
  const imgHash0 = {};
  const imgHash1 = {};
  const threads = [];
  const result = {};
  let fileTotal = 0;
  let fileLoaded = 0;
  /**
   * Collect file hash from zip.
   * @param {jszip} zip The JSZip Object contains file.
   * @param {Array} array An array object stores hashes.
   */
  function collectHash(zip, array) {
    zip.forEach((rpath, file) => {
      if (rpath === "project.json") return;
      fileTotal++;
      threads.push(
        (async () => {
          const data = await file.async("uint8array");
          const hash = md5(data);
          if (ignoreMD5List.indexOf(hash) === -1) {
            if (rpath.endsWith(".png")) {
              array[rpath] = md5(data);
            } else {
              array[rpath] = md5(data);
            }
            await waitTick();
          }
          fileLoaded++;
          progress({
            text: `收集资源文件中 (${fileLoaded}/${fileTotal})`,
            progress: 5 + (fileLoaded / fileTotal) * 30,
          });
          // }
        })()
      );
    });
  }

  collectHash(zip0, md50, imgHash0);
  collectHash(zip1, md51, imgHash1);
  await Promise.all(threads);
  console.log(md50, md51);
  progress({ text: "对比资源文件中", progress: 35 });
  result.assets = await compareAssets({
    o0: md50,
    o1: md51,
    h0: imgHash0,
    h1: imgHash1,
    progress,
  });
  // debugger;
  progress({ text: "分析代码中", progress: 50 });
  const [projectJson0, projectJson1] = await Promise.all([
    (async () => JSON.parse(await zip0.file("project.json").async("string")))(),
    (async () => JSON.parse(await zip1.file("project.json").async("string")))(),
  ]);
  result.code = await compareCode(projectJson0, projectJson1, progress);
  progress({ text: "完成！", progress: 1 });
  return result;
}

// module.exports = compare
</script>
