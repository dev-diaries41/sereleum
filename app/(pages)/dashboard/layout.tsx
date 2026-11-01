import { ItemsProvider } from "@/app/providers/prompts";
import { apiPromptsClient } from "@/app/sereleum";
import Sidenav from "@/app/ui/nav/side_navbar/sidenav";
import { auth } from "@/auth";


export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {  
    const session = await auth();
    const email = session?.user?.email; 
    
    const clusters = await apiPromptsClient.getClusters()
    const items = await apiPromptsClient.getItems(undefined, 25)
    const overview = await apiPromptsClient.getOverview();

  return (
    <ItemsProvider initialClusters={clusters} initialItems={items} initialOverview={overview}>
      <div className={``}>
        <Sidenav email={email}/>
        <div className="flex flex-col max-w-7xl mx-auto lg:pl-[240px] pt-16 lg:pt-0">{children}</div>
      </div>
    </ItemsProvider>
  )
}
