"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import { ApexChart } from "@/components/dashboard/apex-chart";

// ---------------------------------------------------------------------------
// Card 1: Bar Chart — Grouped bar
// ---------------------------------------------------------------------------

const barChartOptions: ApexCharts.ApexOptions = {
  chart: { type: "bar", height: 350, toolbar: { show: false } },
  plotOptions: { bar: { columnWidth: "50%", borderRadius: 4 } },
  dataLabels: { enabled: false },
  xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"] },
  colors: ["#4680ff", "#1abc9c"],
  grid: { borderColor: "#e9ecef", strokeDashArray: 3 },
  legend: { show: true },
  tooltip: { theme: "dark" },
};

const barChartSeries = [
  { name: "Revenue", data: [44, 55, 57, 56, 61, 58, 63] },
  { name: "Profit", data: [76, 85, 101, 98, 87, 105, 91] },
];

// ---------------------------------------------------------------------------
// Card 2: Line Chart — Smooth multi-line
// ---------------------------------------------------------------------------

const lineChartOptions: ApexCharts.ApexOptions = {
  chart: { type: "line", height: 350, toolbar: { show: false } },
  stroke: { curve: "smooth", width: 3 },
  colors: ["#4680ff", "#2ca87f", "#e58a00"],
  xaxis: {
    categories: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
  },
  grid: { borderColor: "#e9ecef", strokeDashArray: 3 },
  legend: { show: true },
  tooltip: { theme: "dark" },
};

const lineChartSeries = [
  { name: "Series 1", data: [28, 29, 33, 36, 32, 32, 33] },
  { name: "Series 2", data: [12, 11, 14, 18, 17, 13, 13] },
  { name: "Series 3", data: [6, 8, 7, 9, 12, 8, 10] },
];

// ---------------------------------------------------------------------------
// Card 3: Area Chart — Stacked area
// ---------------------------------------------------------------------------

const areaChartOptions: ApexCharts.ApexOptions = {
  chart: { type: "area", height: 350, stacked: true, toolbar: { show: false } },
  colors: ["#4680ff", "#1abc9c", "#e58a00"],
  fill: { opacity: 0.4 },
  stroke: { curve: "smooth", width: 2 },
  xaxis: { categories: ["Q1", "Q2", "Q3", "Q4"] },
  legend: { show: true },
  tooltip: { theme: "dark" },
};

const areaChartSeries = [
  { name: "Desktop", data: [31, 40, 28, 51] },
  { name: "Mobile", data: [11, 32, 45, 32] },
  { name: "Tablet", data: [6, 8, 12, 9] },
];

// ---------------------------------------------------------------------------
// Card 4: Pie Chart — Simple pie
// ---------------------------------------------------------------------------

const pieChartOptions: ApexCharts.ApexOptions = {
  chart: { type: "pie", height: 350 },
  labels: ["Desktop", "Mobile", "Tablet", "Other"],
  colors: ["#4680ff", "#1abc9c", "#e58a00", "#7c4dff"],
  legend: { show: true, position: "bottom" },
  dataLabels: { enabled: true },
  tooltip: { theme: "dark" },
};

const pieChartSeries = [44, 55, 13, 8];

// ---------------------------------------------------------------------------
// Card 5: Donut Chart — With center label
// ---------------------------------------------------------------------------

const donutChartOptions: ApexCharts.ApexOptions = {
  chart: { type: "donut", height: 350 },
  labels: ["Engineering", "Marketing", "Sales", "Design", "HR"],
  colors: ["#4680ff", "#1abc9c", "#e58a00", "#7c4dff", "#3ebfea"],
  plotOptions: { pie: { donut: { size: "65%" } } },
  legend: { show: true, position: "bottom" },
  dataLabels: { enabled: false },
  tooltip: { theme: "dark" },
};

const donutChartSeries = [35, 25, 20, 12, 8];

// ---------------------------------------------------------------------------
// Card 6: Radial Bar — Multiple series
// ---------------------------------------------------------------------------

const radialBarOptions: ApexCharts.ApexOptions = {
  chart: { type: "radialBar", height: 350 },
  plotOptions: {
    radialBar: {
      hollow: { size: "30%" },
      dataLabels: {
        name: { fontSize: "14px" },
        value: { fontSize: "16px" },
        total: {
          show: true,
          label: "Total",
          formatter: () => "75%",
        },
      },
    },
  },
  colors: ["#4680ff", "#2ca87f", "#e58a00", "#dc2626"],
  labels: ["Sales", "Marketing", "Product", "Support"],
  legend: { show: true },
};

const radialBarSeries = [87, 75, 65, 50];

// ---------------------------------------------------------------------------
// Card 7: Mixed Chart — Line + bar combined
// ---------------------------------------------------------------------------

const mixedChartOptions: ApexCharts.ApexOptions = {
  chart: { type: "line", height: 350, toolbar: { show: false } },
  stroke: { width: [0, 3] },
  colors: ["#4680ff", "#dc2626"],
  xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
  yaxis: [
    { title: { text: "Revenue" } },
    { opposite: true, title: { text: "Profit Margin" } },
  ],
  legend: { show: true },
  tooltip: { theme: "dark" },
};

const mixedChartSeries = [
  { name: "Revenue", type: "column", data: [440, 505, 414, 671, 227, 413] },
  { name: "Profit Margin", type: "line", data: [23, 42, 35, 27, 43, 22] },
];

// ---------------------------------------------------------------------------
// Card 8: Radar Chart — Spider/radar
// ---------------------------------------------------------------------------

