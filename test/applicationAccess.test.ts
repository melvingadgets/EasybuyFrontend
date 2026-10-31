import { test } from "node:test";
import assert from "node:assert/strict";
import { decideApplicationAccess, latestByPriority } from "../src/lib/applicationAccess.ts";
import type { MyEasyBuyApplication, PublicEasyBuyRequestStatus } from "../src/types/api.ts";

// Run with `npm test` (Node runs the TypeScript directly).
//
// The approval gate: which screen a signed-in customer gets. These rules are what stops a customer
// with a live application from being shown either a dashboard of zeros or a stale rejection.

const request = (status: PublicEasyBuyRequestStatus, requestId = `EB-${status}`): MyEasyBuyApplication => ({
  requestId,
  iphoneModel: "iPhone 15",
  capacity: "128GB",
  plan: "Monthly",
  status,
});

test("no applications: a loan still opens the dashboard, and only no loan at all sends them to apply", () => {
  assert.deepEqual(decideApplicationAccess([], false), { kind: "no_applications" });
  // A person migrated onto EasyBuy has a financed item but no Apply history. Sending them to
  // /apply starts a second application for a phone they already have (2026-10-28 audit).
  assert.deepEqual(decideApplicationAccess([], true), { kind: "open" });
});

test("received or under review: documents are still editable, so the status page", () => {
  for (const status of ["pending_verification", "verified"] as const) {
    assert.equal(decideApplicationAccess([request(status)], false).kind, "under_review");
    // Items can exist from an old, finished loan; a newer request still owns the decision.
    assert.equal(decideApplicationAccess([request(status)], true).kind, "under_review");
  }
});

test("approved opens the shell in the activating state, not the dashboard", () => {
  assert.equal(decideApplicationAccess([request("approved")], false).kind, "activating");
  assert.equal(decideApplicationAccess([request("approved")], true).kind, "activating");
});

test("rejected is the status page, with the reason and a re-apply link", () => {
  assert.equal(decideApplicationAccess([request("rejected")], false).kind, "rejected");
  assert.equal(decideApplicationAccess([request("rejected")], true).kind, "rejected");
});

test("converted with a financed item: today's dashboard, unchanged", () => {
  assert.equal(decideApplicationAccess([request("converted")], true).kind, "open");
});

test("converted without a financed item: never an empty dashboard", () => {
  // The old anonymous-conversion case: the request became an item that carries no link to this
  // person, so the dashboard would show zeros. It's a support case, not a loan.
  assert.equal(decideApplicationAccess([request("converted")], false).kind, "converted_unlinked");
});

test("an old rejection does not hide a newer live application", () => {
  const requests = [request("rejected", "EB-old"), request("verified", "EB-new")];
  assert.equal(latestByPriority(requests)?.requestId, "EB-new");

  const decision = decideApplicationAccess(requests, false);
  assert.equal(decision.kind, "under_review");
  assert.equal(decision.kind === "under_review" && decision.request.requestId, "EB-new");
});

test("the most advanced status wins: converted over approved over review over rejected", () => {
  const all = [
    request("rejected", "A"),
    request("pending_verification", "B"),
    request("verified", "C"),
    request("approved", "D"),
    request("converted", "E"),
  ];

  assert.equal(latestByPriority(all)?.status, "converted");
  assert.equal(latestByPriority(all.filter((r) => r.status !== "converted"))?.status, "approved");
  assert.equal(
    latestByPriority(all.filter((r) => r.status !== "converted" && r.status !== "approved"))?.status,
    "verified"
  );
  assert.equal(
    latestByPriority(all.filter((r) => ["rejected", "pending_verification"].includes(r.status)))?.status,
    "pending_verification"
  );
});

test("the decision carries the request it was made from", () => {
  const decision = decideApplicationAccess([request("approved", "EB-42")], false);
  assert.equal(decision.kind === "activating" && decision.request.requestId, "EB-42");
});

test("the input list is not reordered in place", () => {
  const requests = [request("rejected", "A"), request("converted", "B")];
  latestByPriority(requests);
  assert.deepEqual(
    requests.map((r) => r.requestId),
    ["A", "B"]
  );
});
