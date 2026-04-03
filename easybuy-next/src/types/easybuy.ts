export type FinanceProviderInfo = {
  slug: string;
  displayName: string;
};

export type DownPaymentThreshold = {
  minPrice: number;
  percentage: number;
};

export type DownPaymentRule =
  | {
      type: "fixed_per_model";
    }
  | {
      type: "price_threshold";
      thresholds: DownPaymentThreshold[];
    }
  | {
      type: "flat";
      percentage: number;
    };

export type EasyBuyCatalogItem = {
  model: string;
  imageUrl: string;
  capacities: string[];
  allowedPlans: Array<"Monthly" | "Weekly">;
  downPaymentPercentage: number;
  pricesByCapacity?: Record<string, number>;
};

export type EasyBuyPlanRules = {
  monthlyDurations: number[];
  weeklyDurations: number[];
  monthlyMarkupMultipliers: Record<string, number>;
  weeklyMarkupMultipliers: Record<string, number>;
  downPaymentRule?: DownPaymentRule;
};

export type EasyBuyCatalogResponse = {
  models: EasyBuyCatalogItem[];
  planRules: EasyBuyPlanRules;
  provider?: string;
};
