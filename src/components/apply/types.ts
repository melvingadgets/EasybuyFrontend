export type ApplicationType = "online" | "physical_appearance";
export type PlanType = "Monthly" | "Weekly";
export type PlanSelection = "" | PlanType;

export type ApplyStep = 1 | 2 | 3;

export type ApplyFormState = {
  fullName: string;
  email: string;
  phone: string;
  iphoneModel: string;
  capacity: string;
  plan: PlanSelection;
  phonePrice: string;
  downPayment: string;
  monthlyPlan: string;
  weeklyPlan: string;
  applicationType: ApplicationType;
  visitDate: string;
  visitTimeSlot: string;
  visitStoreLocation: string;
  verificationPassCode?: string;
};
