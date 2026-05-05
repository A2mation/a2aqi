import { SubscriptionDuration } from "@prisma/client";

export enum ROLE {
  ADMIN = "ADMIN",
  WRITER = "WRITER",
  USER = "USER",
  MONITOR = "MONITOR",
  MODERATOR = "MODERATOR",
  VENDOR = "VENDOR"
}

export interface Author {
  name: string;
  username: string;
  email: string;
}

export interface BlogContentProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  title: string;
  desc: string;
  img?: string;
  views?: number;
  authorId: string;
  likesCount: number;
  likedIds: [];
  author: Author;
}

export interface ExportLog {
  id: string;
  deviceId: string;
  status: "COMPLETED" | "PROCESSING" | "FAILED";
  requestedAt: string;
  completedAt: string | null;
  format: "CSV" | "PDF" | "EXCEL";
  fileSize: number | null;
  fileUrl: string | null;
  fromDate: string | null;
  toDate: string | null;
  metadata: any | null;
  errorMessage: string | null;
  device: {
    name: string;
  } | null;
}

export interface CalibrationValues {
  aqi?: number;
  pm10?: number;
  pm25?: number;
  so2?: number;
  no2?: number;
  co2?: number;
  co?: number;
  o3?: number;
  noise?: number;
  pm1?: number;
  tvoc?: number;
  smoke?: number;
  methane?: number;
  h2?: number;
  ammonia?: number;
  h2s?: number;
  temperature?: number;
  humidity?: number;
}

export interface CalibrationLog {
  id: string;

  status: "PENDING" | "SUCCESS" | "FAILED" | "APPROVED" | "REJECTED";

  newValues: {
    [key: string]: number | undefined;
  };

  reason: string | null;
  createdAt: string;
  expiresAt: string;
  previousValues: Record<string, number> | null;
  effectiveFrom: string;
  deliveredAt: string | null;
  acknowledgedAt: string | null;

  deviceId: string;
  performedById: string | null;
}

export interface PricePlanProps {
  id: string;
  name: string;
  price: number;
  period: SubscriptionDuration;
  features: string[];
}
