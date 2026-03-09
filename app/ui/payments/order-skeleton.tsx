export function OrderSkeleton() {
    return (
      <div className='flex flex-col gap-8 justify-center items-center  min-h-[100dvh] bg-zinc-900 py-16 px-4 sm:px-6'>
        <div className='flex flex-row items-left mr-auto gap-4'>
          <div className='w-6 h-6 bg-zinc-700 rounded-full animate-pulse' />
          <div className='w-20 h-6 bg-zinc-700 rounded-full animate-pulse' />
        </div>
        <OrderCompleteSkeleton />
        <table className="w-full flex items-center justify-center">
          <tbody>
            <tr>
              <ReceiptSkeleton />
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  const OrderCompleteSkeleton = () => {
    return (
      <div className="flex flex-col items-center text-white text-center">
        <div className='flex flex-row gap-4 items-center mb-8'>
          <div className='w-10 h-10 bg-zinc-700 rounded-full animate-pulse' />
          <div className='w-20 h-6 bg-zinc-700 rounded-full animate-pulse' />
        </div>
        <div className="flex flex-col  mt-4 max-w-5xl mx-auto bg-transparent items-center text-center">
          <div className="h-12 w-full bg-zinc-700 rounded-full animate-pulse" />
        </div>
      </div>
    )
  }

  const ReceiptSkeleton = () => {
    return (
      <td className="p-0 m-0">
        {/* Wrapper */}
        <table className="w-full max-w-5xl mx-auto text-black table-fixed shadow-md rounded-lg bg-zinc-700 p-4 sm:p-6 lg:p-8">
          <tbody>
            <tr>
              <td className="p-0 m-0">
                <div className="w-full bg-gray-100 p-4 sm:p-6 lg:p-8">
                  <table className="w-full mb-6">
                    <tbody>
                      <tr>
                        <td className="flex justify-between items-center">
                          <div className='w-20 h-6 bg-zinc-700 rounded-full animate-pulse' />
                          <div className='w-20 h-6 bg-zinc-700 rounded-full animate-pulse' />
                        </td>
                      </tr>
                    </tbody>
                  </table>
  
                  <table className="w-full mb-6">
                    <tbody>
                      <tr>
                        <td className="flex flex-wrap gap-4 pb-2">
                          <div className="w-full md:w-1/3">
                            <div className='w-20 h-6 bg-zinc-700 rounded-full animate-pulse' />
                            <div className='w-20 h-6 bg-zinc-700 rounded-full animate-pulse' />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
  
                  <table className="w-full mb-6">
                    <thead>
                      <tr>
                        <th className="w-1/2 py-2 pl-4 pr-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className='w-20 h-6 bg-zinc-700 rounded-full animate-pulse' />
                        </th>
                        <th className="w-1/6 py-2 pl-4 pr-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className='w-20 h-6 bg-zinc-700 rounded-full animate-pulse' />
                        </th>
                        <th className="w-1/3 py-2 pl-4 pr-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className='w-20 h-6 bg-zinc-700 rounded-full animate-pulse' />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="w-1/2 py-2 pl-4 pr-6 border-b border-gray-200">
                          <div className='w-20 h-6 bg-zinc-700 rounded-full animate-pulse' />
                        </td>
                        <td className="w-1/6 py-2 pl-4 pr-6 border-b border-gray-200">
                          <div className='w-20 h-6 bg-zinc-700 rounded-full animate-pulse' />
                        </td>
                        <td className="w-1/3 py-2 pl-4 pr-6 border-b border-gray-200">
                          <div className='w-20 h-6 bg-zinc-700 rounded-full animate-pulse' />
                        </td>
                      </tr>
                    </tbody>
                  </table>
  
                  <table className="w-full mb-6">
                    <tbody>
                      <tr>
                        <td className="pl-4 pr-6 pt-4 pb-2 border-b border-gray-200">
                          <div className='w-20 h-6 bg-zinc-700 rounded-full animate-pulse' />
                        </td>
                      </tr>
                    </tbody>
                  </table>
  
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        {/* /Wrapper */}
      </td>
    )
  }