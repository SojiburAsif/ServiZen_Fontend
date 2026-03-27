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

export interface ReviewListQuery {
  page?: number;
  limit?: number;
  rating?: number;
  serviceId?: string;
  clientId?: string;
}