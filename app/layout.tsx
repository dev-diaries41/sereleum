import type { Metadata } from 'next'
import './globals.css'
import Header from '@/app/ui/nav/header';
import Footer from '@/app/ui/footer/footer';
import { auth } from '@/auth';
import AuthProvider from './providers/auth';

import { IBM_Plex_Sans } from 'next/font/google'

const ibmPlex = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600']
})

export const metadata: Metadata = {
  metadataBase: new URL('https://revelium.vercel.app/'),
  title: 'Revelium',
  description: 'Prompt analytics platform that turns real user prompts into actionable insights',
  keywords: ['ai', 'llm', 'prompts', 'clusters', 'analysis', 'optimise'],
  applicationName: 'Revelium',
  openGraph: {
    type: 'website',
    url: 'https://revelium.vercel.app/',
    description: 'Prompt analytics platform that turns real user prompts into actionable insights',
    siteName: 'Revelium',
    images: []
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  const email = session?.user?.email; 
  const credits = session?.user?.credits; 
  return (
    <html lang="en">
      <AuthProvider>
      <body className={`${ibmPlex.className}`}>
        <main className='bg-gray-100 relative flex flex-col min-h-screen '>
          <Header email={email}/>
          {children}
          <Footer/>
        </main>
      </body>
      </AuthProvider>
    </html>
  )
}
