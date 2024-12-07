import React, { useEffect } from "react";
import ApexCharts from "apexcharts"; // Make sure to install ApexCharts
// import "bootstrap/dist/css/bootstrap.min.css"; // Ensure you have bootstrap installed

export default function Aa({ data }) {
  const seriesData = Array.isArray(data) ? data.map(item => item.product_count) : [];
  console.log('Series Data:', seriesData);
  const getChartOptions = () => {
    return {
      series: seriesData,
      colors: ["#639993", "#364F77", "#5558AF", "#AF5280","#F0BA48"],
      chart: {
        height: 320,
        width: "100%",
        type: "donut",
        border: {
          show: true,
          width: 2,
          color: "#000000"
        }
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["#ffffff"],
        lineCap: "round"
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontFamily: "Inter, sans-serif",
                offsetY: 12
              },
              total: {
                showAlways: true,
                show: true,
                // label: (data?.cash == 0 &&  data?.debit == 0 && data?.credit == 0 && data?.transfer == 0) ? "" : "Datos",
                fontSize: 22,
                color: "white",
                fontFamily: "Inter, sans-serif",
                formatter: function (w) {
                  const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                  return sum.toFixed(1);
                }
              },
              value: {
                show: false,
                fontFamily: "Inter, sans-serif",
                offsetY: -20,
                formatter: function (value) {
                  return Number(value).toFixed(1);
                }
              }
            },
            size: "80%"
          }
        }
      },
      // grid: {
      //   padding: {
      //     top: -2
      //   }
      // },
      // labels: [ "Direct", "Sponsor", "Affiliate", "Email marketing" ],
      // dataLabels: {
      //   enabled: false
      // },
      // legend: {
      //   position: "bottom",
      //   fontFamily: "Inter, sans-serif"
      // },
      grid: {
        show: false, // Hide grid lines
        padding: {
          top: -2
        }
      },
      labels: [], // Remove labels from the chart itself
      dataLabels: {
        enabled: false // Disable data labels
      },
      legend: {
        show: false, // Hide legend
        position: "bottom",
        fontFamily: "Inter, sans-serif"
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return Number(value).toFixed(1);
          }
        }
      },
      xaxis: {
        labels: {
          formatter: function (value) {
            return Number(value).toFixed(1);
          }
        },
        axisTicks: {
          show: false
        },
        axisBorder: {
          show: false
        }
      }
    };
  };

  useEffect(() => {
    if (seriesData.length === 0) {
      console.log('No data available for the chart.');
      return;
    }

    try {
      const chart = new ApexCharts(
        document.getElementById("donut-chart"),
        getChartOptions()
      );
      chart.render();
    } catch (error) {
      console.error('Error rendering chart:', error);
    }
  }, [data]);

  return (
    <div className="">
      <div className="card-body">
        <div className="d-flex justify-content-between mb-3">
          <div className="d-flex align-items-center " />
        </div>

        {/* Donut Chart */}
        <div id="donut-chart" className="py-3" />

        <div className=" pt-3 mt-3">
          <div className="d-flex justify-content-between align-items-center">
            {/* Add any other UI elements here if needed */}
          </div>
        </div>
      </div>
    </div>
  );
}
