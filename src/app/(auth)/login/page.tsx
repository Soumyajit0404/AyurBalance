"use client";

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

const LoginClient = dynamic(() => import('./client').then(mod => mod.LoginClient), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-[400px] space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  ),
})

export default function LoginPage() {
  return <LoginClient />
}
