"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, User, CreditCard, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { initiatePayment } from "@/services/booking.service";
import { jwtUtils } from "@/lib/jwtUtils";

interface Booking {
  id: string;
  bookingDate: string;
  bookingTime: string;
  status: "PENDING" | "ACCEPTED" | "WORKING" | "COMPLETED" | "CANCELLED";
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
  totalAmount: number;
  address: string;
  city: string;
  client?: {
    id: string;
    name: string;
    email: string;
  };
  provider?: {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string;
  };
  service: {
    id: string;
    name: string;
    price: number;
    duration: string;
  };
}

interface BookingListProps {
  userRole: "USER" | "PROVIDER" | "ADMIN";
  onViewDetails?: (bookingId: string) => void;
}

export function BookingList({ userRole, onViewDetails }: BookingListProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initiatingPayment, setInitiatingPayment] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, [userRole]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = userRole === "USER" ? "/api/bookings/my" :
                      userRole === "PROVIDER" ? "/api/bookings/provider" :
                      "/api/bookings/all";

      const response = await fetch(endpoint, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to load bookings: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setBookings(data.data.data);
      } else {
        throw new Error(data.message || "Failed to load bookings");
      }
    } catch (err) {
      console.error("Error loading bookings:", err);
      setError(err instanceof Error ? err.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleInitiatePayment = async (bookingId: string) => {
    try {
      setInitiatingPayment(bookingId);
      const result = await initiatePayment(bookingId);

      if (result?.success && result.data?.paymentUrl) {
        // Redirect to payment URL
        window.location.href = result.data.paymentUrl;
      } else {
        alert(result?.message || "Failed to initiate payment");
      }
    } catch (err) {
      console.error("Payment initiation error:", err);
      alert("Failed to initiate payment");
    } finally {
      setInitiatingPayment(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "ACCEPTED": return "bg-blue-100 text-blue-800 border-blue-200";
      case "WORKING": return "bg-orange-100 text-orange-800 border-orange-200";
      case "COMPLETED": return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PAID": return "bg-green-100 text-green-800 border-green-200";
      case "UNPAID": return "bg-red-100 text-red-800 border-red-200";
      case "REFUNDED": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
        <p className="text-gray-500">You dont have any bookings yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{booking.service.name}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {userRole === "PROVIDER" && booking.client
                    ? `Client: ${booking.client.name}`
                    : userRole === "USER" && booking.provider
                    ? `Provider: ${booking.provider.name}`
                    : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">৳{booking.totalAmount}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                  <Badge variant="outline" className={getPaymentStatusColor(booking.paymentStatus)}>
                    {booking.paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                {format(new Date(booking.bookingDate), "PPP")}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                {booking.bookingTime}
              </div>
              <div className="flex items-center text-sm text-gray-600 md:col-span-2">
                <MapPin className="w-4 h-4 mr-2" />
                {booking.address}, {booking.city}
              </div>
            </div>

            <div className="flex gap-2">
              {onViewDetails && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(booking.id)}
                >
                  View Details
                </Button>
              )}

              {userRole === "USER" &&
               booking.paymentStatus === "UNPAID" &&
               booking.status !== "CANCELLED" && (
                <Button
                  size="sm"
                  onClick={() => handleInitiatePayment(booking.id)}
                  disabled={initiatingPayment === booking.id}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {initiatingPayment === booking.id ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay Now
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}