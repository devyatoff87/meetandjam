import { CategorySlug } from "./categories";

export type EventResponse = {
  id: string;
  title: string;
  description: string;
  maxParticipants: number | null;
  contactInfo: string | null;
  entryPrice: number | null;
  isDonationBased: boolean;
  donationInfo: string | null;
  address: string;
  startsAt: string;
  category: CategorySlug | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};
