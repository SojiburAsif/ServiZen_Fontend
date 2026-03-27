export interface Booking {
  id: string;
  bookingDate: string;
  bookingTime: string;
  status: "PENDING" | "ACCEPTED" | "WORKING" | "COMPLETED" | "CANCELLED";
  paymentStatus: "UNPAID" | "PAID";
  totalAmount: number;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  clientId: string;
  providerId: string;
  serviceId: string;
  createdAt: string;
  updatedAt: string;
  client: {
    id: string;
    name: string;
    email: string;
  };
  provider: {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string;
    phone?: string;
  };
  service: {
    id: string;
    name: string;
    price: number;
    duration: string;
    isActive: boolean;
  };
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  bookingId: string;
  clientId: string;
  serviceId: string;
  providerId: string;
  createdAt: string;
  provider: {
    id: string;
    name: string;
  };
  client: {
    id: string;
    name: string;
  };
  service: {
    id: string;
    name: string;
  };
  booking: {
    id: string;
    status: string;
  };
}

export interface ReviewFormData {
  rating: string;
  comment: string;
}

export interface AddReviewFormData {
  bookingSelection: string;
  rating: string;
  comment: string;
}