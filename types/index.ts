// types/index.ts
// All shared types. Order: data structures → API shapes → analysis → vault → component props

// --- Product Data (from Purch API) ---

export interface Product {
  asin: string;
  title: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  isPrime: boolean;
  productUrl: string;
  source: string;
}

// --- Purch API Response Shapes ---

export interface SearchResponse {
  products: Product[];
  totalResults: number;
  page: number;
  hasMore: boolean;
}

export interface ShopResponse {
  reply: string;
  products: Product[];
}

export interface BuyResponse {
  orderId: string;
  status: "processing";
  product: { title: string; price: number };
  totalPrice: { amount: number; currency: "usdc" };
}

// --- Vault API Response Shapes ---

export interface VaultAsset {
  id: string;
  slug: string;
  title: string;
  productType: "skill" | "knowledge" | "persona";
  cardDescription: string;
  price: number;
  category: string;
  creator: { name: string; type: string };
  downloads: number;
  coverImageUrl: string;
}

export interface VaultSearchResponse {
  items: VaultAsset[];
  nextCursor: string | null;
}

export interface VaultBuyResponse {
  purchaseId: string;
  downloadToken: string;
  item: {
    slug: string;
    title: string;
    productType: string;
    price: number;
    coverImageUrl: string;
  };
}

// --- FOMO Guard Analysis ---

export interface FomoAnalysis {
  normalResponse: string;
  fomoResponse: string;
  originalProduct: Product;
  alternatives: Product[];
  savingsAmount: number;
  degenComment: string;
}

// --- Demo Scenarios ---

export interface DemoScenario {
  id: string;
  label: string;
  userMessage: string;
  originalProduct: Product;
  alternativeProduct: Product;
  fomoResponse: string;
  degenComment: string;
}

// --- Vault Lifecycle State ---

export type VaultStep = "idle" | "searching" | "found" | "buying" | "purchased" | "downloading" | "complete";

export interface VaultLifecycleState {
  step: VaultStep;
  asset: VaultAsset | null;
  purchaseId: string | null;
  downloadToken: string | null;
  error: string | null;
}

// --- Component Props ---

export interface ProductCardProps {
  product: Product;
  variant: "original" | "alternative";
  savingsDelta?: number;
}

export interface SavingsTrackerProps {
  totalSaved: number;
  solPrice?: number;
}

export interface ChatPanelProps {
  variant: "normal" | "fomo";
  userMessage: string;
  response: string;
  isLoading: boolean;
}

export interface ScenarioPickerProps {
  scenarios: DemoScenario[];
  onSelect: (scenario: DemoScenario) => void;
  activeId: string | null;
}
