'use client'
import { useEffect, useLayoutEffect } from 'react';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Receipt from '@/app/ui/payments/receipt';
import OrderComplete from '@/app/ui/payments/order-message';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import useStripeCheckout from '@/app/hooks/useStripeCheckout';
import { useSession } from 'next-auth/react';

export default function OrderSuccess() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const {loadCheckoutSession, checkoutInfo, newCredits} = useStripeCheckout();
    const {data:authSession, update} = useSession();


    useLayoutEffect(() => {
      if(!sessionId){
        return router.push('/');
      }
      loadCheckoutSession(sessionId, router);
      
    },[])

    useEffect(() => {
        if(authSession && newCredits && authSession.user.credits !== newCredits){
          update({...authSession.user, credits: newCredits});
      }
    }, [authSession, newCredits])
    
    if(!sessionId || !checkoutInfo)return null;

    return (
        <div className='flex flex-col gap-8 justify-center items-center  min-h-[100dvh] py-16 px-4 sm:px-6 max-w-5xl mx-auto'>
          <Link href='/' className='flex flex-row items-left mr-auto gap-4'>
            <FontAwesomeIcon icon={faArrowLeft} className='w-6 h-6'/>
            Back
          </Link>
          <OrderComplete/>
          <table className="w-full flex items-center justify-center">
            <tbody>
              <tr>
                  <Receipt amount={checkoutInfo?.amount_total!} email={checkoutInfo?.customer_details?.email || ''} />
              </tr>
            </tbody>
          </table>
        </div>
     
    );
    
    };
    