<template>
  <section class="content dashboard">
    <!--<div class="callout callout-info">-->
    <!--<h4>Tip!</h4>-->

    <!--<p>Add the layout-top-nav class to the body tag to get this layout. This feature can also be used with a-->
    <!--sidebar! So use this class if you want to remove the custom dropdown menus from the navbar and use regular-->
    <!--links instead.</p>-->
    <!--</div>-->

    <!-- Main row -->

    <div class="row">
      <div class="col-lg-6 col-lg-offset-3">
        <!-- VIDEO PROGRESS -->
        <box
          :classes="['box-success']"
          :can-collapse="true"
          :can-close="true"
          :disable-footer="true"
          :header-border="true"
          :no-padding="true"
        >
          <div slot="header">
            <h3 class="box-title">Video Progress</h3>
          </div>
          <!-- /box-header -->

          <div slot="body">
            <div class="chart-responsive">
              <div v-if="!segmentStatsLoading">
                <div class="row">
                  <div class="col-lg-6 text-center">
                    <h3>Finished: {{ segmentStats[0].videosCompleted }}</h3>
                  </div>
                  <div class="col-lg-6 text-center">
                    <h3>Total: {{ segmentStats[0].totalVideos }}</h3>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-12 text-center">
                    <h2>
                      Completion:
                      {{
                        Math.round(
                          (segmentStats[0].videosCompleted / segmentStats[0].totalVideos) * 100
                        )
                      }}%
                    </h2>
                  </div>
                </div>
              </div>
              <div class="text-center">
                <canvas id="videoProgressGuage" class="progress-guage" />
              </div>
            </div>
          </div>
          <!-- /box-body -->

          <div v-if="segmentStatsLoading" class="overlay">
            <i class="fa"><pulse-loader /></i>
          </div>
          <!-- /.overlay -->
        </box>
        <!-- /VIDEO PROGRESS -->
      </div>
    </div>
    <div class="row">
      <!-- Left col -->
      <div class="col-lg-8">
        <!-- SEGMENTS CREATED -->
        <box
          :classes="['box-warning']"
          :can-collapse="true"
          :can-close="true"
          :disable-footer="true"
          :header-border="true"
          :no-padding="true"
        >
          <div slot="header">
            <h3 class="box-title">Segments Created</h3>
          </div>
          <!-- /box-header -->

          <div slot="body">
            <div class="chart-responsive">
              <canvas id="segmentsCreatedChart" />
            </div>
          </div>
          <!-- /box-body -->

          <div v-if="segmentStatsLoading" class="overlay">
            <i class="fa"><pulse-loader /></i>
          </div>
          <!-- /.overlay -->
        </box>
        <!-- /SEGMENTS CREATED -->

        <!-- HOURS PROCESSED -->
        <box
          :classes="['box-success']"
          :can-collapse="true"
          :can-close="true"
          :disable-footer="true"
          :header-border="true"
          :no-padding="true"
        >
          <div slot="header">
            <h3 class="box-title">Video Hours Processed</h3>
          </div>
          <!-- /box-header -->

          <div slot="body">
            <div class="chart-responsive">
              <canvas id="hoursProcessedChart" />
            </div>
          </div>
          <!-- /box-body -->

          <div v-if="segmentStatsLoading" class="overlay">
            <i class="fa"><pulse-loader /></i>
          </div>
          <!-- /.overlay -->
        </box>
        <!-- /SEGMENTS CREATED -->

        <!-- /.row -->
      </div>
      <!-- /.col -->

      <!-- Right col -->
      <div class="col-lg-4">
        <!-- BROWSER USAGE -->
        <box
          :classes="['box-default']"
          :can-collapse="true"
          :can-close="true"
          :disable-footer="true"
          :header-border="true"
          :no-padding="true"
        >
          <div slot="header">
            <h3 class="box-title">Browser Usage</h3>
          </div>
          <!-- /box-header -->

          <div slot="body">
            <div class="chart-responsive">
              <canvas id="pieChart" height="185px" />
            </div>
          </div>
          <!-- /box-body -->

          <div v-if="adminStatsLoading" class="overlay">
            <i class="fa"><pulse-loader /></i>
          </div>
          <!-- /.overlay -->
        </box>
        <!-- /BROWSER USAGE -->

        <!-- INFO BANNERS -->
        <div>
          <div class="small-box bg-red">
            <div class="inner">
              <h3>{{ adminStats.userCount }}</h3>

              <p>User Registrations</p>
            </div>
            <div class="icon">
              <i class="ion ion-person-add" />
            </div>
            <a v-tooltip="'Coming Soon!'" href="#" class="small-box-footer">
              More info <i class="fa fa-arrow-circle-right" />
            </a>
          </div>
          <!-- /.small box -->

          <div class="small-box bg-green">
            <div class="inner">
              <h3>{{ adminStats.messageCount }}</h3>

              <p>Messages Sent</p>
            </div>
            <div class="icon">
              <i class="fa fa-comments-o" />
            </div>
            <a v-tooltip="'Coming Soon!'" href="#" class="small-box-footer">
              More info <i class="fa fa-arrow-circle-right" />
            </a>
          </div>
          <!-- /.small box -->

          <div class="small-box bg-aqua">
            <div class="inner">
              <h3>{{ adminStats.imageCount }}</h3>

              <p>Images Uploaded</p>
            </div>
            <div class="icon">
              <i class="ion ion-images" />
            </div>
            <a v-tooltip="'Coming Soon!'" href="#" class="small-box-footer">
              More info <i class="fa fa-arrow-circle-right" />
            </a>
          </div>
          <!-- /.small box -->

          <div class="small-box bg-yellow">
            <div class="inner">
              <h3>{{ adminStats.documentCount }}</h3>

              <p>Documents Created</p>
            </div>
            <div class="icon">
              <i class="ion ion-document" />
            </div>
            <a v-tooltip="'Coming Soon!'" href="#" class="small-box-footer">
              More info <i class="fa fa-arrow-circle-right" />
            </a>
          </div>
          <!-- /.small box -->
        </div>
        <!-- /INFO BANNERS -->
      </div>
      <!-- /.col -->
    </div>
    <!-- /.row -->

    <div class="row">
      <div class="col-lg-12 col-xs-12">
        <!-- USERS LIST -->
        <box
          :classes="['box-danger']"
          :can-collapse="true"
          :can-close="true"
          :disable-footer="false"
          :header-border="true"
          :no-padding="true"
        >
          <div slot="header">
            <h3 class="box-title">Latest Members</h3>
          </div>
          <!-- /box-header -->

          <span slot="box-tools">
            <!--<span class="label label-danger">8 New Members</span>-->
          </span>
          <!-- /box-tools -->

          <div slot="body">
            <ul class="users-list clearfix">
              <li v-for="user in newMembers" :key="user._id">
                <img :src="user.profileImageUrl" alt="User Image" />

                <router-link :to="'/members/' + user._id">
                  <a class="users-list-name" href="#">{{ getName(user) }}</a>
                </router-link>

                <span class="users-list-date">{{ user.createdAt | moment('D MMM') }}</span>
              </li>
            </ul>
            <!-- /.users-list -->
          </div>
          <!-- /box-body -->

          <div slot="footer" class="text-center">
            <router-link
              v-permission.enable="['user', 'readUser']"
              tag="a"
              class="pageLink uppercase"
              to="/members"
            >
              View All Members
            </router-link>
          </div>
          <!-- /box-footer -->

          <div v-if="newMembersLoading" class="overlay">
            <i class="fa"><pulse-loader /></i>
          </div>
          <!-- /.overlay -->
        </box>
        <!-- /USERS LIST -->

        <!-- VISITOR MAP -->
        <box
          :classes="['box-success']"
          :can-collapse="true"
          :can-close="true"
          :disable-footer="true"
          :header-border="true"
          :no-padding="true"
        >
          <div slot="header">
            <h3 class="box-title">Visitors Report</h3>
          </div>
          <!-- /box-header -->

          <div slot="body">
            <div class="row">
              <div class="col-md-9 col-sm-8">
                <div class="pad">
                  <!-- Map will be created here -->
                  <visitor-map v-if="!adminStatsLoading" :stats="adminStats" />
                </div>
              </div>
              <!--  /.col -->
              <div class="col-md-3 col-sm-4">
                <!-- small box -->
                <div class="small-box bg-green visitor-box">
                  <div class="inner text-center">
                    <h3>{{ adminStats.visitorCount }}</h3>

                    <p>Visitors</p>
                  </div>
                  <div class="icon text-center">
                    <i class="ion ion-mouse" />
                  </div>
                </div>
              </div>
              <!--  /.col -->
            </div>
          </div>
          <!-- /box-body -->

          <div v-if="adminStatsLoading" class="overlay">
            <i class="fa"><pulse-loader /></i>
          </div>
          <!-- /.overlay -->
        </box>
        <!-- /VISITOR MAP -->
      </div>
      <!-- /.col -->
    </div>
    <!-- /.row -->
  </section>
