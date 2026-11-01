# EasyBuy Frontend — Agent Notes

**Read first:** the platform rules in `C:\Users\HP\Desktop\Shortwork\AGENTS.md` and `C:\Users\HP\Desktop\Shortwork\EASYBUY-AGENTS.md`.

- **Role:** The frontend repositories for EasyBuy.
  - **Tracker UI (`src/`):** Authenticated React + Vite app (`easybuytracker-ui`). Embeddable in Melvin OS. Direct API client with Bearer token authentication.
  - **Apply App (`easybuy-next/`):** Public lead-capture and application funnel built on Next.js 16. Server-side same-origin proxy to the backend (`/api/v1/public/*`).
- **Backend:** Calls `EasybuytrackerBackend` (port 552 locally, or Railway production URL).

## Engineering Standards & Testing Discipline
1. **No Fake, Tautological, or Vacuous Tests:**
   - Never write tests that merely assert tautologies, mock out the very behaviors under test without exercising system logic, or exist solely to artificially inflate pass counts or coverage.
   - Tests must execute real application code paths, exercise genuine business logic, and validate actual state changes, edge cases, and failure modes against authoritative contracts and models.
   - Every test must be capable of failing if the code breaks or regresses.
2. **Error Handling & Information Leakage Prevention:**
   - Maintain disciplined, robust error handling across all layers.
   - Use explicit types, readable formatting, and sanitized user-facing errors.
   - **Zero leakage of sensitive internals:** Never expose stack traces, database errors, internal system paths, environment values, credentials, tokens, or sensitive user data in client responses or unauthenticated error payloads.
3. **Repository Documentation & CI/CD Synchronization:**
   - Each repository's `AGENTS.md` is self-contained and authoritative locally. Read it before starting work.
   - Maintain repository-specific `docs/` as the canonical documentation for that repository.
   - Keep repository `docs/`, `README.md`, secrets references, and deployment guides strictly synchronized after every change.
   - Maintain each repository's own GitHub Actions CI/CD workflows. Do not reintroduce a root git repository or root workflow without explicit user authorization.
   - When cross-repository layout changes occur, update the workspace overview accordingly.
   - Run relevant repository verification and affected shared contract checks before finishing.
   - Rebuild only affected consumers and verify health. Preserve composed identities, data volumes, existing credentials, and retained rollback histories.

## Bug Audit Output Location & Persistent Severity-Based QA Reporting
1. **Audit Output Location:**
   - Every repository must write all bug audit reports and findings exclusively to its own ignored `qa-report/bug-audit/` folder. Create it when needed.
   - **Explicit Exception to Documentation Placement:** Never write bug audits to `docs/` or any other documentation folder, `qa-reports/bug-audit/`, or directly to `qa-report/`. Keep audits component-local and preserve existing unrelated reports.
2. **Persistent Severity-Based QA Ledger:**
   - Keep active bugs, functional/UI issues, reliability gaps, and security vulnerabilities in the repository's ignored `qa-report/bug-audit/` directory, exclusively in four reusable severity files:
     - `Critical.md`: Immediate severe compromise or widespread irreversible loss.
     - `High.md`: Major security, authorization, financial, or core-workflow failures.
     - `Medium.md`: Material but limited-impact failures.
     - `Low.md`: Minor usability, visual, or low-impact defects.
   - Create this fixed set once and reuse it for all later audits. Do not create per-audit, per-date, per-feature, or per-issue Markdown reports, and never place audit findings in `docs/`.
   - Identify the issue category within the entry; all categories share these severity files.
   - If a severity file has no open issues, retain the reusable file with a brief statement: `No open issues`. Remove that statement when adding a new issue.
   - These files represent the cumulative active QA ledger, not a claim that untested areas have no bugs.
3. **Issue Entry Format & Discovery Timestamps:**
   - Give every new issue its own heading containing a clear title and its actual discovery date/time in Africa/Lagos, including the UTC offset:
     `## <Issue Title> — YYYY-MM-DD HH:mm WAT (UTC+01:00)`
   - Do not invent discovery timestamps for older findings. Preserve the original timestamp when updating an existing issue.
   - Each entry records:
     - Affected component / files or flow
     - Reproducible evidence (sanitized: never include credentials, tokens, or unnecessary personal information)
     - Actual impact
     - Verification criteria needed to close it
   - Update an existing entry for the same root cause instead of duplicating it on subsequent audits. Move the entry if its severity changes.
4. **Lifecycle & Closure Discipline:**
   - After fixing an issue and passing the relevant verification, delete that issue's entire section from its severity file, preserving unrelated open findings.
   - Do not keep resolved entries, strike-through histories, or duplicate fixed-issue reports in the active ledger.
   - Keep an issue open when verification is incomplete or blocked, and state what remains.
   - Publish and verify replacement severity entries before removing superseded audit reports. Remove fixed findings only after their relevant fix verification passes; retain unresolved or blocked findings with honest status. Consolidating historical reports must not invent discovery timestamps, convert acceptance gaps into confirmed exploits, or silently erase unresolved findings.
5. **Strict Directory Cleanliness:**
   - After every bug audit, `qa-report/bug-audit/` must contain **only** the four persistent severity files: `Critical.md`, `High.md`, `Medium.md`, and `Low.md`.
   - Do not retain any other files or subfolders there: no dated summaries, separate issue reports, screenshots, logs, JSON, traces, HTML, or evidence archives.
   - Temporary audit scratch output may be used while working, but remove audit-generated scratch artifacts before concluding. Do not relocate extra bug-audit reports/artifacts into `docs/` or another QA directory to evade this rule.
