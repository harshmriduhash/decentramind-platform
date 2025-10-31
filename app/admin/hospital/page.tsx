'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Users, 
  Database, 
  CreditCard, 
  Activity, 
  Bell, 
  Shield, 
  Download,
  Upload,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Building2
} from 'lucide-react';
import { AdminConsole, Subscription, DataSource, User, Log, Settings as HospitalSettings } from '../../types/hospital';

const AdminConsolePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [adminData, setAdminData] = useState<AdminConsole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockData: AdminConsole = {
      subscription: {
        id: 'sub-123',
        hospitalId: 'hospital-456',
        planType: 'yearly',
        status: 'active',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        price: 2999,
        currency: 'USD',
        features: [
          'Up to 50 users',
          'Advanced EHR integration',
          'Priority support',
          'Custom reports',
          'API access'
        ],
        nextBillingDate: new Date('2024-12-01')
      },
      connectedDataSources: [
        {
          id: 'ds-1',
          hospitalId: 'hospital-456',
          name: 'Epic EHR',
          type: 'EHR',
          status: 'connected',
          lastSync: new Date('2024-01-15T10:30:00'),
          apiEndpoint: 'https://api.epic.com/v1',
          credentials: {
            encrypted: true,
            lastUpdated: new Date('2024-01-01')
          },
          syncFrequency: 'real-time',
          dataTypes: ['patient', 'appointment', 'vitals', 'medication']
        },
        {
          id: 'ds-2',
          hospitalId: 'hospital-456',
          name: 'Cerner PACS',
          type: 'PACS',
          status: 'connected',
          lastSync: new Date('2024-01-15T09:15:00'),
          syncFrequency: 'hourly',
          dataTypes: ['imaging', 'radiology']
        }
      ],
      invitedUsers: [
        {
          id: 'user-1',
          hospitalId: 'hospital-456',
          email: 'dr.smith@hospital.com',
          firstName: 'John',
          lastName: 'Smith',
          role: 'admin',
          status: 'active',
          lastLogin: new Date('2024-01-15T08:00:00'),
          permissions: ['admin', 'manage_users', 'view_reports'],
          invitedAt: new Date('2024-01-01'),
          acceptedAt: new Date('2024-01-02')
        },
        {
          id: 'user-2',
          hospitalId: 'hospital-456',
          email: 'nurse.jones@hospital.com',
          firstName: 'Sarah',
          lastName: 'Jones',
          role: 'nurse',
          status: 'active',
          lastLogin: new Date('2024-01-15T07:30:00'),
          permissions: ['view_patients', 'update_vitals'],
          invitedAt: new Date('2024-01-01'),
          acceptedAt: new Date('2024-01-03')
        },
        {
          id: 'user-3',
          hospitalId: 'hospital-456',
          email: 'dr.wilson@hospital.com',
          firstName: 'Michael',
          lastName: 'Wilson',
          role: 'doctor',
          status: 'pending',
          lastLogin: undefined,
          permissions: ['view_patients', 'create_appointments'],
          invitedAt: new Date('2024-01-14'),
          acceptedAt: undefined
        }
      ],
      usageLogs: [
        {
          id: 'log-1',
          hospitalId: 'hospital-456',
          userId: 'user-1',
          action: 'login',
          resource: 'admin_console',
          timestamp: new Date('2024-01-15T08:00:00'),
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
        },
        {
          id: 'log-2',
          hospitalId: 'hospital-456',
          userId: 'user-2',
          action: 'update_patient',
          resource: 'patient_123',
          timestamp: new Date('2024-01-15T07:30:00'),
          details: { field: 'vitals', value: '120/80' }
        },
        {
          id: 'log-3',
          hospitalId: 'hospital-456',
          action: 'data_sync',
          resource: 'epic_ehr',
          timestamp: new Date('2024-01-15T10:30:00'),
          details: { records: 150, status: 'success' }
        }
      ],
      settings: {
        hospitalId: 'hospital-456',
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        dataRetention: {
          patientData: 2555, // 7 years
          logs: 365, // 1 year
          backups: 90 // 3 months
        },
        security: {
          twoFactorAuth: true,
          sessionTimeout: 30,
          ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8']
        },
        integrations: {
          allowThirdParty: true,
          webhookUrl: 'https://hospital.com/webhook',
          apiKey: 'sk-***...***'
        }
      }
    };

    setTimeout(() => {
      setAdminData(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'data-sources', label: 'Data Sources', icon: Database },
    { id: 'logs', label: 'Activity Logs', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Admin Console...</p>
        </div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-white text-lg">Failed to load admin data</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab data={adminData} />;
      case 'subscription':
        return <SubscriptionTab subscription={adminData.subscription} />;
      case 'users':
        return <UsersTab users={adminData.invitedUsers} />;
      case 'data-sources':
        return <DataSourcesTab dataSources={adminData.connectedDataSources} />;
      case 'logs':
        return <LogsTab logs={adminData.usageLogs} />;
      case 'settings':
        return <SettingsTab settings={adminData.settings} />;
      default:
        return <OverviewTab data={adminData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="text-4xl">🏥</div>
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Console</h1>
                <p className="text-gray-300">Manage your hospital's DecentraMind integration</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-300">All Systems Operational</span>
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-slate-800/50 rounded-lg p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-md font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-8"
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

// Tab Components
const OverviewTab: React.FC<{ data: AdminConsole }> = ({ data }) => {
  const stats = [
    {
      label: 'Active Users',
      value: data.invitedUsers.filter(u => u.status === 'active').length,
      total: data.invitedUsers.length,
      icon: Users,
      color: 'text-blue-400'
    },
    {
      label: 'Connected Systems',
      value: data.connectedDataSources.filter(ds => ds.status === 'connected').length,
      total: data.connectedDataSources.length,
      icon: Database,
      color: 'text-green-400'
    },
    {
      label: 'Monthly Usage',
      value: '2.4K',
      icon: TrendingUp,
      color: 'text-purple-400'
    },
    {
      label: 'Next Billing',
      value: `$${data.subscription.price}`,
      icon: DollarSign,
      color: 'text-yellow-400'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h2>
        <p className="text-gray-400">Monitor your hospital's DecentraMind integration status</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/50"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${stat.color}`} />
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  {stat.total && (
                    <div className="text-sm text-gray-400">of {stat.total}</div>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {data.usageLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div>
                  <div className="text-white font-medium">{log.action}</div>
                  <div className="text-sm text-gray-400">{log.resource}</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {log.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SubscriptionTab: React.FC<{ subscription: Subscription }> = ({ subscription }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'cancelled': return 'text-red-400 bg-red-400/20';
      case 'expired': return 'text-yellow-400 bg-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Subscription Management</h2>
        <p className="text-gray-400">Manage your hospital's subscription and billing</p>
      </div>

      {/* Subscription Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/50">
          <h3 className="text-lg font-semibold text-white mb-4">Current Plan</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Plan Type</span>
              <span className="text-white font-medium capitalize">{subscription.planType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Status</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
                {subscription.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Price</span>
              <span className="text-white font-medium">${subscription.price}/{subscription.planType === 'monthly' ? 'mo' : 'yr'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Next Billing</span>
              <span className="text-white font-medium">{subscription.nextBillingDate.toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/50">
          <h3 className="text-lg font-semibold text-white mb-4">Plan Features</h3>
          <ul className="space-y-2">
            {subscription.features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2 text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Billing History */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Billing History</h3>
        <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/50">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-600/30 rounded-lg">
              <div>
                <div className="text-white font-medium">Yearly Plan - 2024</div>
                <div className="text-sm text-gray-400">January 1, 2024</div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">$2,999.00</div>
                <div className="text-sm text-green-400">Paid</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UsersTab: React.FC<{ users: User[] }> = ({ users }) => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return '👑';
      case 'doctor': return '👨‍⚕️';
      case 'nurse': return '👩‍⚕️';
      case 'coordinator': return '📋';
      case 'viewer': return '👁️';
      default: return '👤';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'inactive': return 'text-gray-400 bg-gray-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">User Management</h2>
        <p className="text-gray-400">Manage your hospital staff and their access permissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/50">
          <div className="text-3xl font-bold text-white mb-2">{users.length}</div>
          <div className="text-gray-400">Total Users</div>
        </div>
        <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/50">
          <div className="text-3xl font-bold text-green-400 mb-2">
            {users.filter(u => u.status === 'active').length}
          </div>
          <div className="text-gray-400">Active Users</div>
        </div>
        <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/50">
          <div className="text-3xl font-bold text-yellow-400 mb-2">
            {users.filter(u => u.status === 'pending').length}
          </div>
          <div className="text-gray-400">Pending Invites</div>
        </div>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{getRoleIcon(user.role)}</div>
                <div>
                  <div className="text-white font-semibold text-lg">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-gray-400">{user.email}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-500 capitalize">{user.role}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                {user.lastLogin ? (
                  <div>
                    <div className="text-sm text-gray-400">Last Login</div>
                    <div className="text-white">{user.lastLogin.toLocaleDateString()}</div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">Never logged in</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DataSourcesTab: React.FC<{ dataSources: DataSource[] }> = ({ dataSources }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'EHR': return '📋';
      case 'EMR': return '🏥';
      case 'PACS': return '📸';
      case 'LIS': return '🧪';
      case 'RIS': return '🔬';
      case 'Custom': return '⚙️';
      default: return '🔗';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400 bg-green-400/20';
      case 'disconnected': return 'text-red-400 bg-red-400/20';
      case 'error': return 'text-yellow-400 bg-yellow-400/20';
      case 'pending': return 'text-blue-400 bg-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Data Sources</h2>
        <p className="text-gray-400">Manage your connected hospital systems and integrations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/50">
          <div className="text-3xl font-bold text-white mb-2">{dataSources.length}</div>
          <div className="text-gray-400">Total Sources</div>
        </div>
        <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/50">
          <div className="text-3xl font-bold text-green-400 mb-2">
            {dataSources.filter(ds => ds.status === 'connected').length}
          </div>
          <div className="text-gray-400">Connected</div>
        </div>
        <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/50">
          <div className="text-3xl font-bold text-yellow-400 mb-2">
            {dataSources.filter(ds => ds.status === 'error').length}
          </div>
          <div className="text-gray-400">Issues</div>
        </div>
      </div>

      <div className="space-y-4">
        {dataSources.map((source) => (
          <div key={source.id} className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{getTypeIcon(source.type)}</div>
                <div>
                  <div className="text-white font-semibold text-lg">{source.name}</div>
                  <div className="text-gray-400">{source.type} System</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-500">Sync: {source.syncFrequency}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(source.status)}`}>
                      {source.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Last Sync</div>
                <div className="text-white">{source.lastSync.toLocaleString()}</div>
                <div className="flex items-center space-x-2 mt-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-white"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-white"
                  >
                    <Settings className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LogsTab: React.FC<{ logs: Log[] }> = ({ logs }) => {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login': return '🔐';
      case 'update_patient': return '📝';
      case 'data_sync': return '🔄';
      case 'create_appointment': return '📅';
      default: return '📋';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Activity Logs</h2>
        <p className="text-gray-400">Monitor system activity and user actions</p>
      </div>

      <div className="space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-xl">{getActionIcon(log.action)}</div>
                <div>
                  <div className="text-white font-medium">{log.action.replace('_', ' ')}</div>
                  <div className="text-sm text-gray-400">{log.resource}</div>
                  {log.details && (
                    <div className="text-xs text-gray-500 mt-1">
                      {JSON.stringify(log.details)}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">{log.timestamp.toLocaleDateString()}</div>
                <div className="text-xs text-gray-500">{log.timestamp.toLocaleTimeString()}</div>
                {log.ipAddress && (
                  <div className="text-xs text-gray-500">{log.ipAddress}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsTab: React.FC<{ settings: HospitalSettings }> = ({ settings }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
        <p className="text-gray-400">Configure your hospital's DecentraMind integration settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Notifications */}
        <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Email Notifications</span>
              <div className={`w-12 h-6 rounded-full ${settings.notifications.email ? 'bg-purple-500' : 'bg-slate-600'} relative`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300 ${settings.notifications.email ? 'right-0.5' : 'left-0.5'}`}></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">SMS Notifications</span>
              <div className={`w-12 h-6 rounded-full ${settings.notifications.sms ? 'bg-purple-500' : 'bg-slate-600'} relative`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300 ${settings.notifications.sms ? 'right-0.5' : 'left-0.5'}`}></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Push Notifications</span>
              <div className={`w-12 h-6 rounded-full ${settings.notifications.push ? 'bg-purple-500' : 'bg-slate-600'} relative`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300 ${settings.notifications.push ? 'right-0.5' : 'left-0.5'}`}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Security</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Two-Factor Authentication</span>
              <div className={`w-12 h-6 rounded-full ${settings.security.twoFactorAuth ? 'bg-purple-500' : 'bg-slate-600'} relative`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300 ${settings.security.twoFactorAuth ? 'right-0.5' : 'left-0.5'}`}></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Session Timeout</span>
              <span className="text-white">{settings.security.sessionTimeout} minutes</span>
            </div>
            <div>
              <span className="text-gray-300 block mb-2">IP Whitelist</span>
              <div className="space-y-1">
                {settings.security.ipWhitelist.map((ip, index) => (
                  <div key={index} className="text-sm text-gray-400 bg-slate-600/50 px-3 py-1 rounded">
                    {ip}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Data Retention */}
        <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Data Retention</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Patient Data</span>
              <span className="text-white">{settings.dataRetention.patientData} days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Activity Logs</span>
              <span className="text-white">{settings.dataRetention.logs} days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Backups</span>
              <span className="text-white">{settings.dataRetention.backups} days</span>
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Integrations</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Third-Party Access</span>
              <div className={`w-12 h-6 rounded-full ${settings.integrations.allowThirdParty ? 'bg-purple-500' : 'bg-slate-600'} relative`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300 ${settings.integrations.allowThirdParty ? 'right-0.5' : 'left-0.5'}`}></div>
              </div>
            </div>
            {settings.integrations.webhookUrl && (
              <div>
                <span className="text-gray-300 block mb-2">Webhook URL</span>
                <div className="text-sm text-gray-400 bg-slate-600/50 px-3 py-1 rounded">
                  {settings.integrations.webhookUrl}
                </div>
              </div>
            )}
            {settings.integrations.apiKey && (
              <div>
                <span className="text-gray-300 block mb-2">API Key</span>
                <div className="text-sm text-gray-400 bg-slate-600/50 px-3 py-1 rounded">
                  {settings.integrations.apiKey}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminConsolePage;
