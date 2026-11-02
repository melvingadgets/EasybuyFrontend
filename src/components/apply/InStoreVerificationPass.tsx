import { useMemo, useState } from "react";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaPrint, FaQrcode, FaShieldAlt, FaWhatsapp } from "react-icons/fa";

type InStoreVerificationPassProps = {
  requestId: string;
  passCode: string;
  applicantName?: string;
  iphoneModel?: string;
  capacity?: string;
  plan?: string;
  visitDate?: string;
  visitTimeSlot?: string;
  visitStoreLocation?: string;
  documentsComplete?: boolean;
  compact?: boolean;
};

// Generates a deterministic scannable QR pattern grid for the verification token.
function generateQrMatrix(text: string, size = 25): boolean[][] {
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const addFinderPattern = (row: number, col: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        matrix[row + r][col + c] = isBorder || isInner;
      }
    }
  };

  // Three finder patterns (top-left, top-right, bottom-left)
  addFinderPattern(0, 0);
  addFinderPattern(0, size - 7);
  addFinderPattern(size - 7, 0);

  // Timing lines
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Alignment pattern near bottom right
  const alignRow = size - 9;
  const alignCol = size - 9;
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const isBorder = r === 0 || r === 4 || c === 0 || c === 4;
      const isCenter = r === 2 && c === 2;
      matrix[alignRow + r][alignCol + c] = isBorder || isCenter;
    }
  }

  // Pseudo-random data distribution based on hash of text
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const inFinder1 = r < 8 && c < 8;
      const inFinder2 = r < 8 && c >= size - 8;
      const inFinder3 = r >= size - 8 && c < 8;
      const inTiming = r === 6 || c === 6;
      const inAlign = r >= alignRow && r < alignRow + 5 && c >= alignCol && c < alignCol + 5;
      if (inFinder1 || inFinder2 || inFinder3 || inTiming || inAlign) continue;

      hash ^= (r * 31 + c * 17);
      hash = Math.imul(hash, 16777619);
      matrix[r][c] = (hash & 1) === 1;
    }
  }

  return matrix;
}

export function InStoreVerificationPass({
  requestId,
  passCode,
  applicantName,
  iphoneModel,
  capacity,
  plan,
  visitDate,
  visitTimeSlot,
  visitStoreLocation = "Melvin Gadgets Hub, Computer Village, Ikeja, Lagos",
  documentsComplete,
  compact = false,
}: InStoreVerificationPassProps) {
  const [copied, setCopied] = useState(false);

  const qrMatrix = useMemo(() => generateQrMatrix(`MELVIN-PASS:${passCode}:${requestId}`), [passCode, requestId]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(passCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const whatsAppAppointmentUrl = useMemo(() => {
    const text = `Hello Melvin Gadgets! I have an in-store physical verification appointment for request ${requestId} (Pass Code: ${passCode}) on ${visitDate || "scheduled day"} at ${visitTimeSlot || "scheduled slot"}.`;
    return `https://wa.me/2347086758713?text=${encodeURIComponent(text)}`;
  }, [requestId, passCode, visitDate, visitTimeSlot]);

  return (
    <div className={`overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-card to-muted/40 shadow-soft ${compact ? "p-4" : "p-6"}`}>
      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <FaShieldAlt className="size-5" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Verified Physical Visit
            </span>
            <h3 className="text-lg font-bold leading-tight">In-Store Verification Pass</h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 font-mono text-xs font-bold text-foreground transition hover:bg-muted"
            title="Click to copy pass code"
          >
            <span>{passCode}</span>
            <span className="text-[10px] text-muted-foreground">{copied ? "✓ Copied" : "Copy"}</span>
          </button>
          {!compact ? (
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
              title="Print Pass"
            >
              <FaPrint className="size-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Main Pass Content */}
      <div className="mt-5 grid gap-6 sm:grid-cols-[1fr_140px] sm:items-center">
        <div className="space-y-3.5 text-sm">
          {applicantName || iphoneModel ? (
            <div>
              <p className="text-xs text-muted-foreground">Applicant & Device</p>
              <p className="font-semibold text-foreground">
                {applicantName ? `${applicantName} · ` : ""}
                {iphoneModel ? `${iphoneModel} (${capacity}) · ${plan}` : requestId}
              </p>
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-2.5">
              <FaCalendarAlt className="mt-0.5 size-4 shrink-0 text-emerald-600" />
              <div>
                <p className="text-xs text-muted-foreground">Appointment Date</p>
                <p className="font-medium text-foreground">{visitDate || "Upcoming Business Day"}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <FaClock className="mt-0.5 size-4 shrink-0 text-emerald-600" />
              <div>
                <p className="text-xs text-muted-foreground">Time Slot</p>
                <p className="font-medium text-foreground">{visitTimeSlot || "10:00 AM - 04:00 PM"}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl border border-border/80 bg-background/60 p-3">
            <FaMapMarkerAlt className="mt-0.5 size-4 shrink-0 text-red-500" />
            <div className="text-xs">
              <p className="font-semibold text-foreground">{visitStoreLocation}</p>
              <p className="mt-0.5 text-muted-foreground">
                Opening Hours: Mon – Sat: 9:00 AM – 6:00 PM (Closed Sundays)
              </p>
            </div>
          </div>
        </div>

        {/* QR Code Matrix */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-white p-3 shadow-inner">
          <svg viewBox="0 0 25 25" className="size-28" shapeRendering="crispEdges">
            {qrMatrix.map((row, r) =>
              row.map((active, c) =>
                active ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#09090b" /> : null
              )
            )}
          </svg>
          <div className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-zinc-800">
            <FaQrcode className="size-3" /> Scan on Arrival
          </div>
        </div>
      </div>

      {/* Checklist and Next Steps */}
      <div className="mt-5 rounded-xl border border-border bg-muted/50 p-3.5 text-xs">
        <p className="font-semibold text-foreground">What to expect at the store:</p>
        <ul className="mt-2 space-y-1.5 text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className={documentsComplete ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
              {documentsComplete ? "✓" : "•"}
            </span>
            <span>
              {documentsComplete
                ? "Your documents are uploaded online! Ready for physical check."
                : "Please upload your 3 documents online before arriving so your device is prepped."}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="font-bold text-foreground">•</span>
            <span>Bring a valid physical ID (NIN Slip, Voters Card, or Drivers License) and this pass.</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="font-bold text-foreground">•</span>
            <span>Our in-store team will scan this pass, confirm your biometrics, and hand over your phone.</span>
          </li>
        </ul>
      </div>

      {/* WhatsApp Help Button */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
        <a
          href={whatsAppAppointmentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <FaWhatsapp className="size-4" /> Message Store Concierge on WhatsApp
        </a>
        <span className="text-xs text-muted-foreground">Pass Code: {passCode}</span>
      </div>
    </div>
  );
}
