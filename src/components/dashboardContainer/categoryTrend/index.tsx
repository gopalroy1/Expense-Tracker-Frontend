import { API } from "@/api";
import axiosInstance from "@/api/axios/axiosInstane";
import { useApi } from "@/hooks/useApi";
import { setAccounts } from "@/store/accountSlice";
import ReactECharts from "echarts-for-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

/* ---------------- Types ---------------- */

type CategoryTrendResponse = {
  year: number;
  defaultCategory: string;
  months: number[];
  labels: string[];
  categoryTrend: number[];
  subCategoryTrend: Record<string, number[]>;
};

/* ---------------- Component ---------------- */

export default function CategoryTrendExplorer() {
  const [data, setData] = useState<CategoryTrendResponse | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [range, setRange] = useState<6 | 12 | "ALL">("ALL");
  const [view, setView] = useState<"CATEGORY" | "SUB_CATEGORY">("CATEGORY");
    const [loading, setLoading] = useState<boolean>(true);
        const dispatch = useDispatch();
            const { callApi } = useApi();
        

        const { accountTypes, loading:loadingCategory } = useSelector((s: any) => s.account || {});
console.log({accountTypes})

  /* ---------------- Fetch ---------------- */

  const fetchData = async (
    selectedCategory?: string,
    selectedYear?: number
  ) => {
    setLoading(true);

    const res = await axiosInstance.get<CategoryTrendResponse>(
      "/api/dashboard/category-trend",
      {
        params: {
          category: selectedCategory,
          year: selectedYear,
        },
      }
    );

    setData(res.data);
    setCategory(res.data.defaultCategory);
    setYear(res.data.year);
    setView("CATEGORY");
    setLoading(false);
  };
        // helper: load into redux
    const load = async () => {
        try {
            // dispatch(setLoading(true));

            const res = await callApi(() => API.getAccounts());

            // Correct shape
            const types = res.accountTypes ?? [];

            dispatch(setAccounts(types));  // <-- FIXED

            // Open all by default
            // setOpenType((prev) => {
            //     const next: Record<string, boolean> = {};
            //     types.forEach((t: any) => (next[t.id] = prev[t.id] ?? true));
            //     return next;
            // });

        } catch (err: any) {
            toast.error(err?.message || "Failed to load accounts");
        } finally {
            // dispatch(setLoading(false));
        }
    };


  useEffect(() => {
      fetchData();
      load()
  }, []);

  /* ---------------- Derived (range filter) ---------------- */

  const slicedData = useMemo(() => {
    if (!data || range === "ALL") return data;

    const start = Math.max(0, data.labels.length - range);

    return {
      ...data,
      labels: data.labels.slice(start),
      categoryTrend: data.categoryTrend.slice(start),
      subCategoryTrend: Object.fromEntries(
        Object.entries(data.subCategoryTrend).map(([k, v]) => [
          k,
          v.slice(start),
        ])
      ),
    };
  }, [data, range]);

  if (loading) return <div className="p-4">Loading trend…</div>;
  if (!slicedData) return null;

  /* ---------------- Chart Options ---------------- */

  const categoryOption = {
    tooltip: {
      trigger: "axis",
      valueFormatter: (v: number) => `₹ ${v.toLocaleString()}`,
    },
    grid: { left: 12, right: 12, bottom: 24, containLabel: true },
    xAxis: {
      type: "category",
      data: slicedData.labels,
      axisTick: { show: false },
      axisLine: { show: false },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: (v: number) => `₹${(v / 1000).toFixed(0)}k`,
      },
      splitLine: {
        lineStyle: { type: "dashed", opacity: 0.3 },
      },
    },
    series: [
      {
        type: "line",
        smooth: true,
        symbolSize: 6,
        lineStyle: { width: 3 },
        areaStyle: { opacity: 0.25 },
        data: slicedData.categoryTrend,
      },
    ],
  };

  const subCategoryOption = {
    tooltip: {
      trigger: "axis",
      valueFormatter: (v: number) => `₹ ${v.toLocaleString()}`,
    },
    legend: {
      top: 0,
      icon: "circle",
    },
    grid: { left: 12, right: 12, bottom: 24, containLabel: true },
    xAxis: {
      type: "category",
      data: slicedData.labels,
    },
    yAxis: {
      type: "value",
      splitLine: {
        lineStyle: { type: "dashed", opacity: 0.3 },
      },
    },
    series: Object.entries(slicedData.subCategoryTrend).map(
      ([name, values]) => ({
        name,
        type: "line",
        smooth: true,
        symbolSize: 5,
        data: values,
      })
    ),
  };

  /* ---------------- Render ---------------- */

  return (
    <div className="rounded-xl border bg-white p-4 space-y-3">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold">Category Trend</h3>
          <p className="text-sm text-gray-500">
            {year} • {category}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Category */}
          <select
            value={category ?? ""}
            onChange={(e) => fetchData(e.target.value, year ?? undefined)}
            className="border rounded px-2 py-1 text-sm"
          >
            { !loadingCategory&& accountTypes&& accountTypes?.map((c: any) => (
              <option key={c.type+"sldf"} value={c.type}>
                {c.type}
              </option>
            ))}
          </select>

          {/* Year */}
          <select
            value={year ?? ""}
            onChange={(e) => fetchData(category ?? undefined, Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            {[2025, 2024, 2023].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* Range */}
          <div className="flex gap-1">
            {[6, 12, "ALL"].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r as any)}
                className={`px-2 py-1 text-xs rounded border ${
                  range === r ? "bg-black text-white" : ""
                }`}
              >
                {r === "ALL" ? "All" : `Last ${r}M`}
              </button>
            ))}
          </div>

          {view === "CATEGORY" && (
            <button
              onClick={() => setView("SUB_CATEGORY")}
              className="border rounded px-2 py-1 text-sm"
            >
              View breakdown
            </button>
          )}
        </div>
      </div>

      {/* Charts */}
      {view === "CATEGORY" && (
        <ReactECharts
          option={categoryOption}
          style={{ height: 320 }}
          onEvents={{
            click: () => setView("SUB_CATEGORY"),
          }}
        />
      )}

      {view === "SUB_CATEGORY" && (
        <>
          <button
            onClick={() => setView("CATEGORY")}
            className="text-sm text-blue-600"
          >
            ← Back to category
          </button>

          <ReactECharts
            option={subCategoryOption}
            style={{ height: 360 }}
          />
        </>
      )}
    </div>
  );
}
