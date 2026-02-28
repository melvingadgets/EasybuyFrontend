import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import { FaBoxOpen, FaCalendarAlt, FaClock, FaFileAlt, FaUserCog } from "react-icons/fa";
import { BlurLoadingContainer } from "../components/BlurLoadingContainer";
import { getRtkErrorMessage } from "../lib/rtkError";
import type {
  EasyBoughtItemCreatedDatePreview,
  ReceiptUploadedDatePreview,
  UserNextDueDatePreview,
} from "../types/api";
import {
  useLazyPreviewEasyBoughtItemCreatedDateQuery,
  useLazyPreviewReceiptUploadedDateQuery,
  useLazyPreviewUserNextDueDateQuery,
  useUpdateEasyBoughtItemCreatedDateMutation,
  useUpdateReceiptUploadedDateMutation,
  useUpdateUserNextDueDateMutation,
} from "../store/api/backendApi";

type ModalAction =
  | null
  | {
      kind: "receipt";
      receiptId: string;
      uploadedAtIso: string;
      reason: string;
      preview: ReceiptUploadedDatePreview | null;
    }
  | {
      kind: "user";
      userId: string;
      nextDueDateIso: string;
      reason: string;
      preview: UserNextDueDatePreview | null;
    }
  | {
      kind: "item";
      itemId: string;
      createdAtIso: string;
      reason: string;
      preview: EasyBoughtItemCreatedDatePreview | null;
    };

const formatDateTime = (value: string | null | undefined) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString();
};

const toIso = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
};

