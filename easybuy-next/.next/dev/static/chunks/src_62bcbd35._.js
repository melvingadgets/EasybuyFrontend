(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/apply/ProgressBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProgressBar",
    ()=>ProgressBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const labels = [
    "Basic info",
    "Plan",
    "Review"
];
function ProgressBar({ step }) {
    const progress = (step - 1) / (labels.length - 1) * 100;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between text-xs font-medium text-muted-foreground",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "Step ",
                            step,
                            " of ",
                            labels.length
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/apply/ProgressBar.tsx",
                        lineNumber: 15,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            Math.round(progress),
                            "% complete"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/apply/ProgressBar.tsx",
                        lineNumber: 16,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/apply/ProgressBar.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-2 rounded-full bg-muted",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-full rounded-full bg-primary transition-all duration-300 ease-out",
                    style: {
                        width: `${progress}%`
                    },
                    "aria-hidden": "true"
                }, void 0, false, {
                    fileName: "[project]/src/components/apply/ProgressBar.tsx",
                    lineNumber: 20,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/apply/ProgressBar.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-3 gap-2 text-[11px] text-muted-foreground sm:text-xs",
                children: labels.map((label, index)=>{
                    const current = index + 1;
                    const active = current === step;
                    const done = current < step;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center gap-1 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-semibold ${active ? "border-primary bg-primary text-primary-foreground" : done ? "border-primary bg-primary/10 text-primary" : "border-border bg-background"}`,
                                children: current
                            }, void 0, false, {
                                fileName: "[project]/src/components/apply/ProgressBar.tsx",
                                lineNumber: 35,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: active ? "text-foreground" : undefined,
                                children: label
                            }, void 0, false, {
                                fileName: "[project]/src/components/apply/ProgressBar.tsx",
                                lineNumber: 46,
                                columnNumber: 15
                            }, this)
                        ]
                    }, label, true, {
                        fileName: "[project]/src/components/apply/ProgressBar.tsx",
                        lineNumber: 34,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/components/apply/ProgressBar.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/apply/ProgressBar.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = ProgressBar;
var _c;
__turbopack_context__.k.register(_c, "ProgressBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/apply/FormLayout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FormLayout",
    ()=>FormLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$ProgressBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/apply/ProgressBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$IMG_1938__$28$1$292e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$IMG_1938__$28$1$292e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/IMG_1938 (1).png.mjs { IMAGE => "[project]/src/IMG_1938 (1).png (static in ecmascript, tag client)" } [app-client] (structured image object with data url, ecmascript)');
;
;
;
function FormLayout({ step, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-soft sm:p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-4 sm:grid-cols-[1fr_128px] sm:items-start sm:gap-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "font-heading text-2xl font-semibold sm:text-[28px]",
                                children: [
                                    "Own The iPhone You Deserve,",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "block",
                                        children: "Pay Small Small"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/apply/FormLayout.tsx",
                                        lineNumber: 18,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/apply/FormLayout.tsx",
                                lineNumber: 16,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-sm text-muted-foreground",
                                children: "Complete the short steps below."
                            }, void 0, false, {
                                fileName: "[project]/src/components/apply/FormLayout.tsx",
                                lineNumber: 20,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-sm text-muted-foreground",
                                children: "No account needed. Submit your request and admin review starts immediately."
                            }, void 0, false, {
                                fileName: "[project]/src/components/apply/FormLayout.tsx",
                                lineNumber: 21,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/apply/FormLayout.tsx",
                        lineNumber: 15,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden sm:block",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$IMG_1938__$28$1$292e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$IMG_1938__$28$1$292e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"].src,
                            alt: "Melvin Gadgets",
                            className: "h-24 w-full object-cover"
                        }, void 0, false, {
                            fileName: "[project]/src/components/apply/FormLayout.tsx",
                            lineNumber: 27,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/apply/FormLayout.tsx",
                        lineNumber: 26,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/apply/FormLayout.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$ProgressBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProgressBar"], {
                    step: step
                }, void 0, false, {
                    fileName: "[project]/src/components/apply/FormLayout.tsx",
                    lineNumber: 32,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/apply/FormLayout.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/apply/FormLayout.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/apply/FormLayout.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = FormLayout;
var _c;
__turbopack_context__.k.register(_c, "FormLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/apply/helpers.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildPublicWhatsAppUrl",
    ()=>buildPublicWhatsAppUrl,
    "formatAmount",
    ()=>formatAmount,
    "formatInputWithCommas",
    ()=>formatInputWithCommas,
    "getOrCreateAnonymousId",
    ()=>getOrCreateAnonymousId,
    "getSafePlan",
    ()=>getSafePlan,
    "parseFormattedNumber",
    ()=>parseFormattedNumber
]);
const amountFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2
});
const parseFormattedNumber = (value)=>{
    const sanitized = String(value || "").replace(/[^\d.]/g, "");
    const numeric = Number(sanitized);
    return Number.isFinite(numeric) ? numeric : 0;
};
const formatInputWithCommas = (value)=>{
    const cleaned = value.replace(/[^\d.]/g, "");
    if (!cleaned) return "";
    const hasTrailingDot = cleaned.endsWith(".");
    const [integerPartRaw, decimalRaw = ""] = cleaned.split(".");
    const integerPart = (integerPartRaw || "0").replace(/^0+(?=\d)/, "");
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const decimals = decimalRaw.slice(0, 2);
    if (hasTrailingDot && !decimals.length) {
        return `NGN ${formattedInteger}.`;
    }
    return decimals.length ? `NGN ${formattedInteger}.${decimals}` : `NGN ${formattedInteger}`;
};
const formatAmount = (value)=>amountFormatter.format(value || 0);
const getSafePlan = (plan)=>plan === "Monthly" ? "Monthly" : "Weekly";
const getOrCreateAnonymousId = ()=>{
    const key = "easybuy_public_anonymous_id";
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const created = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `anon-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem(key, created);
    return created;
};
const PUBLIC_WHATSAPP_NUMBER = "2347086758713";
const buildPublicWhatsAppUrl = (params)=>{
    const message = [
        "Hello Admin, I just submitted an EasyBuy request.",
        `Name: ${params.fullName}`,
        `Email: ${params.email}`,
        `Phone: ${params.phone}`,
        `Device: ${params.iphoneModel} (${params.capacity})`,
        `Plan: ${params.plan}`
    ].join("\n");
    return `https://wa.me/${PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/apply/steps/StepFourReview.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StepFourReview",
    ()=>StepFourReview
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/apply/helpers.ts [app-client] (ecmascript)");
;
;
function StepFourReview({ form, downPaymentPercentage, minimumRequiredDownPayment, calculatedNextPayment }) {
    const durationText = form.plan === "Monthly" ? form.monthlyPlan ? `${form.monthlyPlan} month(s)` : "Not selected" : form.weeklyPlan ? `${form.weeklyPlan} week(s)` : "Not selected";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-5 step-enter",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-border bg-muted p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "font-heading text-xl font-semibold",
                        children: "Review your request"
                    }, void 0, false, {
                        fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-sm text-muted-foreground",
                        children: "Confirm these details before you submit. You can still go back and edit."
                    }, void 0, false, {
                        fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
                        className: "mt-4 grid gap-3 text-base sm:grid-cols-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                        className: "text-sm text-muted-foreground",
                                        children: "Name"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                                        lineNumber: 36,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                        className: "font-medium",
                                        children: form.fullName || "-"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                                        lineNumber: 37,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                                lineNumber: 35,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                        className: "text-sm text-muted-foreground",
                                        children: "Email"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                                        lineNumber: 40,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                        className: "font-medium",
                                        children: form.email || "-"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                                        lineNumber: 41,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                                lineNumber: 39,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                        className: "text-sm text-muted-foreground",
                                        children: "Phone"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                                        lineNumber: 44,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                        className: "font-medium",
                                        children: form.phone || "-"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                                        lineNumber: 45,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                                lineNumber: 43,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                        className: "text-sm text-muted-foreground",
                                        children: "Device"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                                        lineNumber: 48,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                        className: "font-medium",
                                        children: form.iphoneModel ? `${form.iphoneModel} (${form.capacity})` : "-"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                                        lineNumber: 49,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                                lineNumber: 47,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                        className: "text-sm text-muted-foreground",
                                        children: "Plan Type"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                                        lineNumber: 52,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                        className: "font-medium",
                                        children: form.plan || "-"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                                        lineNumber: 53,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                                lineNumber: 51,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                        className: "text-sm text-muted-foreground",
                                        children: "Plan Duration"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                                        lineNumber: 56,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                        className: "font-medium",
                                        children: durationText
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                                        lineNumber: 57,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                                lineNumber: 55,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                        className: "text-sm text-muted-foreground",
                                        children: "Phone Price"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                                        lineNumber: 60,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                        className: "font-medium",
                                        children: form.phonePrice || "-"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                                        lineNumber: 61,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                                lineNumber: 59,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                        className: "text-sm text-muted-foreground",
                                        children: "Down Payment"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                                        lineNumber: 64,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                        className: "font-medium",
                                        children: form.downPayment || "-"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                                        lineNumber: 65,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                                lineNumber: 63,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                        className: "text-sm text-muted-foreground",
                                        children: "Minimum Required"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                                        lineNumber: 68,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                        className: "font-medium",
                                        children: [
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatAmount"])(minimumRequiredDownPayment),
                                            " (",
                                            downPaymentPercentage,
                                            "%)"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                                        lineNumber: 69,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                                lineNumber: 67,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                        className: "text-sm text-muted-foreground",
                                        children: "Estimated Next Payment"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                                        lineNumber: 74,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                        className: "font-medium",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatAmount"])(Number(calculatedNextPayment.toFixed(2)))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                                        lineNumber: 75,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                                lineNumber: 73,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-heading text-xl font-semibold",
                        children: "Data protection"
                    }, void 0, false, {
                        fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-sm text-emerald-800",
                        children: "By submitting, you confirm these details are accurate. Approval and next steps are handled by admin."
                    }, void 0, false, {
                        fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/apply/steps/StepFourReview.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_c = StepFourReview;
var _c;
__turbopack_context__.k.register(_c, "StepFourReview");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/apply/steps/StepOneBasicInfo.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StepOneBasicInfo",
    ()=>StepOneBasicInfo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const inputBase = "w-full rounded-md border bg-background px-3 py-2.5 text-base focus:outline-none focus:ring-2";
function StepOneBasicInfo({ form, errors, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-5 step-enter",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-4 sm:grid-cols-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2 sm:col-span-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "full-name",
                                className: "text-sm font-medium",
                                children: "Full Name"
                            }, void 0, false, {
                                fileName: "[project]/src/components/apply/steps/StepOneBasicInfo.tsx",
                                lineNumber: 16,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                id: "full-name",
                                className: `${inputBase} ${errors.fullName ? "border-red-500 focus:ring-red-500" : "border-input focus:ring-ring"}`,
                                value: form.fullName,
                                onChange: (e)=>onChange("fullName", e.target.value),
                                autoComplete: "name"
                            }, void 0, false, {
                                fileName: "[project]/src/components/apply/steps/StepOneBasicInfo.tsx",
                                lineNumber: 19,
                                columnNumber: 11
                            }, this),
                            errors.fullName ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-red-600",
                                children: errors.fullName
                            }, void 0, false, {
                                fileName: "[project]/src/components/apply/steps/StepOneBasicInfo.tsx",
                                lineNumber: 26,
                                columnNumber: 30
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/apply/steps/StepOneBasicInfo.tsx",
                        lineNumber: 15,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "email",
                                className: "text-sm font-medium",
                                children: "Email"
                            }, void 0, false, {
                                fileName: "[project]/src/components/apply/steps/StepOneBasicInfo.tsx",
                                lineNumber: 30,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                id: "email",
                                type: "email",
                                className: `${inputBase} ${errors.email ? "border-red-500 focus:ring-red-500" : "border-input focus:ring-ring"}`,
                                value: form.email,
                                onChange: (e)=>onChange("email", e.target.value),
                                autoComplete: "email"
                            }, void 0, false, {
                                fileName: "[project]/src/components/apply/steps/StepOneBasicInfo.tsx",
                                lineNumber: 33,
                                columnNumber: 11
                            }, this),
                            errors.email ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-red-600",
                                children: errors.email
                            }, void 0, false, {
                                fileName: "[project]/src/components/apply/steps/StepOneBasicInfo.tsx",
                                lineNumber: 41,
                                columnNumber: 27
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/apply/steps/StepOneBasicInfo.tsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "phone",
                                className: "text-sm font-medium",
                                children: "Phone"
                            }, void 0, false, {
                                fileName: "[project]/src/components/apply/steps/StepOneBasicInfo.tsx",
                                lineNumber: 45,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                id: "phone",
                                className: `${inputBase} ${errors.phone ? "border-red-500 focus:ring-red-500" : "border-input focus:ring-ring"}`,
                                value: form.phone,
                                onChange: (e)=>onChange("phone", e.target.value),
                                placeholder: "e.g. +234...",
                                autoComplete: "tel"
                            }, void 0, false, {
                                fileName: "[project]/src/components/apply/steps/StepOneBasicInfo.tsx",
                                lineNumber: 48,
                                columnNumber: 11
                            }, this),
                            errors.phone ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-red-600",
                                children: errors.phone
                            }, void 0, false, {
                                fileName: "[project]/src/components/apply/steps/StepOneBasicInfo.tsx",
                                lineNumber: 56,
                                columnNumber: 27
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/apply/steps/StepOneBasicInfo.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/apply/steps/StepOneBasicInfo.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-heading text-xl font-semibold",
                        children: "Secure application"
                    }, void 0, false, {
                        fileName: "[project]/src/components/apply/steps/StepOneBasicInfo.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-sm text-emerald-800",
                        children: "Your personal details are encrypted in transit and used only to process your EasyBuy request."
                    }, void 0, false, {
                        fileName: "[project]/src/components/apply/steps/StepOneBasicInfo.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/apply/steps/StepOneBasicInfo.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/apply/steps/StepOneBasicInfo.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = StepOneBasicInfo;
var _c;
__turbopack_context__.k.register(_c, "StepOneBasicInfo");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/apply/steps/StepTwoPlan.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StepTwoPlan",
    ()=>StepTwoPlan
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/apply/helpers.ts [app-client] (ecmascript)");
;
;
const inputBase = "w-full rounded-md border bg-background px-3 py-2.5 text-base focus:outline-none focus:ring-2";
function StepTwoPlan({ form, catalog, loadingCatalog, selectedModel, availableCapacities, monthlyDurations, weeklyDurations, previewUnavailable, downPaymentPercentage, minimumRequiredDownPayment, calculatedNextPayment, downPaymentTooLow, downPaymentAbovePhonePrice, hasPlanAndDuration, onFormChange, onModelChange, onPhonePriceChange, onDownPaymentChange, onPreviewUnavailable }) {
    const isMonthly = form.plan === "Monthly";
    const isWeekly = form.plan === "Weekly";
    const selectedDuration = isMonthly ? form.monthlyPlan : isWeekly ? form.weeklyPlan : "";
    const durationHasValue = !!selectedDuration;
    const durationLabel = isWeekly ? "Weekly Plan Duration" : isMonthly ? "Monthly Plan Duration" : "Plan Duration";
    const durationPlaceholder = isWeekly ? "Select weekly duration" : isMonthly ? "Select monthly duration" : "Select plan type first";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-5 step-enter",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid gap-4 sm:grid-cols-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2 sm:col-span-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "iphone-model",
                            className: "text-sm font-medium",
                            children: "iPhone Model"
                        }, void 0, false, {
                            fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                            lineNumber: 65,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            id: "iphone-model",
                            className: `${inputBase} border-input focus:ring-ring`,
                            value: form.iphoneModel,
                            onChange: (e)=>onModelChange(e.target.value),
                            disabled: loadingCatalog || !catalog.length,
                            children: catalog.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: item.model,
                                    children: item.model
                                }, item.model, false, {
                                    fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                                    lineNumber: 76,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                            lineNumber: 68,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                    lineNumber: 64,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "capacity",
                            className: "text-sm font-medium",
                            children: "Capacity"
                        }, void 0, false, {
                            fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                            lineNumber: 84,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            id: "capacity",
                            className: `${inputBase} border-input focus:ring-ring`,
                            value: form.capacity,
                            onChange: (e)=>onFormChange({
                                    capacity: e.target.value
                                }),
                            disabled: !selectedModel || !availableCapacities.length,
                            children: availableCapacities.map((capacity)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: capacity,
                                    children: capacity
                                }, capacity, false, {
                                    fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                                    lineNumber: 95,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                            lineNumber: 87,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2 pt-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "phone-price",
                                    className: "text-sm font-medium",
                                    children: "Phone Price (NGN)"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                                    lineNumber: 102,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    id: "phone-price",
                                    className: `${inputBase} border-input focus:ring-ring`,
                                    type: "text",
                                    inputMode: "decimal",
                                    placeholder: "e.g., NGN 1,250,000",
                                    value: form.phonePrice,
                                    onChange: (e)=>onPhonePriceChange(e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                                    lineNumber: 105,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                            lineNumber: 101,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                    lineNumber: 83,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "overflow-hidden rounded-xl border border-border bg-muted",
                    children: selectedModel && !previewUnavailable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: selectedModel.imageUrl,
                        alt: form.iphoneModel,
                        className: "h-28 w-full object-contain p-3",
                        onError: onPreviewUnavailable
                    }, void 0, false, {
                        fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                        lineNumber: 119,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-28 items-center justify-center text-sm text-muted-foreground",
                        children: "Model preview unavailable"
                    }, void 0, false, {
                        fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                        lineNumber: 126,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                    lineNumber: 117,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "plan-type",
                            className: "text-sm font-medium",
                            children: "Plan Type"
                        }, void 0, false, {
                            fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                            lineNumber: 133,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            id: "plan-type",
                            className: `${inputBase} ${form.plan ? "border-input focus:ring-ring" : "border-red-500 focus:ring-red-500"}`,
                            value: form.plan,
                            onChange: (e)=>onFormChange({
                                    plan: e.target.value ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSafePlan"])(e.target.value) : "",
                                    monthlyPlan: "",
                                    weeklyPlan: ""
                                }),
                            disabled: !selectedModel,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "",
                                    children: "Select plan type"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                                    lineNumber: 149,
                                    columnNumber: 13
                                }, this),
                                selectedModel?.allowedPlans.map((plan)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: plan,
                                        children: plan
                                    }, plan, false, {
                                        fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                                        lineNumber: 151,
                                        columnNumber: 15
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                            lineNumber: 136,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                    lineNumber: 132,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "plan-duration",
                            className: "text-sm font-medium",
                            children: durationLabel
                        }, void 0, false, {
                            fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                            lineNumber: 159,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            id: "plan-duration",
                            className: `${inputBase} ${durationHasValue ? "border-input focus:ring-ring" : "border-red-500 focus:ring-red-500"}`,
                            value: selectedDuration,
                            onChange: (e)=>{
                                const value = e.target.value;
                                if (isMonthly) {
                                    onFormChange({
                                        monthlyPlan: value
                                    });
                                    return;
                                }
                                if (isWeekly) {
                                    onFormChange({
                                        weeklyPlan: value
                                    });
                                }
                            },
                            disabled: !form.plan,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "",
                                    children: durationPlaceholder
                                }, void 0, false, {
                                    fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                                    lineNumber: 178,
                                    columnNumber: 13
                                }, this),
                                isMonthly ? monthlyDurations.map((months)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: months,
                                        children: [
                                            months,
                                            " ",
                                            months === 1 ? "Month" : "Months"
                                        ]
                                    }, months, true, {
                                        fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                                        lineNumber: 181,
                                        columnNumber: 19
                                    }, this)) : null,
                                isWeekly ? weeklyDurations.map((weeks)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: weeks,
                                        children: [
                                            weeks,
                                            " Weeks"
                                        ]
                                    }, weeks, true, {
                                        fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                                        lineNumber: 188,
                                        columnNumber: 19
                                    }, this)) : null
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                            lineNumber: 162,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                    lineNumber: 158,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "down-payment",
                            className: "text-sm font-medium",
                            children: "Down Payment"
                        }, void 0, false, {
                            fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                            lineNumber: 197,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            id: "down-payment",
                            className: `${inputBase} ${downPaymentTooLow || downPaymentAbovePhonePrice ? "border-amber-500 bg-amber-50 text-amber-700" : "border-input focus:ring-ring"}`,
                            type: "text",
                            inputMode: "decimal",
                            placeholder: "e.g., NGN 500,000",
                            value: form.downPayment,
                            onChange: (e)=>onDownPaymentChange(e.target.value)
                        }, void 0, false, {
                            fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                            lineNumber: 200,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-muted-foreground",
                            children: hasPlanAndDuration ? `Minimum required: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatAmount"])(minimumRequiredDownPayment)} (${downPaymentPercentage}% of phone price)` : "Select plan type and duration to auto-fill minimum down payment."
                        }, void 0, false, {
                            fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                            lineNumber: 213,
                            columnNumber: 11
                        }, this),
                        downPaymentTooLow ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-amber-600",
                            children: "Down payment is below the required minimum for this model."
                        }, void 0, false, {
                            fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                            lineNumber: 219,
                            columnNumber: 13
                        }, this) : null,
                        downPaymentAbovePhonePrice ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-red-600",
                            children: "Down payment cannot be greater than phone price."
                        }, void 0, false, {
                            fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                            lineNumber: 222,
                            columnNumber: 13
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                    lineNumber: 196,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "next-payment",
                            className: "text-sm font-medium",
                            children: "Next Payment"
                        }, void 0, false, {
                            fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                            lineNumber: 228,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            id: "next-payment",
                            className: "w-full rounded-md border border-input bg-background px-3 py-2.5 text-base",
                            type: "text",
                            value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatAmount"])(Number(calculatedNextPayment.toFixed(2))),
                            readOnly: true
                        }, void 0, false, {
                            fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                            lineNumber: 231,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
                    lineNumber: 227,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
            lineNumber: 63,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/apply/steps/StepTwoPlan.tsx",
        lineNumber: 62,
        columnNumber: 5
    }, this);
}
_c = StepTwoPlan;
var _c;
__turbopack_context__.k.register(_c, "StepTwoPlan");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$globalLoading$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/globalLoading.ts [app-client] (ecmascript)");
"use client";
;
;
;
const stopGlobalLoad = (config)=>{
    config?.__stopGlobalLoad?.();
    if (config) {
        config.__stopGlobalLoad = undefined;
    }
};
const shouldSuppressBackgroundEmailToast = (message)=>{
    const normalized = String(message || "").toLowerCase();
    return normalized.includes("verification email") || normalized.includes("email could not be sent") || normalized.includes("email is currently disabled") || normalized.includes("email verification is currently disabled");
};
const API_MODE = String(("TURBOPACK compile-time value", "local") || "local").trim().toLowerCase();
const LOCAL_API_URL = String(("TURBOPACK compile-time value", "http://localhost:552") || "http://localhost:552").trim();
const ONLINE_API_URL = String(("TURBOPACK compile-time value", "https://easybuytrackerbackend.onrender.com") || "").trim();
const LEGACY_BASE_URL = String(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_BASE_URL || "").trim();
const baseURL = API_MODE === "online" ? ONLINE_API_URL || LEGACY_BASE_URL || LOCAL_API_URL : LOCAL_API_URL || LEGACY_BASE_URL || "http://localhost:552";
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL
});
api.interceptors.request.use((config)=>{
    const meta = config;
    if (!meta.suppressGlobalLoader) {
        meta.__stopGlobalLoad = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$globalLoading$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["beginGlobalLoad"])();
    }
    return config;
});
api.interceptors.response.use((response)=>{
    stopGlobalLoad(response.config);
    return response;
}, (error)=>{
    const config = error?.config || undefined;
    stopGlobalLoad(config);
    const canceled = error?.code === "ERR_CANCELED" || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].isCancel(error);
    if (canceled) {
        return Promise.reject(error);
    }
    if (!config?.suppressErrorToast) {
        const message = error?.response?.data?.message || error?.response?.data?.error || error?.message || "Request failed";
        if (!shouldSuppressBackgroundEmailToast(message)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error(message);
        }
    }
    return Promise.reject(error);
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/tiktokPixel.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "initializeTikTokPixel",
    ()=>initializeTikTokPixel,
    "trackTikTokEvent",
    ()=>trackTikTokEvent,
    "trackTikTokPageView",
    ()=>trackTikTokPageView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use client";
const pixelId = String(("TURBOPACK compile-time value", "D6IPRLJC77U8UE5GMK7G") || "").trim();
let initialized = false;
const bootstrapTikTok = ()=>{
    if (("TURBOPACK compile-time value", "object") === "undefined" || typeof document === "undefined") return;
    if (window.ttq) return;
    const ttq = [];
    const methods = [
        "page",
        "track",
        "identify",
        "instances",
        "debug",
        "on",
        "off",
        "once",
        "ready",
        "alias",
        "group",
        "enableCookie",
        "disableCookie",
        "holdConsent",
        "revokeConsent",
        "grantConsent"
    ];
    ttq.setAndDefer = (target, method)=>{
        target[method] = (...args)=>{
            target.push([
                method,
                ...args
            ]);
        };
    };
    for (const method of methods){
        ttq.setAndDefer(ttq, method);
    }
    ttq.load = (id)=>{
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src = `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${encodeURIComponent(id)}&lib=ttq`;
        const firstScriptTag = document.getElementsByTagName("script")[0];
        if (firstScriptTag?.parentNode) {
            firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
        } else {
            document.head.appendChild(script);
        }
    };
    window.TiktokAnalyticsObject = "ttq";
    window.ttq = ttq;
};
const initializeTikTokPixel = ()=>{
    if (!pixelId || initialized) return !!pixelId;
    bootstrapTikTok();
    if (!window.ttq) return false;
    window.ttq.load(pixelId);
    initialized = true;
    return true;
};
const trackTikTokPageView = ()=>{
    if (!initializeTikTokPixel()) return;
    window.ttq.page();
};
const trackTikTokEvent = (eventName, payload)=>{
    if (!initializeTikTokPixel()) return;
    if (payload && Object.keys(payload).length > 0) {
        window.ttq.track(eventName, payload);
        return;
    }
    window.ttq.track(eventName);
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/apply/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ApplyPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$spinners$2f$ClipLoader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-spinners/ClipLoader.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$FormLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/apply/FormLayout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$steps$2f$StepFourReview$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/apply/steps/StepFourReview.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$steps$2f$StepOneBasicInfo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/apply/steps/StepOneBasicInfo.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$steps$2f$StepTwoPlan$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/apply/steps/StepTwoPlan.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/apply/helpers.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tiktokPixel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/tiktokPixel.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
const DRAFT_KEY = "easybuy_next_apply_draft_v1";
const initialFormState = {
    fullName: "",
    email: "",
    phone: "",
    iphoneModel: "",
    capacity: "",
    plan: "",
    phonePrice: "",
    downPayment: "",
    monthlyPlan: "",
    weeklyPlan: ""
};
const isValidEmail = (value)=>/^\S+@\S+\.\S+$/.test(value.trim());
const normalizeStep = (step)=>{
    const numeric = Number(step);
    if (numeric === 2 || numeric === 3) return numeric;
    return 1;
};
function ApplyPage() {
    _s();
    const pixelPageTrackedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const [draftReady, setDraftReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [loadingCatalog, setLoadingCatalog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [catalog, setCatalog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [planRules, setPlanRules] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [catalogError, setCatalogError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [submittedRequestId, setSubmittedRequestId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [contactAdminModalOpen, setContactAdminModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [contactAdminWhatsAppUrl, setContactAdminWhatsAppUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [openingWhatsApp, setOpeningWhatsApp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [downPaymentTouched, setDownPaymentTouched] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [previewUnavailable, setPreviewUnavailable] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [basicErrors, setBasicErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialFormState);
    const selectedModel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ApplyPage.useMemo[selectedModel]": ()=>catalog.find({
                "ApplyPage.useMemo[selectedModel]": (item)=>item.model === form.iphoneModel
            }["ApplyPage.useMemo[selectedModel]"]) || null
    }["ApplyPage.useMemo[selectedModel]"], [
        catalog,
        form.iphoneModel
    ]);
    const availableCapacities = selectedModel?.capacities || [];
    const monthlyDurations = planRules?.monthlyDurations || [];
    const weeklyDurations = planRules?.weeklyDurations || [];
    const selectedCapacityPrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ApplyPage.useMemo[selectedCapacityPrice]": ()=>{
            if (!selectedModel || !form.capacity) return 0;
            const rawPrice = Number(selectedModel.pricesByCapacity?.[form.capacity]);
            return Number.isFinite(rawPrice) && rawPrice > 0 ? rawPrice : 0;
        }
    }["ApplyPage.useMemo[selectedCapacityPrice]"], [
        selectedModel,
        form.capacity
    ]);
    const downPaymentPercentage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ApplyPage.useMemo[downPaymentPercentage]": ()=>{
            const raw = Number(selectedModel?.downPaymentPercentage);
            return Number.isFinite(raw) && raw > 0 ? raw : 0;
        }
    }["ApplyPage.useMemo[downPaymentPercentage]"], [
        selectedModel?.downPaymentPercentage
    ]);
    const downPaymentMultiplier = downPaymentPercentage / 100;
    const hasPlanAndDuration = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ApplyPage.useMemo[hasPlanAndDuration]": ()=>{
            if (!form.plan) return false;
            if (form.plan === "Monthly") return !!form.monthlyPlan;
            if (form.plan === "Weekly") return !!form.weeklyPlan;
            return false;
        }
    }["ApplyPage.useMemo[hasPlanAndDuration]"], [
        form.monthlyPlan,
        form.plan,
        form.weeklyPlan
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ApplyPage.useEffect": ()=>{
            try {
                const raw = localStorage.getItem(DRAFT_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (parsed?.form && typeof parsed.form === "object") {
                        setForm({
                            ...initialFormState,
                            ...parsed.form
                        });
                    }
                    if (parsed?.step) {
                        setStep(normalizeStep(parsed.step));
                    }
                }
            } catch  {
                localStorage.removeItem(DRAFT_KEY);
            } finally{
                setDraftReady(true);
            }
        }
    }["ApplyPage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ApplyPage.useEffect": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tiktokPixel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeTikTokPixel"])();
            if (pixelPageTrackedRef.current) return;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tiktokPixel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackTikTokPageView"])();
            pixelPageTrackedRef.current = true;
        }
    }["ApplyPage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ApplyPage.useEffect": ()=>{
            let active = true;
            const loadCatalog = {
                "ApplyPage.useEffect.loadCatalog": async ()=>{
                    setLoadingCatalog(true);
                    try {
                        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/api/v1/public/easybuy-catalog", {
                            suppressErrorToast: false
                        });
                        const data = response.data?.data;
                        const models = data?.models || [];
                        const nextPlanRules = data?.planRules || null;
                        if (!active) return;
                        setCatalog(models);
                        setPlanRules(nextPlanRules);
                        if (models.length) {
                            setForm({
                                "ApplyPage.useEffect.loadCatalog": (prev)=>{
                                    const found = models.find({
                                        "ApplyPage.useEffect.loadCatalog.found": (item)=>item.model === prev.iphoneModel
                                    }["ApplyPage.useEffect.loadCatalog.found"]);
                                    const model = found || models[0];
                                    const nextCapacity = model.capacities.includes(prev.capacity) ? prev.capacity : model.capacities[0] || "";
                                    const safePlan = prev.plan && model.allowedPlans.includes(prev.plan) ? prev.plan : "";
                                    const safePrice = Number(model.pricesByCapacity?.[nextCapacity] || 0);
                                    return {
                                        ...prev,
                                        iphoneModel: model.model,
                                        capacity: nextCapacity,
                                        plan: safePlan,
                                        monthlyPlan: safePlan === "Monthly" ? prev.monthlyPlan : "",
                                        weeklyPlan: safePlan === "Weekly" ? prev.weeklyPlan : "",
                                        phonePrice: safePrice > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatInputWithCommas"])(String(safePrice)) : ""
                                    };
                                }
                            }["ApplyPage.useEffect.loadCatalog"]);
                        }
                    } catch  {
                        if (!active) return;
                        setCatalogError("Failed to load device options");
                    } finally{
                        if (active) setLoadingCatalog(false);
                    }
                }
            }["ApplyPage.useEffect.loadCatalog"];
            loadCatalog();
            return ({
                "ApplyPage.useEffect": ()=>{
                    active = false;
                }
            })["ApplyPage.useEffect"];
        }
    }["ApplyPage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ApplyPage.useEffect": ()=>{
            if (!draftReady) return;
            localStorage.setItem(DRAFT_KEY, JSON.stringify({
                step,
                form
            }));
        }
    }["ApplyPage.useEffect"], [
        draftReady,
        form,
        step
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ApplyPage.useEffect": ()=>{
            if (!planRules) return;
            setForm({
                "ApplyPage.useEffect": (prev)=>{
                    let next = prev;
                    if (next.monthlyPlan && !planRules.monthlyDurations.includes(Number(next.monthlyPlan))) {
                        next = {
                            ...next,
                            monthlyPlan: ""
                        };
                    }
                    if (next.weeklyPlan && !planRules.weeklyDurations.includes(Number(next.weeklyPlan))) {
                        next = {
                            ...next,
                            weeklyPlan: ""
                        };
                    }
                    return next;
                }
            }["ApplyPage.useEffect"]);
        }
    }["ApplyPage.useEffect"], [
        planRules
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ApplyPage.useEffect": ()=>{
            if (!selectedModel) return;
            setForm({
                "ApplyPage.useEffect": (prev)=>{
                    let next = prev;
                    const hasValidPlan = prev.plan && selectedModel.allowedPlans.includes(prev.plan);
                    if (!hasValidPlan) {
                        next = {
                            ...next,
                            plan: "",
                            monthlyPlan: "",
                            weeklyPlan: ""
                        };
                    }
                    if (!selectedModel.capacities.includes(next.capacity)) {
                        next = {
                            ...next,
                            capacity: selectedModel.capacities[0] || ""
                        };
                    }
                    return next;
                }
            }["ApplyPage.useEffect"]);
        }
    }["ApplyPage.useEffect"], [
        selectedModel
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ApplyPage.useEffect": ()=>{
            setPreviewUnavailable(false);
        }
    }["ApplyPage.useEffect"], [
        selectedModel?.imageUrl
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ApplyPage.useEffect": ()=>{
            if (!selectedModel || !form.capacity) return;
            if (selectedCapacityPrice <= 0) {
                setForm({
                    "ApplyPage.useEffect": (prev)=>{
                        if (!prev.phonePrice) return prev;
                        return {
                            ...prev,
                            phonePrice: ""
                        };
                    }
                }["ApplyPage.useEffect"]);
                setDownPaymentTouched(false);
                return;
            }
            setForm({
                "ApplyPage.useEffect": (prev)=>{
                    const currentPrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseFormattedNumber"])(prev.phonePrice);
                    if (currentPrice === selectedCapacityPrice) {
                        return prev;
                    }
                    return {
                        ...prev,
                        phonePrice: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatInputWithCommas"])(String(selectedCapacityPrice))
                    };
                }
            }["ApplyPage.useEffect"]);
            setDownPaymentTouched(false);
        }
    }["ApplyPage.useEffect"], [
        form.capacity,
        selectedCapacityPrice,
        selectedModel
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ApplyPage.useEffect": ()=>{
            if (downPaymentTouched) return;
            if (!hasPlanAndDuration) {
                setForm({
                    "ApplyPage.useEffect": (prev)=>prev.downPayment ? {
                            ...prev,
                            downPayment: ""
                        } : prev
                }["ApplyPage.useEffect"]);
                return;
            }
            const phonePrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseFormattedNumber"])(form.phonePrice);
            const minimumDownPayment = phonePrice * downPaymentMultiplier;
            setForm({
                "ApplyPage.useEffect": (prev)=>({
                        ...prev,
                        downPayment: minimumDownPayment > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatInputWithCommas"])(minimumDownPayment.toFixed(2)) : ""
                    })
            }["ApplyPage.useEffect"]);
        }
    }["ApplyPage.useEffect"], [
        downPaymentMultiplier,
        downPaymentTouched,
        form.phonePrice,
        hasPlanAndDuration
    ]);
    const phonePriceNumber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ApplyPage.useMemo[phonePriceNumber]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseFormattedNumber"])(form.phonePrice)
    }["ApplyPage.useMemo[phonePriceNumber]"], [
        form.phonePrice
    ]);
    const minimumRequiredDownPayment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ApplyPage.useMemo[minimumRequiredDownPayment]": ()=>hasPlanAndDuration ? phonePriceNumber * downPaymentMultiplier : 0
    }["ApplyPage.useMemo[minimumRequiredDownPayment]"], [
        downPaymentMultiplier,
        hasPlanAndDuration,
        phonePriceNumber
    ]);
    const calculatedDownPayment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ApplyPage.useMemo[calculatedDownPayment]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseFormattedNumber"])(form.downPayment)
    }["ApplyPage.useMemo[calculatedDownPayment]"], [
        form.downPayment
    ]);
    const downPaymentTooLow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ApplyPage.useMemo[downPaymentTooLow]": ()=>hasPlanAndDuration && calculatedDownPayment < minimumRequiredDownPayment && phonePriceNumber > 0
    }["ApplyPage.useMemo[downPaymentTooLow]"], [
        calculatedDownPayment,
        hasPlanAndDuration,
        minimumRequiredDownPayment,
        phonePriceNumber
    ]);
    const downPaymentAbovePhonePrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ApplyPage.useMemo[downPaymentAbovePhonePrice]": ()=>hasPlanAndDuration && calculatedDownPayment > phonePriceNumber && phonePriceNumber > 0
    }["ApplyPage.useMemo[downPaymentAbovePhonePrice]"], [
        calculatedDownPayment,
        hasPlanAndDuration,
        phonePriceNumber
    ]);
    const invalidDownPayment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ApplyPage.useMemo[invalidDownPayment]": ()=>hasPlanAndDuration ? calculatedDownPayment <= 0 || downPaymentTooLow || downPaymentAbovePhonePrice : false
    }["ApplyPage.useMemo[invalidDownPayment]"], [
        calculatedDownPayment,
        downPaymentAbovePhonePrice,
        downPaymentTooLow,
        hasPlanAndDuration
    ]);
    const calculatedLoanedAmount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ApplyPage.useMemo[calculatedLoanedAmount]": ()=>hasPlanAndDuration ? Math.max(phonePriceNumber - calculatedDownPayment, 0) : 0
    }["ApplyPage.useMemo[calculatedLoanedAmount]"], [
        calculatedDownPayment,
        hasPlanAndDuration,
        phonePriceNumber
    ]);
    const calculatedNextPayment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ApplyPage.useMemo[calculatedNextPayment]": ()=>{
            const resolvedPlan = selectedModel?.allowedPlans.includes(form.plan) ? form.plan : "";
            if (!resolvedPlan) return 0;
            if (resolvedPlan === "Monthly") {
                const months = Number(form.monthlyPlan) || 0;
                const multiplier = planRules?.monthlyMarkupMultipliers[String(months)] || 1;
                if (months <= 0) return 0;
                return calculatedLoanedAmount * multiplier / months;
            }
            const weeks = Number(form.weeklyPlan) || 0;
            const multiplier = planRules?.weeklyMarkupMultipliers[String(weeks)] || 1;
            if (weeks <= 0) return 0;
            return calculatedLoanedAmount * multiplier / weeks;
        }
    }["ApplyPage.useMemo[calculatedNextPayment]"], [
        calculatedLoanedAmount,
        form.monthlyPlan,
        form.plan,
        form.weeklyPlan,
        planRules,
        selectedModel
    ]);
    const setField = (field, value)=>{
        setForm((prev)=>({
                ...prev,
                [field]: value
            }));
    };
    const applyFormPatch = (patch)=>{
        setForm((prev)=>({
                ...prev,
                ...patch
            }));
    };
    const validateStepOne = ()=>{
        const nextErrors = {};
        if (!form.fullName.trim()) {
            nextErrors.fullName = "Full name is required";
        }
        if (!form.email.trim()) {
            nextErrors.email = "Email is required";
        } else if (!isValidEmail(form.email)) {
            nextErrors.email = "Use a valid email address";
        }
        const phoneOnlyDigits = form.phone.replace(/\D/g, "");
        if (!form.phone.trim()) {
            nextErrors.phone = "Phone number is required";
        } else if (phoneOnlyDigits.length < 10) {
            nextErrors.phone = "Phone number looks too short";
        }
        setBasicErrors(nextErrors);
        if (Object.keys(nextErrors).length) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Complete your basic info before continuing");
            return false;
        }
        return true;
    };
    const validateStepTwo = ()=>{
        if (!selectedModel) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Device options are unavailable. Try again.");
            return false;
        }
        if (!form.capacity.trim()) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Select a valid device capacity");
            return false;
        }
        if (!form.plan || !selectedModel.allowedPlans.includes(form.plan)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Select a valid plan type");
            return false;
        }
        if (form.plan === "Monthly" && !form.monthlyPlan) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Select a monthly plan duration");
            return false;
        }
        if (form.plan === "Weekly" && !form.weeklyPlan) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Select a weekly plan duration");
            return false;
        }
        if (phonePriceNumber <= 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Enter a valid phone price greater than zero");
            return false;
        }
        if (invalidDownPayment) {
            if (downPaymentTooLow) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error(`Down payment cannot be below ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatAmount"])(minimumRequiredDownPayment)} for this model`);
            } else if (downPaymentAbovePhonePrice) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Down payment cannot be greater than the phone price");
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Enter a valid down payment");
            }
            return false;
        }
        return true;
    };
    const validateCurrentStep = ()=>{
        if (step === 1) return validateStepOne();
        if (step === 2) return validateStepTwo();
        return validateStepOne() && validateStepTwo();
    };
    const saveDraftStep = (targetStep)=>{
        const urlParams = new URLSearchParams(window.location.search);
        const payload = {
            step: targetStep,
            anonymousId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOrCreateAnonymousId"])(),
            fullName: form.fullName.trim(),
            email: form.email.trim().toLowerCase(),
            phone: form.phone.trim(),
            iphoneModel: form.iphoneModel,
            capacity: form.capacity,
            plan: form.plan,
            monthlyPlan: form.monthlyPlan,
            weeklyPlan: form.weeklyPlan,
            referrer: document.referrer || "",
            landingPage: window.location.href,
            utmSource: urlParams.get("utm_source") || "",
            utmMedium: urlParams.get("utm_medium") || "",
            utmCampaign: urlParams.get("utm_campaign") || "",
            utmTerm: urlParams.get("utm_term") || "",
            utmContent: urlParams.get("utm_content") || "",
            website: ""
        };
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/api/v1/public/easybuy-drafts/step", payload, {
            suppressErrorToast: true
        }).catch(()=>{
        // Background save only. Do not block step navigation.
        });
    };
    const goNext = ()=>{
        if (!validateCurrentStep()) return;
        if (step === 1 || step === 2) {
            saveDraftStep(step);
        }
        setStep((prev)=>{
            if (prev === 1) return 2;
            if (prev === 2) return 3;
            return 3;
        });
    };
    const goBack = ()=>{
        setStep((prev)=>{
            if (prev === 3) return 2;
            if (prev === 2) return 1;
            return 1;
        });
    };
    const submitRequest = async ()=>{
        if (!(validateStepOne() && validateStepTwo())) {
            return;
        }
        setSubmitting(true);
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const payload = {
                fullName: form.fullName.trim(),
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim(),
                iphoneModel: form.iphoneModel,
                capacity: form.capacity,
                plan: form.plan,
                anonymousId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOrCreateAnonymousId"])(),
                referrer: document.referrer || "",
                landingPage: window.location.href,
                utmSource: urlParams.get("utm_source") || "",
                utmMedium: urlParams.get("utm_medium") || "",
                utmCampaign: urlParams.get("utm_campaign") || "",
                utmTerm: urlParams.get("utm_term") || "",
                utmContent: urlParams.get("utm_content") || "",
                website: ""
            };
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/api/v1/public/easybuy-requests", payload, {
                suppressErrorToast: false
            });
            const requestId = String(response?.data?.data?.requestId || "");
            setSubmittedRequestId(requestId);
            setContactAdminWhatsAppUrl((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildPublicWhatsAppUrl"])({
                fullName: payload.fullName,
                email: payload.email,
                phone: payload.phone,
                iphoneModel: payload.iphoneModel,
                capacity: payload.capacity,
                plan: payload.plan
            }));
            setContactAdminModalOpen(true);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success("Request submitted successfully.");
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tiktokPixel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackTikTokEvent"])("SubmitForm", {
                content_type: "product",
                content_name: payload.iphoneModel,
                plan: payload.plan,
                capacity: payload.capacity,
                currency: "NGN",
                value: Number.isFinite(phonePriceNumber) ? phonePriceNumber : 0,
                request_status: String(response?.data?.data?.status || "verified")
            });
            if (catalog.length) {
                const first = catalog[0];
                const firstCapacity = first.capacities[0] || "";
                const firstPrice = Number(first.pricesByCapacity?.[firstCapacity] || 0);
                setForm({
                    ...initialFormState,
                    iphoneModel: first.model,
                    capacity: firstCapacity,
                    phonePrice: firstPrice > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatInputWithCommas"])(String(firstPrice)) : ""
                });
            } else {
                setForm(initialFormState);
            }
            setBasicErrors({});
            setStep(1);
            setDownPaymentTouched(false);
            localStorage.removeItem(DRAFT_KEY);
        } catch  {
        // shared error toast via axios interceptor
        } finally{
            setSubmitting(false);
        }
    };
    const openContactAdminWhatsApp = ()=>{
        if (!contactAdminWhatsAppUrl || openingWhatsApp) return;
        setOpeningWhatsApp(true);
        window.open(contactAdminWhatsAppUrl, "_blank", "noopener,noreferrer");
        window.setTimeout(()=>setOpeningWhatsApp(false), 600);
    };
    const stepView = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ApplyPage.useMemo[stepView]": ()=>{
            if (step === 1) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$steps$2f$StepOneBasicInfo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StepOneBasicInfo"], {
                    form: form,
                    errors: basicErrors,
                    onChange: setField
                }, void 0, false, {
                    fileName: "[project]/src/app/apply/page.tsx",
                    lineNumber: 558,
                    columnNumber: 14
                }, this);
            }
            if (step === 2) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$steps$2f$StepTwoPlan$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StepTwoPlan"], {
                    form: form,
                    catalog: catalog,
                    loadingCatalog: loadingCatalog,
                    selectedModel: selectedModel,
                    availableCapacities: availableCapacities,
                    monthlyDurations: monthlyDurations,
                    weeklyDurations: weeklyDurations,
                    previewUnavailable: previewUnavailable,
                    downPaymentPercentage: downPaymentPercentage,
                    minimumRequiredDownPayment: minimumRequiredDownPayment,
                    calculatedNextPayment: calculatedNextPayment,
                    downPaymentTooLow: downPaymentTooLow,
                    downPaymentAbovePhonePrice: downPaymentAbovePhonePrice,
                    hasPlanAndDuration: hasPlanAndDuration,
                    onFormChange: applyFormPatch,
                    onModelChange: {
                        "ApplyPage.useMemo[stepView]": (model)=>{
                            setPreviewUnavailable(false);
                            applyFormPatch({
                                iphoneModel: model,
                                plan: "",
                                monthlyPlan: "",
                                weeklyPlan: ""
                            });
                        }
                    }["ApplyPage.useMemo[stepView]"],
                    onPhonePriceChange: {
                        "ApplyPage.useMemo[stepView]": (value)=>applyFormPatch({
                                phonePrice: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatInputWithCommas"])(value)
                            })
                    }["ApplyPage.useMemo[stepView]"],
                    onDownPaymentChange: {
                        "ApplyPage.useMemo[stepView]": (value)=>{
                            setDownPaymentTouched(true);
                            applyFormPatch({
                                downPayment: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatInputWithCommas"])(value)
                            });
                        }
                    }["ApplyPage.useMemo[stepView]"],
                    onPreviewUnavailable: {
                        "ApplyPage.useMemo[stepView]": ()=>setPreviewUnavailable(true)
                    }["ApplyPage.useMemo[stepView]"]
                }, void 0, false, {
                    fileName: "[project]/src/app/apply/page.tsx",
                    lineNumber: 563,
                    columnNumber: 9
                }, this);
            }
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$steps$2f$StepFourReview$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StepFourReview"], {
                form: form,
                downPaymentPercentage: downPaymentPercentage,
                minimumRequiredDownPayment: minimumRequiredDownPayment,
                calculatedNextPayment: calculatedNextPayment
            }, void 0, false, {
                fileName: "[project]/src/app/apply/page.tsx",
                lineNumber: 594,
                columnNumber: 7
            }, this);
        }
    }["ApplyPage.useMemo[stepView]"], [
        availableCapacities,
        basicErrors,
        calculatedNextPayment,
        catalog,
        downPaymentAbovePhonePrice,
        downPaymentPercentage,
        downPaymentTooLow,
        hasPlanAndDuration,
        form,
        loadingCatalog,
        minimumRequiredDownPayment,
        monthlyDurations,
        previewUnavailable,
        selectedModel,
        step,
        weeklyDurations
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mx-auto w-full max-w-3xl space-y-6 px-4 py-10 md:px-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$apply$2f$FormLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormLayout"], {
                step: step,
                children: [
                    catalogError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive",
                        children: catalogError
                    }, void 0, false, {
                        fileName: "[project]/src/app/apply/page.tsx",
                        lineNumber: 624,
                        columnNumber: 11
                    }, this) : null,
                    stepView,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: goBack,
                                disabled: step === 1 || submitting,
                                className: "rounded-md border border-border bg-background px-4 py-2.5 text-base hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50",
                                children: "Back"
                            }, void 0, false, {
                                fileName: "[project]/src/app/apply/page.tsx",
                                lineNumber: 630,
                                columnNumber: 11
                            }, this),
                            step < 3 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: goNext,
                                disabled: submitting || loadingCatalog,
                                className: "inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-base font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
                                children: "Next"
                            }, void 0, false, {
                                fileName: "[project]/src/app/apply/page.tsx",
                                lineNumber: 640,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: submitRequest,
                                disabled: submitting || loadingCatalog,
                                className: "inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-base font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
                                children: submitting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$spinners$2f$ClipLoader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            color: "hsl(var(--primary-foreground))",
                                            size: 16,
                                            speedMultiplier: 0.9
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/apply/page.tsx",
                                            lineNumber: 657,
                                            columnNumber: 19
                                        }, this),
                                        "Submitting..."
                                    ]
                                }, void 0, true) : "Submit Request"
                            }, void 0, false, {
                                fileName: "[project]/src/app/apply/page.tsx",
                                lineNumber: 649,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/apply/page.tsx",
                        lineNumber: 629,
                        columnNumber: 9
                    }, this),
                    submittedRequestId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-5 rounded-lg border border-border bg-muted p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-medium",
                                children: "Request submitted"
                            }, void 0, false, {
                                fileName: "[project]/src/app/apply/page.tsx",
                                lineNumber: 669,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-xs text-muted-foreground",
                                children: "Your request has been received. Admin review starts immediately."
                            }, void 0, false, {
                                fileName: "[project]/src/app/apply/page.tsx",
                                lineNumber: 670,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3 flex flex-wrap gap-2",
                                children: contactAdminWhatsAppUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: openContactAdminWhatsApp,
                                    disabled: openingWhatsApp,
                                    className: "inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60",
                                    children: openingWhatsApp ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$spinners$2f$ClipLoader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                color: "hsl(var(--primary-foreground))",
                                                size: 14,
                                                speedMultiplier: 0.9
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/apply/page.tsx",
                                                lineNumber: 684,
                                                columnNumber: 23
                                            }, this),
                                            "Opening WhatsApp..."
                                        ]
                                    }, void 0, true) : "Contact Melvin Gadgets on WhatsApp"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/apply/page.tsx",
                                    lineNumber: 676,
                                    columnNumber: 17
                                }, this) : null
                            }, void 0, false, {
                                fileName: "[project]/src/app/apply/page.tsx",
                                lineNumber: 674,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/apply/page.tsx",
                        lineNumber: 668,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/apply/page.tsx",
                lineNumber: 622,
                columnNumber: 7
            }, this),
            contactAdminModalOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center",
                onClick: (event)=>{
                    if (event.currentTarget === event.target) {
                        setContactAdminModalOpen(false);
                    }
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-soft",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "font-heading text-xl font-semibold",
                            children: "Contact Melvin Gadgets"
                        }, void 0, false, {
                            fileName: "[project]/src/app/apply/page.tsx",
                            lineNumber: 711,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-3 space-y-2 text-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-semibold text-foreground",
                                    children: "Please get your 3 months bank statement and NIN ready."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/apply/page.tsx",
                                    lineNumber: 713,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-bold text-foreground",
                                    children: "Melvin Gadgets will contact you soon."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/apply/page.tsx",
                                    lineNumber: 716,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "rounded-md border border-red-200 bg-red-50 px-3 py-2 font-extrabold text-red-800",
                                    children: "Melvin Gadgets does not receive payment in advance. Complete payment only after physical confirmation of the phone."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/apply/page.tsx",
                                    lineNumber: 719,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/apply/page.tsx",
                            lineNumber: 712,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4 flex gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setContactAdminModalOpen(false),
                                    className: "rounded-md border border-border bg-background px-3 py-2 text-base hover:bg-muted",
                                    children: "Close"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/apply/page.tsx",
                                    lineNumber: 724,
                                    columnNumber: 15
                                }, this),
                                contactAdminWhatsAppUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: openContactAdminWhatsApp,
                                    disabled: openingWhatsApp,
                                    className: "inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-base font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60",
                                    children: openingWhatsApp ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$spinners$2f$ClipLoader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                color: "hsl(var(--primary-foreground))",
                                                size: 16,
                                                speedMultiplier: 0.9
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/apply/page.tsx",
                                                lineNumber: 740,
                                                columnNumber: 23
                                            }, this),
                                            "Opening WhatsApp..."
                                        ]
                                    }, void 0, true) : "Contact Melvin Gadgets on WhatsApp"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/apply/page.tsx",
                                    lineNumber: 732,
                                    columnNumber: 17
                                }, this) : null
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/apply/page.tsx",
                            lineNumber: 723,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/apply/page.tsx",
                    lineNumber: 710,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/apply/page.tsx",
                lineNumber: 702,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/apply/page.tsx",
        lineNumber: 621,
        columnNumber: 5
    }, this);
}
_s(ApplyPage, "7lviO5n5h5V6eziFU5IcnaGfbLI=");
_c = ApplyPage;
var _c;
__turbopack_context__.k.register(_c, "ApplyPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_62bcbd35._.js.map