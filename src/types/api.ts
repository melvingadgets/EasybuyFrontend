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
  Plan: "Monthly" | "Weekly";
  downPayment: number;
  loanedAmount: number;
  PhonePrice: number;
  monthlyPlan: 1 | 2 | 3;
  weeklyPlan: 4 | 8 | 12;
  UserEmail?: string;
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
  status: "pending" | "approved";
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
  status?: "pending" | "approved";
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
