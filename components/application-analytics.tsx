
type ApplicationAnalyticsProps = {
  statuses: string[];
};

export default function ApplicationAnalytics({
  statuses,
}: ApplicationAnalyticsProps) {
  // Count each application status
  const total = statuses.length;

  const categories = [
    { name: "Applied", color: "#2563eb" },
    { name: "Interview", color: "#8b5cf6" },
    { name: "Offer", color: "#10b981" },
    { name: "Rejected", color: "#f43f5e" },
  ];

  const statistics = categories.map((category) => {
    const count = statuses.filter(
      (status) => status === category.name
    ).length;

    return {
      ...category,
      count,
      percentage: total > 0
        ? (count / total) * 100
        : 0,
    };
  });

  // Build the donut chart colors
  let position = 0;

  const slices = statistics.map((item) => {
    const start = position;
    position += item.percentage;

    return `${item.color} ${start}% ${position}%`;
  });

  const chartBackground = total > 0
    ? `conic-gradient(${slices.join(", ")})`
    : "#e2e8f0";

  return (
    <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

      {/* HEADING */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900">
          Application Analytics
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Understand your internship application progress.
        </p>
      </div>

      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">

        {/* DONUT CHART */}
        <div className="flex justify-center">
          <div
            role="img"
            aria-label={`Application status chart. ${statistics
              .map((item) => `${item.name}: ${item.count}`)
              .join(", ")}`}
            className="relative h-56 w-56 rounded-full"
            style={{ background: chartBackground }}
          >
            <div className="absolute inset-8 flex flex-col items-center justify-center rounded-full bg-white">
              <span className="text-4xl font-bold text-slate-900">
                {total}
              </span>

              <span className="mt-1 text-sm text-slate-500">
                Applications
              </span>
            </div>
          </div>
        </div>

        {/* STATUS BREAKDOWN */}
        <div className="space-y-5">

          {statistics.map((item) => (
            <div key={item.name}>

              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />

                  <span className="text-sm font-medium text-slate-700">
                    {item.name}
                  </span>
                </div>

                <span className="text-sm font-semibold text-slate-900">
                  {item.count} ({item.percentage.toFixed(0)}%)
                </span>
              </div>

              {/* PROGRESS BAR */}
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>

            </div>
          ))}

        </div>
      </div>

      {total === 0 && (
        <p className="mt-6 text-center text-sm text-slate-400">
          Add applications to see your analytics.
        </p>
      )}

    </section>
  );
}
