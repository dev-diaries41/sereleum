import { PromptsProvider } from "@/app/providers/prompts";

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <PromptsProvider>
      <div className={``}>
        <div className="flex flex-col max-w-7xl mx-auto pt-24">{children}</div>
      </div>
    </PromptsProvider>
  )
}
