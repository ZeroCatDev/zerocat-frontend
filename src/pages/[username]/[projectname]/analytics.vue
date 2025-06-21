<template>
  <div>
    <v-container>
      <!-- Overview Cards -->
      <v-row>
        <v-col cols="12" sm="6" md="2.4">
          <v-card>
            <v-card-text>
              <div class="text-subtitle-2 mb-1">浏览量</div>
              <div class="text-h5">{{ analytics?.overview?.pageviews?.value || 0 }}</div>
              <v-chip
                :color="getGrowthColor(analytics?.overview?.pageviews?.value, analytics?.overview?.pageviews?.prev)"
                size="small"
                class="mt-2"
              >
                {{ calculateGrowth(analytics?.overview?.pageviews?.value, analytics?.overview?.pageviews?.prev) }}%
              </v-chip>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="2.4">
          <v-card>
            <v-card-text>
              <div class="text-subtitle-2 mb-1">访客数</div>
              <div class="text-h5">{{ analytics?.overview?.visitors?.value || 0 }}</div>
              <v-chip
                :color="getGrowthColor(analytics?.overview?.visitors?.value, analytics?.overview?.visitors?.prev)"
                size="small"
                class="mt-2"
              >
                {{ calculateGrowth(analytics?.overview?.visitors?.value, analytics?.overview?.visitors?.prev) }}%
              </v-chip>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="2.4">
          <v-card>
            <v-card-text>
              <div class="text-subtitle-2 mb-1">访问次数</div>
              <div class="text-h5">{{ analytics?.overview?.visits?.value || 0 }}</div>
              <v-chip
                :color="getGrowthColor(analytics?.overview?.visits?.value, analytics?.overview?.visits?.prev)"
                size="small"
                class="mt-2"
              >
                {{ calculateGrowth(analytics?.overview?.visits?.value, analytics?.overview?.visits?.prev) }}%
              </v-chip>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="2.4">
          <v-card>
            <v-card-text>
              <div class="text-subtitle-2 mb-1">跳出率</div>
              <div class="text-h5">{{ calculateBounceRate(analytics?.overview?.bounces?.value, analytics?.overview?.visits?.value) }}%</div>
              <v-chip
                :color="getGrowthColor(analytics?.overview?.bounces?.value, analytics?.overview?.bounces?.prev, true)"
                size="small"
                class="mt-2"
              >
                {{ calculateGrowth(analytics?.overview?.bounces?.value, analytics?.overview?.bounces?.prev) }}%
              </v-chip>
            </v-card-text>
          </v-card>
        </v-col>


      </v-row>

      <!-- Chart -->
      <v-row class="mt-4">
        <v-col cols="12">
          <v-card>
            <v-card-text>
              <div class="d-flex justify-space-between align-center mb-4">
                <div class="text-h6">访问趋势</div>
                <v-select
                  v-model="timeRange"
                  :items="timeRanges"
                  density="compact"
                  hide-details
                  class="w-25"
                ></v-select>
              </div>
              <v-chart v-if="analytics?.timeseries?.pageviews?.length > 0" class="chart" :option="chartOption" autoresize />
              <div v-else class="d-flex justify-center align-center chart">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Statistics Tables -->
      <v-row class="mt-4">
        <v-col cols="12" md="4">
          <v-card>
            <v-card-text>
              <div class="text-h6 mb-4">来源域名</div>
              <v-table density="compact">
                <thead>
                  <tr>
                    <th>域名</th>
                    <th class="text-right">访问次数</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in analytics?.referrers || []" :key="index">
                    <td>{{ item?.x || '未知' }}</td>
                    <td class="text-right">{{ item?.y || 0 }}</td>
                  </tr>
                  <tr v-if="!analytics?.referrers?.length">
                    <td colspan="2" class="text-center">暂无数据</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card>
            <v-card-text>
              <div class="text-h6 mb-4">浏览器</div>
              <v-table density="compact">
                <thead>
                  <tr>
                    <th>浏览器</th>
                    <th class="text-right">使用次数</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in analytics?.browsers || []" :key="index">
                    <td>{{ formatBrowserName(item?.x) || '未知' }}</td>
                    <td class="text-right">{{ item?.y || 0 }}</td>
                  </tr>
                  <tr v-if="!analytics?.browsers?.length">
                    <td colspan="2" class="text-center">暂无数据</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card>
            <v-card-text>
              <div class="text-h6 mb-4">操作系统</div>
              <v-table density="compact">
                <thead>
                  <tr>
                    <th>系统</th>
                    <th class="text-right">使用次数</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in analytics?.os || []" :key="index">
                    <td>{{ item?.x || '未知' }}</td>
                    <td class="text-right">{{ item?.y || 0 }}</td>
                  </tr>
                  <tr v-if="!analytics?.os?.length">
                    <td colspan="2" class="text-center">暂无数据</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12" md="6">
          <v-card>
            <v-card-text>
              <div class="text-h6 mb-4">设备类型</div>
              <v-table density="compact">
                <thead>
                  <tr>
                    <th>类型</th>
                    <th class="text-right">使用次数</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in analytics?.devices || []" :key="index">
                    <td>{{ formatDeviceType(item?.x) || '未知' }}</td>
                    <td class="text-right">{{ item?.y || 0 }}</td>
                  </tr>
                  <tr v-if="!analytics?.devices?.length">
                    <td colspan="2" class="text-center">暂无数据</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card>
            <v-card-text>
              <div class="text-h6 mb-4">国家/地区</div>
              <v-table density="compact">
                <thead>
                  <tr>
                    <th>国家/地区</th>
                    <th class="text-right">访问次数</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in analytics?.countries || []" :key="index">
                    <td>{{ formatCountryName(item?.x) || '未知' }}</td>
                    <td class="text-right">{{ item?.y || 0 }}</td>
                  </tr>
                  <tr v-if="!analytics?.countries?.length">
                    <td colspan="2" class="text-center">暂无数据</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { use404Helper } from '@/composables/use404';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';
