"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Shield, Bell, Globe, Lock, Save, Building, Phone, Mail, Clock, Zap } from "lucide-react"

export default function AdminSettingsPage() {
  const { demoMode, setDemoMode } = useApp()
  const [saved, setSaved] = useState(false)

  const [hotelSettings, setHotelSettings] = useState({
    hotelName: "Grand Hotel",
    address: "123 Main St, New York, NY 10001",
    phone: "+1 555-HOTEL",
    email: "emergency@grandhotel.com",
    timezone: "America/New_York",
  })

  const [alertSettings, setAlertSettings] = useState({
    autoDispatch: true,
    notifyPolice: true,
    notifyHospital: true,
    notifyFireDept: false,
    smsAlerts: true,
    emailAlerts: true,
    pushNotifications: true,
    countdownSeconds: 5,
    cancelPin: process.env.NEXT_PUBLIC_CANCEL_PIN || "1234",
  })

  const [securitySettings, setSecuritySettings] = useState({
    requirePinToCancel: true,
    locationSharing: true,
    dataRetentionDays: 90,
    encryptLogs: true,
  })

  const handleSave = async () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">Configure your emergency response system</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          {saved ? (
            <><Shield className="h-4 w-4" />Saved!</>
          ) : (
            <><Save className="h-4 w-4" />Save Changes</>
          )}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Hotel Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Hotel Information
            </CardTitle>
            <CardDescription>Basic property details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hotelName">Hotel Name</Label>
              <Input id="hotelName" value={hotelSettings.hotelName} onChange={e => setHotelSettings({ ...hotelSettings, hotelName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={hotelSettings.address} onChange={e => setHotelSettings({ ...hotelSettings, address: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />Phone</Label>
                <Input id="phone" type="tel" value={hotelSettings.phone} onChange={e => setHotelSettings({ ...hotelSettings, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone" className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" />Timezone</Label>
                <Input id="timezone" value={hotelSettings.timezone} onChange={e => setHotelSettings({ ...hotelSettings, timezone: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />Emergency Email</Label>
              <Input id="email" type="email" value={hotelSettings.email} onChange={e => setHotelSettings({ ...hotelSettings, email: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        {/* Alert Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Alert Configuration
            </CardTitle>
            <CardDescription>How and who gets notified</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Auto-Dispatch to Police", description: "Automatically notify police on SOS", key: "notifyPolice" as const },
              { label: "Auto-Dispatch to Hospital", description: "Notify nearest hospital on trigger", key: "notifyHospital" as const },
              { label: "Auto-Dispatch to Fire Dept", description: "Alert fire department when needed", key: "notifyFireDept" as const },
              { label: "SMS Alerts", description: "Send text messages to contacts", key: "smsAlerts" as const },
              { label: "Email Alerts", description: "Send email notifications", key: "emailAlerts" as const },
              { label: "Push Notifications", description: "Browser push notifications", key: "pushNotifications" as const },
            ].map(setting => (
              <div key={setting.key} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="font-medium text-sm">{setting.label}</p>
                  <p className="text-xs text-muted-foreground">{setting.description}</p>
                </div>
                <Switch
                  checked={alertSettings[setting.key]}
                  onCheckedChange={v => setAlertSettings({ ...alertSettings, [setting.key]: v })}
                />
              </div>
            ))}
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />Countdown (sec)</Label>
                <Input
                  type="number"
                  min={3}
                  max={30}
                  value={alertSettings.countdownSeconds}
                  onChange={e => setAlertSettings({ ...alertSettings, countdownSeconds: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1"><Zap className="h-3.5 w-3.5" />Cancel PIN</Label>
                <Input
                  type="password"
                  maxLength={6}
                  value={alertSettings.cancelPin}
                  onChange={e => setAlertSettings({ ...alertSettings, cancelPin: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Security & Privacy
            </CardTitle>
            <CardDescription>Data protection and access controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Require PIN to Cancel", description: "Prevent accidental emergency cancellation", key: "requirePinToCancel" as const },
              { label: "Live Location Sharing", description: "Share location with responders in emergencies", key: "locationSharing" as const },
              { label: "Encrypt Activity Logs", description: "Encrypt all stored emergency logs", key: "encryptLogs" as const },
            ].map(setting => (
              <div key={setting.key} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="font-medium text-sm">{setting.label}</p>
                  <p className="text-xs text-muted-foreground">{setting.description}</p>
                </div>
                <Switch
                  checked={securitySettings[setting.key]}
                  onCheckedChange={v => setSecuritySettings({ ...securitySettings, [setting.key]: v })}
                />
              </div>
            ))}
            <div className="space-y-2">
              <Label>Data Retention (days)</Label>
              <Input
                type="number"
                min={30}
                max={365}
                value={securitySettings.dataRetentionDays}
                onChange={e => setSecuritySettings({ ...securitySettings, dataRetentionDays: Number(e.target.value) })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Demo Mode Card */}
        <Card className={`border-2 ${demoMode ? "border-amber-500/30 bg-amber-500/5" : "border-border"}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Demo Mode
              {demoMode && <Badge className="bg-amber-500 hover:bg-amber-600 text-white">Active</Badge>}
            </CardTitle>
            <CardDescription>
              When enabled, emergencies use simulated alerts instead of real SMS/API calls.
              Perfect for demonstrations and testing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="font-medium">Enable Demo Mode</p>
                <p className="text-sm text-muted-foreground">Simulates all emergency notifications</p>
              </div>
              <Switch checked={demoMode} onCheckedChange={setDemoMode} />
            </div>
            {demoMode && (
              <div className="mt-3 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-sm text-amber-700">
                Demo mode is active. All SMS and API calls are simulated. Cancel PIN: <strong>1234</strong>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
