import { PromptsProvider } from "@/app/providers/prompts";
import { reveliumClient } from "@/app/revelium/client";
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
    const clusters = await reveliumClient.getClusters()
    const prompts = await reveliumClient.getPrompts(undefined, 10)
    const promptOverview = await reveliumClient.getPromptsOverview();

  return (
    <PromptsProvider initialClusters={clusters} initialPrompts={prompts} overview={promptOverview}>
      <div className={``}>
        <Sidenav email={email} credits={credits!}/>
        {/* <DashboardHeader email={email!} credits={credits!}/> */}
        <div className="flex flex-col lg:pl-[240px]">{children}</div>
      </div>
      </PromptsProvider>
  )
}