import VChart from 'vue-echarts';
import { getProjectAnalytics, getProjectInfoByNamespace } from '@/services/projectService';
import axios from '@/axios/axios';
use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
]);

export default {
  components: {
    VChart,
  },
  data() {
    return {
      project: {
        id: null,
      },
      analytics: {
        overview: {
          pageviews: { value: 0, prev: 0 },
          visitors: { value: 0, prev: 0 },
          visits: { value: 0, prev: 0 },
          bounces: { value: 0, prev: 0 },
          totaltime: { value: 0, prev: 0 }
        },
        referrers: [],
        browsers: [],
        os: [],
        devices: [],
        countries: [],
        timeseries: {
          pageviews: [],
          sessions: [],
        },
      },
      timeRange: '24h',
      timeRanges: [
        { title: '最近 24 小时', value: '24h' },
        { title: '最近 7 天', value: '7d' },
        { title: '最近 30 天', value: '30d' },
        { title: '本月', value: 'this-month' },
        { title: '上月', value: 'last-month' },
      ],
    };
  },
  computed: {
    chartOption() {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: (params) => {
            const date = new Date(params[0].axisValue);
            const formattedDate = this.formatDate(date);
            let result = `${formattedDate}<br/>`;
            // 反转参数数组以保持与图表显示顺序一致
            params.reverse().forEach(param => {
              result += `${param.seriesName}: ${param.value}<br/>`;
            });
            return result;
          }
        },
        legend: {
          data: ['浏览量', '访客数']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.analytics.timeseries.pageviews.map(item => item.x),
          axisLabel: {
            formatter: (value) => {
              const date = new Date(value);
              if (this.timeRange === '24h') {
                return `${date.getHours()}:00`;
              } else {
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }
            }
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '访客数',
            type: 'bar',
            data: this.analytics.timeseries.sessions.map(item => item.y),
            itemStyle: {
              color: 'rgb(25, 118, 210)'  // 深蓝色
            },
            barGap: '-100%',  // 让两个柱子重叠
            barWidth: '60%',  // 控制柱子宽度
            z: 1  // 确保在下层显示
          },
          {
            name: '浏览量',
            type: 'bar',
            data: this.analytics.timeseries.pageviews.map(item => item.y),
            itemStyle: {
              color: 'rgba(25, 118, 210, 0.3)'  // 更浅的蓝色，更透明
            },
            barWidth: '60%',  // 控制柱子宽度
            z: 2  // 确保在上层显示
          }
        ]
      };
    },
  },
  methods: {
    getDateRange(range) {
      const now = new Date();
      const endDate = new Date(now);
      let startDate = new Date(now);

      switch (range) {
        case '24h':
          startDate.setHours(startDate.getHours() - 24);
          break;
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case 'this-month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'last-month':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          endDate = new Date(now.getFullYear(), now.getMonth(), 0);
          break;
        default:
          startDate.setHours(startDate.getHours() - 24);
      }

      // 格式化日期为 ISO 字符串
      return {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };
    },
    async initializeProject() {
      try {
        const username = this.$route.params.username;
        const projectname = this.$route.params.projectname;

        // 获取项目信息
        const projectInfo = await getProjectInfoByNamespace(username, projectname);
        if (!projectInfo || projectInfo.id === 0) {
          use404Helper.show404();
          return;
        }

        this.project = projectInfo;
        // 获取项目ID后加载分析数据
        await this.fetchAnalytics();
      } catch (error) {
        console.error('Failed to initialize project:', error);
        use404Helper.show404();
      }
    },
    async fetchAnalytics() {
      try {
        const projectId = this.project?.id;
        if (!projectId) return;

        const { startDate, endDate } = this.getDateRange(this.timeRange);
        const response = await getProjectAnalytics(projectId, startDate, endDate);
        if (response.status === 'success') {
          this.analytics = response.data;
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    },
    calculateGrowth(current, previous) {
      if (!previous) return 0;
      return Math.round(((current - previous) / previous) * 100);
    },
    getGrowthColor(current, previous, inverse = false) {
      if (!previous) return 'grey';
      const growth = this.calculateGrowth(current, previous);
      const isPositive = growth > 0;
      return inverse ? (!isPositive ? 'success' : 'error') : (isPositive ? 'success' : 'error');
    },
    calculateBounceRate(bounces, visits) {
      if (!visits) return 0;
      return Math.round((bounces / visits) * 100);
    },
    formatDuration(seconds) {
      if (!seconds || isNaN(seconds)) return '0m 0s';
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.round(seconds % 60);
      return `${minutes}m ${remainingSeconds}s`;
    },
    formatBrowserName(name) {
      const names = {
        'edge-chromium': 'Edge',
        'chrome': 'Chrome',
      };
      return names[name] || name;
    },
    formatDeviceType(type) {
      const types = {
        'desktop': '桌面端',
        'mobile': '移动端',
        'tablet': '平板',
      };
      return types[type] || type;
    },
    formatCountryName(code) {
      const countries = {
        'HK': '中国香港',
        'CN': '中国大陆',
        'US': '美国',
      };
      return countries[code] || code;
    },
    formatDate(date) {
      if (this.timeRange === '24h') {
        return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:00`;
      } else {
        return `${date.getMonth() + 1}月${date.getDate()}日`;
      }
    },
  },
  async mounted() {
    await this.initializeProject();
  },
  watch: {
    timeRange: {
      handler() {
        this.fetchAnalytics();
      },
    },
  },
};
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>
