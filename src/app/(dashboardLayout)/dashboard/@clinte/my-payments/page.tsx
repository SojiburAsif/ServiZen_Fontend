/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserPayments } from "@/services/user-payment.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  CalendarDays, 
  User as UserIcon, 
  Wrench, 
  Download, 
  LayoutGrid, 
  List, 
  ShieldCheck,
  CreditCard,
  Hash
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// --- Helpers ---
const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default async function MyPaymentsPage() {
  const paymentsResponse = await getUserPayments({ page: 1, limit: 20 });

  if (!paymentsResponse) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-emerald-500 font-bold">
        Failed to load payments...
      </main>
    );
  }

  const { data: payments = [], meta = { total: 0 } } = paymentsResponse;

  return (
    <main className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100">
      <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase dark:text-white">
              Payment <span className="text-emerald-500">History</span>
            </h1>
            <p className="text-zinc-500 mt-2 max-w-md">
              Securely manage your transactions, download invoices, and track service billing.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="size-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
               <ShieldCheck className="text-emerald-500 size-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-zinc-500">Total Spent</p>
              <p className="text-xl font-black text-emerald-500 leading-none">
                ৳{payments.reduce((acc: number, curr: any) => acc + curr.amount, 0)}
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="table" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-xl">
              <TabsTrigger value="table" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-black transition-all">
                Table
              </TabsTrigger>
              <TabsTrigger value="card" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-black transition-all">
                Cards
              </TabsTrigger>
            </TabsList>
            
            <p className="text-xs font-bold uppercase text-zinc-500 tracking-wider">
              {payments.length} Transactions
            </p>
          </div>

          {/* --- Table View --- */}
          <TabsContent value="table">
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="text-[11px] font-bold uppercase text-zinc-500 py-5 px-6">#</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase text-zinc-500 py-5">Service & Transaction</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase text-zinc-500">Provider</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase text-zinc-500">Amount</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase text-zinc-500">Date</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase text-zinc-500 text-center">Status</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase text-zinc-500 text-right px-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {payments.map((payment: any, index: number) => (
                    <TableRow key={payment.transactionId || `pay-${index}`} className="border-none hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors group">
                      <TableCell className="px-6 py-5 align-middle">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                          <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400">
                            {index + 1}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-5 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                            <Hash className="size-5 text-zinc-500" />
                          </div>
                          <div>
                            <p className="font-bold dark:text-white leading-none">{payment?.booking?.service?.name || "Service"}</p>
                            <span className="text-[10px] text-zinc-500 font-mono mt-1 block uppercase">TXN: {payment?.transactionId?.slice(-12)}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="align-middle">
                        <div className="flex items-center gap-2">
                          <div className="size-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-[10px] text-zinc-500">
                            {payment?.booking?.provider?.name?.[0] || "P"}
                          </div>
                          <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{payment?.booking?.provider?.name || "Provider"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="align-middle">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-bold text-zinc-500">৳</span>
                          <span className="text-lg font-black text-zinc-900 dark:text-white">{payment?.amount}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-zinc-500 align-middle">
                        {payment?.createdAt ? formatDate(payment.createdAt) : "N/A"}
                      </TableCell>
                      <TableCell className="text-center align-middle">
                        <Badge className="bg-emerald-500 text-black border-none text-[9px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
                          {payment?.status || "PAID"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-6 align-middle">
                        <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all">
                          <Download className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* --- Card View --- */}
          <TabsContent value="card">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {payments.map((payment: any, index: number) => (
                <Card key={payment.transactionId || `card-${index}`} className="bg-zinc-950 border-zinc-800 hover:border-emerald-500/50 transition-all rounded-3xl overflow-hidden group">
                  <CardContent className="p-0">
                    <div className="bg-zinc-900/50 p-5 border-b border-zinc-800">
                      <div className="flex justify-between items-start mb-4">
                        <Badge className="bg-emerald-500 text-black font-black text-[10px]">SUCCESS</Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-emerald-500">
                           <Download className="size-4" />
                        </Button>
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-500 transition-colors">
                        {payment?.booking?.service?.name}
                      </h3>
                      <p className="text-[10px] font-mono text-zinc-500 mt-1">ID: {payment?.transactionId}</p>
                    </div>
                    
                    <div className="p-5 space-y-4">
                       <div className="flex justify-between items-center">
                          <span className="text-zinc-500 text-xs">Amount Paid</span>
                          <span className="text-xl font-black text-emerald-500">৳{payment?.amount}</span>
                       </div>
                       
                       <div className="space-y-2 pt-2 border-t border-zinc-800/50">
                          <div className="flex items-center gap-2 text-xs text-zinc-400">
                             <UserIcon className="size-3 text-emerald-500" />
                             <span>Provider: <b>{payment?.booking?.provider?.name}</b></span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-400">
                             <CalendarDays className="size-3 text-emerald-500" />
                             <span>Date: {payment?.createdAt ? formatDate(payment.createdAt) : "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-400">
                             <CreditCard className="size-3 text-emerald-500" />
                             <span>Method: Stripe Online</span>
                          </div>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {payments.length === 0 && (
          <div className="mt-20 text-center py-20 border-2 border-dashed border-zinc-800 rounded-[40px]">
            <DollarSign className="size-16 text-zinc-800 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white">No Transactions Yet</h3>
            <p className="text-zinc-500 mt-2">When you pay for a service, it will appear here.</p>
          </div>
        )}

        {meta.total > 20 && (
          <div className="mt-12 flex justify-center">
            <Button variant="outline" className="rounded-full border-zinc-800 text-zinc-400 hover:bg-emerald-500 hover:text-black transition-all">
              Load More History
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}