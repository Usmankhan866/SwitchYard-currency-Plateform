"use client";

import dynamic from "next/dynamic";
import type { Props as ApexChartProps } from "react-apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function ApexChart(props: ApexChartProps) {
  return <ReactApexChart {...props} />;
}
