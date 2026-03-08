import { faHome, faLayerGroup, faTerminal } from "@fortawesome/free-solid-svg-icons";
import { NavItem } from "../types";

export const navLinks: NavItem[] = [
    { name: 'Contact', link: '/contact'},
    // { name: 'Pricing', link: '/pricing'},
  ];
  
  export const footerLinks: NavItem[] = [
    // { name: 'Contact', link: '/contact'},
    // { name: 'Pricing', link: '/pricing'},
    // { name: 'Terms', link: '/terms'},
    // { name: 'License', link: '/license'},
    // { name: 'Privacy policy', link: '/privacy'},
  ];
   export const sideBarLinks: NavItem[] = [
    { name: 'Home', link: '/dashboard', icon: faHome},
    { name: 'Clusters', link: '/dashboard/clusters', icon: faLayerGroup},
    { name: 'Prompts', link: '/dashboard/prompts', icon: faTerminal},
  ];
  
  