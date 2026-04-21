import { ApplyForm } from "@/components/apply/ApplyForm";
import type { EasyBuyCatalogResponse, FinanceProviderInfo } from "@/types/easybuy";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_ONLINE_URL || "https://easybuytrackerbackend.onrender.com";
const FALLBACK_PROVIDERS: FinanceProviderInfo[] = [{ slug: "aurapay", displayName: "AuraPay" }];

async function getProviders(): Promise<FinanceProviderInfo[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/public/providers`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    return data?.data?.length ? data.data : FALLBACK_PROVIDERS;
  } catch {
    return FALLBACK_PROVIDERS;
  }
}

async function getCatalog(provider: string): Promise<{
  models: EasyBuyCatalogResponse["models"];
  planRules: EasyBuyCatalogResponse["planRules"] | null;
}> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/public/easybuy-catalog?provider=${encodeURIComponent(provider)}`,
      { next: { revalidate: 60 } }
    );
    const data = await res.json();
    return {
      models: data?.data?.models || [],
      planRules: data?.data?.planRules || null,
    };
  } catch {
    return { models: [], planRules: null };
  }
}

export default async function ApplyPage() {
  const providers = await getProviders();
  const initialProvider = providers[0]?.slug || "aurapay";
  const { models, planRules } = await getCatalog(initialProvider);

  return (
    <ApplyForm
      initialProviders={providers}
      initialProvider={initialProvider}
      initialCatalog={models}
      initialPlanRules={planRules}
    />
  );
}
