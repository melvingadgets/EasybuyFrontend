import { beginGlobalLoad } from "../../lib/globalLoading";
import { auth } from "../../lib/auth";
import type {
  ApiSuccess,
  CurrentUser,
  DashboardResponse,
  EasyBoughtItemCreatedDatePreview,
  EasyBoughtItemCreatedDateUpdate,
  EasyBoughtItem,
  PendingReceiptItem,
  ReceiptUploadedDatePreview,
  ReceiptUploadedDateUpdate,
  ReceiptItem,
  SuperAdminLoginStats,
  SuperAdminUser,
  SuperAdminUserWithItems,
  UserNextDueDatePreview,
  UserNextDueDateUpdate,
} from "../../types/api";
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";

type ExtendedFetchArgs = FetchArgs & {
  suppressGlobalLoader?: boolean;
  suppressErrorToast?: boolean;
};

const apiMode = String(import.meta.env.VITE_API_MODE || "local").trim().toLowerCase();
const envBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const localUrl = String(import.meta.env.VITE_API_LOCAL_URL || "http://localhost:552").trim();
const onlineUrl = String(import.meta.env.VITE_API_ONLINE_URL || "https://easybuytrackerbackend.onrender.com").trim();

const baseUrl = envBaseUrl || (apiMode === "online" ? onlineUrl : localUrl);

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    const token = auth.getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const isAbortError = (error: FetchBaseQueryError | undefined) => {
  if (!error) return false;
  if (error.status !== "FETCH_ERROR") return false;
  const fetchError = "error" in error && typeof error.error === "string" ? error.error : "";
  return fetchError.toLowerCase().includes("abort");
};

const getApiErrorMessage = (error: FetchBaseQueryError): string => {
  const payload = (error as any).data;
  if (payload && typeof payload === "object") {
    const knownMessage = (payload as any).message || (payload as any).error;
    if (typeof knownMessage === "string" && knownMessage.trim()) {
      return knownMessage;
    }
  }

  if (
    error.status === "PARSING_ERROR" &&
    typeof payload === "string" &&
    payload.trim().startsWith("<")
  ) {
    return "Server returned HTML instead of JSON. Backend may be outdated or endpoint is unavailable.";
  }

  if ("error" in error && typeof error.error === "string" && error.error.trim()) {
    return error.error;
  }

  return "Request failed";
};

const baseQueryWithUx: BaseQueryFn<string | ExtendedFetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const request = typeof args === "string" ? ({ url: args } as ExtendedFetchArgs) : args;
  const { suppressGlobalLoader = false, suppressErrorToast = false, ...queryArgs } = request;

  const stopLoading = suppressGlobalLoader ? undefined : beginGlobalLoad();

  try {
    const result = await rawBaseQuery(queryArgs as FetchArgs, api, extraOptions);

    if (
      result.error &&
      !suppressErrorToast &&
      !api.signal.aborted &&
      !isAbortError(result.error)
    ) {
      const message = getApiErrorMessage(result.error);
      toast.error(message);
    }

    return result;
  } finally {
    stopLoading?.();
  }
};

