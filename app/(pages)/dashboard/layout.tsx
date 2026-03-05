import { PromptsProvider } from "@/app/providers/prompts";
import { sereleumClient } from "@/app/client";
import Sidenav from "@/app/ui/nav/side_navbar/sidenav";
import { auth } from "@/auth";
import { PromptsOverviewInfo } from "@/app/types";

const defaultOverview:PromptsOverviewInfo = {
  total_clusters: 0,
  total_prompts: 0,
  top_clusters: [],
  top_cluster_token_counts: {}
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
    const stage = process.env.NEXT_PUBLIC_APP_STAGE;
  
    // const session = await auth();
    // const email = session?.user?.email; 
    // const credits = session?.user?.credits; 
    
    const clusters = stage === "mvp"? [] : await sereleumClient.getClusters()
    const prompts = stage === "mvp"? [] : await sereleumClient.getPrompts(undefined, 25)
    const promptOverview = stage === "mvp"? defaultOverview : await sereleumClient.getPromptsOverview();

  return (
    <PromptsProvider initialClusters={clusters} initialPrompts={prompts} overview={promptOverview}>
      <div className={``}>
        {/* <Sidenav email={email} credits={credits!}/> */}
        {/* <div className="flex flex-col max-w-7xl mx-auto lg:pl-[240px] pt-16 lg:pt-0">{children}</div> */}

        <div className="flex flex-col max-w-7xl mx-auto pt-16">{children}</div>
      </div>
    </PromptsProvider>
  )
}
