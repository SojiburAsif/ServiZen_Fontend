"use client";

import { useEffect, useMemo, useState } from "react";
import { type ServiceRecord } from "@/services/services.service";
import { jwtUtils } from "@/lib/jwtUtils";
import { handleBookLater, handleBookNow } from "../../../app/(commonLayout)/actions/booking-actions";
import LocationSelector from "@/components/shared/LocationSelector";
import { Role } from "@/app/constants/role";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CalendarIcon,
  CreditCard,
  Loader2,
  MapPin,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";


interface BookingFormProps {
  service: ServiceRecord;
}

type BookingType = "now" | "later";

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
];

function canUserBookServices(userRole: string | null): boolean {
  // Allow booking if user has any role assigned
  return userRole !== null && userRole !== undefined;
}

function getUserRoleFromCookies(): string | null {
  try {
    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (!accessToken) return null;

    const decoded = jwtUtils.decodedToken(accessToken);
    const rawRole = String(decoded?.role || "").toUpperCase();
    
    // Map raw role to Role constants
    const userRole = rawRole === "ADMIN"
      ? Role.ADMIN
      : rawRole === "PROVIDER"
        ? Role.PROVIDER
        : Role.CLIENT;
        
    return userRole;
  } catch (error) {
    console.error("Failed to decode user role:", error);
    return null;
  }
}

const formatMinDate = (date: Date) => date.toISOString().split("T")[0];

