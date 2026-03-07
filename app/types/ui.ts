import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { Status } from "./requests";


export interface CardProps extends React.HTMLAttributes<HTMLDivElement>   {
  title: string;
  description: string;
  link: string;
  cta: string;
  tags?: string[];
  metadata?: string[];
}

export type InputField = Partial<React.JSX.IntrinsicElements['input']> & {
  optional?: boolean;
};

export interface NavItem  {
  name: string;
  link: string;
  newPage?: boolean;
  icon?: any
} 


export interface NavItemsProps {
  navItems: NavItem[];
  classname?: string
}

export interface LogoProps {
  src: string;
  name?: string;
  alt?: string;
  width?:  number | `${number}`;
  height?:  number | `${number}`;
} 

export interface FileUploaderProps {
  onFileUpload: (files: File[]) => void; // Updated to handle an array of files
  acceptedFileExt?: string[];
  acceptedMimes: string[];
  className?: string;
  children?: ReactNode;
  fileLimit?: number;
  maxSize?: number;
}


export interface Option {
  value: string;
  label: string;
}


export type SelectorProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options: Option[];
  placeholderOption: string
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  className?: string;
  icon?: IconProp;
};

export type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement>;

    
export type ContactState = {
  errors?: {
    supportType?: string[];
    email?: string[];
    message?: string[];
  };
  success: boolean;
};

export interface PollOptions  {
  interval: number;
  maxDuration: number;
  maxErrors: number;
  onMaxErrors?: () => void;
  onMaxDuration?: () => void;
}

export interface ToastProps {
  title: string;
  description: string;
  logo?: string;
  position?: 'bottom-left' | 'bottom-right' | 'top-right' | 'top-left' | 'center' | 'center-top';
  maxDuration?: number;
  onClose: () => void;
};

export interface ToastOptions extends Omit<ToastProps, 'onClose'> {}

export interface BasePopUpProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  isError?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
}

export interface LoaderDialogProps extends BasePopUpProps{
  onMinimize :() => void;

}

export interface LoadingState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  minimize: boolean;
  minimizeLoader: () => void;
  showLoadingDialog: boolean;
  showLoadingMiniIndicator: boolean;
}


export interface CTAPopUpProps extends BasePopUpProps{ 
  onConfirmCta?: string;
  onCloseCta?: string;
  onConfirmClassName?: string;
  onCloseClassName?: string;
}

export interface ProviderProps {
  children: ReactNode;
}

export interface UserProfileWidgetProps {
  username: string | undefined | null;    //email/uid/username
} 

export interface ActionRowProps {
  onCopy: () => void;
  onDelete: () => void;
  shareUrl?: string | null;
}

export interface SectionItem {
  title: string;
  description: string;
  image?: string
  icon?: IconProp
}
export interface FeatureProps extends SectionItem {
}

export interface HeaderProps {
  email: string | null | undefined;
}

export interface DashboardHeaderProps extends HeaderProps {
      credits: number;
}

export interface ProgressBarProps{
  progress: number;
  label?: string;
}

export interface StatusTrackerPopUpProps {
  title?: string;
  status: Status | null;
  description?: string;
  minimized: boolean;
  onMinimize: () => void;
}

export interface ProgressTrackerPopUpProps extends StatusTrackerPopUpProps {
  progress?: number;
  label?: string;
}

export interface MetricType {
  name: string;
  value: number;
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
  
  export type QuestionnaireAnswer = string[] | string | boolean;

  export interface TQuestion<T extends Record<string, QuestionnaireAnswer>> {
    questionCategory: keyof T;
    question: string;
    options?: string[]; // Optional choices for questions
    allowMultipleAnswers?: boolean;
    isTextInput?: boolean;
  }
  
  
