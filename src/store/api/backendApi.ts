import { beginGlobalLoad } from "../../lib/globalLoading";
import { auth } from "../../lib/auth";
import { backendBaseUrl } from "../../lib/backendBase";
import { isMelvinBridgeToken, reportBridgeResponse } from "../../lib/melvinBridge";
import { refreshAccessToken } from "../../lib/tokenRefresh";
import type {
  ApiSuccess,
  CurrentUser,
  EasyBuyCatalogResponse,
  EasyBuyPricingResponse,
  FinanceProviderInfo,
  MyEasyBuyApplication,
  DashboardResponse,
  EasyBoughtItemCreatedDatePreview,
  EasyBoughtItemCreatedDateUpdate,
  EasyBoughtItem,
  PendingReceiptItem,
  PaginationMeta,
  PublicEasyBuyAnalytics,
  PublicEasyBuyAbandonedDraft,
  PublicEasyBuyRequest,
  PublicEasyBuyRequestDocuments,
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

// Same origin rules as the axios client; one implementation, in backendBase.ts.
const baseUrl = backendBaseUrl;

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
  // Which token this request will carry, so its answer can teach the Melvin OS gate (bridgeGate.ts)
  // and, for our own tokens, so a 401 can renew exactly the one that was refused.
  const sentToken = auth.getToken();
  const bridgeToken = isMelvinBridgeToken(sentToken) ? sentToken : null;
  const userToken = sentToken && !bridgeToken ? sentToken : null;

  try {
    let result = await rawBaseQuery(queryArgs as FetchArgs, api, extraOptions);

    // Access-token expiry: renew once, then replay the request with the fresh token.
    if (result.error?.status === 401 && userToken && !bridgeToken && !api.signal.aborted) {
      if (await refreshAccessToken(userToken)) {
        result = await rawBaseQuery(queryArgs as FetchArgs, api, extraOptions);
      }
    }

    let handledByGate = false;
    if (bridgeToken && !api.signal.aborted) {
      const status = result.error ? result.error.status : 200;
      if (typeof status === "number") handledByGate = reportBridgeResponse(bridgeToken, status);
    }

    if (
      result.error &&
      !suppressErrorToast &&
      !handledByGate &&
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
    "EasyBuyCatalog",
    "EasyBuyPricing",
    "Receipts",
    "PendingReceipts",
    "SuperAdminStats",
    "SuperAdminUsers",
    "SuperAdminUsersWithItems",
    "Maintenance",
    "PublicEasyBuyRequests",
    "PublicEasyBuyAbandonedDrafts",
    "PublicEasyBuyAnalytics",
    "PublicProviders",
    "PublicCatalog",
    "MyApplications",
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

    getEasyBuyCatalog: builder.query<ApiSuccess<EasyBuyCatalogResponse>, void>({
      query: () => ({ url: "/api/v1/user/easybuy-catalog", suppressErrorToast: true }),
      providesTags: [{ type: "EasyBuyCatalog", id: "CATALOG" }],
    }),

    // ── Apply (public) ────────────────────────────────────────────────────────
    // The applicant-facing screens. These are the routes the standalone Apply app uses, read
    // through the same client so they get the token, the refresh-on-401 and the error handling.

    getPublicProviders: builder.query<ApiSuccess<FinanceProviderInfo[]>, void>({
      query: () => ({ url: "/api/v1/public/providers", suppressErrorToast: true }),
      providesTags: [{ type: "PublicProviders", id: "LIST" }],
    }),

    /** The public catalog: models, plan rules and the service-fee rule, for one provider. */
    getPublicEasyBuyCatalog: builder.query<ApiSuccess<EasyBuyCatalogResponse>, string | void>({
      query: (provider) => ({
        url: provider
          ? `/api/v1/public/easybuy-catalog?provider=${encodeURIComponent(provider)}`
          : "/api/v1/public/easybuy-catalog",
        suppressErrorToast: true,
      }),
      providesTags: [{ type: "PublicCatalog", id: "CATALOG" }],
    }),

    /** The signed-in person's own applications. 401 for anonymous visitors. */
    getMyApplications: builder.query<ApiSuccess<MyEasyBuyApplication[]>, void>({
      query: () => ({ url: "/api/v1/public/easybuy-requests/mine", suppressErrorToast: true }),
      providesTags: [{ type: "MyApplications", id: "LIST" }],
    }),

    /** Submits an application, anonymously or signed in, and returns its documents key. */
    createPublicEasyBuyRequest: builder.mutation<
      ApiSuccess<{ requestId: string; documentsToken: string; status?: string }>,
      Record<string, unknown>
    >({
      query: (body) => ({
        url: "/api/v1/public/easybuy-requests",
        method: "POST",
        body,
        suppressGlobalLoader: true,
        suppressErrorToast: true,
      }),
      invalidatesTags: [{ type: "MyApplications", id: "LIST" }],
    }),

    /** Half-finished applications, so the public analytics and the funnel still see progress. */
    savePublicEasyBuyDraftStep: builder.mutation<ApiSuccess, Record<string, unknown>>({
      query: (body) => ({
        url: "/api/v1/public/easybuy-drafts/step",
        method: "POST",
        body,
        suppressGlobalLoader: true,
        suppressErrorToast: true,
      }),
    }),

    /**
     * Attaches an application submitted anonymously to the signed-in person, so it shows up in
     * `/mine` and the approval gate can see it. Idempotent; 409 if someone else already owns it.
     */
    claimPublicEasyBuyRequest: builder.mutation<ApiSuccess, { requestId: string; documentsToken?: string }>({
      query: ({ requestId, documentsToken }) => ({
        url: `/api/v1/public/easybuy-requests/${encodeURIComponent(requestId)}/documents/claim`,
        method: "POST",
        ...(documentsToken ? { headers: { "x-documents-token": documentsToken } } : {}),
        suppressGlobalLoader: true,
        suppressErrorToast: true,
      }),
      invalidatesTags: [{ type: "MyApplications", id: "LIST" }],
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

    rejectReceipt: builder.mutation<ApiSuccess, { receiptId: string; reason: string }>({
      query: ({ receiptId, reason }) => ({
        url: `/api/v1/receipt/${receiptId}/reject`,
        method: "PATCH",
        body: { reason },
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

    getSuperAdminEasyBuyPricing: builder.query<ApiSuccess<EasyBuyPricingResponse>, void>({
      query: () => ({ url: "/api/v1/superadmin/easybuy-pricing", suppressErrorToast: true }),
      providesTags: [{ type: "EasyBuyPricing", id: "LIST" }],
    }),

    updateSuperAdminEasyBuyPricing: builder.mutation<
      ApiSuccess<EasyBuyPricingResponse & { updatedCount?: number }>,
      { updates: Array<{ model: string; capacity: string; price: number }> }
    >({
      query: ({ updates }) => ({
        url: "/api/v1/superadmin/easybuy-pricing",
        method: "PATCH",
        body: { updates },
        suppressGlobalLoader: true,
      }),
      invalidatesTags: [
        { type: "EasyBuyPricing", id: "LIST" },
        { type: "EasyBuyCatalog", id: "CATALOG" },
      ],
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

    getSuperAdminPublicEasyBuyRequests: builder.query<
      ApiSuccess<PublicEasyBuyRequest[]> & { pagination?: PaginationMeta },
      { status?: string; search?: string; page?: number; limit?: number } | void
    >({
      query: (params) => {
        const query = new URLSearchParams();
        if (params?.status) query.set("status", params.status);
        if (params?.search) query.set("search", params.search);
        if (params?.page) query.set("page", String(params.page));
        if (params?.limit) query.set("limit", String(params.limit));

        const suffix = query.toString() ? `?${query.toString()}` : "";
        return {
          url: `/api/v1/superadmin/public-easybuy-requests${suffix}`,
          suppressErrorToast: true,
        };
      },
      providesTags: [{ type: "PublicEasyBuyRequests", id: "LIST" }],
    }),

    getSuperAdminAbandonedPublicEasyBuyDrafts: builder.query<
      ApiSuccess<PublicEasyBuyAbandonedDraft[]> & {
        pagination?: PaginationMeta;
        meta?: {
          inactivityMinutes?: number;
          abandonedBefore?: string;
        };
      },
      { search?: string; page?: number; limit?: number; inactivityMinutes?: number } | void
    >({
      query: (params) => {
        const query = new URLSearchParams();
        if (params?.search) query.set("search", params.search);
        if (params?.page) query.set("page", String(params.page));
        if (params?.limit) query.set("limit", String(params.limit));
        if (params?.inactivityMinutes) query.set("inactivityMinutes", String(params.inactivityMinutes));

        const suffix = query.toString() ? `?${query.toString()}` : "";
        return {
          url: `/api/v1/superadmin/public-easybuy-abandoned-drafts${suffix}`,
          suppressErrorToast: true,
        };
      },
      providesTags: [{ type: "PublicEasyBuyAbandonedDrafts", id: "LIST" }],
    }),

    // NIN, bank statements and NIN photo for one request. The file links expire after a few
    // minutes, so nothing is cached: each open fetches fresh links (and is audited server-side).
    getSuperAdminPublicEasyBuyRequestDocuments: builder.query<ApiSuccess<PublicEasyBuyRequestDocuments>, string>({
      query: (requestId) => ({
        url: `/api/v1/superadmin/public-easybuy-requests/${encodeURIComponent(requestId)}/documents`,
        suppressErrorToast: true,
      }),
      keepUnusedDataFor: 0,
    }),

    getSuperAdminPublicEasyBuyAnalytics: builder.query<
      ApiSuccess<PublicEasyBuyAnalytics>,
      { landingPath?: string; provider?: string } | void
    >({
      query: (params) => {
        const query = new URLSearchParams();
        if (params?.landingPath) query.set("landingPath", params.landingPath);
        if (params?.provider) query.set("provider", params.provider);

        const suffix = query.toString() ? `?${query.toString()}` : "";
        return {
          url: `/api/v1/superadmin/public-easybuy-analytics${suffix}`,
          suppressErrorToast: true,
        };
      },
      providesTags: [{ type: "PublicEasyBuyAnalytics", id: "OVERVIEW" }],
    }),

    approveSuperAdminPublicEasyBuyRequest: builder.mutation<
      ApiSuccess<PublicEasyBuyRequest>,
      { requestId: string; reason?: string }
    >({
      query: ({ requestId, reason }) => ({
        url: `/api/v1/superadmin/public-easybuy-requests/${encodeURIComponent(requestId)}/approve`,
        method: "PATCH",
        body: { reason: reason || "" },
        suppressGlobalLoader: true,
      }),
      invalidatesTags: [{ type: "PublicEasyBuyRequests", id: "LIST" }],
    }),

    rejectSuperAdminPublicEasyBuyRequest: builder.mutation<
      ApiSuccess<PublicEasyBuyRequest>,
      { requestId: string; reason: string }
    >({
      query: ({ requestId, reason }) => ({
        url: `/api/v1/superadmin/public-easybuy-requests/${encodeURIComponent(requestId)}/reject`,
        method: "PATCH",
        body: { reason },
        suppressGlobalLoader: true,
      }),
      invalidatesTags: [{ type: "PublicEasyBuyRequests", id: "LIST" }],
    }),

    convertSuperAdminPublicEasyBuyRequest: builder.mutation<
      ApiSuccess,
      {
        requestId: string;
        userEmail?: string;
        phonePrice: number;
        downPayment?: number;
        monthlyPlan?: number;
        weeklyPlan?: number;
        reason?: string;
      }
    >({
      query: ({ requestId, ...body }) => ({
        url: `/api/v1/superadmin/public-easybuy-requests/${encodeURIComponent(requestId)}/convert`,
        method: "POST",
        body,
        suppressGlobalLoader: true,
      }),
      invalidatesTags: [{ type: "PublicEasyBuyRequests", id: "LIST" }, { type: "Items", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useGetDashboardQuery,
  useGetEasyBoughtItemsQuery,
  useGetEasyBuyCatalogQuery,
  useGetPublicProvidersQuery,
  useGetPublicEasyBuyCatalogQuery,
  useGetMyApplicationsQuery,
  useCreatePublicEasyBuyRequestMutation,
  useSavePublicEasyBuyDraftStepMutation,
  useClaimPublicEasyBuyRequestMutation,
  useGetMyReceiptsQuery,
  useUploadReceiptMutation,
  useGetPendingReceiptsQuery,
  useApproveReceiptMutation,
  useRejectReceiptMutation,
  useGetSuperAdminLoginStatsQuery,
  useGetSuperAdminUsersQuery,
  useGetSuperAdminUsersWithItemsQuery,
  useGetSuperAdminEasyBuyPricingQuery,
  useUpdateSuperAdminEasyBuyPricingMutation,
  useDeleteSuperAdminUserMutation,
  useLazyPreviewReceiptUploadedDateQuery,
  useUpdateReceiptUploadedDateMutation,
  useLazyPreviewUserNextDueDateQuery,
  useUpdateUserNextDueDateMutation,
  useLazyPreviewEasyBoughtItemCreatedDateQuery,
  useUpdateEasyBoughtItemCreatedDateMutation,
  useGetSuperAdminPublicEasyBuyRequestsQuery,
  useGetSuperAdminAbandonedPublicEasyBuyDraftsQuery,
  useGetSuperAdminPublicEasyBuyAnalyticsQuery,
  useGetSuperAdminPublicEasyBuyRequestDocumentsQuery,
  useApproveSuperAdminPublicEasyBuyRequestMutation,
  useRejectSuperAdminPublicEasyBuyRequestMutation,
  useConvertSuperAdminPublicEasyBuyRequestMutation,
} = backendApi;

