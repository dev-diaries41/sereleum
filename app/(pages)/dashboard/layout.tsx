import DashboardHeader from "@/app/ui/nav/dashboard/header"
import Sidenav from "@/app/ui/nav/side_navbar/sidenav";
import { auth } from "@/auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
    const session = await auth();
    const email = session?.user?.email; 
    const credits = session?.user?.credits; 
  
  return (
      <div className={``}>
        <Sidenav email={email} credits={credits!}/>
        {/* <DashboardHeader email={email!} credits={credits!}/> */}
        <div className="flex flex-col lg:pl-[240px]">{children}</div>
      </div>
  )
}
