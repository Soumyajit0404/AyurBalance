"use client"

import { useTheme } from "next-themes"
import { Moon, Sun, Bell, BellOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

export default function SettingsPage() {
  const { setTheme, theme } = useTheme()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState(true)

  const handleNotificationToggle = (checked: boolean) => {
    setNotifications(checked)
    toast({
      title: "Notifications " + (checked ? "Enabled" : "Disabled"),
      description: `You will ${checked ? "" : "no longer "}receive notifications.`,
    })
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Settings" description="Manage your application preferences." />
      <div className="grid max-w-2xl gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the app.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark themes.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="h-6 w-6" />
                <Switch
                  id="dark-mode"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
                <Moon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage how you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
               <div className="space-y-0.5">
                <Label htmlFor="notifications" className="text-base">Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts and updates.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <BellOff className="h-6 w-6" />
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={handleNotificationToggle}
                />
                <Bell className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
