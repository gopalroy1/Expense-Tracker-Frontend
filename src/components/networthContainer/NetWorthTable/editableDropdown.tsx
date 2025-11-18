import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function EditableDropdown({
  items,
  selected,
  onSelect,
  onAdd,
  placeholder = "Search or add...",
}: any) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const ref = useRef<any>(null);

  // close dropdown on outside click
  useEffect(() => {
    function handleClick(e: any) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = items.filter((i: any) =>
    i.name.toLowerCase().includes(query.toLowerCase())
  );

  const exactMatch = items.some(
    (i: any) => i.name.toLowerCase() === query.toLowerCase()
  );

  const handleAdd = async () => {
    const text = query.trim();
    if (!text) return;

    const newItem = await onAdd(text);
    onSelect(newItem || { id: Math.random(), name: text });

    setQuery("");
    setOpen(false);
  };

  return (
    <div className="relative w-full" ref={ref}>
      {/* Selected Box */}
      <div
        className="border rounded-md px-3 py-2 bg-white cursor-pointer hover:border-gray-400 transition"
        onClick={() => setOpen(!open)}
      >
        {selected?.name || <span className="text-gray-400">Select...</span>}
      </div>

      {open && (
        <div className="absolute mt-1 z-50 w-max min-w-full bg-white border rounded-md shadow-lg p-2">
          {/* Search */}
          <input
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />

          {/* Add new option */}
          {query.trim() && !exactMatch && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-50 text-blue-700 text-sm cursor-pointer hover:bg-blue-100 mb-1"
              onClick={handleAdd}
            >
              <Plus className="w-4 h-4" /> Add “{query.trim()}”
            </div>
          )}

          {/* List */}
          <div className="max-h-56 overflow-y-auto w-full">
            {filtered.length === 0 && (
              <div className="p-3 text-center text-gray-400 text-sm">No results</div>
            )}

            {filtered.map((item: any) => (
              <div
                key={item.id}
                className="px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer text-gray-800"
                onClick={() => {
                  onSelect(item);
                  setOpen(false);
                }}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
