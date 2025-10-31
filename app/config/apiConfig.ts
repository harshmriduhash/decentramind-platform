// API Configuration for DecentraMind
export interface APIConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  headers: Record<string, string>;
}

export interface CoinGeckoConfig {
  baseUrl: string;
  endpoints: {
    trending: string;
    markets: string;
    coin: string;
    search: string;
  };
  rateLimit: {
    requestsPerMinute: number;
    burstLimit: number;
  };
}

export interface HealthAPIConfig {
  baseUrl: string;
  endpoints: {
    healthTips: string;
    medicationWarnings: string;
    healthNews: string;
  };
  sources: string[];
}

export interface NotificationConfig {
  providers: {
    firebase: boolean;
    websocket: boolean;
    polling: boolean;
  };
  intervals: {
    polling: number;
    cleanup: number;
  };
}

class APIConfigManager {
  private static instance: APIConfigManager;
  private config: {
    coinGecko: CoinGeckoConfig;
    healthAPI: HealthAPIConfig;
    notifications: NotificationConfig;
    devMode: boolean;
  };

  private constructor() {
    this.config = {
      coinGecko: {
        baseUrl: 'https://api.coingecko.com/api/v3',
        endpoints: {
          trending: '/search/trending',
          markets: '/coins/markets',
          coin: '/coins',
          search: '/search'
        },
        rateLimit: {
          requestsPerMinute: 30,
          burstLimit: 10
        }
      },
      healthAPI: {
        baseUrl: 'https://api.healthline.com/v1',
        endpoints: {
          healthTips: '/tips',
          medicationWarnings: '/warnings',
          healthNews: '/news'
        },
        sources: ['Healthline', 'WebMD', 'Mayo Clinic', 'FDA']
      },
      notifications: {
        providers: {
          firebase: true,
          websocket: false,
          polling: true
        },
        intervals: {
          polling: 30000, // 30 seconds
          cleanup: 300000 // 5 minutes
        }
      },
      devMode: process.env.NODE_ENV === 'development'
    };
  }

  static getInstance(): APIConfigManager {
    if (!APIConfigManager.instance) {
      APIConfigManager.instance = new APIConfigManager();
    }
    return APIConfigManager.instance;
  }

  // CoinGecko API Methods
  getCoinGeckoConfig(): CoinGeckoConfig {
    return this.config.coinGecko;
  }

  getCoinGeckoUrl(endpoint: keyof CoinGeckoConfig['endpoints']): string {
    return `${this.config.coinGecko.baseUrl}${this.config.coinGecko.endpoints[endpoint]}`;
  }

  // Health API Methods
  getHealthAPIConfig(): HealthAPIConfig {
    return this.config.healthAPI;
  }

  getHealthAPIUrl(endpoint: keyof HealthAPIConfig['endpoints']): string {
    return `${this.config.healthAPI.baseUrl}${this.config.healthAPI.endpoints[endpoint]}`;
  }

  // Notification Methods
  getNotificationConfig(): NotificationConfig {
    return this.config.notifications;
  }

  // Development Mode
  isDevMode(): boolean {
    return this.config.devMode;
  }

  // Mock Data Methods for Development
  getMockCoinGeckoData(endpoint: string): any {
    if (!this.isDevMode()) return null;

    const mockData = {
      trending: {
        coins: [
          {
            item: {
              id: 'bitcoin',
              name: 'Bitcoin',
              symbol: 'btc',
              thumb: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
              market_cap_rank: 1
            }
          },
          {
            item: {
              id: 'ethereum',
              name: 'Ethereum',
              symbol: 'eth',
              thumb: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
              market_cap_rank: 2
            }
          }
        ]
      },
      markets: [
        {
          id: 'bitcoin',
          name: 'Bitcoin',
          symbol: 'btc',
          current_price: 45000,
          price_change_percentage_24h: 2.5,
          total_volume: 25000000000,
          market_cap: 850000000000,
          image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
          market_cap_rank: 1
        }
      ]
    };

    return mockData[endpoint as keyof typeof mockData] || null;
  }

  getMockHealthData(endpoint: string): any {
    if (!this.isDevMode()) return null;

    const mockData = {
      tips: [
        {
          id: '1',
          title: 'Stay Hydrated',
          description: 'Drink at least 8 glasses of water daily',
          category: 'nutrition',
          source: 'Healthline'
        }
      ],
      warnings: [
        {
          id: '1',
          medication: 'Aspirin',
          warning: 'May cause stomach irritation',
          severity: 'medium',
          source: 'FDA'
        }
      ]
    };

    return mockData[endpoint as keyof typeof mockData] || null;
  }

  // Rate Limiting
  private requestCounts: Map<string, { count: number; resetTime: number }> = new Map();

  canMakeRequest(api: 'coinGecko' | 'healthAPI'): boolean {
    const now = Date.now();
    const config = api === 'coinGecko' ? this.config.coinGecko : this.config.healthAPI;
    const key = api;
    
    const current = this.requestCounts.get(key);
    if (!current || now > current.resetTime) {
      this.requestCounts.set(key, {
        count: 1,
        resetTime: now + 60000 // Reset every minute
      });
      return true;
    }

    if (current.count >= (config as any).rateLimit?.requestsPerMinute || 60) {
      return false;
    }

    current.count++;
    return true;
  }

  // Update Configuration
  updateConfig(updates: Partial<typeof this.config>): void {
    this.config = { ...this.config, ...updates };
  }

  // Get Full Configuration
  getFullConfig(): typeof this.config {
    return this.config;
  }
}

export default APIConfigManager;

