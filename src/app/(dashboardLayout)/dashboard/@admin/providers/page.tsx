/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
    getAllProviders,
    getProviderById,
    updateProvider,
    deleteProvider,
    ProviderListItem,
    ProviderDetailedProfile,
    UpdateProviderData
} from "@/services/provider.service";
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
    Mail,
    Trash2,
    Eye,
    Search,
    UserCheck,
    ShieldAlert,
    ChevronLeft,
    ChevronRight,
    Globe,
    Key,
    MapPin,
    Phone,
    User,
    Filter,
    AlertCircle,
    Star,
    DollarSign,
    Briefcase,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const statusColors: any = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400",
    BLOCKED: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400",
    DELETED: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-500",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400",
};

export default function AdminProvidersPage() {
    const [providers, setProviders] = useState<ProviderListItem[]>([]);
    const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProvider, setSelectedProvider] = useState<ProviderListItem | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [detailedProvider, setDetailedProvider] = useState<ProviderDetailedProfile | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

    const fetchProviders = useCallback(async (page: number = 1) => {
        try {
            setLoading(true);
            const response = await getAllProviders(page, 10);
            if (response) {
                setProviders(response.data);
                setMeta({
                    page: response.meta.page,
                    totalPages: Math.ceil(response.meta.total / response.meta.limit),
                    total: response.meta.total
                });
            }
        } catch (error) {
            toast.error("Failed to fetch providers");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProviders();
    }, [fetchProviders]);

    const filteredProviders = useMemo(() => {
        return providers.filter(provider =>
            provider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            provider.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            provider.contactNumber?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [providers, searchTerm]);

    const handleViewProvider = async (provider: ProviderListItem) => {
        setIsProcessing(true);
        try {
            const providerDetails = await getProviderById(provider.id);
            if (providerDetails) {
                setDetailedProvider(providerDetails);
                setIsViewDialogOpen(true);
            }
        } catch (error) {
            toast.error("Failed to load provider details");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDeleteProvider = async () => {
        if (!selectedProvider) return;

        setIsProcessing(true);
        try {
            await deleteProvider(selectedProvider.id);
            toast.success("Provider deleted successfully");

            // Close the view modal if it's showing the deleted provider
            if (isViewDialogOpen && detailedProvider && detailedProvider.id === selectedProvider.id) {
                setIsViewDialogOpen(false);
                setDetailedProvider(null);
            }

            setIsDeleteDialogOpen(false);

            // Refresh the providers list
            await fetchProviders(meta.page);
        } catch (error) {
            toast.error("Failed to delete provider");
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading && providers.length === 0) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse">Loading providers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">Provider Management</h1>
                    <p className="text-muted-foreground">Monitor and manage service providers.</p>
                </div>
                <Card className="bg-primary/5 border-none shadow-none">
                    <CardContent className="py-3 px-6 flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-xs uppercase font-bold text-muted-foreground">Total Providers</p>
                            <p className="text-2xl font-black">{meta.total}</p>
                        </div>
                        <UserCheck className="h-8 w-8 text-primary opacity-50" />
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-xl border-muted/20 overflow-hidden">
                <CardHeader className="border-b bg-muted/30">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, email, or phone..."
                                className="pl-10 bg-background"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" onClick={() => fetchProviders(meta.page)} disabled={loading}>
                            <Loader2 className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead className="font-bold">Provider Information</TableHead>
                                <TableHead className="font-bold">Contact & Rating</TableHead>
                                <TableHead className="font-bold">Status</TableHead>
                                <TableHead className="font-bold">Wallet</TableHead>
                                <TableHead className="text-right font-bold px-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProviders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <ShieldAlert className="h-12 w-12 mb-2 opacity-20" />
                                            <p>No providers found matching your search.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredProviders.map((provider) => (
                                    <TableRow key={provider.id} className="group transition-colors">
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-base">{provider.name || "Unnamed Provider"}</span>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Mail className="h-3 w-3" /> {provider.email}
                                                </span>
                                                {provider.registrationNumber && (
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Briefcase className="h-3 w-3" /> Reg: {provider.registrationNumber}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                {provider.contactNumber && (
                                                    <span className="text-xs flex items-center gap-1">
                                                        <Phone className="h-3 w-3" /> {provider.contactNumber}
                                                    </span>
                                                )}
                                                {provider.averageRating && (
                                                    <span className="text-xs flex items-center gap-1">
                                                        <Star className="h-3 w-3 text-yellow-500" />
                                                        {provider.averageRating.toFixed(1)} rating
                                                    </span>
                                                )}
                                                {provider.specialties && provider.specialties.length > 0 && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {provider.specialties.length} specialties
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={statusColors[provider.user?.status || 'ACTIVE']}>
                                                {provider.user?.status || 'ACTIVE'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-medium flex items-center gap-1">
                                                    <DollarSign className="h-4 w-4 text-green-600" />
                                                    Balance: ${provider.walletBalance?.toLocaleString() || '0'}
                                                </span>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Briefcase className="h-3 w-3" />
                                                    Earned: ${provider.totalEarned?.toLocaleString() || '0'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right px-6">
                                            <div className="flex justify-end gap-1">
                                                <Button size="icon" variant="ghost" className="hover:text-primary transition-colors" onClick={() => handleViewProvider(provider)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="hover:text-rose-600" onClick={() => { setSelectedProvider(provider); setIsDeleteDialogOpen(true); }}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>

                {/* Pagination UI */}
                <div className="p-4 border-t bg-muted/10 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing page {meta.page} of {meta.totalPages}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={meta.page <= 1}
                            onClick={() => fetchProviders(meta.page - 1)}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={meta.page >= meta.totalPages}
                            onClick={() => fetchProviders(meta.page + 1)}
                        >
                            Next <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* View Provider Details Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Provider Details</DialogTitle>
                    </DialogHeader>
                    {detailedProvider && (
                        <div className="space-y-6">
                            {/* Basic Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Basic Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Name</p>
                                            <p className="font-medium">{detailedProvider.name || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                                            <p className="font-medium">{detailedProvider.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Contact Number</p>
                                            <p className="font-medium">{detailedProvider.contactNumber || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Registration Number</p>
                                            <p className="font-medium">{detailedProvider.registrationNumber || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Experience</p>
                                            <p className="font-medium">{detailedProvider.experience ? `${detailedProvider.experience} years` : "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                                            <p className="font-medium">{detailedProvider.averageRating ? `${detailedProvider.averageRating.toFixed(1)} ⭐` : "N/A"}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">Bio</p>
                                        <p className="text-sm bg-muted/50 p-3 rounded-md">{detailedProvider.bio || "No bio available"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Address</p>
                                        <p className="text-sm bg-muted/50 p-3 rounded-md">{detailedProvider.address || "N/A"}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Financial Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <DollarSign className="h-5 w-5 text-green-600" />
                                        Financial Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-green-50 dark:bg-green-500/10 p-4 rounded-lg border border-green-200 dark:border-green-800">
                                            <div className="flex items-center gap-2 mb-2">
                                                <DollarSign className="h-5 w-5 text-green-600" />
                                                <p className="text-sm font-medium text-green-700 dark:text-green-400">Wallet Balance</p>
                                            </div>
                                            <p className="text-2xl font-bold text-green-600">${detailedProvider.walletBalance?.toLocaleString() || '0'}</p>
                                        </div>
                                        <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Briefcase className="h-5 w-5 text-blue-600" />
                                                <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Total Earned</p>
                                            </div>
                                            <p className="text-2xl font-bold text-blue-600">${detailedProvider.totalEarned?.toLocaleString() || '0'}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Specialties */}
                            {detailedProvider.specialties && detailedProvider.specialties.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Specialties</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {detailedProvider.specialties.map((specialty, index) => (
                                                <Badge key={index} variant="outline">
                                                    {specialty.specialty?.title || "Unknown Specialty"}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Provider</DialogTitle>
                        <DialogDescription>Are you sure you want to delete {selectedProvider?.name}? This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteProvider} disabled={isProcessing}>
                            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete Provider
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}