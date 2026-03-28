"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarIcon,
  CreditCard,
  Loader2,
  MapPin,
  UserX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";


import { type ServiceRecord } from "@/services/services.service";
import { jwtUtils } from "@/lib/jwtUtils";
import { handleBookLater, handleBookNow } from "@/services/user-booking.service";

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
  return userRole === "USER";
}

function getUserRoleFromCookies(): string | null {
  try {
    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (!accessToken) return null;

    const decoded = jwtUtils.decodedToken(accessToken);
    return (decoded?.role as string) || null;
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

  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [bookingDate, setBookingDate] = useState<string>("");
  const [bookingTime, setBookingTime] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    const role = getUserRoleFromCookies();
    setUserRole(role);
    setIsLoadingRole(false);
  }, []);

  const isClient = canUserBookServices(userRole);
  const canBook = isClient && service.isActive;

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
        console.error("Geolocation error:", error);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const resetForm = () => {
    setBookingType("now");
    setLocationError(null);
    setLatitude("");
    setLongitude("");
    setBookingDate("");
    setBookingTime("");
    setCity("");
    setAddress("");
  };

  const bookingAction = bookingType === "now" ? handleBookNow : handleBookLater;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="h-14 rounded-full bg-emerald-600 px-8 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 disabled:opacity-60"
          disabled={isLoadingRole}
        >
          {isLoadingRole ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            "Book Now"
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Book {service.name}</DialogTitle>
          <DialogDescription>
            Fill in the details below to schedule your service booking.
          </DialogDescription>
        </DialogHeader>

        {!isClient && !isLoadingRole && (
          <Alert>
            <UserX className="h-4 w-4" />
            <AlertDescription>
              Only clients can book services. Your current role:{" "}
              {userRole || "Unknown"}.
            </AlertDescription>
          </Alert>
        )}

        {isClient && (
          <form
            action={async (formData) => {
              try {
                setIsSubmitting(true);
                await bookingAction(formData);
                setIsOpen(false);
                resetForm();
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="space-y-6"
          >
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
                  <p className="font-medium">৳{service.price}</p>
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

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="flex-1"
                disabled={
                  isSubmitting ||
                  !bookingDate ||
                  !bookingTime ||
                  !city.trim() ||
                  !address.trim() ||
                  !latitude ||
                  !longitude
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : bookingType === "now" ? (
                  "Book & Pay Now"
                ) : (
                  "Book for Later"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
