'use client';
import { capitalizeFirstLetter } from '@/app/lib/helpers';
import { Usage } from '@/app/types';
import 'react-circular-progressbar/dist/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import UsageCard from './usage-card';
import AccountInformation from './account-info';

interface AccountOverviewProps  { 
  usage: Usage; 
  email:string ;
  credits: number;
}
export default function AccountOverview({ usage , email, credits }: AccountOverviewProps) {
  return (
      <div className="w-full flex flex-col px-4 pt-24 sm:pt-8">        
      <h1 className="text-xl md:text-2xl">Account overview</h1>
        <div className="flex flex-col w-full min-h-screen items-center">
          <AccountInformation email={email} credits={credits}/>
          <div className="flex flex-col justify-center items-start gap-2 w-full mb-4">
            <div className="w-full flex flex-row items-center justify-start gap-2">
              {/* <h1 className="text-xl md:text-2xl">Usage</h1> */}
            </div>
          </div>

          <div className='w-full flex flex-wrap gap-4 justify-between items-center mb-8'>
            {Object.entries(usage).map(([key, value], index) => (
              <div key={index} className="w-full sm:w-full lg:w-1/4 mb-6 sm:mb-0">
                <UsageCard periodUsage={{ name: capitalizeFirstLetter(key), value: value }} />
              </div>
            ))}
          </div>
        </div>
      </div>
  );
}
