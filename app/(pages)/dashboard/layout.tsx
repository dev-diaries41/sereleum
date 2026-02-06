import { PromptsProvider } from "@/app/providers/prompts";
import { sereleumClient } from "@/app/sereleum/client";
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
    const clusters = await sereleumClient.getClusters()

    const prompts = await sereleumClient.getPrompts(undefined, 25)
    const promptOverview = await sereleumClient.getPromptsOverview();

  return (
    <PromptsProvider initialClusters={clusters} initialPrompts={prompts} overview={promptOverview}>
      <div className={``}>
        <Sidenav email={email} credits={credits!}/>
        <div className="flex flex-col max-w-7xl mx-auto lg:pl-[240px] pt-16 lg:pt-0">{children}</div>
      </div>
      </PromptsProvider>
  )
}
