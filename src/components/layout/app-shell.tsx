"use client"
import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Carrot,
  LayoutDashboard,
  MessageCircleQuestion,
  NotebookText,
  Pipette,
  Users,
  Menu,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Logo } from "@/components/icons"
import { Button } from '@/components/ui/button'
import { UserNav } from './user-nav'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl text-primary">AyurBalance</span>
          </Link>
          {menuItems.map((item) => (
             <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-primary",
                pathname === item.href ? "text-primary font-semibold" : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                 {menuItems.map((item) => (
                  <Link href={item.href} key={item.href}>
                    <DropdownMenuItem>
                       <item.icon className="mr-2 h-4 w-4" />
                       {item.label}
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <UserNav />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  )
}