</template>

<script>
import faker from 'faker';

import VisitorMap from '../../utilities/VisitorMap.vue';

import { statsService } from '../../../services';

export default {
  name: 'Dashboard',
  components: {
    VisitorMap,
  },
  data() {
    return {
      newMembers: {},
      client: null,
      adminStats: {},
      adminStatsLoading: true,
      segmentStats: [],
      segmentStatsLoading: true,
    };
  },
  computed: {},
  created() {
    this.getNewMembers();
    this.getDashboardStats();
    this.getSegmentStats();
  },
  mounted() {
    //      $('.sparkbar').each(function () {
    //        var $this = $(this)
    //        $this.sparkline('html', {
    //          type    : 'bar',
    //          height  : $this.data('height') ? $this.data('height') : '30',
    //          barColor: $this.data('color')
    //        })
    //      })
  },
  methods: {
    avatar() {
      return faker.image.avatar();
    },
    getName(user) {
      if (user._id === this.$store.state.auth.user._id) {
        return 'You';
      } else {
        return user.firstName + ' ' + user.lastName;
      }
    },
    getNewMembers() {
      this.newMembersLoading = true;
      this.$userRepository
        .list({ $sort: ['-createdAt'], $limit: 8 })
        .then(result => {
          this.newMembersLoading = false;
          this.newMembers = result.data.docs;
        })
        .catch(error => {
          this.newMembersLoading = false;
          console.error('Dashboard.getNewMembers-error:', error);
          this.$snotify.error('Get new members failed', 'Error!');
        });
    },
    getDashboardStats() {
      this.adminStatsLoading = true;
      statsService
        .getDashboardStats()
        .then(result => {
          this.adminStats = result;
          this.createPieChart();
          this.adminStatsLoading = false;
        })
        .catch(error => {
          this.adminStatsLoading = false;
          console.error('Dashboard.getDashboardStats-error:', error);
          this.$snotify.error('Get adminStats failed', 'Error!');
        });
    },
    getSegmentStats() {
      this.segmentStatsLoading = true;
      statsService
        .getSegmentStats()
        .then(result => {
          this.segmentStats = result;
          this.createSegmentCharts();
          this.createVideoProgressChart();
          this.segmentStatsLoading = false;
        })
        .catch(error => {
          this.segmentStatsLoading = false;
          console.error('Dashboard.getDashboardStats-error:', error);
          this.$snotify.error('Get segment stats failed', 'Error!');
        });
    },
    createPieChart() {
      // -------------
      // - PIE CHART -
      // -------------
      // Get context with jQuery - using jQuery's .get() method.
      let browsers = [];
      let visitors = [];
      let other = [];
      for (let browser in this.adminStats.totalVisitorsPerBrowser) {
        browsers.push(browser);
        visitors.push(this.adminStats.totalVisitorsPerBrowser[browser]);
      }

      // eslint-disable-next-line no-undef
      var pieChartCanvas = $('#pieChart');

      // 1) combine the arrays:
      let charData = [];
      for (var j = 0; j < visitors.length; j++)
        charData.push({ visitor: visitors[j], browser: browsers[j] });

      // 2) sort:
      charData.sort(function(a, b) {
        return a.visitor < b.visitor ? 1 : a.visitor === b.visitor ? 0 : -1;
      });

      // 3) separate them back out:
      for (var k = 0; k < charData.length; k++) {
        visitors[k] = charData[k].visitor;
        browsers[k] = charData[k].browser;
      }

      const backgroundColor = ['#f56954', '#00a65a', '#f39c12', '#00c0ef', '#3c8dbc', '#d2d6de'];

      const maxChartSize = backgroundColor.length - 1;

      if (visitors.length > maxChartSize) {
        other = visitors.slice(maxChartSize, visitors.length - 1);
        visitors = visitors.slice(0, maxChartSize);
        browsers = browsers.slice(0, maxChartSize);

        visitors.push(other.reduce((prev, curr) => prev + curr));
        browsers.push('Other');
      }

      let data = {
        datasets: [
          {
            data: visitors,
            //            backgroundColor: color
            backgroundColor,
          },
        ],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: browsers,
      };

      // eslint-disable-next-line no-undef
      new Chart(pieChartCanvas, {
        // eslint-disable-line no-new
        type: 'doughnut',
        data: data,
      });
      // -----------------
      // - END PIE CHART -
      // -----------------
    },
    createVideoProgressChart() {
      var opts = {
        angle: 0, // The span of the gauge arc
        lineWidth: 0.2, // The line thickness
        radiusScale: 1, // Relative radius
        pointer: {
          length: 0.54, // // Relative to gauge radius
          strokeWidth: 0.053, // The thickness
          color: '#000000', // Fill color
        },
        limitMax: false, // If false, max value increases automatically if value > maxValue
        limitMin: false, // If true, the min value of the gauge will be fixed
        colorStart: '#6FADCF', // Colors
        colorStop: '#8FC0DA', // just experiment with them
        strokeColor: '#E0E0E0', // to see which ones work best for you
        generateGradient: true,
        highDpiSupport: true, // High resolution support
        staticLabels: {
          font: '10px sans-serif', // Specifies font
          labels: [
            160,
            320,
            480,
            640,
            this.segmentStats[0].videosCompleted,
            this.segmentStats[0].totalVideos,
          ], // Print labels at these values
          color: '#000000', // Optional: Label text color
          fractionDigits: 0, // Optional: Numerical precision. 0=round off.
        },
        staticZones: [
          { strokeStyle: '#ff0202', min: 0, max: 160, height: 0.6 }, // Red from 100 to 60
          { strokeStyle: '#c86400', min: 160, max: 320, height: 0.8 }, // Yellow
          { strokeStyle: '#969600', min: 320, max: 480, height: 1.0 }, // Green
          { strokeStyle: '#64c803', min: 480, max: 640, height: 1.2 }, // Yellow
          { strokeStyle: '#00ff06', min: 640, max: this.segmentStats[0].totalVideos, height: 1.4 }, // Red
        ],
      };
      var target = document.getElementById('videoProgressGuage'); // your canvas element
      // eslint-disable-next-line no-undef
      var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
      gauge.maxValue = this.segmentStats[0].totalVideos; // set max gauge value
      gauge.setMinValue(0); // Prefer setter over gauge.minValue = 0
      gauge.animationSpeed = 50; // set animation speed (32 is default value)
      gauge.set(this.segmentStats[0].videosCompleted); // set actual value
    },
    createSegmentCharts() {
      // Get context with jQuery - using jQuery's .get() method.
      const segmentsCreatedData = this.segmentStats.map(s => {
        return { x: new Date(s.createdAt), y: s.segmentsCreated };
      });

      const hoursProcessedData = this.segmentStats.map(s => {
        return { x: new Date(s.createdAt), y: s.hoursProcessed };
      });

      // eslint-disable-next-line no-undef
      var segmentsCreatedChartCanvas = $('#segmentsCreatedChart');
      // eslint-disable-next-line no-undef
      var hoursProcessedChartCanvas = $('#hoursProcessedChart');

      let data = {
        datasets: [
          {
            data: segmentsCreatedData,
            fill: true,
            label: 'Segments Created',
            borderColor: '#fe8b36',
            backgroundColor: '#fe8b36',
            lineTension: 0,
            pointRadius: 0,
            showLine: true,
            pointHoverBackgroundColor: '#ffffff',
            pointHoverRadius: '7',
          },
        ],
      };

      // eslint-disable-next-line no-undef
      new Chart(segmentsCreatedChartCanvas, {
        // eslint-disable-line no-new
        type: 'line',
        data: data,
        options: {
          tooltips: {
            mode: 'x-axis',
            intersect: false,
          },
          hover: {
            mode: 'x-axis',
            intersect: false,
          },
          scales: {
            xAxes: [
              {
                type: 'time',
                time: {
                  unit: 'day',
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Segments',
                },
              },
            ],
          },
        },
      });

      data = {
        datasets: [
          {
            data: hoursProcessedData,
            fill: true,
            label: 'Hours Processed',
            borderColor: '#00a65a',
            backgroundColor: '#00a65a',
            lineTension: 0,
            pointRadius: 0,
            showLine: true,
            pointHoverBackgroundColor: '#ffffff',
            pointHoverRadius: '7',
          },
        ],
      };

      // eslint-disable-next-line no-undef
      new Chart(hoursProcessedChartCanvas, {
        // eslint-disable-line no-new
        type: 'line',
        data: data,
        options: {
          tooltips: {
            mode: 'x-axis',
            intersect: false,
          },
          hover: {
            mode: 'x-axis',
            intersect: false,
          },
          scales: {
            xAxes: [
              {
                type: 'time',
                time: {
                  unit: 'day',
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Hours Processed',
                },
              },
            ],
          },
        },
      });
    },
  },
};
</script>

<style lang="scss">
.dashboard {
  .progress-guage {
    height: 20vh;
    width: 40vh;
  }
  .users-list {
    & > li img {
      height: 128px;
    }
  }
  .info-box {
    cursor: pointer;
  }
  .info-box-content {
    text-align: center;
    vertical-align: middle;
    display: inherit;
  }
  .fullCanvas {
    width: 100%;
  }
  .pad canvas {
    border: 0px;
  }

  .chart-responsive {
    canvas {
      border: 0px;
    }
    padding-bottom: 10px;
  }

  .small-box.visitor-box {
    height: 375px;
    margin-bottom: 0px;
    .inner {
      padding-top: 100px;
    }
    .icon {
      position: static;
    }
  }
}
</style>
