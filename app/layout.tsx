import type { Metadata } from 'next'
import './globals.css'
import Header from '@/app/ui/nav/header';
import Footer from '@/app/ui/footer/footer';
import { auth } from '@/auth';
import AuthProvider from './providers/auth';

import { IBM_Plex_Sans } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"

const ibmPlex = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600']
})

const appName = 'Sereleum'
const description = 'Prompt analytics platform that turns user prompts into actionable insights'

export const metadata: Metadata = {
  metadataBase: new URL('https://sereleum.vercel.app/'),
  title: appName,
  description: description,
  keywords: ['ai', 'llm', 'prompts', 'clusters', 'analysis', 'optimise'],
  applicationName: appName,
  openGraph: {
    type: 'website',
    url: 'https://sereleum.vercel.app/',
    description: description,
    siteName: appName,
    images: ["/sereleum-opengraph.png"]
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  const email = session?.user?.email; 

  return (
    <html lang="en">
      <AuthProvider>
      <body className={`${ibmPlex.className}`}>
        <main className='bg-white relative flex flex-col min-h-screen '>
          <Header email={email}/>
          {children}
          <Footer/>
        </main>
        <Analytics />
      </body>
      </AuthProvider>
    </html>
  )
}
