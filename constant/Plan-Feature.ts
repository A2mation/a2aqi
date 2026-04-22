import { SubscriptionDuration } from "@prisma/client";

export const features = [
  "Advanced analytics",
  "Historical data insights",
  "Advanced reporting & exports",
  "Multi-location tracking",
  "Priority support",
];

const PLAN_NAMES: Record<SubscriptionDuration, string> = {
  [SubscriptionDuration.THREE_MONTHS]: "Quarterly",
  [SubscriptionDuration.SIX_MONTHS]: "Half Yearly",
  [SubscriptionDuration.TWELVE_MONTHS]: "Yearly",
};

const PLAN_PERIOD_LABELS: Record<SubscriptionDuration, string> = {
  [SubscriptionDuration.THREE_MONTHS]: "Three Month",
  [SubscriptionDuration.SIX_MONTHS]: "Six Month",
  [SubscriptionDuration.TWELVE_MONTHS]: "12 Months",
};

export const getPlanName = (period: SubscriptionDuration): string => {
  return PLAN_NAMES[period] || "Yearly";
};

export const getPlanPeriod = (period: SubscriptionDuration): string => {
  return PLAN_PERIOD_LABELS[period] || "12 Months";
};


