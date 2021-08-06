import {Component, OnInit, ViewChild} from "@angular/core";
import {ChartComponent} from "ng-apexcharts";
import axios from "axios";
import {ChartData} from "../../entity/chartdata";
import * as apex from "ng-apexcharts";

export type ChartOptions = {
  series: apex.ApexNonAxisChartSeries;
  chart: apex.ApexChart;
  responsive: apex.ApexResponsive[];
  labels: any
};

@Component({
  selector: 'app-chart-data',
  templateUrl: './chart-data.component.html',
  styleUrls: ['./chart-data.component.scss']
})
export class ChartDataComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent = new ChartComponent();
  public chartOptions: Partial<any>;
  chartData: ChartData[] = [];
  series = [];
  labels = [];

  // constructor() {
  //   this.chartOptions = {
  //     series: [44, 1, 1, 43, 27],
  //     chart: {
  //       type: "donut"
  //     },
  //     labels: ["Team A", "Team B", "Team C", "Team D", "Team E"]
  //   };
  // }

  constructor() {
    this.chartOptions = {
      series: this.series,
      chart: {
        type: "donut"
      },
      labels: this.labels,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }


  ngOnInit(): void {
    this.getChartData();
  }

  private getChartData() {
    axios.interceptors.request.use(
      function (request) {
        return request //todo encode request
      }
      , function (error) {
        return Promise.reject(error);
      }
    );

    axios.get(`http://localhost:4210/api/expense/common/chart-data`, {withCredentials: true})
      .then(response => {
        if (response.data.rows) {
          this.chartData = response.data.rows;
          this.chartData.forEach((value, index) => {
            // @ts-ignore
            this.series.push(value.summary);
            // @ts-ignore
            this.labels.push(value.type);
          })
          // this.initSvg();
          // this.drawPie();
        }
      }).catch(e => {
    }).finally(() => {
    })
  }
}
