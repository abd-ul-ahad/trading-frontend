// Paths use /api/v1 prefix; set NEXT_PUBLIC_API_BASE_URL to API root (e.g. http://165.232.105.20:8000).
import axiosInstance from '@/lib/axios/config';

export const toNum = (v: unknown): number => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
};

export interface StrategyListItem {
  publicCode: string;
  displayName: string;
  description: string | null;
  riskLevel: number;
  activeSince: string;
  tradesPerMonth: string;
  returnPct: string;
  maxDrawdownPct: string;
  winRatePct: string;
  sparkline: number[];
}

export interface StrategyInfo {
  publicCode: string;
  displayName: string;
  description: string | null;
  riskLevel: number;
  activeSince: string;
  chartMode: string;
}

export interface StrategyMetrics {
  returnPct: string;
  maxDrawdownPct: string;
  winRatePct: string;
  tradesPerMonth: string;
  totalTrades: number;
  netPnl: string;
  profitFactor: string;
}

export interface StrategyDetailResponse {
  strategy: StrategyInfo;
  metrics: StrategyMetrics;
}

export interface PerformanceCurvePoint {
  t: string;
  v: number;
}

export interface StrategyPerformanceResponse {
  strategy: StrategyInfo;
  timeframe: string;
  metrics: StrategyMetrics;
  curve: PerformanceCurvePoint[];
}

export type StrategyTimeframe =
  | '1D'
  | '1W'
  | '1M'
  | '3M'
  | '6M'
  | 'YTD'
  | '1Y'
  | 'ALL'
  | 'CUSTOM';

const BASE = '/api/v1/strategies';

class StrategyApiService {
  async getAllStrategies(): Promise<StrategyListItem[]> {
    const response = await axiosInstance.get<StrategyListItem[]>(BASE);
    return response.data;
  }

  async getStrategy(publicCode: string): Promise<StrategyDetailResponse> {
    const response = await axiosInstance.get<StrategyDetailResponse>(
      `${BASE}/${publicCode}`
    );
    return response.data;
  }

  async getStrategyPerformance(
    publicCode: string,
    timeframe: StrategyTimeframe = 'ALL'
  ): Promise<StrategyPerformanceResponse> {
    const response = await axiosInstance.get<StrategyPerformanceResponse>(
      `${BASE}/${publicCode}/performance`,
      { params: { timeframe } }
    );
    return response.data;
  }
}

export const strategyApi = new StrategyApiService();
