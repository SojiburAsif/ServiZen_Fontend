/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { getAllAdmins } from '@/services/user.service';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Mail, 
  Phone, 
  ShieldCheck, 
  UserPlus, 
  Search,
  Calendar,
  ExternalLink
} from 'lucide-react';

interface Props {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function AllAdminPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const limit = parseInt(params.limit || '10');

  const response = await getAllAdmins(page, limit);
  const admins = response?.data || [];
  const meta = response?.meta || { page, limit, total: 0 };
  const totalPages = Math.ceil(meta.total / limit);

  return (
    <div className="p-4 md:p-8 space-y-8 bg-gray-50/50 dark:bg-[#020802]/50 min-h-screen">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-2xl">
              <ShieldCheck className="size-10 text-green-600 dark:text-green-400" />
            </div>
            Admin <span className="text-green-600 italic">Nexus</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium flex items-center gap-2">
            Control center for platform administrators <Badge variant="secondary" className="rounded-full">{meta.total} Active</Badge>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           {/* Placeholder for Search - Looks Modern */}
           <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search admin..." 
                className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black focus:ring-2 ring-green-500/20 outline-none w-64 transition-all"
              />
           </div>
           <Button className="bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-600/20 font-bold gap-2">
             <UserPlus className="size-4" /> Add Admin
           </Button>
        </div>
      </div>

      {/* --- TABLE CARD --- */}
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] bg-white/70 dark:bg-black/40 backdrop-blur-xl rounded-[2rem] overflow-hidden">
        <CardHeader className="p-8 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-black">Directory</CardTitle>
            <div className="flex gap-2">
               <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
               <div className="h-2 w-2 rounded-full bg-green-500 opacity-50" />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50 dark:bg-white/5">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="py-5 px-8 font-bold uppercase text-[11px] tracking-widest text-gray-400">Identity</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-widest text-gray-400">Communication</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-widest text-gray-400">Account Status</TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-widest text-gray-400">Onboarding</TableHead>
                  <TableHead className="text-right px-8 font-bold uppercase text-[11px] tracking-widest text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-60 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
                        <ShieldCheck className="size-12 opacity-20" />
                        <p className="font-bold italic">No admins registered yet.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  admins.map((admin) => (
                    <TableRow key={admin.id} className="group hover:bg-green-500/[0.02] dark:hover:bg-green-500/[0.05] transition-all border-b border-gray-100 dark:border-white/5">
                      <TableCell className="py-6 px-8">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                             <div className="h-14 w-14 rounded-2xl overflow-hidden ring-2 ring-white dark:ring-gray-800 shadow-md transition-transform group-hover:scale-105">
                                {admin.profilePhoto ? (
                                  <img src={admin.profilePhoto} alt={admin.name} className="h-full w-full object-cover" />
                                ) : (
                                  <div className="h-full w-full bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-white text-xl font-black">
                                    {admin.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                             </div>
                             {admin.user?.status === 'ACTIVE' && (
                               <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white dark:border-black rounded-full shadow-sm" />
                             )}
                          </div>
                          <div>
                            <div className="font-black text-gray-900 dark:text-white text-base tracking-tight">{admin.name}</div>
                            <div className="text-[11px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest opacity-80 flex items-center gap-1">
                               <ShieldCheck className="size-3" /> System Admin
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1.5">
                          <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-2">
                            <div className="p-1 bg-gray-100 dark:bg-white/5 rounded-md"><Mail className="size-3" /></div>
                            {admin.user?.email || admin.email}
                          </div>
                          <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                             <div className="p-1 bg-gray-100 dark:bg-white/5 rounded-md"><Phone className="size-3" /></div>
                             {admin.contactNumber || "N/A"}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <Badge 
                            variant="outline" 
                            className={`w-fit rounded-lg px-3 py-1 font-bold border-none ${
                              admin.user?.status === 'ACTIVE' 
                              ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                              : 'bg-red-500/10 text-red-600'
                            }`}
                          >
                            {admin.user?.status || 'N/A'}
                          </Badge>
                          {admin.user?.emailVerified && (
                            <span className="text-[10px] font-black text-blue-500 uppercase flex items-center gap-1 ml-1">
                               <CheckCircleBadge /> Verified
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400">
                          <Calendar className="size-4 opacity-50" />
                          {new Date(admin.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </div>
                      </TableCell>

                      <TableCell className="text-right px-8">
                         <Button variant="ghost" size="icon" className="rounded-xl hover:bg-green-500/10 hover:text-green-600">
                            <ExternalLink className="size-5" />
                         </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* --- PAGINATION SECTION --- */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-6 bg-gray-50/30 dark:bg-white/5 gap-4">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-tighter">
                Showing <span className="text-gray-900 dark:text-white">{page}</span> of <span className="text-gray-900 dark:text-white">{totalPages}</span> Units
              </span>
              <div className="flex items-center gap-3">
                <Button 
                   variant="outline" 
                   className="rounded-xl border-gray-200 dark:border-gray-800 font-bold hover:bg-white dark:hover:bg-black" 
                   asChild 
                   disabled={page <= 1}
                >
                  <Link href={`?page=${page - 1}&limit=${limit}`} className={page <= 1 ? 'pointer-events-none opacity-50' : ''}>
                    <ChevronLeft className="size-4 mr-2" /> Back
                  </Link>
                </Button>
                
                <div className="flex gap-1">
                   {[...Array(totalPages)].map((_, i) => (
                     <div key={i} className={`h-1.5 w-4 rounded-full transition-all ${page === i + 1 ? 'bg-green-500 w-8' : 'bg-gray-200 dark:bg-gray-800'}`} />
                   ))}
                </div>

                <Button 
                   variant="outline" 
                   className="rounded-xl border-gray-200 dark:border-gray-800 font-bold hover:bg-white dark:hover:bg-black" 
                   asChild 
                   disabled={page >= totalPages}
                >
                  <Link href={`?page=${page + 1}&limit=${limit}`} className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}>
                    Next <ChevronRight className="size-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Simple internal helper icon
function CheckCircleBadge() {
  return (
    <svg className="size-3 fill-current" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}