export default function MonthSelector({ month, year, setMonth, setYear }:{month:string, year:string, setMonth:Function, setYear:Function}) {
  return (
    <div className="flex gap-4">
      <select
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="border rounded px-2 py-1"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
            {new Date(2000, i).toLocaleString("default", { month: "long" })}
          </option>
        ))}
      </select>

      <input
        type="number"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="border rounded px-2 py-1 w-24"
      />
    </div>
  );
}