"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Phone, Mail, Heart, Pill, AlertCircle, FileText, Save, Plus, X } from "lucide-react"

export default function ProfilePage() {
  const { user, updateUser } = useApp()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Profile form state
  const [profile, setProfile] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
  })
  
  // Medical info state
  const [medicalInfo, setMedicalInfo] = useState({
    bloodType: user?.medicalInfo?.bloodType || "",
    allergies: user?.medicalInfo?.allergies || [],
    medications: user?.medicalInfo?.medications || [],
    conditions: user?.medicalInfo?.conditions || [],
    emergencyNotes: user?.medicalInfo?.emergencyNotes || "",
  })
  
  // Input states for adding items
  const [newAllergy, setNewAllergy] = useState("")
  const [newMedication, setNewMedication] = useState("")
  const [newCondition, setNewCondition] = useState("")

  const handleSave = async () => {
    setIsSaving(true)
    // Actually persist to context + localStorage via updateUser
    updateUser({
      name: profile.name,
      phone: profile.phone,
      email: profile.email,
      medicalInfo: {
        bloodType: medicalInfo.bloodType,
        allergies: medicalInfo.allergies,
        medications: medicalInfo.medications,
        conditions: medicalInfo.conditions,
        emergencyNotes: medicalInfo.emergencyNotes,
      },
    })
    await new Promise(resolve => setTimeout(resolve, 600))
    setIsSaving(false)
    setIsEditing(false)
  }

  const addItem = (type: "allergies" | "medications" | "conditions", value: string) => {
    if (!value.trim()) return
    setMedicalInfo(prev => ({
      ...prev,
      [type]: [...prev[type], value.trim()],
    }))
    if (type === "allergies") setNewAllergy("")
    if (type === "medications") setNewMedication("")
    if (type === "conditions") setNewCondition("")
  }

  const removeItem = (type: "allergies" | "medications" | "conditions", index: number) => {
    setMedicalInfo(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }))
  }

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal and medical information
          </p>
        </div>
        <Button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          disabled={isSaving}
          className="gap-2"
        >
          {isSaving ? (
            "Saving..."
          ) : isEditing ? (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          ) : (
            "Edit Profile"
          )}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Your basic account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{user?.name}</p>
                <Badge variant="outline" className="capitalize">{user?.role}</Badge>
              </div>
            </div>
            
            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Medical Information
            </CardTitle>
            <CardDescription>
              Important health details for emergency responders
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Blood Type */}
            <div className="space-y-2">
              <Label>Blood Type</Label>
              <div className="flex flex-wrap gap-2">
                {bloodTypes.map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant={medicalInfo.bloodType === type ? "default" : "outline"}
                    size="sm"
                    disabled={!isEditing}
                    onClick={() => setMedicalInfo({ ...medicalInfo, bloodType: type })}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Allergies */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                Allergies
              </Label>
              <div className="flex flex-wrap gap-2">
                {medicalInfo.allergies.map((allergy, index) => (
                  <Badge key={index} variant="destructive" className="gap-1">
                    {allergy}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeItem("allergies", index)}
                        className="ml-1 rounded-full hover:bg-destructive-foreground/20"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
                {medicalInfo.allergies.length === 0 && (
                  <span className="text-sm text-muted-foreground">No allergies listed</span>
                )}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add allergy..."
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addItem("allergies", newAllergy)}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => addItem("allergies", newAllergy)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <Separator />

            {/* Medications */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Pill className="h-4 w-4 text-primary" />
                Current Medications
              </Label>
              <div className="flex flex-wrap gap-2">
                {medicalInfo.medications.map((medication, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {medication}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeItem("medications", index)}
                        className="ml-1 rounded-full hover:bg-secondary-foreground/20"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
                {medicalInfo.medications.length === 0 && (
                  <span className="text-sm text-muted-foreground">No medications listed</span>
                )}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add medication..."
                    value={newMedication}
                    onChange={(e) => setNewMedication(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addItem("medications", newMedication)}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => addItem("medications", newMedication)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <Separator />

            {/* Medical Conditions */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-warning" />
                Medical Conditions
              </Label>
              <div className="flex flex-wrap gap-2">
                {medicalInfo.conditions.map((condition, index) => (
                  <Badge key={index} variant="outline" className="gap-1 border-warning text-warning">
                    {condition}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeItem("conditions", index)}
                        className="ml-1 rounded-full hover:bg-warning/20"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
                {medicalInfo.conditions.length === 0 && (
                  <span className="text-sm text-muted-foreground">No conditions listed</span>
                )}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add condition..."
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addItem("conditions", newCondition)}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => addItem("conditions", newCondition)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Notes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Emergency Notes
            </CardTitle>
            <CardDescription>
              Additional information for emergency responders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add any important notes for emergency responders (e.g., 'Carries EpiPen in right pocket', 'Has pacemaker', etc.)"
              value={medicalInfo.emergencyNotes}
              onChange={(e) => setMedicalInfo({ ...medicalInfo, emergencyNotes: e.target.value })}
              disabled={!isEditing}
              rows={4}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
