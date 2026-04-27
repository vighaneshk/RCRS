"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Users, Plus, Search, Phone, Mail, Shield, UserCheck, Clock, Trash2, Pencil } from "lucide-react"

interface StaffMember {
  id: string
  name: string
  role: string
  department: string
  phone: string
  email: string
  status: "available" | "busy" | "off-duty"
  shift: string
}

const initialStaff: StaffMember[] = [
  { id: "1", name: "Mike Johnson", role: "Security", department: "Security", phone: "+1 555-1001", email: "mike@hotel.com", status: "available", shift: "Morning" },
  { id: "2", name: "Sarah Williams", role: "Front Desk", department: "Reception", phone: "+1 555-1002", email: "sarah@hotel.com", status: "busy", shift: "Morning" },
  { id: "3", name: "Tom Anderson", role: "Manager", department: "Management", phone: "+1 555-1003", email: "tom@hotel.com", status: "available", shift: "Morning" },
  { id: "4", name: "Lisa Chen", role: "Security", department: "Security", phone: "+1 555-1004", email: "lisa@hotel.com", status: "off-duty", shift: "Evening" },
  { id: "5", name: "James Rivera", role: "Paramedic", department: "Medical", phone: "+1 555-1005", email: "james@hotel.com", status: "available", shift: "Night" },
  { id: "6", name: "Emma Brooks", role: "Concierge", department: "Guest Services", phone: "+1 555-1006", email: "emma@hotel.com", status: "busy", shift: "Morning" },
]

const statusColors: Record<string, string> = {
  available: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  busy: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  "off-duty": "bg-slate-500/10 text-slate-600 border-slate-500/30",
}

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
  const [form, setForm] = useState({
    name: "", role: "", department: "", phone: "", email: "", status: "available" as StaffMember["status"], shift: "Morning",
  })

  const resetForm = () => setForm({ name: "", role: "", department: "", phone: "", email: "", status: "available", shift: "Morning" })

  const handleAdd = () => {
    const newMember: StaffMember = { ...form, id: `staff-${Date.now()}` }
    setStaff(prev => [...prev, newMember])
    resetForm()
    setIsAddOpen(false)
  }

  const handleEdit = () => {
    if (!editingStaff) return
    setStaff(prev => prev.map(s => s.id === editingStaff.id ? { ...editingStaff, ...form } : s))
    setEditingStaff(null)
    resetForm()
  }

  const handleDelete = (id: string) => setStaff(prev => prev.filter(s => s.id !== id))

  const openEdit = (member: StaffMember) => {
    setForm({ name: member.name, role: member.role, department: member.department, phone: member.phone, email: member.email, status: member.status, shift: member.shift })
    setEditingStaff(member)
  }

  const filtered = staff.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const available = staff.filter(s => s.status === "available").length
  const busy = staff.filter(s => s.status === "busy").length

  const StaffForm = ({ onSubmit, label }: { onSubmit: () => void; label: string }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Full Name</Label>
          <Input placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Role</Label>
          <Input placeholder="Security Officer" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Department</Label>
          <Input placeholder="Security" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Shift</Label>
          <Select value={form.shift} onValueChange={v => setForm({ ...form, shift: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Morning">Morning</SelectItem>
              <SelectItem value="Evening">Evening</SelectItem>
              <SelectItem value="Night">Night</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Phone</Label>
        <Input type="tel" placeholder="+1 555-0000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input type="email" placeholder="staff@hotel.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Status</Label>
        <Select value={form.status} onValueChange={v => setForm({ ...form, status: v as StaffMember["status"] })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="busy">Busy</SelectItem>
            <SelectItem value="off-duty">Off Duty</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => { resetForm(); setIsAddOpen(false); setEditingStaff(null) }}>Cancel</Button>
        <Button onClick={onSubmit}>{label}</Button>
      </DialogFooter>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">Manage hotel staff and emergency responders</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" />Add Staff Member</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Staff Member</DialogTitle>
              <DialogDescription>Add a new staff member to the system.</DialogDescription>
            </DialogHeader>
            <StaffForm onSubmit={handleAdd} label="Add Member" />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Staff", value: staff.length, icon: Users, color: "text-blue-500" },
          { label: "Available", value: available, icon: UserCheck, color: "text-emerald-500" },
          { label: "Busy", value: busy, icon: Clock, color: "text-amber-500" },
          { label: "Off Duty", value: staff.length - available - busy, icon: Shield, color: "text-slate-500" },
        ].map(stat => (
          <Card key={stat.label} className="relative overflow-hidden">
            <CardContent className="flex items-center gap-4 p-4">
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search staff..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      {/* Staff Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(member => (
          <Card key={member.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  {member.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base truncate">{member.name}</CardTitle>
                  <CardDescription>{member.role} • {member.department}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={statusColors[member.status]}>
                  {member.status}
                </Badge>
                <Badge variant="outline" className="text-xs">{member.shift} Shift</Badge>
              </div>
              <div className="space-y-1.5 text-sm">
                <a href={`tel:${member.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Phone className="h-3.5 w-3.5" />{member.phone}
                </a>
                <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="h-3.5 w-3.5" />{member.email}
                </a>
              </div>
              <div className="flex gap-2 pt-2 border-t border-border">
                <Dialog open={editingStaff?.id === member.id} onOpenChange={open => !open && setEditingStaff(null)}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => openEdit(member)}>
                      <Pencil className="h-3 w-3" />Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Staff Member</DialogTitle>
                      <DialogDescription>Update staff member information.</DialogDescription>
                    </DialogHeader>
                    <StaffForm onSubmit={handleEdit} label="Save Changes" />
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm" className="gap-1 text-destructive hover:bg-destructive/10 hover:border-destructive/30" onClick={() => handleDelete(member.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-10 w-10 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No staff members found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
