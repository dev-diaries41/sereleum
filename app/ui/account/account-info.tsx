
interface AccountInformationProps {
  email: string; 
  credits: number, 
}

export default function  AccountInformation({email, credits}:AccountInformationProps ) {
  console.log(`email: ${email}`)
  return (
    <div className='w-full flex flex-col py-8'>
      {/* <h1 className="font-semibold mb-2 mr-auto opacity-80">Account information</h1> */}
      <div className="relative w-full flex flex-col items-center justify center gap-4  border border-gray-300 rounded-md p-4 mb-4">
        <div className="w-full flex flex-col md:flex-row items-start justify-between gap-2 overflow-hidden">
            <span className='font-medium opacity-80'>
                Email
            </span>
            <span className=''>
                {email}
            </span> 
        </div>
        <div className="w-full h-px bg-gray-300 "></div>
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
