'use client'
 
import DefaultError from '@/app/ui/utilities/default-error'
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset?: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])
 
  return (
    <div>
        <DefaultError title={`Error loading cluster details.`}  reset={reset}/>
    </div>
  )
}