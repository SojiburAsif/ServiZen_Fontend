/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { type ServiceRecord } from "@/services/services.service";
import { handleBookLater, handleBookNow } from "../../../app/(commonLayout)/actions/booking-actions";
import LocationSelector from "@/components/shared/LocationSelector";
import { Role } from "@/app/constants/role";
import { useRouter } from "next/navigation";
import {
  CalendarIcon,
  CreditCard,
  Loader2,
  MapPin,
  Clock,
  Calendar,
  Info,
  CheckCircle2,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface BookingFormProps {
  service: ServiceRecord;
  user: any | null;
}

const timeSlots = [
  "09:00 AM", "10:30 AM", "12:00 PM", "01:30 PM", "03:00 PM", "04:30 PM", "06:00 PM", "07:30 PM"
];

export function BookingForm({ service, user }: BookingFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [bookingType, setBookingType] = useState<"now" | "later">("now");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState(timeSlots[0]);

  const router = useRouter();

  const handleLocationSelect = (loc: { lat: number; lng: number; address: string }) => {
    setLatitude(String(loc.lat));
    setLongitude(String(loc.lng));
    setAddress(loc.address);
    const parts = loc.address.split(',');
    setCity(parts[parts.length - 2]?.trim() || "Dinajpur");
  };

  const handleOpenClick = () => {
    if (!user) {
      toast.error("Please login to book a service");
      router.push('/login');
      return;
    }
    if (user.role === Role.PROVIDER) {
      toast.error("Providers cannot book services.");
      return;
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (bookingType === "now" && service.price < 60) {
        throw new Error("Minimum booking amount is ৳60");
      }

      const formData = new FormData();
      formData.append("serviceId", service.id);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);
      formData.append("city", city);
      formData.append("address", address);
      formData.append("bookingDate", bookingDate);
      formData.append("bookingTime", bookingTime);

      const action = bookingType === "now" ? handleBookNow : handleBookLater;
      const result = await action(formData);

      if (result.success) {
        if (bookingType === "now" && "paymentUrl" in result && result.paymentUrl) {
          window.location.href = result.paymentUrl as string;
        } else {
          toast.success("Service Booked Successfully!");
          setIsOpen(false);
          router.push(user.role === Role.CLIENT ? '/dashboard/my-bookings' : '/dashboard');
        }
      } else {
        toast.error((result as any).error || "Something went wrong");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      toast.error(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleOpenClick}
        className="w-full h-14 rounded-2xl bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-700 hover:scale-[1.02] shadow-xl shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 group"
      >
        <ShieldCheck className="h-5 w-5" /> Book Service Now <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && setIsOpen(open)}>
        <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden bg-white dark:bg-[#0a0a0a] border-gray-200 dark:border-gray-800 rounded-3xl gap-0 max-h-[90vh]">
          {isSubmitting && (
            <div className="absolute inset-0 z-[100] bg-white/60 dark:bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center transition-all">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 border border-gray-100 dark:border-gray-800">
                <div className="relative flex justify-center items-center h-16 w-16">
                  <div className="absolute inset-0 rounded-full border-t-2 border-emerald-500 animate-spin"></div>
                  <Loader2 className="h-8 w-8 text-emerald-500 animate-pulse" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Processing Booking</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Please wait a moment...</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col h-full max-h-[90vh]">
            <DialogHeader className="p-6 pb-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black text-gray-900 dark:text-white">Confirm Booking</DialogTitle>
                  <DialogDescription className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Complete the details below to finalize your service request.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative">
              <form id="booking-form" onSubmit={handleSubmit} className="space-y-8">
                
                {/* Payment & Price Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-3 space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Info className="h-4 w-4" /> Select Booking Method
                    </label>
                    <div className="flex bg-gray-100 dark:bg-gray-900 p-1.5 rounded-2xl border border-gray-200/50 dark:border-gray-800">
                      <button
                        type="button"
                        onClick={() => setBookingType("now")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${bookingType === "now" ? "bg-white dark:bg-[#111] text-emerald-600 shadow-md transform scale-[1.02]" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`}
                      >
                        <CreditCard className="h-4 w-4" /> Pay Now
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookingType("later")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${bookingType === "later" ? "bg-white dark:bg-[#111] text-emerald-600 shadow-md transform scale-[1.02]" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`}
                      >
                        <CalendarIcon className="h-4 w-4" /> Book For Later
                      </button>
                    </div>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl p-5 border border-emerald-100/50 dark:border-emerald-900/30 flex flex-col justify-center items-center text-center">
                     <p className="text-[10px] font-black tracking-widest text-emerald-600/70 uppercase mb-1">Total Fee</p>
                     <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">৳{service.price}</p>
                  </div>
                </div>

                {/* Schedule Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-900/30 p-5 rounded-3xl border border-gray-100 dark:border-gray-800">
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest"><Calendar className="h-4 w-4" /> Preferred Date</label>
                    <Input
                      type="date" required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="bg-white dark:bg-[#111] border-gray-200 dark:border-gray-800 rounded-xl h-12 text-sm font-semibold transition-all focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest"><Clock className="h-4 w-4" /> Preferred Time</label>
                    <div className="relative">
                      <select 
                        required 
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full h-12 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl px-4 text-sm font-semibold appearance-none transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <ChevronRight className="h-4 w-4 rotate-90" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map Section */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest"><MapPin className="h-4 w-4" /> Service Location</label>
                    {city && <span className="text-[10px] font-bold px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full">{city}</span>}
                  </div>
                  
                  <div className="rounded-3xl border-2 border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm h-[320px] relative transition-all hover:border-emerald-200 dark:hover:border-emerald-900/50">
                    <LocationSelector onLocationSelect={handleLocationSelect} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">City</label>
                      <Input 
                        value={city} onChange={(e) => setCity(e.target.value)} required 
                        className="bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 rounded-xl h-12 text-sm font-semibold" 
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Detailed Address</label>
                      <Input 
                        value={address} onChange={(e) => setAddress(e.target.value)} required 
                        placeholder="e.g. House 12, Road 4, Section A" 
                        className="bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 rounded-xl h-12 text-sm font-semibold" 
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] flex items-center justify-between gap-4">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="rounded-xl h-12 px-6 font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white">
                Cancel
              </Button>
              <Button
                form="booking-form"
                type="submit"
                disabled={isSubmitting || !latitude || !longitude}
                className={`h-12 px-10 rounded-xl bg-emerald-600 text-white font-bold text-sm tracking-wide transition-all shadow-lg ${isSubmitting ? 'opacity-50' : 'hover:bg-emerald-700 hover:-translate-y-0.5 shadow-emerald-500/25'}`}
              >
                {bookingType === "now" ? "Pay & Confirm" : "Confirm Booking"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
