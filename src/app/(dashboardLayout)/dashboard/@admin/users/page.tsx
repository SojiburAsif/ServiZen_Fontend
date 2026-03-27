/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { getAllUsers, updateUserStatus, deleteUser, AdminUser, getUserById, DetailedUser } from "@/services/user.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { 
    Mail, Trash2, Edit2, Loader2, Eye, Search, 
    UserCheck, ShieldAlert, ChevronLeft, ChevronRight, 
    Globe, Key, MapPin, Phone, User, Filter, AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

// বর্তমান লগইন করা অ্যাডমিনের আইডি (এটি আপনার Auth context থেকে আসা উচিত)
const CURRENT_ADMIN_ID = "your-admin-id"; 

const statusColors: any = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400",
    BLOCKED: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400",
    DELETED: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-500",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400",
};

export default function AllUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [newStatus, setNewStatus] = useState("");
    const [detailedUser, setDetailedUser] = useState<DetailedUser | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

    const fetchUsers = useCallback(async (page: number = 1) => {
        try {
            setLoading(true);
            const response = await getAllUsers(page, 10);
            if (response) {
                setUsers(response.data);
                setMeta({
                    page: response.meta.page,
                    totalPages: Math.ceil(response.meta.total / response.meta.limit),
                    total: response.meta.total
                });
            }
        } catch (error) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "ALL" || user.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [users, searchTerm, statusFilter]);

    const handleStatusUpdate = async () => {
        if (!selectedUser) return;
        
        // Validation: Cannot update self
        if (selectedUser.id === CURRENT_ADMIN_ID) {
            return toast.error("You cannot change your own status!");
        }

        // Special handling for deleted users - allow restoration
        if (selectedUser.isDeleted && newStatus === "ACTIVE") {
            // Allow restoration: set isDeleted to false and status to ACTIVE
            setIsProcessing(true);
            try {
                await updateUserStatus(selectedUser.id, "ACTIVE", false);
                toast.success("User has been restored successfully!");
                setIsStatusDialogOpen(false);
                fetchUsers(meta.page);
            } catch (error) {
                toast.error("Failed to restore user");
            } finally {
                setIsProcessing(false);
            }
            return;
        }

        // Prevent changing status to ACTIVE if user is already deleted
        if (selectedUser.isDeleted && newStatus === "ACTIVE") {
            return toast.error("Cannot change status to ACTIVE for deleted users. Use restoration instead.");
        }

        // Normal status update for non-deleted users
        setIsProcessing(true);
        try {
            await updateUserStatus(selectedUser.id, newStatus);
            toast.success(`User status updated to ${newStatus}`);
            setIsStatusDialogOpen(false);
            fetchUsers(meta.page);
        } catch (error) {
            toast.error("Update failed");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        if (selectedUser.id === CURRENT_ADMIN_ID) {
            return toast.error("Security Risk: You cannot delete your own account.");
        }

        setIsProcessing(true);
        try {
            await deleteUser(selectedUser.id);
            toast.success("User account moved to trash");
            setIsDeleteDialogOpen(false);
            fetchUsers(meta.page);
        } catch (error) {
            toast.error("Failed to delete user");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleViewUser = async (user: AdminUser) => {
        setIsProcessing(true);
        try {
            const userDetails = await getUserById(user.id);
            if (userDetails) {
                setDetailedUser(userDetails);
                setIsViewDialogOpen(true);
            }
        } catch (error) {
            toast.error("Failed to load profile details");
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading && users.length === 0) return <AdminUsersLoadingSkeleton />;

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header with Stats */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-primary/10 via-transparent to-transparent p-6 rounded-3xl border border-primary/5">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                        <ShieldAlert className="h-3 w-3" /> Admin Dashboard
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                        User <span className="text-primary">Directory</span>
                    </h1>
                    <p className="text-muted-foreground max-w-md">Manage permissions, monitor account activity, and control system access.</p>
                </div>
                
                <div className="flex gap-4">
                    <StatCard label="Total Users" value={meta.total} icon={<User className="text-primary"/>} />
                    <StatCard label="Active Now" value={users.filter(u => u.status === 'ACTIVE').length} icon={<UserCheck className="text-emerald-500"/>} />
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search users by name, email or ID..." 
                        className="pl-11 h-12 bg-background border-muted-foreground/20 rounded-2xl focus-visible:ring-primary shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px] h-12 rounded-2xl border-muted-foreground/20">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Accounts</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="BLOCKED">Blocked</SelectItem>
                        <SelectItem value="DELETED">Deleted</SelectItem>
                    </SelectContent>
                </Select>
                <Button 
                    variant="outline" 
                    className="h-12 px-6 rounded-2xl hover:bg-primary hover:text-white transition-all duration-300"
                    onClick={() => fetchUsers(meta.page)} 
                    disabled={loading}
                >
                    <Loader2 className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Sync Data
                </Button>
            </div>

            {/* Main Table Card */}
            <Card className="rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border-muted/30 overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 border-none">
                                    <TableHead className="py-5 px-6 font-bold text-slate-700 dark:text-slate-300">Identity</TableHead>
                                    <TableHead className="font-bold">Privilege</TableHead>
                                    <TableHead className="font-bold">Authentication</TableHead>
                                    <TableHead className="font-bold text-center">Status</TableHead>
                                    <TableHead className="text-right font-bold px-8 text-primary">Control</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-80 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <div className="p-4 bg-muted rounded-full">
                                                    <Search className="h-10 w-10 text-muted-foreground/40" />
                                                </div>
                                                <p className="text-xl font-bold text-slate-400">No results found</p>
                                                <Button variant="link" onClick={() => {setSearchTerm(""); setStatusFilter("ALL")}}>Clear all filters</Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow 
                                            key={user.id} 
                                            className={`hover:bg-primary/[0.02] transition-colors group border-b border-muted/20 ${user.status === 'DELETED' ? 'opacity-60' : ''}`}
                                        >
                                            <TableCell className="py-5 px-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center font-bold text-primary border border-primary/10 overflow-hidden">
                                                        {user.image ? (
                                                            <img src={user.image} alt={user.name || "User"} className="h-full w-full object-cover" />
                                                        ) : user.name ? (
                                                            user.name[0].toUpperCase()
                                                        ) : (
                                                            <User size={18}/>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-800 dark:text-slate-100">{user.name || "Guest User"}</span>
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Mail className="h-3 w-3" /> {user.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="rounded-md border-primary/20 bg-primary/5 text-primary font-bold">
                                                    {user.Role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {user.isGoogleLogin ? (
                                                    <div className="flex items-center gap-2 text-blue-500 font-semibold text-sm">
                                                        <Globe size={14} /> Google Account
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm">
                                                        <Key size={14} /> Standard Login
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge className={`${statusColors[user.status]} border shadow-none px-3 py-1 font-black rounded-full text-[10px]`}>
                                                    {user.status}
                                                    {user.isDeleted && <span className="ml-1 text-xs">(Deleted)</span>}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right px-8">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                    <ActionButton 
                                                        icon={<Eye size={16}/>} 
                                                        onClick={() => handleViewUser(user)} 
                                                        label="View Details"
                                                    />
                                                    <ActionButton 
                                                        icon={user.isDeleted ? <User size={16}/> : <Edit2 size={16}/>} 
                                                        color={user.isDeleted ? "hover:bg-emerald-50 hover:text-emerald-600" : "hover:bg-amber-50 hover:text-amber-600"} 
                                                        disabled={user.id === CURRENT_ADMIN_ID}
                                                        onClick={() => { 
                                                            setSelectedUser(user); 
                                                            setNewStatus(user.isDeleted ? "ACTIVE" : user.status); 
                                                            setIsStatusDialogOpen(true); 
                                                        }} 
                                                    />
                                                    <ActionButton 
                                                        icon={<Trash2 size={16}/>} 
                                                        color="hover:bg-rose-50 hover:text-rose-600" 
                                                        disabled={user.status === 'DELETED' || user.id === CURRENT_ADMIN_ID}
                                                        onClick={() => { setSelectedUser(user); setIsDeleteDialogOpen(true); }} 
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                
                {/* Pagination UI */}
                <div className="p-6 bg-muted/20 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-muted-foreground">
                        Displaying <span className="text-primary">{filteredUsers.length}</span> entries
                    </p>
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="rounded-xl h-10"
                            disabled={meta.page <= 1}
                            onClick={() => fetchUsers(meta.page - 1)}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                        </Button>
                        <div className="flex gap-1">
                            {[...Array(meta.totalPages)].map((_, i) => (
                                <button 
                                    key={i}
                                    onClick={() => fetchUsers(i + 1)}
                                    className={`h-10 w-10 rounded-xl font-bold transition-all ${meta.page === i + 1 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'hover:bg-muted'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <Button 
                            variant="ghost" 
                            size="sm"
                            className="rounded-xl h-10"
                            disabled={meta.page >= meta.totalPages}
                            onClick={() => fetchUsers(meta.page + 1)}
                        >
                            Next <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Profile View Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
                    <DialogHeader className="sr-only">
                        <DialogTitle>User Profile</DialogTitle>
                    </DialogHeader>
                    <div className="h-32 bg-gradient-to-r from-primary to-blue-600 w-full" />
                    <div className="px-8 pb-8">
                        <div className="relative -mt-12 mb-6 flex justify-between items-end">
                            <div className="h-24 w-24 rounded-3xl bg-white dark:bg-slate-900 p-2 shadow-xl overflow-hidden">
                                {detailedUser?.image ? (
                                    <img src={detailedUser.image} alt={detailedUser.name || "User"} className="h-full w-full object-cover rounded-2xl" />
                                ) : (
                                    <div className="h-full w-full rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl font-black text-primary">
                                        {detailedUser?.name?.[0]?.toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <Badge className={`${statusColors[detailedUser?.status || '']} px-4 py-1.5 rounded-xl border-2`}>
                                {detailedUser?.status}
                            </Badge>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-3xl font-black">{detailedUser?.name}</h2>
                                <p className="text-muted-foreground font-medium">{detailedUser?.email}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <InfoBox icon={<ShieldAlert className="text-primary"/>} label="Access Role" value={detailedUser?.Role} />
                                <InfoBox icon={<Key className="text-orange-500"/>} label="Verified" value={detailedUser?.emailVerified ? "Yes" : "No"} />
                                <InfoBox icon={<User size={18}/>} label="Provider" value={detailedUser?.isGoogleLogin ? "Google" : "Email"} />
                                <InfoBox icon={<Phone size={18}/>} label="Phone" value={(detailedUser as any)?.client?.contactNumber || "N/A"} />
                            </div>

                            {detailedUser?.status === 'BLOCKED' && (
                                <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl flex gap-3 items-center text-rose-600">
                                    <AlertCircle size={20} />
                                    <p className="text-sm font-bold">This user is currently restricted from logging in.</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 pt-6 border-t flex justify-end">
                            <Button onClick={() => setIsViewDialogOpen(false)} variant="secondary" className="rounded-xl px-8 font-bold">
                                Close Profile
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Status & Delete Dialogs (Keeping them simple but clean) */}
            <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
                <DialogContent className="rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black">
                            {selectedUser?.isDeleted ? "Restore User" : "Change Status"}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedUser?.isDeleted 
                                ? `Restoring access for ${selectedUser?.name}`
                                : `Setting new permissions for ${selectedUser?.name}`
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-4">
                        {selectedUser?.isDeleted ? (
                            <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl">
                                <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400">
                                    <User className="h-5 w-5" />
                                    <div>
                                        <p className="font-bold">Restore User Account</p>
                                        <p className="text-sm">This will reactivate the user and restore their access.</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Select value={newStatus} onValueChange={setNewStatus}>
                                <SelectTrigger className="h-14 rounded-2xl border-muted-foreground/20">
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="ACTIVE">✅ Active Account</SelectItem>
                                    <SelectItem value="BLOCKED">🚫 Block Access</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsStatusDialogOpen(false)} className="rounded-xl">Cancel</Button>
                        <Button onClick={handleStatusUpdate} disabled={isProcessing} className="rounded-xl px-8 bg-primary hover:bg-primary/90">
                            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {selectedUser?.isDeleted ? "Restore User" : "Update Now"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-rose-600 font-black text-2xl">Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <b>{selectedUser?.name}</b>? This account will be marked as deleted and cannot be managed further.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-6">
                        <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} className="rounded-xl">Keep User</Button>
                        <Button variant="destructive" onClick={handleDeleteUser} disabled={isProcessing} className="rounded-xl px-8">
                            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirm Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// --- Helper UI Components ---

function StatCard({ label, value, icon }: { label: string, value: number, icon: React.ReactNode }) {
    return (
        <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-none shadow-sm min-w-[140px] rounded-2xl">
            <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center border shadow-sm">
                    {icon}
                </div>
                <div>
                    <p className="text-[10px] uppercase font-black text-muted-foreground tracking-tighter leading-none mb-1">{label}</p>
                    <p className="text-2xl font-black leading-none">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}

function ActionButton({ icon, onClick, color = "hover:text-primary", disabled = false, label }: any) {
    return (
        <Button 
            size="icon" 
            variant="ghost" 
            disabled={disabled}
            className={`${color} h-10 w-10 rounded-xl hover:bg-white dark:hover:bg-slate-800 shadow-none transition-all duration-200 border border-transparent hover:border-muted`}
            onClick={onClick}
            title={label}
        >
            {icon}
        </Button>
    );
}

function InfoBox({ icon, label, value }: { icon: React.ReactNode, label: string, value: any }) {
    return (
        <div className="p-4 rounded-2xl bg-muted/30 border border-muted/50 flex items-start gap-3">
            <div className="mt-1">{icon}</div>
            <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground mb-0.5">{label}</p>
                <p className="font-bold text-slate-700 dark:text-slate-200">{value || "N/A"}</p>
            </div>
        </div>
    );
}

function AdminUsersLoadingSkeleton() {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
            <div className="flex justify-between items-end">
                <div className="space-y-4">
                    <div className="h-4 w-24 bg-muted rounded-full" />
                    <div className="h-12 w-64 bg-muted rounded-2xl" />
                </div>
                <div className="flex gap-4">
                    <div className="h-20 w-32 bg-muted rounded-2xl" />
                    <div className="h-20 w-32 bg-muted rounded-2xl" />
                </div>
            </div>
            <div className="h-[500px] w-full bg-muted/20 rounded-[2rem] border" />
        </div>
    );
}