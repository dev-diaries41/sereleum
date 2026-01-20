import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { positions } from "../constants/layout/style";
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
}

export interface LogoProps {
  src: string;
  name: string;
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

    
export type FeedbackState = {
  errors?: {
    feedbackType?: string[];
    email?: string[];
    feedback?: string[];
  };
  message: string | null;
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
  position?: keyof typeof positions;
  children?: ReactNode;
  isError?: boolean;
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
  onClose?: () => void;
  onConfirm?: () => void;
}

export interface ProviderProps {
  children: ReactNode;
}

export interface UserProfileWidgetProps {
  credits: number;
  userId: string | undefined | null;    //email/uid/username
} 

export interface ActionRowProps {
  onCopy: () => void;
  onDelete: () => void;
  shareUrl?: string | null;
}

export interface Feature {
  title: string;
  description: string;
  image?: string
}
export interface FeatureProps extends Feature {
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

export interface IndexProgressTrackerPopUpProps extends ProgressBarProps {
  title?: string;
  status: Status | null;
  description?: string;
  minimized: boolean;
  onMinimize: () => void;
}

