import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

// `src/lib/access.ts` is a byte-identical copy of `melvin-platform-kit/src/access.ts`. A stale
// copy is a silent authorization bug: a screen gated on a permission this build doesn't know
// about, or one it wrongly believes. The workspace script recomputes the hash in the header.
//
// Standalone checkouts of this repo have no sibling kit, so the check is skipped there.

const script = resolve(import.meta.dirname, "../../scripts/check-access-sync.mjs");

test("src/lib/access.ts is an unmodified copy of the kit's access.ts", (t) => {
  if (!existsSync(script)) {
    t.skip("workspace checkout not present — run from Shortwork to verify");
    return;
  }

  const result = spawnSync(process.execPath, [script], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /ok\s+EasybuyFrontend\/src\/lib\/access\.ts/);
});
