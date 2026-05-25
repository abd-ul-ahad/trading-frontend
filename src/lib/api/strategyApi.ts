import axiosInstance from '@/lib/axios/config';

export interface Strategy {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface StrategyPerformance {
  strategyId: string;
  totalPnL: number;
  unrealizedPnL: number;
  realizedPnL: number;
  winRate: number;          // 0..1, denominator = closed trades only
  totalTrades: number;      // count since day 1 (any status)
  winningTrades: number;    // closed trades with pnl > 0, since day 1
  losingTrades: number;     // closed trades with pnl < 0, since day 1
  maxDrawdown: number;      // USD, non-negative, peak-to-trough since day 1
  currentDrawdown: number;  // USD, non-negative, peak - latest snapshot
  lastUpdated: string;
}

export interface Trade {
  trade_id: string;
  strategy_id: string;
  account_id: string;
  symbol: string;
  direction: 'long' | 'short';
  entry_time: string;
  entry_price: number;
  exit_time: string | null;
  exit_price: number | null;
  quantity: number;
  pnl: number | null;
  status: 'open' | 'closed' | 'cancelled';
}

export interface TradesResponse {
  trades: Trade[];
  total: number;
}

export interface EquityCurvePoint {
  timestamp: string;
  totalPnL: number;
  drawdown: number;
}

export interface PublicSummary {
  strategyId: string;
  name: string;
  winRate: number;          // 0..1, denominator = closed trades only
  totalTrades: number;      // count since day 1
  maxDrawdown: number;      // USD, non-negative
  lastUpdated: string;
}

class StrategyApiService {
  // Admin - Get all strategies
  async getAllStrategies(): Promise<Strategy[]> {
    const response = await axiosInstance.get<Strategy[]>('/strategies');
    return response.data;
  }

  // Admin - Get single strategy by ID
  async getStrategyById(id: string): Promise<Strategy> {
    const response = await axiosInstance.get<Strategy>(`/strategies/${id}`);
    return response.data;
  }

  // Admin - Get strategy performance (real-time)
  async getStrategyPerformance(id: string): Promise<StrategyPerformance> {
    const response = await axiosInstance.get<StrategyPerformance>(
      `/strategies/${id}/performance`
    );
    return response.data;
  }

  // Admin - Get strategy trades with pagination
  async getStrategyTrades(
    id: string,
    limit: number = 50,
    offset: number = 0,
    status?: 'open' | 'closed' | 'cancelled'
  ): Promise<TradesResponse> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    if (status) {
      params.append('status', status);
    }

    const response = await axiosInstance.get<TradesResponse>(
      `/strategies/${id}/trades?${params.toString()}`
    );
    return response.data;
  }

  // Admin - Get equity curve data
  async getEquityCurve(id: string, days: number = 30): Promise<EquityCurvePoint[]> {
    const response = await axiosInstance.get<EquityCurvePoint[]>(
      `/strategies/${id}/equity-curve?days=${days}`
    );
    return response.data;
  }

  // Public - Get public strategy summary
  async getPublicSummary(id: string): Promise<PublicSummary> {
    const response = await axiosInstance.get<PublicSummary>(
      `/strategies/public/${id}/summary`
    );
    return response.data;
  }
}

export const strategyApi = new StrategyApiService();