export const backendApi = createApi({
  reducerPath: "backendApi",
  baseQuery: baseQueryWithUx,
  tagTypes: [
    "CurrentUser",
    "Dashboard",
    "Items",
    "Receipts",
    "PendingReceipts",
    "SuperAdminStats",
    "SuperAdminUsers",
    "SuperAdminUsersWithItems",
    "Maintenance",
  ],
  endpoints: (builder) => ({
    getCurrentUser: builder.query<ApiSuccess<CurrentUser>, void>({
      query: () => ({ url: "/api/v1/user/getcurrentuser", suppressErrorToast: true }),
      providesTags: [{ type: "CurrentUser", id: "ME" }],
    }),

    getDashboard: builder.query<DashboardResponse, void>({
      query: () => ({ url: "/api/dashboard", suppressErrorToast: true }),
      providesTags: [{ type: "Dashboard", id: "ME" }],
    }),

    getEasyBoughtItems: builder.query<ApiSuccess<EasyBoughtItem[]>, void>({
      query: () => ({ url: "/api/v1/user/geteasyboughtitems", suppressErrorToast: true }),
      providesTags: [{ type: "Items", id: "LIST" }],
    }),

    getMyReceipts: builder.query<ApiSuccess<ReceiptItem[]>, void>({
      query: () => ({ url: "/api/v1/receipt/my", suppressErrorToast: true }),
      providesTags: [{ type: "Receipts", id: "LIST" }],
    }),

    uploadReceipt: builder.mutation<ApiSuccess, FormData>({
      query: (formData) => ({
        url: "/api/v1/receipt/upload",
        method: "POST",
        body: formData,
        suppressGlobalLoader: true,
      }),
      invalidatesTags: [{ type: "Receipts", id: "LIST" }, { type: "PendingReceipts", id: "LIST" }],
    }),

    getPendingReceipts: builder.query<ApiSuccess<PendingReceiptItem[]>, void>({
      query: () => ({ url: "/api/v1/receipt/pending", suppressErrorToast: true }),
      providesTags: [{ type: "PendingReceipts", id: "LIST" }],
    }),

    approveReceipt: builder.mutation<ApiSuccess, { receiptId: string; reason?: string }>({
      query: ({ receiptId, reason }) => ({
        url: `/api/v1/receipt/${receiptId}/approve`,
        method: "PATCH",
        body: { reason: reason || "" },
        suppressGlobalLoader: true,
      }),
      invalidatesTags: [
        { type: "PendingReceipts", id: "LIST" },
        { type: "Receipts", id: "LIST" },
        { type: "Dashboard", id: "ME" },
      ],
    }),

    getSuperAdminLoginStats: builder.query<ApiSuccess<SuperAdminLoginStats>, void>({
      query: () => ({ url: "/api/v1/superadmin/login-stats", suppressErrorToast: true }),
      providesTags: [{ type: "SuperAdminStats", id: "STATS" }],
    }),

    getSuperAdminUsers: builder.query<ApiSuccess<SuperAdminUser[]>, void>({
      query: () => ({ url: "/api/v1/superadmin/users", suppressErrorToast: true }),
      providesTags: [{ type: "SuperAdminUsers", id: "LIST" }],
    }),

    getSuperAdminUsersWithItems: builder.query<ApiSuccess<SuperAdminUserWithItems[]>, void>({
      query: () => ({ url: "/api/v1/superadmin/users-with-items", suppressErrorToast: true }),
      providesTags: [{ type: "SuperAdminUsersWithItems", id: "LIST" }],
    }),

    deleteSuperAdminUser: builder.mutation<ApiSuccess, { userId: string; reason?: string }>({
      query: ({ userId, reason }) => ({
        url: `/api/v1/superadmin/users/${userId}`,
        method: "DELETE",
        body: { reason: reason || "" },
        suppressGlobalLoader: true,
      }),
      invalidatesTags: [
        { type: "SuperAdminUsers", id: "LIST" },
        { type: "SuperAdminUsersWithItems", id: "LIST" },
        { type: "SuperAdminStats", id: "STATS" },
      ],
    }),

    previewReceiptUploadedDate: builder.query<
      ApiSuccess<ReceiptUploadedDatePreview>,
      { receiptId: string; uploadedAt: string }
    >({
      query: ({ receiptId, uploadedAt }) => ({
        url: `/api/v1/superadmin/maintenance/receipts/${receiptId}/uploaded-date/preview?uploadedAt=${encodeURIComponent(
          uploadedAt
        )}`,
        suppressErrorToast: true,
      }),
      providesTags: [{ type: "Maintenance", id: "DATE" }],
    }),

    updateReceiptUploadedDate: builder.mutation<
      ApiSuccess<ReceiptUploadedDateUpdate>,
      { receiptId: string; uploadedAt: string; reason?: string }
    >({
      query: ({ receiptId, uploadedAt, reason }) => ({
        url: `/api/v1/superadmin/maintenance/receipts/${receiptId}/uploaded-date`,
        method: "PATCH",
        body: { uploadedAt, reason: reason || "" },
        suppressGlobalLoader: true,
      }),
      invalidatesTags: [{ type: "Maintenance", id: "DATE" }],
    }),

    previewUserNextDueDate: builder.query<
      ApiSuccess<UserNextDueDatePreview>,
      { userId: string; nextDueDate: string }
    >({
      query: ({ userId, nextDueDate }) => ({
        url: `/api/v1/superadmin/maintenance/users/${userId}/next-due-date/preview?nextDueDate=${encodeURIComponent(
          nextDueDate
        )}`,
        suppressErrorToast: true,
      }),
      providesTags: [{ type: "Maintenance", id: "DATE" }],
    }),

    updateUserNextDueDate: builder.mutation<
      ApiSuccess<UserNextDueDateUpdate>,
      { userId: string; nextDueDate: string; reason?: string }
    >({
      query: ({ userId, nextDueDate, reason }) => ({
        url: `/api/v1/superadmin/maintenance/users/${userId}/next-due-date`,
        method: "PATCH",
        body: { nextDueDate, reason: reason || "" },
        suppressGlobalLoader: true,
      }),
      invalidatesTags: [{ type: "Maintenance", id: "DATE" }],
    }),

    previewEasyBoughtItemCreatedDate: builder.query<
      ApiSuccess<EasyBoughtItemCreatedDatePreview>,
      { itemId: string; createdAt: string }
    >({
      query: ({ itemId, createdAt }) => ({
        url: `/api/v1/superadmin/maintenance/items/${itemId}/created-date/preview?createdAt=${encodeURIComponent(
          createdAt
        )}`,
        suppressErrorToast: true,
      }),
      providesTags: [{ type: "Maintenance", id: "DATE" }],
    }),

    updateEasyBoughtItemCreatedDate: builder.mutation<
      ApiSuccess<EasyBoughtItemCreatedDateUpdate>,
      { itemId: string; createdAt: string; reason?: string }
    >({
      query: ({ itemId, createdAt, reason }) => ({
        url: `/api/v1/superadmin/maintenance/items/${itemId}/created-date`,
        method: "PATCH",
        body: { createdAt, reason: reason || "" },
        suppressGlobalLoader: true,
      }),
      invalidatesTags: [{ type: "Maintenance", id: "DATE" }],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useGetDashboardQuery,
  useGetEasyBoughtItemsQuery,
  useGetMyReceiptsQuery,
  useUploadReceiptMutation,
  useGetPendingReceiptsQuery,
  useApproveReceiptMutation,
  useGetSuperAdminLoginStatsQuery,
  useGetSuperAdminUsersQuery,
  useGetSuperAdminUsersWithItemsQuery,
  useDeleteSuperAdminUserMutation,
  useLazyPreviewReceiptUploadedDateQuery,
  useUpdateReceiptUploadedDateMutation,
  useLazyPreviewUserNextDueDateQuery,
  useUpdateUserNextDueDateMutation,
  useLazyPreviewEasyBoughtItemCreatedDateQuery,
  useUpdateEasyBoughtItemCreatedDateMutation,
} = backendApi;

