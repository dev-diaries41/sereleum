import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function MetricCard({ title, value, icon }: { title: string; value: React.ReactNode; icon?: any; }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 w-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-end gap-3 mt-2">
            <h3 className="text-3xl md:text-4xl font-extrabold leading-none">{value}</h3>
          </div>
        </div>
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-50">
          {icon ? <FontAwesomeIcon icon={icon} className="w-6 h-6 text-gray-700" /> : null}
        </div>
      </div>
      <div className="mt-4 h-8">
        <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-8">
          <polyline fill="none" stroke="#D1D5DB" strokeWidth={1.6} points="0,14 18,10 36,8 54,6 72,7 90,4 100,6" />
        </svg>
      </div>
    </div>
  );
}
