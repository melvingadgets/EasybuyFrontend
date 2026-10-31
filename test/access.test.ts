import { test } from "node:test";
import assert from "node:assert/strict";
import { can, hasMinRole, resolvePermissions } from "../src/lib/access.ts";

// The finance app's copy of the access engine, evaluated exactly as the route guard and the nav
// filter evaluate it. `lib/access.ts` is vendored verbatim from the kit; the root script
// `scripts/check-access-sync.mjs` proves it hasn't drifted, and this file proves the *behaviour*
// the screens rely on.
//
// Run with `npm test` (Node runs the TypeScript directly).

test("a SuperAdmin reaches every screen an Admin reaches", () => {
  // The old guard was an equality check, so `["Admin"]` hid Create User and Create Item from
  // the SuperAdmin who owns them. Rank is inheritance now.
  for (const permission of [
    "easybuy.users.create",
    "easybuy.catalog.write",
    "easybuy.receipts.approve",
    "easybuy.admins.create",
    "easybuy.superadmin.access",
  ] as const) {
    assert.equal(can({ role: "SuperAdmin" }, permission), true, permission);
  }
  assert.equal(hasMinRole({ role: "SuperAdmin" }, "User"), true);
  assert.equal(hasMinRole({ role: "SuperAdmin" }, "Admin"), true);
});

test("an Admin sees the staff screens but not the SuperAdmin ones", () => {
  assert.equal(can({ role: "Admin" }, "easybuy.users.create"), true);
  assert.equal(can({ role: "Admin" }, "easybuy.catalog.write"), true);
  assert.equal(can({ role: "Admin" }, "easybuy.receipts.approve"), false);
  assert.equal(can({ role: "Admin" }, "easybuy.superadmin.access"), false);
  assert.equal(can({ role: "Admin" }, "easybuy.admins.create"), false);
});

test("an ordinary customer sees their own screens and nothing else", () => {
  assert.equal(hasMinRole({ role: "User" }, "User"), true);
  assert.equal(can({ role: "User" }, "easybuy.receipts.upload"), true);
  assert.equal(can({ role: "User" }, "easybuy.users.create"), false);
  assert.equal(can({ role: "User" }, "easybuy.superadmin.access"), false);
});

test("a token the app cannot read shows no staff screen at all", () => {
  // A token is attacker-controlled JSON. Every one of these must hide the staff nav and
  // redirect to /403 rather than falling back to a customer view.
  for (const claim of [
    null,
    undefined,
    {},
    { role: "admin" },
    { role: "superadmin" },
    { role: "SuperAdmin " },
    { role: "guest" },
    { role: 1 },
    { role: { $ne: null } },
  ]) {
    assert.deepEqual(resolvePermissions(claim as never), [], JSON.stringify(claim) ?? "undefined");
    assert.equal(can(claim as never, "easybuy.users.create"), false);
    assert.equal(hasMinRole(claim as never, "User"), false);
  }
});

test("a domain role widens what a customer may do, and nothing more", () => {
  const salesperson = { role: "User", domainRoles: ["market:salesperson"] };
  assert.equal(can(salesperson, "market.swap.settle"), true);
  assert.equal(can(salesperson, "easybuy.users.create"), false);
  assert.equal(can({ role: "User", domainRoles: ["market:notreal"] }, "market.swap.settle"), false);
});
