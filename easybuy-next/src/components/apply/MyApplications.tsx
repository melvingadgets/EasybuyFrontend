"use client";

import { useEffect, useState } from "react";
import { getMelvinBridgeToken, onMelvinAuthChange } from "@/lib/melvinBridge";

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
            <li key={request.requestId} className="flex items-center justify-between gap-3 rounded-lg bg-background px-3 py-2.5">
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">
                  {request.iphoneModel} ({request.capacity}) · {request.plan}
                </span>
                <span className="block text-xs text-muted-foreground">{request.requestId}</span>
              </span>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${status.tone}`}>{status.label}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
