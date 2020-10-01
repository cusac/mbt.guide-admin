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

          <div v-if="statsLoading" class="overlay">
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

          <div v-if="statsLoading" class="overlay">
            <i class="fa"><pulse-loader /></i>
          </div>
          <!-- /.overlay -->
        </box>
        <!-- /SEGMENTS CREATED -->

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

        <div class="row">
          <div class="col-lg-12">
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
                      <visitor-map v-if="!statsLoading" :stats="adminStats" />
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

              <div v-if="statsLoading" class="overlay">
                <i class="fa"><pulse-loader /></i>
              </div>
              <!-- /.overlay -->
            </box>
            <!-- /VISITOR MAP -->
          </div>
          <!-- /.col -->
        </div>
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

          <div v-if="statsLoading" class="overlay">
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
      <div class="col-lg-4 col-xs-6" />
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
      statsLoading: true,
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
      this.statsLoading = true;
      statsService
        .getDashboardStats()
        .then(result => {
          this.adminStats = result;
          this.createPieChart();
          this.statsLoading = false;
        })
        .catch(error => {
          this.statsLoading = false;
          console.error('Dashboard.getDashboardStats-error:', error);
          this.$snotify.error('Get adminStats failed', 'Error!');
        });
    },
    getSegmentStats() {
      this.statsLoading = true;
      statsService
        .getSegmentStats()
        .then(result => {
          this.segmentStats = result;
          this.createSegmentCharts();
          this.statsLoading = false;
        })
        .catch(error => {
          this.statsLoading = false;
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
