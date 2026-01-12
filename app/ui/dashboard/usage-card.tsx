import { MetricType } from "@/app/types";

interface UsageCardProps {
    metric: MetricType;
  }
  
  export default function MetricCard({ metric }: UsageCardProps) {
    return (
      <div className='flex flex-col items-center bg-white border border-gray-300 p-8 rounded-xl'>
        <h1 className='text-xl font-semibold opacity-90 mb-4'>{metric.name}</h1>
        <span className='text-5xl font-bold my-auto'>{metric.value}</span>
      </div>
    );
  } 