export function BookingForm({ service }: BookingFormProps) {
  const [bookingType, setBookingType] = useState<BookingType>("now");
  const [isOpen, setIsOpen] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoadingRole, setIsLoadingRole] = useState(true);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [bookingDate, setBookingDate] = useState<string>("");
  const [bookingTime, setBookingTime] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);

  const router = useRouter();

  useEffect(() => {
    const role = getUserRoleFromCookies();
    setUserRole(role);
    setIsLoadingRole(false);
  }, []);

  const isClient = true; // Always allow booking per user request
  const canBook = true; 
  const isPriceValid = true; // service.price >= 60; // Minimum ৳60 for Stripe

  const today = useMemo(() => new Date(), []);
  const maxDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d;
  }, []);

  const getCurrentLocation = () => {
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(String(position.coords.latitude));
        setLongitude(String(position.coords.longitude));
        setIsGettingLocation(false);
        setLocationError(null);
      },
      (error) => {
        setIsGettingLocation(false);
        setLocationError("Unable to get your location. Please enter address manually.");
        console.error("Geolocation error:", error.message || error);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setSelectedLocation(location);
    setLatitude(String(location.lat));
    setLongitude(String(location.lng));
    setAddress(location.address);
    // Extract city from address (simple extraction)
    const addressParts = location.address.split(',');
    setCity(addressParts[addressParts.length - 2]?.trim() || addressParts[0]?.trim() || '');
    setLocationError(null);
  };

  const resetForm = () => {
    setBookingType("now");
    setLocationError(null);
    setSubmitError(null);
    setLatitude("");
    setLongitude("");
    setBookingDate("");
    setBookingTime("");
    setCity("");
    setAddress("");
    setSelectedLocation(null);
  };

  const handleSubmit = async (formData: FormData) => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      // Check minimum payment amount for Stripe (approximately $0.50 USD = 60 BDT)
      const minAmount = 60; // BDT
      if (bookingType === "now" && service.price < minAmount) {
        throw new Error(`Service price (৳${service.price}) is below the minimum payment requirement of ৳${minAmount}. Please choose a different service or contact support.`);
      }

      const bookingAction = bookingType === "now" ? handleBookNow : handleBookLater;
      const result = await bookingAction(formData);

      if (result.success) {
        if (bookingType === "now" && 'paymentUrl' in result && result.paymentUrl) {
          toast.success("Booking initiated. Redirecting to payment...");
          // Redirect to Stripe checkout
          window.location.href = result.paymentUrl;
        } else {
          toast.success("Booking confirmed successfully!");
          // For book later, close dialog and show success
          setIsOpen(false);
          resetForm();
          // Redirect to user's bookings page when booking is successful
          if (userRole === Role.CLIENT || userRole === "USER") {
             router.push('/dashboard/my-bookings');
          } else {
             router.push('/dashboard');
          }
        }
      } else {
        toast.error(result.error || "An unexpected error occurred");
        setSubmitError(result.error || "An unexpected error occurred");
      }
    } catch (error) {
      console.error("Booking submission error:", error);
      const msg = error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(msg);
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-primary rounded-full px-8 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition disabled:opacity-60"
        disabled={false}
      >
        Book Now
      </button>

      {isOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-3xl overflow-y-auto max-h-[90vh]">
            <form method="dialog">
              <button 
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={(e) => { e.preventDefault(); setIsOpen(false); resetForm(); }}
              >
                ✕
              </button>
            </form>
            <h3 className="font-bold text-2xl mb-2">Book {service.name}</h3>
            <p className="text-sm opacity-70 mb-6">
              Fill in the details below to schedule your service booking.
            </p>

            <form action={handleSubmit} className="space-y-6">
            <input type="hidden" name="serviceId" value={service.id} />

            <div className="rounded-xl border bg-muted/40 p-4">
              <h3 className="mb-3 font-semibold">Service Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Service:</span>
                  <p className="font-medium">{service.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Price:</span>
                  <p className={`font-medium ${service.price < 60 ? 'text-red-600' : 'text-green-600'}`}>
                    ৳{service.price}
                    {service.price < 60 && (
                      <span className="text-xs text-red-500 block">
                        Below minimum (৳60 required)
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration:</span>
                  <p className="font-medium">{service.duration || "N/A"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Provider:</span>
                  <p className="font-medium">{service.provider?.name || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Booking Type</label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Button
                  type="button"
                  variant={bookingType === "now" ? "default" : "outline"}
                  onClick={() => setBookingType("now")}
                  className="h-12"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Book Now & Pay
                </Button>
                <Button
                  type="button"
                  variant={bookingType === "later" ? "default" : "outline"}
                  onClick={() => setBookingType("later")}
                  className="h-12"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Book Later
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {bookingType === "now"
                  ? "Payment will be processed immediately."
                  : "You can pay later within the allowed payment window."}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Booking Date</label>
                <Input
                  type="date"
                  name="bookingDate"
                  required
                  min={formatMinDate(today)}
                  max={formatMinDate(maxDate)}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Booking Time</label>
                <select
                  name="bookingTime"
                  required
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-medium">Service Location</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="text-xs"
                >
                  {isGettingLocation ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      Locating...
                    </>
                  ) : (
                    <>
                      <MapPin className="mr-1 h-3 w-3" />
                      Use Current Location
                    </>
                  )}
                </Button>
              </div>

              {locationError && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{locationError}</AlertDescription>
                </Alert>
              )}

              {submitError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}

              <LocationSelector
                onLocationSelect={handleLocationSelect}
                initialLocation={selectedLocation || undefined}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <Input
                    type="text"
                    name="city"
                    placeholder="Enter city"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Latitude</label>
                    <Input
                      type="number"
                      name="latitude"
                      step="any"
                      placeholder="Lat"
                      required
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Longitude</label>
                    <Input
                      type="number"
                      name="longitude"
                      step="any"
                      placeholder="Lng"
                      required
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Full Address</label>
                <Textarea
                  name="address"
                  placeholder="Enter complete address with landmarks"
                  required
                  minLength={10}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="modal-action flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setIsOpen(false); resetForm(); }}
                className="btn btn-outline flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Processing...
                  </>
                ) : bookingType === "now" ? (
                  "Pay ৳" + service.price
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={() => { setIsOpen(false); resetForm(); }}>
          <button>close</button>
        </form>
      </dialog>
      )}
    </>
  );
}