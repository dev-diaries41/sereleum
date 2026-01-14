export function MetricsItem({
  label,
  value,
  largeValue,
}: {
  label: string;
  value: string;
  largeValue?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
      {largeValue ? (
        <div className="text-lg font-extrabold">{largeValue}</div>
      ) : null}
    </div>
  );
}