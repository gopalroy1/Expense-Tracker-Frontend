import axiosInstance from "@/api/axios/axiosInstane";
import React, { useEffect, useState } from "react";
import {
  NetWorthTrendView,
  type NetWorthTrendPoint,
} from "./NetworthView";

type TrendApiResponse = {
  year: number | null;
  data: NetWorthTrendPoint[];
};

export const NetWorthTrendSection: React.FC = () => {
  const [year, setYear] = useState<number | null>(null);
  const [data, setData] = useState<NetWorthTrendPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrend = async (y?: number) => {
    const params: any = {};
    if (y) params.year = y;

    const res = await axiosInstance.get<TrendApiResponse>(
      "/api/dashboard/networth-trend",
      { params }
    );

    return res.data;
  };

  useEffect(() => {
    fetchTrend()
      .then((res) => {
        setYear(res.year);
        setData(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!year) return;

    setLoading(true);
    fetchTrend(year)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [year]);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading trend…</div>;
  }

  if (!year) return null;

  return (
    <NetWorthTrendView
      year={year}
      data={data}
      onYearChange={setYear}
    />
  );
};
