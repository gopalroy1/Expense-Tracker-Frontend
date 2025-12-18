
import { API } from "@/api";
import axiosInstance from "@/api/axios/axiosInstane";
import { useApi } from "@/hooks/useApi";
import { setAccounts } from "@/store/accountSlice";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { CategoryTrendView } from "./categoryTrendView";

export const CategoryTrendExplorer = () => {
  const [rawData, setRawData] = useState<any>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [range, setRange] = useState<6 | 12 | "ALL">("ALL");
  const [view, setView] = useState<"CATEGORY" | "SUB_CATEGORY">("CATEGORY");
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const { callApi } = useApi();
  const { accountTypes } = useSelector((s: any) => s.account || {});

  /* ---------------- Load account types ---------------- */

  useEffect(() => {
    callApi(() => API.getAccounts())
      .then((res) => dispatch(setAccounts(res.accountTypes ?? [])))
      .catch((e) => toast.error(e?.message || "Failed to load categories"));
  }, []);

  /* ---------------- Fetch category trend ---------------- */

  const fetchData = async (c?: string, y?: number) => {
    setLoading(true);
    const res = await axiosInstance.get("/api/dashboard/category-trend", {
      params: { category: c, year: y },
    });

    setRawData(res.data);
    setCategory(res.data.defaultCategory);
    setYear(res.data.year);
    setView("CATEGORY");
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ---------------- Apply range filter ---------------- */

  const data: any = useMemo(() => {
    if (!rawData) return null;

    if (range === "ALL") {
      return {
        year: rawData.year,
        category,
        labels: rawData.labels,
        categoryTrend: rawData.categoryTrend,
        subCategoryTrend: rawData.subCategoryTrend,
      };
    }

    const start = Math.max(0, rawData.labels.length - range);

    return {
      year: rawData.year,
      category,
      labels: rawData.labels.slice(start),
      categoryTrend: rawData.categoryTrend.slice(start),
      subCategoryTrend: Object.fromEntries(
        Object.entries(rawData.subCategoryTrend).map(([k, v]:any) => [
          k,
          v.slice(start),
        ])
      ),
    };
  }, [rawData, range, category]);

  if (loading) return <div className="text-sm text-gray-500">Loading…</div>;
  if (!data || !year) return null;

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
      {/* Controls */}
      <div className="flex gap-2">
        <select
          value={category ?? ""}
          onChange={(e) => fetchData(e.target.value, year)}
          className="border rounded px-2 py-1 text-sm"
        >
          {accountTypes?.map((c: any) => (
            <option key={c.type} value={c.type}>
              {c.type}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => fetchData(category!, Number(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        >
          {[year - 2, year - 1, year, year + 1].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* View */}
      <CategoryTrendView
        data={data}
        view={view}
        range={range}
        onRangeChange={setRange}
        onViewChange={setView}
      />
    </div>
  );
};
