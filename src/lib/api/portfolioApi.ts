import axiosInstance from '@/lib/axios/config';

export const toNum = (v: unknown): number => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
};

export interface PortfolioCurvePoint {
  t: string;
  v: number;
}

export interface PortfolioChange {
  amount: number;
  pct: number;
}

export interface PortfolioStats {
  totalInvested: number;
  totalPnl: {
    amount: number;
    pct: number;
  };
  ytdReturnPct: number;
  benchmarkPct: number;
  maxDrawdownPct: number;
  riskReward: number;
}

export interface PortfolioResponse {
  greetingName: string;
  asOf: string;
  currency: string;
  nStrategies: number;
  totalValue: number;
  timeframe: string;
  change: PortfolioChange;
  curve: PortfolioCurvePoint[];
  stats: PortfolioStats;
}

export type PortfolioTimeframe =
  | '1D'
  | '1W'
  | '1M'
  | '1Q'
  | 'YTD'
  | '1Y'
  | 'MAX'
  | 'CUSTOM';

export const PORTFOLIO_TIMEFRAMES: readonly PortfolioTimeframe[] = [
  '1D',
  '1W',
  '1M',
  '1Q',
  'YTD',
  '1Y',
  'MAX',
  'CUSTOM',
] as const;

export type PortfolioQuery = {
  timeframe?: PortfolioTimeframe;
  from?: string;
  to?: string;
};

const BASE = '/api/v1/portfolio';

class PortfolioApiService {
  async getPortfolio(params?: PortfolioQuery): Promise<PortfolioResponse> {
    const response = await axiosInstance.get<PortfolioResponse>(BASE, {
      params,
    });
    return response.data;
  }
}

export const portfolioApi = new PortfolioApiService();
