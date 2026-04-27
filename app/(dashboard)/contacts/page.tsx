"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Pencil, Trash2, Phone, Mail, Star, Bell, Users, UserPlus, CheckCircle } from "lucide-react"
import type { EmergencyContact } from "@/lib/types"

const relationships = [
  "Spouse",
  "Parent",
  "Child",
  "Sibling",
  "Friend",
  "Doctor",
  "Neighbor",
  "Coworker",
  "Other",
]

// Extracted outside the page component to prevent re-creation on every render
// (which was causing input fields to lose focus after each keystroke)
function ContactForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  formData: {
    name: string
    phone: string
    email: string
    relationship: string
    isPrimary: boolean
    notifyOnEmergency: boolean
  }
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string
    phone: string
    email: string
    relationship: string
    isPrimary: boolean
    notifyOnEmergency: boolean
  }>>
  onSubmit: () => void
  onCancel: () => void
  submitLabel: string
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="contact-name">Full Name</Label>
        <Input
          id="contact-name"
          placeholder="Jane Doe"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="h-11"
          required
          autoComplete="off"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-phone">Phone Number</Label>
        <Input
          id="contact-phone"
          type="tel"
          placeholder="+1 555-0123"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          className="h-11"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-email">Email (Optional)</Label>
        <Input
          id="contact-email"
          type="email"
          placeholder="jane@example.com"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-relationship">Relationship</Label>
        <Select
          value={formData.relationship}
          onValueChange={(value) => setFormData(prev => ({ ...prev, relationship: value }))}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select relationship" />
          </SelectTrigger>
          <SelectContent>
            {relationships.map((rel) => (
              <SelectItem key={rel} value={rel}>
                {rel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between rounded-xl border-2 border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50">
        <div className="space-y-1">
          <Label htmlFor="contact-primary" className="font-medium">Primary Contact</Label>
          <p className="text-xs text-muted-foreground">First person to be notified</p>
        </div>
        <Switch
          id="contact-primary"
          checked={formData.isPrimary}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPrimary: checked }))}
        />
      </div>
      <div className="flex items-center justify-between rounded-xl border-2 border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50">
        <div className="space-y-1">
          <Label htmlFor="contact-notify" className="font-medium">Notify on Emergency</Label>
          <p className="text-xs text-muted-foreground">Receive alerts when SOS is triggered</p>
        </div>
        <Switch
          id="contact-notify"
          checked={formData.notifyOnEmergency}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, notifyOnEmergency: checked }))}
        />
      </div>
      <DialogFooter className="pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={onSubmit} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
          {submitLabel}
        </Button>
      </DialogFooter>
    </div>
  )
}