export const SuperAdminDateMaintenancePage = () => {
  const [receiptId, setReceiptId] = useState("");
  const [uploadedAtInput, setUploadedAtInput] = useState("");
  const [receiptReason, setReceiptReason] = useState("");
  const [receiptPreview, setReceiptPreview] = useState<ReceiptUploadedDatePreview | null>(null);

  const [userId, setUserId] = useState("");
  const [nextDueDateInput, setNextDueDateInput] = useState("");
  const [userReason, setUserReason] = useState("");
  const [userPreview, setUserPreview] = useState<UserNextDueDatePreview | null>(null);

  const [itemId, setItemId] = useState("");
  const [itemCreatedAtInput, setItemCreatedAtInput] = useState("");
  const [itemReason, setItemReason] = useState("");
  const [itemPreview, setItemPreview] = useState<EasyBoughtItemCreatedDatePreview | null>(null);

  const [modalAction, setModalAction] = useState<ModalAction>(null);

  const [previewReceiptTrigger, previewReceiptResult] = useLazyPreviewReceiptUploadedDateQuery();
  const [updateReceiptUploadedDate, updateReceiptState] = useUpdateReceiptUploadedDateMutation();

  const [previewUserTrigger, previewUserResult] = useLazyPreviewUserNextDueDateQuery();
  const [updateUserNextDueDate, updateUserState] = useUpdateUserNextDueDateMutation();

  const [previewItemTrigger, previewItemResult] = useLazyPreviewEasyBoughtItemCreatedDateQuery();
  const [updateItemCreatedDate, updateItemState] = useUpdateEasyBoughtItemCreatedDateMutation();

  const pageLoading = useMemo(
    () =>
      previewReceiptResult.isFetching ||
      previewUserResult.isFetching ||
      previewItemResult.isFetching ||
      updateReceiptState.isLoading ||
      updateUserState.isLoading ||
      updateItemState.isLoading,
    [
      previewReceiptResult.isFetching,
      previewUserResult.isFetching,
      previewItemResult.isFetching,
      updateReceiptState.isLoading,
      updateUserState.isLoading,
      updateItemState.isLoading,
    ]
  );

  const receiptPreviewError = getRtkErrorMessage(
    previewReceiptResult.error as any,
    "Failed to preview receipt uploaded date"
  );
  const userPreviewError = getRtkErrorMessage(
    previewUserResult.error as any,
    "Failed to preview user next due date"
  );
  const itemPreviewError = getRtkErrorMessage(
    previewItemResult.error as any,
    "Failed to preview item created date"
  );

  useEffect(() => {
    if (!modalAction) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModalAction(null);
    };

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEscape);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener("keydown", onEscape);
    };
  }, [modalAction]);

  const previewReceipt = async () => {
    const safeReceiptId = receiptId.trim();
    if (!safeReceiptId) {
      toast.error("Receipt ID is required");
      return;
    }
    if (!uploadedAtInput) {
      toast.error("Uploaded date/time is required");
      return;
    }

    const uploadedAtIso = toIso(uploadedAtInput);
    if (!uploadedAtIso) {
      toast.error("Invalid uploaded date/time");
      return;
    }

    try {
      const response = await previewReceiptTrigger({
        receiptId: safeReceiptId,
        uploadedAt: uploadedAtIso,
      }).unwrap();
      setReceiptPreview(response.data || null);
      toast.success("Receipt preview loaded");
    } catch (_error) {
      // Error toast handled by RTK base query.
    }
  };

  const previewUser = async () => {
    const safeUserId = userId.trim();
    if (!safeUserId) {
      toast.error("User ID is required");
      return;
    }
    if (!nextDueDateInput) {
      toast.error("Next due date/time is required");
      return;
    }

    const nextDueDateIso = toIso(nextDueDateInput);
    if (!nextDueDateIso) {
      toast.error("Invalid next due date/time");
      return;
    }

    try {
      const response = await previewUserTrigger({
        userId: safeUserId,
        nextDueDate: nextDueDateIso,
      }).unwrap();
      setUserPreview(response.data || null);
      toast.success("User due-date preview loaded");
    } catch (_error) {
      // Error toast handled by RTK base query.
    }
  };

  const previewItem = async () => {
    const safeItemId = itemId.trim();
    if (!safeItemId) {
      toast.error("Item ID is required");
      return;
    }
    if (!itemCreatedAtInput) {
      toast.error("Item created date/time is required");
      return;
    }

    const createdAtIso = toIso(itemCreatedAtInput);
    if (!createdAtIso) {
      toast.error("Invalid item created date/time");
      return;
    }

    try {
      const response = await previewItemTrigger({
        itemId: safeItemId,
        createdAt: createdAtIso,
      }).unwrap();
      setItemPreview(response.data || null);
      toast.success("Item created-date preview loaded");
    } catch (_error) {
      // Error toast handled by RTK base query.
    }
  };

  const confirmReceiptUpdate = async (action: Extract<ModalAction, { kind: "receipt" }>) => {
    try {
      const response = await updateReceiptUploadedDate({
        receiptId: action.receiptId,
        uploadedAt: action.uploadedAtIso,
        reason: action.reason,
      }).unwrap();

      toast.success(response.message || "Receipt uploaded date updated");
      setModalAction(null);
      await previewReceiptTrigger({
        receiptId: action.receiptId,
        uploadedAt: action.uploadedAtIso,
      }).unwrap();
      setReceiptPreview((prev) =>
        prev
          ? {
              ...prev,
              currentUploadedAt: action.uploadedAtIso,
            }
          : prev
      );
    } catch (_error) {
      // Error toast handled by RTK base query.
    }
  };

  const confirmUserUpdate = async (action: Extract<ModalAction, { kind: "user" }>) => {
    try {
      const response = await updateUserNextDueDate({
        userId: action.userId,
        nextDueDate: action.nextDueDateIso,
        reason: action.reason,
      }).unwrap();

      toast.success(response.message || "User next due date updated");
      setModalAction(null);
      await previewUserTrigger({
        userId: action.userId,
        nextDueDate: action.nextDueDateIso,
      }).unwrap();
      setUserPreview((prev) =>
        prev
          ? {
              ...prev,
              currentNextDueDate: action.nextDueDateIso,
            }
          : prev
      );
    } catch (_error) {
      // Error toast handled by RTK base query.
    }
  };

  const confirmItemUpdate = async (action: Extract<ModalAction, { kind: "item" }>) => {
    try {
      const response = await updateItemCreatedDate({
        itemId: action.itemId,
        createdAt: action.createdAtIso,
        reason: action.reason,
      }).unwrap();

      toast.success(response.message || "Item created date updated");
      setModalAction(null);
      await previewItemTrigger({
        itemId: action.itemId,
        createdAt: action.createdAtIso,
      }).unwrap();
      setItemPreview((prev) =>
        prev
          ? {
              ...prev,
              currentCreatedAt: action.createdAtIso,
            }
          : prev
      );
    } catch (_error) {
      // Error toast handled by RTK base query.
    }
  };

  return (
    <BlurLoadingContainer loading={false} minDurationMs={120}>
      <section className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-soft">
          <h1 className="text-xl font-semibold">Super Admin Date Maintenance</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Temporary tool for legacy corrections only: receipt uploaded date, user next due date, and item created date.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <article className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="mb-4 flex items-center gap-2">
              <FaFileAlt className="text-primary" />
              <h2 className="text-lg font-semibold">Receipt Uploaded Date</h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs uppercase text-muted-foreground">Receipt ID</label>
                <input
                  value={receiptId}
                  onChange={(event) => setReceiptId(event.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Mongo receipt _id"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-muted-foreground">New Uploaded Date/Time</label>
                <input
                  type="datetime-local"
                  value={uploadedAtInput}
                  onChange={(event) => setUploadedAtInput(event.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-muted-foreground">Reason (optional)</label>
                <input
                  value={receiptReason}
                  onChange={(event) => setReceiptReason(event.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Why are you changing this date?"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={previewReceipt}
                disabled={previewReceiptResult.isFetching}
                className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                {previewReceiptResult.isFetching ? "Previewing..." : "Preview Change"}
              </button>
              <button
                type="button"
                disabled={!receiptPreview}
                onClick={() => {
                  const safeReceiptId = receiptId.trim();
                  const uploadedAtIso = toIso(uploadedAtInput);
                  if (!safeReceiptId || !uploadedAtIso) {
                    toast.error("Preview the change first");
                    return;
                  }
                  setModalAction({
                    kind: "receipt",
                    receiptId: safeReceiptId,
                    uploadedAtIso,
                    reason: receiptReason,
                    preview: receiptPreview,
                  });
                }}
                className="rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground hover:opacity-90 disabled:opacity-60"
              >
                Apply Update
              </button>
            </div>

            {receiptPreviewError && (
              <p className="mt-3 rounded-md bg-destructive/10 p-2 text-sm text-destructive">{receiptPreviewError}</p>
            )}

            {receiptPreview && (
              <div className="mt-4 space-y-2 rounded-lg border border-border bg-muted p-3">
                <p className="text-xs uppercase text-muted-foreground">Preview</p>
                <p className="text-sm">
                  <span className="font-medium">Current:</span> {formatDateTime(receiptPreview.currentUploadedAt)}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Proposed:</span> {formatDateTime(receiptPreview.proposedUploadedAt)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Plan: {receiptPreview.plan || "-"} | Amount: {receiptPreview.amount ?? "-"} | Status:{" "}
                  {receiptPreview.status || "-"}
                </p>
              </div>
            )}
          </article>

          <article className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="mb-4 flex items-center gap-2">
              <FaUserCog className="text-primary" />
              <h2 className="text-lg font-semibold">User Next Due Date</h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs uppercase text-muted-foreground">User ID</label>
                <input
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Mongo user _id"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-muted-foreground">New Next Due Date/Time</label>
                <input
                  type="datetime-local"
                  value={nextDueDateInput}
                  onChange={(event) => setNextDueDateInput(event.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-muted-foreground">Reason (optional)</label>
                <input
                  value={userReason}
                  onChange={(event) => setUserReason(event.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Why are you changing this date?"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={previewUser}
                disabled={previewUserResult.isFetching}
                className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                {previewUserResult.isFetching ? "Previewing..." : "Preview Change"}
              </button>
              <button
                type="button"
                disabled={!userPreview}
                onClick={() => {
                  const safeUserId = userId.trim();
                  const nextDueDateIso = toIso(nextDueDateInput);
                  if (!safeUserId || !nextDueDateIso) {
                    toast.error("Preview the change first");
                    return;
                  }
                  setModalAction({
                    kind: "user",
                    userId: safeUserId,
                    nextDueDateIso,
                    reason: userReason,
                    preview: userPreview,
                  });
                }}
                className="rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground hover:opacity-90 disabled:opacity-60"
              >
                Apply Update
              </button>
            </div>

            {userPreviewError && (
              <p className="mt-3 rounded-md bg-destructive/10 p-2 text-sm text-destructive">{userPreviewError}</p>
            )}

            {userPreview && (
              <div className="mt-4 space-y-2 rounded-lg border border-border bg-muted p-3">
                <p className="text-xs uppercase text-muted-foreground">Preview</p>
                <p className="text-sm">
                  <span className="font-medium">User:</span> {userPreview.fullName || "-"} ({userPreview.email || "-"})
                </p>
                <p className="text-sm">
                  <span className="font-medium">Current:</span> {formatDateTime(userPreview.currentNextDueDate)}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Proposed:</span> {formatDateTime(userPreview.proposedNextDueDate)}
                </p>
              </div>
            )}
          </article>

          <article className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="mb-4 flex items-center gap-2">
              <FaBoxOpen className="text-primary" />
              <h2 className="text-lg font-semibold">Item Created Date</h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs uppercase text-muted-foreground">Item ID</label>
                <input
                  value={itemId}
                  onChange={(event) => setItemId(event.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Mongo item _id"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-muted-foreground">New Item Created Date/Time</label>
                <input
                  type="datetime-local"
                  value={itemCreatedAtInput}
                  onChange={(event) => setItemCreatedAtInput(event.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-muted-foreground">Reason (optional)</label>
                <input
                  value={itemReason}
                  onChange={(event) => setItemReason(event.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Why are you changing this date?"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={previewItem}
                disabled={previewItemResult.isFetching}
                className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                {previewItemResult.isFetching ? "Previewing..." : "Preview Change"}
              </button>
              <button
                type="button"
                disabled={!itemPreview}
                onClick={() => {
                  const safeItemId = itemId.trim();
                  const createdAtIso = toIso(itemCreatedAtInput);
                  if (!safeItemId || !createdAtIso) {
                    toast.error("Preview the change first");
                    return;
                  }
                  setModalAction({
                    kind: "item",
                    itemId: safeItemId,
                    createdAtIso,
                    reason: itemReason,
                    preview: itemPreview,
                  });
                }}
                className="rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground hover:opacity-90 disabled:opacity-60"
              >
                Apply Update
              </button>
            </div>

            {itemPreviewError && (
              <p className="mt-3 rounded-md bg-destructive/10 p-2 text-sm text-destructive">{itemPreviewError}</p>
            )}

            {itemPreview && (
              <div className="mt-4 space-y-2 rounded-lg border border-border bg-muted p-3">
                <p className="text-xs uppercase text-muted-foreground">Preview</p>
                <p className="text-sm">
                  <span className="font-medium">Model:</span> {itemPreview.iphoneModel || "-"} ({itemPreview.plan || "-"})
                </p>
                <p className="text-sm">
                  <span className="font-medium">User:</span> {itemPreview.userEmail || "-"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Current:</span> {formatDateTime(itemPreview.currentCreatedAt)}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Proposed:</span> {formatDateTime(itemPreview.proposedCreatedAt)}
                </p>
              </div>
            )}
          </article>
        </div>
      </section>

      {modalAction && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirm maintenance update"
          onClick={(event) => {
            if (event.target === event.currentTarget) setModalAction(null);
          }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
        >
          <article className="w-full max-w-lg rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-soft">
            <h3 className="text-lg font-semibold">Confirm Date Update</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              This change is immediate and will be audit logged.
            </p>

            {modalAction.kind === "receipt" ? (
              <div className="mt-4 space-y-2 rounded-lg border border-border bg-muted p-3 text-sm">
                <p className="flex items-center gap-2">
                  <FaFileAlt className="text-primary" /> Receipt ID: {modalAction.receiptId}
                </p>
                <p className="flex items-center gap-2">
                  <FaClock className="text-primary" /> Current: {formatDateTime(modalAction.preview?.currentUploadedAt)}
                </p>
                <p className="flex items-center gap-2">
                  <FaCalendarAlt className="text-primary" /> New: {formatDateTime(modalAction.uploadedAtIso)}
                </p>
              </div>
            ) : modalAction.kind === "user" ? (
              <div className="mt-4 space-y-2 rounded-lg border border-border bg-muted p-3 text-sm">
                <p className="flex items-center gap-2">
                  <FaUserCog className="text-primary" /> User ID: {modalAction.userId}
                </p>
                <p className="flex items-center gap-2">
                  <FaClock className="text-primary" /> Current: {formatDateTime(modalAction.preview?.currentNextDueDate)}
                </p>
                <p className="flex items-center gap-2">
                  <FaCalendarAlt className="text-primary" /> New: {formatDateTime(modalAction.nextDueDateIso)}
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-2 rounded-lg border border-border bg-muted p-3 text-sm">
                <p className="flex items-center gap-2">
                  <FaBoxOpen className="text-primary" /> Item ID: {modalAction.itemId}
                </p>
                <p className="flex items-center gap-2">
                  <FaClock className="text-primary" /> Current: {formatDateTime(modalAction.preview?.currentCreatedAt)}
                </p>
                <p className="flex items-center gap-2">
                  <FaCalendarAlt className="text-primary" /> New: {formatDateTime(modalAction.createdAtIso)}
                </p>
              </div>
            )}

            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalAction(null)}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (modalAction.kind === "receipt") {
                    confirmReceiptUpdate(modalAction);
                    return;
                  }
                  if (modalAction.kind === "user") {
                    confirmUserUpdate(modalAction);
                    return;
                  }
                  confirmItemUpdate(modalAction);
                }}
                disabled={pageLoading}
                className="flex items-center justify-center gap-2 rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground hover:opacity-90 disabled:opacity-60"
              >
                {pageLoading ? (
                  <>
                    <ClipLoader color="hsl(var(--destructive-foreground))" size={14} speedMultiplier={0.9} />
                    Updating...
                  </>
                ) : (
                  "Confirm Update"
                )}
              </button>
            </div>
          </article>
        </div>
      )}
    </BlurLoadingContainer>
  );
};
