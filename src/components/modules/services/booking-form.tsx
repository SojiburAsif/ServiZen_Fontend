/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { type ServiceRecord } from "@/services/services.service";
import { jwtUtils } from "@/lib/jwtUtils";
import { handleBookLater, handleBookNow } from "../../../app/(commonLayout)/actions/booking-actions";
import LocationSelector from "@/components/shared/LocationSelector";
import { Role } from "@/app/constants/role";
import { useRouter } from "next/navigation";
import {
  CalendarIcon,
  CreditCard,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface BookingFormProps {
  service: ServiceRecord;
}

const timeSlots = [
  "09:00 AM", "10:30 AM", "12:00 PM", "01:30 PM", "03:00 PM", "04:30 PM", "06:00 PM", "07:30 PM"
];

export function BookingForm({ service }: BookingFormProps) {
  const [bookingType, setBookingType] = useState<"now" | "later">("now");
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const router = useRouter();

  useEffect(() => {
    const accessToken = document.cookie.split("; ").find(r => r.startsWith("accessToken="))?.split("=")[1];
    if (accessToken) {
      const decoded = jwtUtils.decodedToken(accessToken);
      setUserRole(decoded?.role?.toUpperCase() || null);
    }
  }, []);

  const handleLocationSelect = (loc: { lat: number; lng: number; address: string }) => {
    setLatitude(String(loc.lat));
    setLongitude(String(loc.lng));
    setAddress(loc.address);
    const parts = loc.address.split(',');
    setCity(parts[parts.length - 2]?.trim() || "Dinajpur");
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      if (bookingType === "now" && service.price < 60) {
        throw new Error("Minimum booking amount is ৳60");
      }

      const action = bookingType === "now" ? handleBookNow : handleBookLater;
      const result = await action(formData);

      if (result.success) {
        // Fix: Use type narrowing or 'in' operator to check for paymentUrl
        if (bookingType === "now" && "paymentUrl" in result && result.paymentUrl) {
          window.location.href = result.paymentUrl;
        } else {
          toast.success("Service Booked Successfully!");
          setIsOpen(false);
          router.push(userRole === Role.CLIENT ? '/dashboard/my-bookings' : '/dashboard');
        }
      } else {
        toast.error((result as any).error || "Something went wrong");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full h-14 rounded-2xl bg-emerald-500 text-black font-semibold text-lg hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all active:scale-95"
      >
        BOOKING NOW
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] bg-[#0A0A0A] border border-zinc-800 p-8 shadow-2xl">
            
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-3xl font-semibold text-white">Complete Booking</h3>
                <p className="text-zinc-500 text-sm mt-1">Fill the details to confirm your service.</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-zinc-900 rounded-full transition-colors">
                <CheckCircle2 className="h-6 w-6 text-zinc-600 rotate-45" />
              </button>
            </div>

            <form action={handleSubmit} className="space-y-6">
              <input type="hidden" name="serviceId" value={service.id} />
              <input type="hidden" name="latitude" value={latitude} />
              <input type="hidden" name="longitude" value={longitude} />

              <div className="grid grid-cols-2 gap-4 p-1 bg-zinc-900 rounded-2xl border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setBookingType("now")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${bookingType === "now" ? "bg-emerald-500 text-black shadow-lg" : "text-zinc-500 hover:text-white"}`}
                >
                  <CreditCard className="h-4 w-4" /> Pay Now
                </button>
                <button
                  type="button"
                  onClick={() => setBookingType("later")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${bookingType === "later" ? "bg-emerald-500 text-black shadow-lg" : "text-zinc-500 hover:text-white"}`}
                >
                  <CalendarIcon className="h-4 w-4" /> Book Later
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">Preferred Date</label>
                  <Input 
                    type="date" name="bookingDate" required 
                    className="bg-zinc-900 border-zinc-800 rounded-xl h-12 text-white focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">Preferred Time</label>
                  <select name="bookingTime" required className="w-full h-12 bg-zinc-900 border border-zinc-800 rounded-xl px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">Service Location</label>
                <LocationSelector onLocationSelect={handleLocationSelect} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input placeholder="City" name="city" value={city} onChange={(e)=>setCity(e.target.value)} required className="bg-zinc-900 border-zinc-800 rounded-xl h-12" />
                  <div className="flex gap-2">
                    <Input placeholder="Lat" value={latitude} readOnly className="bg-zinc-800/50 border-zinc-800 rounded-xl h-12 text-zinc-500" />
                    <Input placeholder="Lng" value={longitude} readOnly className="bg-zinc-800/50 border-zinc-800 rounded-xl h-12 text-zinc-500" />
                  </div>
                </div>
                <Textarea 
                  placeholder="Street Address & House No." 
                  name="address" value={address} 
                  onChange={(e)=>setAddress(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 rounded-2xl min-h-[100px]" 
                />
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-zinc-800">
                <div className="flex-1">
                  <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-tighter">Total Price</p>
                  <p className="text-2xl font-semibold text-emerald-500">৳{service.price}</p>
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-[2] h-14 rounded-2xl bg-white text-black font-semibold hover:bg-emerald-500 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "CONFIRM BOOKING"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}