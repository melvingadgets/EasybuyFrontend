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
};
