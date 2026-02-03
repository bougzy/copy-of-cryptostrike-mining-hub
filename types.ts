
export interface MiningStats {
  hashRate: number;
  totalMined: number;
  dailyEarnings: number;
  activeRigs: number;
  efficiency: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  type: 'AI' | 'SYSTEM' | 'SOCIAL';
}

export interface WalletInfo {
  address: string | null;
  connected: boolean;
  balance: number;
  network: string;
}

export interface UserWallet {
  id: string;
  address: string;
  profit: number;
  lastActive: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export enum View {
  HOME = 'HOME',
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  MINING = 'MINING',
  TASKS = 'TASKS',
  WALLET = 'WALLET',
  INSIGHTS = 'INSIGHTS',
  ADMIN = 'ADMIN'
}

export interface UserSession {
  email: string;
  role: 'admin' | 'user';
}

export interface MiningInsight {
  topic: string;
  content: string;
  relevance: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface DbStatus {
  connected: boolean;
  cluster: string;
  latency: number;
  lastSync: string;
  url: string;
}
