export interface Hospital {
  id: string;
  name: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  contactEmail: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  hospitalId: string;
  planType: 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: Date;
  endDate: Date;
  price: number;
  currency: string;
  features: string[];
  nextBillingDate: Date;
}

export interface DataSource {
  id: string;
  hospitalId: string;
  name: string;
  type: 'EHR' | 'EMR' | 'PACS' | 'LIS' | 'RIS' | 'Custom';
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  lastSync: Date;
  apiEndpoint?: string;
  credentials?: {
    encrypted: boolean;
    lastUpdated: Date;
  };
  syncFrequency: 'real-time' | 'hourly' | 'daily' | 'weekly';
  dataTypes: string[];
}

export interface User {
  id: string;
  hospitalId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'doctor' | 'nurse' | 'coordinator' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  lastLogin?: Date;
  permissions: string[];
  invitedAt: Date;
  acceptedAt?: Date;
}

export interface Log {
  id: string;
  hospitalId: string;
  userId?: string;
  action: string;
  resource: string;
  timestamp: Date;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface Settings {
  hospitalId: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  dataRetention: {
    patientData: number; // days
    logs: number; // days
    backups: number; // days
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number; // minutes
    ipWhitelist: string[];
  };
  integrations: {
    allowThirdParty: boolean;
    webhookUrl?: string;
    apiKey?: string;
  };
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
}

export interface OnboardingData {
  hospital: Partial<Hospital>;
  subscription: Partial<Subscription>;
  users: Partial<User>[];
  dataSources: Partial<DataSource>[];
  currentStep: number;
  completedSteps: string[];
}

export interface AdminConsole {
  subscription: Subscription;
  connectedDataSources: DataSource[];
  invitedUsers: User[];
  usageLogs: Log[];
  settings: Settings;
}
