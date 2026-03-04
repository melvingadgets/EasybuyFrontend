export type EasyBuyCatalogItem = {
  model: string;
  imageUrl: string;
  capacities: string[];
  allowedPlans: Array<"Monthly" | "Weekly">;
  downPaymentPercentage: 40 | 60;
  pricesByCapacity?: Record<string, number>;
};

export type EasyBuyPlanRules = {
  monthlyDurations: number[];
  weeklyDurations: number[];
  monthlyMarkupMultipliers: Record<string, number>;
  weeklyMarkupMultipliers: Record<string, number>;
};

export type EasyBuyCatalogResponse = {
  models: EasyBuyCatalogItem[];
  planRules: EasyBuyPlanRules;
};

