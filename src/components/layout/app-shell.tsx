"use client"
import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Carrot,
  LayoutDashboard,
  MessageCircleQuestion,
  NotebookText,
  Pipette,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Logo } from "@/components/icons"
import { Button } from '@/components/ui/button'
import { UserNav } from './user-nav'

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/patients", label: "Patients", icon: Users },
  { href: "/food-database", label: "Food Database", icon: Carrot },
  { href: "/diet-plan-tool", label: "AI Diet Plan", icon: NotebookText },
  { href: "/recipe-analysis", label: "Recipe Analysis", icon: Pipette },
  { href: "/q-and-a", label: "Q&A", icon: MessageCircleQuestion },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo className="size-8 text-primary" />
            <span className="font-headline text-xl text-primary">AyurBalance</span>
          </Link>
        </SidebarHeader>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarFooter>
          {/* Footer content if any */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
             {/* Can add breadcrumbs or page title here */}
          </div>
          <UserNav />
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
