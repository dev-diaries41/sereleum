import { faBook, faCreditCard, faFlask, faHome, faLayerGroup, faQuestionCircle, faTerminal } from "@fortawesome/free-solid-svg-icons";
import { NavItem } from "../types";

export const navLinks: NavItem[] = [
    { name: 'Home', link: '/', icon: faHome },
    { name: 'Contact', link: '/contact', icon: faQuestionCircle},
    // { name: 'Pricing', link: '/pricing', icon: faCreditCard},
  ];
  
  export const footerLinks: NavItem[] = [
    // { name: 'Contact', link: '/contact', icon: faQuestionCircle},
    // { name: 'Pricing', link: '/pricing', icon: faCreditCard},
    // { name: 'Terms', link: '/terms'},
    // { name: 'License', link: '/license'},
    // { name: 'Privacy policy', link: '/privacy'},
  ];
   export const sideBarLinks: NavItem[] = [
    { name: 'Home', link: '/dashboard', icon: faHome},
    { name: 'Clusters', link: '/dashboard/clusters', icon: faLayerGroup},
    { name: 'Prompts', link: '/dashboard/prompts', icon: faTerminal},
  ];
  
  