const radarChartOptions: ApexCharts.ApexOptions = {
  chart: { type: "radar", height: 350 },
  colors: ["#4680ff", "#1abc9c"],
  xaxis: {
    categories: [
      "Performance", "Security", "Speed",
      "Reliability", "Scalability", "Support",
    ],
  },
  legend: { show: true },
  tooltip: { theme: "dark" },
};

const radarChartSeries = [
  { name: "Product A", data: [80, 50, 30, 40, 100, 20] },
  { name: "Product B", data: [20, 30, 40, 80, 20, 80] },
];

// ---------------------------------------------------------------------------
// Card 9: Stacked Bar — Horizontal stacked
// ---------------------------------------------------------------------------

const stackedBarOptions: ApexCharts.ApexOptions = {
  chart: { type: "bar", height: 350, stacked: true, toolbar: { show: false } },
  plotOptions: { bar: { horizontal: true, barHeight: "50%" } },
  colors: ["#4680ff", "#1abc9c", "#e58a00"],
  xaxis: { categories: ["Q1", "Q2", "Q3", "Q4"] },
  legend: { show: true, position: "bottom" },
  tooltip: { theme: "dark" },
};

const stackedBarSeries = [
  { name: "Product A", data: [44, 55, 41, 37] },
  { name: "Product B", data: [13, 23, 20, 8] },
  { name: "Product C", data: [11, 17, 15, 15] },
];

// ---------------------------------------------------------------------------
// Card 10: Heatmap — Static data (avoids hydration mismatch)
// ---------------------------------------------------------------------------

const heatmapOptions: ApexCharts.ApexOptions = {
  chart: { type: "heatmap", height: 350, toolbar: { show: false } },
  colors: ["#4680ff"],
  dataLabels: { enabled: false },
  legend: { show: true },
  tooltip: { theme: "dark" },
};

const heatmapSeries = [
  { name: "Mon", data: [45, 72, 31, 58, 89, 23, 67, 41] },
  { name: "Tue", data: [62, 38, 85, 19, 73, 51, 28, 94] },
  { name: "Wed", data: [33, 77, 56, 42, 15, 88, 64, 29] },
  { name: "Thu", data: [81, 25, 48, 93, 37, 66, 52, 18] },
  { name: "Fri", data: [54, 69, 22, 76, 43, 87, 35, 61] },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function ApexChartsPage() {
  return (
    <>
      <PageBreadcrumb
        title="Charts"
        items={[{ label: "Charts & Maps" }, { label: "ApexCharts" }]}
      />

      <div className="grid grid-cols-12 gap-6">
        {/* Card 1: Bar Chart */}
        <div className="col-span-6">
          <Card>
            <CardHeader>
              <CardTitle>Bar Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <ApexChart
                type="bar"
                height={350}
                options={barChartOptions}
                series={barChartSeries}
              />
            </CardContent>
          </Card>
        </div>

        {/* Card 2: Line Chart */}
        <div className="col-span-6">
          <Card>
            <CardHeader>
              <CardTitle>Line Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <ApexChart
                type="line"
                height={350}
                options={lineChartOptions}
                series={lineChartSeries}
              />
            </CardContent>
          </Card>
        </div>

        {/* Card 3: Area Chart */}
        <div className="col-span-6">
          <Card>
            <CardHeader>
              <CardTitle>Area Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <ApexChart
                type="area"
                height={350}
                options={areaChartOptions}
                series={areaChartSeries}
              />
            </CardContent>
          </Card>
        </div>

        {/* Card 4: Pie Chart */}
        <div className="col-span-6">
          <Card>
            <CardHeader>
              <CardTitle>Pie Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <ApexChart
                type="pie"
                height={350}
                options={pieChartOptions}
                series={pieChartSeries}
              />
            </CardContent>
          </Card>
        </div>

        {/* Card 5: Donut Chart */}
        <div className="col-span-6">
          <Card>
            <CardHeader>
              <CardTitle>Donut Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <ApexChart
                type="donut"
                height={350}
                options={donutChartOptions}
                series={donutChartSeries}
              />
            </CardContent>
          </Card>
        </div>

        {/* Card 6: Radial Bar */}
        <div className="col-span-6">
          <Card>
            <CardHeader>
              <CardTitle>Radial Bar</CardTitle>
            </CardHeader>
            <CardContent>
              <ApexChart
                type="radialBar"
                height={350}
                options={radialBarOptions}
                series={radialBarSeries}
              />
            </CardContent>
          </Card>
        </div>

        {/* Card 7: Mixed Chart */}
        <div className="col-span-6">
          <Card>
            <CardHeader>
              <CardTitle>Mixed Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <ApexChart
                type="line"
                height={350}
                options={mixedChartOptions}
                series={mixedChartSeries}
              />
            </CardContent>
          </Card>
        </div>

        {/* Card 8: Radar Chart */}
        <div className="col-span-6">
          <Card>
            <CardHeader>
              <CardTitle>Radar Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <ApexChart
                type="radar"
                height={350}
                options={radarChartOptions}
                series={radarChartSeries}
              />
            </CardContent>
          </Card>
        </div>

        {/* Card 9: Stacked Bar */}
        <div className="col-span-6">
          <Card>
            <CardHeader>
              <CardTitle>Stacked Bar</CardTitle>
            </CardHeader>
            <CardContent>
              <ApexChart
                type="bar"
                height={350}
                options={stackedBarOptions}
                series={stackedBarSeries}
              />
            </CardContent>
          </Card>
        </div>

        {/* Card 10: Heatmap */}
        <div className="col-span-6">
          <Card>
            <CardHeader>
              <CardTitle>Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <ApexChart
                type="heatmap"
                height={350}
                options={heatmapOptions}
                series={heatmapSeries}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
