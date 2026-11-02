import { OPEN_STATUSES } from "../src/components/apply/applicationStatus.ts";
import { test } from "node:test";
import assert from "node:assert/strict";
import type { MyEasyBuyApplication } from "../src/types/api.ts";
import type { DocumentsSession } from "../src/lib/documentsSession.ts";

test("application records distinguish physical appearance from online application", () => {
  const onlineApp: MyEasyBuyApplication = {
    requestId: "EBR-ONLINE-01",
    iphoneModel: "iPhone 14",
    capacity: "128GB",
    plan: "Monthly",
    status: "verified",
    applicationType: "online",
  };

  const physicalApp: MyEasyBuyApplication = {
    requestId: "EBR-PHYSICAL-02",
    iphoneModel: "iPhone 15 Pro",
    capacity: "256GB",
    plan: "Weekly",
    status: "verified",
    applicationType: "physical_appearance",
    visitDate: "2026-11-10",
    visitTimeSlot: "10:00 AM - 12:00 PM",
    visitStoreLocation: "Melvin Gadgets Hub, Computer Village, Ikeja, Lagos",
    verificationPassCode: "MG-PASS-A1B2C3",
  };

  assert.equal(onlineApp.applicationType, "online");
  assert.equal(onlineApp.verificationPassCode, undefined);

  assert.equal(physicalApp.applicationType, "physical_appearance");
  assert.equal(physicalApp.visitDate, "2026-11-10");
  assert.equal(physicalApp.visitTimeSlot, "10:00 AM - 12:00 PM");
  assert.equal(physicalApp.visitStoreLocation, "Melvin Gadgets Hub, Computer Village, Ikeja, Lagos");
  assert.equal(physicalApp.verificationPassCode, "MG-PASS-A1B2C3");
});

test("DocumentsSession preserves physical appearance appointment and verification pass", () => {
  const session: DocumentsSession = {
    requestId: "EBR-TEST-99",
    documentsToken: "doc-tok-xyz",
    downPaymentNaira: 150000,
    applicationType: "physical_appearance",
    visitDate: "2026-11-15",
    visitTimeSlot: "02:00 PM - 04:00 PM",
    visitStoreLocation: "Melvin Gadgets Hub, Computer Village, Ikeja, Lagos",
    verificationPassCode: "MG-PASS-998877",
    savedAt: Date.now(),
  };

  const serialized = JSON.stringify(session);
  const parsed = JSON.parse(serialized) as DocumentsSession;

  assert.equal(parsed.requestId, "EBR-TEST-99");
  assert.equal(parsed.applicationType, "physical_appearance");
  assert.equal(parsed.visitDate, "2026-11-15");
  assert.equal(parsed.visitTimeSlot, "02:00 PM - 04:00 PM");
  assert.equal(parsed.verificationPassCode, "MG-PASS-998877");
});


test("OPEN_STATUSES allows document editing for all unapproved applications", () => {
  assert.equal(OPEN_STATUSES.has("pending_verification"), true);
  assert.equal(OPEN_STATUSES.has("verified"), true);
  assert.equal(OPEN_STATUSES.has("rejected"), true);
  assert.equal(OPEN_STATUSES.has("approved"), false);
  assert.equal(OPEN_STATUSES.has("converted"), false);
});
