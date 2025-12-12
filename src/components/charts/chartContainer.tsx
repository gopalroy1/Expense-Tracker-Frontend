export function ChartContainer({ children }: any) {
  return (
    <div
      className="
        w-full
        flex
        items-center
        justify-center
        overflow-hidden
        py-4
      "
      style={{
        aspectRatio: "1 / 1", // keeps chart square
        height: "auto",
        minHeight: "420px", // ensures enough height for labels + legend
        maxHeight:"500px"
      }}
    >
      {children}
    </div>
  );
}
