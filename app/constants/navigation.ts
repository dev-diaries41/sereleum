import { faBook, faCreditCard, faFlask, faHome, faQuestionCircle, faTerminal } from "@fortawesome/free-solid-svg-icons";
import { NavItem } from "../types";

export const navLinks: NavItem[] = [
    { name: 'Home', link: '/', icon: faHome },
    { name: 'Pricing', link: '/pricing', icon: faCreditCard},
  ];
  
  export const footerLinks: NavItem[] = [
    { name: 'Support', link: '/support', icon: faQuestionCircle},
    { name: 'Pricing', link: '/pricing', icon: faCreditCard},
    { name: 'Terms', link: '/terms'},
    { name: 'License', link: '/license'},
    { name: 'Privacy policy', link: '/privacy'},
  ];
  

  export const headerLinks: NavItem[] = [
    { name: 'Support', link: '/support', icon: faQuestionCircle},
    { name: 'Pricing', link: '/pricing', icon: faCreditCard},
  ];

   export const topSidebarLinks: NavItem[] = [
    { name: 'Home', link: '/dashboard', icon: faHome},
    { name: 'Playground', link: '/dashboard/playground', icon: faFlask},
    { name: 'Prompts', link: '/dashboard/prompts', icon: faTerminal},
  ];

   export const bottomSidebarLinks: NavItem[] = [
    { name: 'Documentation', link: '/docs', icon: faBook},
    { name: 'Support', link: '/support', icon: faQuestionCircle},
  ];
  
    export const sideBarLinks = [...topSidebarLinks, ...bottomSidebarLinks]

  
  