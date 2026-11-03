import { dashboardLinks } from "@/app/constants/navigation";
import { SereleumProvider } from "@/app/providers/sereleum";
import { apiPromptsClient } from "@/app/sereleum";
import DashboardHeader from "@/app/ui/dashboard/header";
import Sidenav from "@/app/ui/nav/side_navbar/sidenav";
import { auth } from "@/auth";


export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {  
    const session = await auth();
    const email = session?.user?.email; 
    
    const overview = await apiPromptsClient.getOverview();

  return (
    <SereleumProvider initialOverview={overview}>
      <div className={``}>
        <DashboardHeader email={email} navBarItems={dashboardLinks} className="w-full z-50 bg-gray-100 py-4 border border-gray-300 "/>
        {/* <Sidenav email={email}/> */}
        <div className="flex flex-col max-w-5xl mx-auto pt-16 lg:pt-16">{children}</div>
      </div>
    </SereleumProvider>
  )
}
