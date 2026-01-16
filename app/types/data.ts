export interface PaymentDetails {
    email: string | null;
    name: string;
    receipt_url: string | null;
    chargeId: string;
}

export type UserPlan = 'Free' | 'Basic' | 'Pro';

export type UserPlanOverView = {plan: UserPlan; cancel_at_period_end?: boolean; cancelled? :boolean;}

export type UserProfileInfo = {
    userPlan: UserPlan, 
    expiresAt: number, 
}

export type UsagePeriod = keyof Usage

export type Usage = {
    today: number;
    month: number;
    total: number;
  }

  export interface UsageTrackerProps {
  usage: number;
  period: string;
}
  
  export interface MetricType {
    name: string;
    value: number;
  }

  export interface NewUser {
    email: string;
    password: string;
    name?: string;
    username?: string;
  }

  export interface User {
    email: string;
    salt: string; 
    hashedPassword: string;
    credits: number;
    name?: string;
    username?: string;
    metadata?: Record<string, any>;
  }


   export type RegistrationState = {
    errors?: {
      email?: string[];
      passowrd?: string[];
      confirmPassword?: string[];
    };
    message: string | null;
  };

  export type CompleteResetState = {
    errors?: {
      passowrd?: string[];
      confirmPassword?: string[];
    };
    message: string | null;
  };

  export type ResetState = {
    errors?: {
      email?: string[];
    };
    message: string | null;
  };
  
   export type LoginState = {
    success: boolean;
    error?: string;
  };

  export type UpgradeState = {
    message: string | null;
  };
  