export default function ContactsPage() {
  const { emergencyContacts, addEmergencyContact, updateEmergencyContact, deleteEmergencyContact } = useApp()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null)
  
  const emptyForm = {
    name: "",
    phone: "",
    email: "",
    relationship: "",
    isPrimary: false,
    notifyOnEmergency: true,
  }

  // Form state
  const [formData, setFormData] = useState(emptyForm)

  const resetForm = () => setFormData(emptyForm)

  const handleAddContact = () => {
    addEmergencyContact(formData)
    resetForm()
    setIsAddDialogOpen(false)
  }

  const handleEditContact = () => {
    if (!editingContact) return
    updateEmergencyContact(editingContact.id, formData)
    resetForm()
    setEditingContact(null)
  }

  const openEditDialog = (contact: EmergencyContact) => {
    setFormData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email || "",
      relationship: contact.relationship,
      isPrimary: contact.isPrimary,
      notifyOnEmergency: contact.notifyOnEmergency,
    })
    setEditingContact(contact)
  }

  const handleCancel = () => {
    resetForm()
    setIsAddDialogOpen(false)
    setEditingContact(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Emergency Contacts</h1>
          <p className="text-muted-foreground">
            Manage people who will be notified in emergencies
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/20">
              <Plus className="h-4 w-4" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-red-500" />
                Add Emergency Contact
              </DialogTitle>
              <DialogDescription>
                Add someone who will be notified when you trigger an emergency.
              </DialogDescription>
            </DialogHeader>
          <ContactForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleAddContact}
            onCancel={handleCancel}
            submitLabel="Add Contact"
          />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="relative overflow-hidden border-2">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
          <CardContent className="relative flex items-center gap-4 p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5">
              <Users className="h-7 w-7 text-blue-500" />
            </div>
            <div>
              <p className="text-3xl font-bold">{emergencyContacts.length}</p>
              <p className="text-sm text-muted-foreground">Total Contacts</p>
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-2">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
          <CardContent className="relative flex items-center gap-4 p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
              <Bell className="h-7 w-7 text-emerald-500" />
            </div>
            <div>
              <p className="text-3xl font-bold">
                {emergencyContacts.filter(c => c.notifyOnEmergency).length}
              </p>
              <p className="text-sm text-muted-foreground">Will be Notified</p>
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-2">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />
          <CardContent className="relative flex items-center gap-4 p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/5">
              <Star className="h-7 w-7 text-amber-500" />
            </div>
            <div>
              <p className="text-3xl font-bold">
                {emergencyContacts.filter(c => c.isPrimary).length}
              </p>
              <p className="text-sm text-muted-foreground">Primary Contact</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contacts List */}
      {emergencyContacts.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
              <Users className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">No Emergency Contacts</h3>
            <p className="mb-6 text-center text-muted-foreground max-w-sm">
              Add contacts who will be notified when you trigger an emergency alert.
            </p>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/20">
                  <Plus className="h-4 w-4" />
                  Add Your First Contact
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-red-500" />
                    Add Emergency Contact
                  </DialogTitle>
                  <DialogDescription>
                    Add someone who will be notified when you trigger an emergency.
                  </DialogDescription>
                </DialogHeader>
                <ContactForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleAddContact}
                  onCancel={handleCancel}
                  submitLabel="Add Contact"
                />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {emergencyContacts.map((contact) => (
            <Card key={contact.id} className="group relative overflow-hidden border-2 transition-all hover:shadow-lg hover:border-border/80">
              {contact.isPrimary && (
                <div className="absolute right-3 top-3">
                  <Badge className="gap-1 bg-amber-500 hover:bg-amber-600 text-white">
                    <Star className="h-3 w-3" />
                    Primary
                  </Badge>
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-red-500/10 to-red-500/5 text-lg font-bold text-red-500">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{contact.name}</CardTitle>
                    <CardDescription>{contact.relationship}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <a href={`tel:${contact.phone}`} className="hover:underline font-medium">
                      {contact.phone}
                    </a>
                  </div>
                  {contact.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <a href={`mailto:${contact.email}`} className="hover:underline truncate">
                        {contact.email}
                      </a>
                    </div>
                  )}
                </div>
                
                <div>
                  {contact.notifyOnEmergency ? (
                    <Badge variant="secondary" className="gap-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                      <CheckCircle className="h-3 w-3" />
                      Will be notified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1 text-muted-foreground">
                      <Bell className="h-3 w-3" />
                      No alerts
                    </Badge>
                  )}
                </div>
                
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Dialog open={editingContact?.id === contact.id} onOpenChange={(open) => !open && setEditingContact(null)}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 gap-1"
                        onClick={() => openEditDialog(contact)}
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Contact</DialogTitle>
                        <DialogDescription>
                          Update emergency contact information.
                        </DialogDescription>
                      </DialogHeader>
                      <ContactForm
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleEditContact}
                        onCancel={handleCancel}
                        submitLabel="Save Changes"
                      />
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30">
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Contact</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove {contact.name} from your emergency contacts? 
                          They will no longer be notified during emergencies.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteEmergencyContact(contact.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
