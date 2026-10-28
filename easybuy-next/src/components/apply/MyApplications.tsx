"use client";

import { useEffect, useState } from "react";
import { ApplicationDocuments } from "@/components/apply/ApplicationDocuments";
import { getMelvinBridgeToken, onMelvinAuthChange } from "@/lib/melvinBridge";

// Applications that can still take documents (approval or rejection locks them).
const OPEN_STATUSES = new Set(["pending_verification", "verified"]);

// "My applications": inside Melvin OS, a signed-in person sees where each of their EasyBuy
// applications stands (the Apply integration's third step). Hidden for anonymous visitors.

type MyRequest = {
  requestId: string;
  iphoneModel: string;
  capacity: string;
  plan: string;
  status: "pending_verification" | "verified" | "approved" | "rejected" | "converted";
  createdAt?: string;
};

const STATUS: Record<MyRequest["status"], { label: string; tone: string }> = {
  pending_verification: { label: "Received", tone: "bg-amber-100 text-amber-800" },
  verified: { label: "Under review", tone: "bg-amber-100 text-amber-800" },
  approved: { label: "Approved: come collect", tone: "bg-sky-100 text-sky-800" },
  rejected: { label: "Not approved", tone: "bg-red-100 text-red-700" },
  converted: { label: "Collected", tone: "bg-emerald-100 text-emerald-800" },
};

export function MyApplications() {
  const [token, setToken] = useState<string | null>(() => getMelvinBridgeToken());
  const [requests, setRequests] = useState<MyRequest[]>([]);
  const [openDocuments, setOpenDocuments] = useState<string | null>(null);

  useEffect(() => onMelvinAuthChange(() => setToken(getMelvinBridgeToken())), []);

  useEffect(() => {
    if (!token) {
      setRequests([]);
      return;
    }
    let active = true;
    fetch("/api/v1/public/easybuy-requests/mine", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => {
        if (active) setRequests(Array.isArray(body?.data) ? body.data : []);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [token]);

  if (!requests.length) return null;
  return (
    <section className="mb-5 rounded-xl border border-border bg-muted p-4">
      <h2 className="font-heading text-lg font-semibold">My applications</h2>
      <ul className="mt-3 space-y-2">
        {requests.map((request) => {
          const status = STATUS[request.status] ?? { label: request.status, tone: "bg-muted text-foreground" };
          return (
            <li key={request.requestId} className="rounded-lg bg-background px-3 py-2.5">
              <div className="flex items-center justify-between gap-3">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">
                    {request.iphoneModel} ({request.capacity}) · {request.plan}
                  </span>
                  <span className="block text-xs text-muted-foreground">{request.requestId}</span>
                </span>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${status.tone}`}>{status.label}</span>
              </div>
              {OPEN_STATUSES.has(request.status) ? (
                <button
                  type="button"
                  aria-expanded={openDocuments === request.requestId}
                  onClick={() => setOpenDocuments((current) => (current === request.requestId ? null : request.requestId))}
                  className="mt-2 min-h-11 w-full rounded-md border border-border px-3 text-sm font-medium hover:bg-muted"
                >
                  {openDocuments === request.requestId ? "Hide documents" : "Documents: bank statement, NIN, photo"}
                </button>
              ) : null}
              {openDocuments === request.requestId && token ? (
                <div className="mt-3">
                  <ApplicationDocuments requestId={request.requestId} auth={{ bearer: token }} compact />
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
