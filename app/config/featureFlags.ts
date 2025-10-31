export const featureFlags = {
  enableLaunchpad: true,
  enableAgentXP: true,
  enableA2AProtocol: false,
  enableVoiceChat: false,
  enableMultiDomainDashboard: false, // Deprecated - merged into unified dashboard
  enableIDOICO: false, // Deprecated - replaced with unified launchpad
  enableUnifiedDashboard: true, // New unified dashboard approach
};

export type FeatureFlag = keyof typeof featureFlags;

export const isFeatureEnabled = (flag: FeatureFlag): boolean => {
  return featureFlags[flag];
};
