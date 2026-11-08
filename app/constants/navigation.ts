import {faBookOpen, faHome, faLayerGroup, faTags } from "@fortawesome/free-solid-svg-icons";
import { NavItem } from "../types";


export const dashboardLinks: NavItem[] = [
    { name: 'Overview', link: '/dashboard', icon: faBookOpen},
    { name: 'Clusters', link: '/dashboard/clusters', icon: faLayerGroup},
    { name: 'Tags', link: '/dashboard/tags', icon: faTags},

    // { name: 'Pricing', link: '/pricing'},
  ];

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
  ];
  
  