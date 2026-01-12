import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState } from "react";
import Stripe from "stripe";
import { CreditBundles } from "../constants/global";
import { updateCredits } from "../lib/server/data/user";

const useStripeCheckout = () => {
    const [checkoutInfo, setCheckoutInfo] = useState<Partial<Stripe.Response<Stripe.Checkout.Session>>|null>(null);
    const [newCredits, setNewCredits] = useState<number|null>(null);

    const loadCheckoutSession = async (sessionId: string, router: AppRouterInstance) => {
        try {
          const url = `/api/order/complete?session_id=${sessionId}`;
          const res = await fetch(url);
          const { session } = await res.json();
          if (!session) {
              router.push('/'); // Redirect to root page
              return;
          }
          const { customer_details, status, amount_total, created } = session as  Stripe.Response<Stripe.Checkout.Session>;
          if(customer_details?.email && amount_total && status === 'complete'){
            let newCredits: number;

            switch(amount_total){
              case CreditBundles.small.amount:
                newCredits = await updateCredits(customer_details?.email, CreditBundles.small.credits);
                setNewCredits(newCredits);
                break;
                
              case CreditBundles.large.amount:
                newCredits = await updateCredits(customer_details?.email, CreditBundles.large.credits);
                setNewCredits(newCredits);
                break;
              default:
                console.warn("Unrecognized bundle amount:", amount_total);
            }
          }
    
          setCheckoutInfo({ customer_details, status, amount_total, created });

          if (status !== 'complete') {
              router.push('/'); // Redirect to root page
          }
        } catch (error) {
        router.push('/'); // Redirect to root page
      }
    };

  return {
    newCredits,
    checkoutInfo,  
    loadCheckoutSession,
  };
};

export default useStripeCheckout