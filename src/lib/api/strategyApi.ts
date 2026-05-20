import axiosInstance from '@/lib/axios/config';

export interface Strategy {
  id: string;
  name: string;
  description: string;
  account_id: string;
  status: 'active' | 'inactive';
  initial_capital: number;
  createdAt: string;
  updatedAt: string;
}

export interface StrategyPerformance {
  strategyId: string;
  totalReturn: number;
  totalPnL: number;
  unrealizedPnL: number;
  realizedPnL: number;
  winRate: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  maxDrawdown: number;
  currentDrawdown: number;
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
  equity: number;
  totalPnL: number;
  drawdown: number;
}

export interface PublicSummary {
  strategyId: string;
  name: string;
  totalReturn: number;
  winRate: number;
  totalTrades: number;
  maxDrawdown: number;
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
