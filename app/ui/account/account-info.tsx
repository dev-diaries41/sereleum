import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface AccountInformationProps {
  email: string; 
  credits: number, 
}

export default function  AccountInformation({email, credits}:AccountInformationProps ) {
  console.log(`email: ${email}`)
  return (
    <div className='w-full flex flex-col py-24'>
      <div className="w-full flex flex-row items-center justify-start text-left gap-2 mb-8">
        <FontAwesomeIcon icon={faUserCircle} className="w-6 h-6"/>
        <h1 className="text-2xl md:text-3xl font-bold">Account overview</h1>
      </div>
      <h1 className="font-semibold mb-2 mr-auto opacity-80">Account information</h1>
      <div className="relative w-full flex flex-col items-center justify center gap-4 bg-white dark:bg-[#333] border border-gray-300 dark:border-[#555] rounded-md p-4 mb-4">
        <div className="w-full flex flex-col md:flex-row items-start justify-between gap-2 overflow-hidden">
            <span className='font-medium opacity-80'>
                Email
            </span>
            <span className=''>
                {email}
            </span> 
        </div>
        <div className="w-full h-px bg-gray-200 dark:bg-[#555]"></div>
        <div className="w-full flex flex-row items-start justify-between gap-4">
            <span className='font-medium opacity-80'>
                Credits
            </span>
            <span>
                {credits}
            </span>
        </div>
      </div>
    </div>
  )
}
