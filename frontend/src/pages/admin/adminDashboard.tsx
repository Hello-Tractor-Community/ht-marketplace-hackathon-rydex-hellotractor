import { FC, useEffect, useMemo, useState } from "react";
import { Card, CardHeader, Grid, Stack, useTheme } from "@mui/material";
import { useParams } from "react-router-dom";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import PageContainer from "../../components/PageContainer/PageContainer";
import {
  DashboardData,
  getAdminDashboard,
} from "../../api/stores/getDashboard";

const AdminDashboard: FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>();
  const [from, setFrom] = useState<Dayjs>(dayjs().startOf("week"));
  const [to, setTo] = useState<Dayjs>(dayjs().endOf("week"));

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    getAdminDashboard({
      from: from.format("YYYY-MM-DD"),
      to: to.format("YYYY-MM-DD"),
    })
      .then(setDashboardData)
      .catch(console.error);
  }, [id, from, to]);

  const theme = useTheme();

  const ordersChartData = useMemo(() => {
    return {
      options: {
        chart: {
          id: "basic-bar",
        },
        xaxis: {
          categories: dashboardData?.orders?.map((order) => order.date),
        },
        colors: [theme.palette.primary.main],
        plotOptions: {
          bar: {
            borderRadius: theme.shape.borderRadius,
          },
        },
      } as ApexOptions,
      series: [
        {
          name: "Orders",
          data: dashboardData?.orders?.map((order) => order.count) ?? [],
        },
      ],
    };
  }, [dashboardData, theme]);

  const salesChartData = useMemo(() => {
    return {
      options: {
        chart: {
          id: "basic-line",
        },
        xaxis: {
          type: "datetime",
          categories: dashboardData?.orders?.map((order) => order.date),
        },
        colors: [theme.palette.primary.main],
        plotOptions: {
          line: {},
        },
        markers: {
          shape: "circle",
          size: 4,
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 2,
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 90, 100],
          },
        },
      } as ApexOptions,
      series: [
        {
          name: "Sales",
          data: dashboardData?.orders?.map((order) => order.priceTotal) ?? [],
        },
      ],
    };
  }, [dashboardData, theme]);

  return (
    <PageContainer title={"Dashboard"}>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6}></Grid>
        <Grid item xs={12} md={6}>
          <Stack
            direction={"row"}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Stack direction={"row"} spacing={2}>
              <DatePicker
                value={from}
                onChange={(date) => {
                  if (date) {
                    setFrom(date);
                  }
                }}
                label="From"
                slotProps={{
                  textField: {
                    size: "small",
                    label: "From",
                  },
                }}
              />{" "}
              <DatePicker
                value={to}
                onChange={(date) => {
                  if (date) {
                    setTo(date);
                  }
                }}
                label="To"
                slotProps={{
                  textField: {
                    size: "small",
                    label: "To",
                  },
                }}
              />
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Orders per day" />
            <Chart
              options={ordersChartData.options}
              series={ordersChartData.series}
              type="bar"
              width="100%"
              height={250}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Sales overview" />
            <Chart
              options={salesChartData.options}
              series={salesChartData.series}
              type="area"
              width="100%"
              height={250}
            />
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default AdminDashboard;
