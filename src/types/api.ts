export type ApiSuccess<T = unknown> = {
  message: string;
  success?: number;
  data?: T;
  Result?: T;
};

export type UserRole = "Admin" | "User" | "SuperAdmin";

export type CurrentUser = {
  _id: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  role: UserRole;
  email?: string;
};

export type AppUser = {
  _id: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: UserRole | string;
};

export type EasyBoughtItem = {
  _id: string;
  IphoneModel: string;
  IphoneImageUrl: string;
  capacity?: string;
  Plan: "Monthly" | "Weekly";
  downPayment: number;
  loanedAmount: number;
  PhonePrice: number;
  monthlyPlan?: 1 | 2 | 3;
  weeklyPlan?: 4 | 8 | 12;
  UserEmail?: string;
};

export type EasyBuyCatalogItem = {
  model: string;
  imageUrl: string;
  capacities: string[];
  allowedPlans: Array<"Monthly" | "Weekly">;
  downPaymentPercentage: 40 | 60;
  pricesByCapacity?: Record<string, number>;
};

export type EasyBuyPlanRules = {
  monthlyDurations: number[];
  weeklyDurations: number[];
  monthlyMarkupMultipliers: Record<string, number>;
  weeklyMarkupMultipliers: Record<string, number>;
};

export type EasyBuyCatalogResponse = {
  models: EasyBuyCatalogItem[];
  planRules: EasyBuyPlanRules;
};

export type EasyBuyPricingModel = {
  model: string;
  capacities: string[];
  pricesByCapacity: Record<string, number>;
};

export type EasyBuyPricingResponse = {
  models: EasyBuyPricingModel[];
};

export type SuperAdminCreator = {
  _id: string;
  fullName?: string;
  email?: string;
  role?: UserRole;
};

export type SuperAdminUser = {
  _id: string;
  fullName?: string;
  email?: string;
  role: UserRole;
  createdByAdmin?: SuperAdminCreator | null;
  createdUsers?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type SuperAdminUserWithItems = SuperAdminUser & {
  easyBoughtItems: EasyBoughtItem[];
};

export type SuperAdminLoginStats = {
  usersLoggedIn: number;
  adminsLoggedIn: number;
  superAdminsLoggedIn: number;
  totalLoggedIn: number;
};

export type DashboardPaymentItem = {
  amount: number;
  status: "paid" | "pending" | "approved" | "failed";
  paymentMethod: "card" | "bank" | "wallet" | "receipt";
  paidAt: string;
};

export type DashboardResponse = {
  totalAmount: number;
  totalPaid: number;
  remainingBalance: number;
  owedAmount?: number;
  progress: number;
  nextPaymentDue: string | null;
  nextPaymentAmount: number;
  planStatus: "active" | "completed" | "cancelled";
  recentPayments: DashboardPaymentItem[];
};

export type ReceiptItem = {
  _id: string;
  payment?: string;
  amount: number;
  fileUrl: string;
  fileType: "image" | "pdf";
  status: "pending" | "approved" | "rejected";
  rejectedAt?: string;
  rejectionReason?: string;
  createdAt: string;
};

export type PendingReceiptItem = ReceiptItem & {
  user?: {
    _id: string;
    fullName?: string;
    email?: string;
    createdByAdmin?: {
      _id: string;
      fullName?: string;
      email?: string;
      role?: UserRole;
    } | null;
  };
};

export type ReceiptUploadedDatePreview = {
  receiptId: string;
  currentUploadedAt: string | null;
  proposedUploadedAt: string | null;
  user?: string;
  plan?: "Monthly" | "Weekly";
  amount?: number;
  status?: "pending" | "approved" | "rejected";
};

export type ReceiptUploadedDateUpdate = {
  receiptId: string;
  previousUploadedAt: string | null;
  updatedUploadedAt: string | null;
  updatedAt: string | null;
};

export type UserNextDueDatePreview = {
  userId: string;
  fullName?: string;
  email?: string;
  currentNextDueDate: string | null;
  proposedNextDueDate: string | null;
};

export type UserNextDueDateUpdate = {
  userId: string;
  previousNextDueDate: string | null;
  updatedNextDueDate: string | null;
  updatedAt: string | null;
};

export type EasyBoughtItemCreatedDatePreview = {
  itemId: string;
  currentCreatedAt: string | null;
  proposedCreatedAt: string | null;
  userId?: string;
  userEmail?: string;
  iphoneModel?: string;
  plan?: "Monthly" | "Weekly";
};

export type EasyBoughtItemCreatedDateUpdate = {
  itemId: string;
  previousCreatedAt: string | null;
  updatedCreatedAt: string | null;
  updatedAt: string | null;
};

export type PublicEasyBuyRequestStatus =
  | "pending_verification"
  | "verified"
  | "approved"
  | "rejected"
  | "converted";

export type PublicEasyBuyRequest = {
  _id: string;
  requestId: string;
  fullName: string;
  email: string;
  phone: string;
  iphoneModel: string;
  capacity: string;
  plan: "Monthly" | "Weekly";
  status: PublicEasyBuyRequestStatus;
  rejectionReason?: string;
  reviewedAt?: string;
  reviewedBy?: {
    _id: string;
    fullName?: string;
    email?: string;
    role?: UserRole;
  } | null;
  verifiedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  convertedAt?: string;
  convertedEasyBoughtItemId?: string;
  createdAt: string;
  updatedAt: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
