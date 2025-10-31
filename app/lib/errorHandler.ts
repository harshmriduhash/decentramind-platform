// Comprehensive Error Handling System for DecentraMind

export interface ErrorContext {
  userId?: string;
  agentId?: string;
  action?: string;
  timestamp: string;
  userAgent?: string;
  walletAddress?: string;
}

export interface ErrorLog {
  id: string;
  error: string;
  message: string;
  context: ErrorContext;
  stack?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLogs: ErrorLog[] = [];
  private maxLogs = 1000;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Log an error with context
  logError(error: Error | string, context: ErrorContext, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'): void {
    const errorLog: ErrorLog = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      error: error instanceof Error ? error.message : error,
      message: this.getUserFriendlyMessage(error instanceof Error ? error.message : error),
      context: {
        ...context,
        timestamp: new Date().toISOString()
      },
      stack: error instanceof Error ? error.stack : undefined,
      severity
    };

    this.errorLogs.push(errorLog);
    
    // Keep only the latest logs
    if (this.errorLogs.length > this.maxLogs) {
      this.errorLogs = this.errorLogs.slice(-this.maxLogs);
    }

    // Console log for development
    console.error('DecentraMind Error:', {
      message: errorLog.message,
      error: errorLog.error,
      context: errorLog.context,
      severity: errorLog.severity
    });

    // TODO: Send to external logging service in production
    this.sendToLoggingService(errorLog);
  }

  // Get user-friendly error messages
  private getUserFriendlyMessage(error: string): string {
    const errorMessages: { [key: string]: string } = {
      'Agent not found': 'The requested agent could not be found. Please try refreshing the page.',
      'Missing or insufficient permissions': 'You don\'t have permission to perform this action. Please check your wallet connection.',
      'Invalid wallet address': 'Please connect a valid Solana wallet to continue.',
      'Network error': 'Connection issue detected. Please check your internet connection and try again.',
      'Database error': 'We\'re experiencing technical difficulties. Please try again in a few moments.',
      'Validation failed': 'Please check your input and try again.',
      'Insufficient DMT': 'You don\'t have enough DMT tokens for this action.',
      'Agent evolution failed': 'Agent evolution could not be completed. Please try again.',
      'Task delegation failed': 'Task delegation could not be completed. Please try again.',
      'Authentication failed': 'Please reconnect your wallet and try again.',
      'Firebase error': 'Data synchronization issue. Please try again.',
      'Solana transaction failed': 'Blockchain transaction failed. Please try again.',
      'Agent creation failed': 'Agent creation could not be completed. Please try again.',
      'Domain validation failed': 'Please select a valid domain for your agent.',
      'Owner validation failed': 'Agent ownership validation failed. Please reconnect your wallet.'
    };

    // Find the best matching error message
    for (const [key, message] of Object.entries(errorMessages)) {
      if (error.toLowerCase().includes(key.toLowerCase())) {
        return message;
      }
    }

    // Default message for unknown errors
    return 'An unexpected error occurred. Please try again or contact support if the problem persists.';
  }

  // Send error to external logging service (placeholder for production)
  private sendToLoggingService(errorLog: ErrorLog): void {
    // TODO: Implement external logging service integration
    // Examples: Sentry, LogRocket, DataDog, etc.
    
    if (process.env.NODE_ENV === 'production') {
      // Production logging logic here
      console.log('Sending error to logging service:', errorLog.id);
    }
  }

  // Get error logs for debugging
  getErrorLogs(severity?: 'low' | 'medium' | 'high' | 'critical'): ErrorLog[] {
    if (severity) {
      return this.errorLogs.filter(log => log.severity === severity);
    }
    return this.errorLogs;
  }

  // Clear error logs
  clearErrorLogs(): void {
    this.errorLogs = [];
  }

  // Get error statistics
  getErrorStats(): { total: number; bySeverity: { [key: string]: number } } {
    const bySeverity: { [key: string]: number } = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };

    this.errorLogs.forEach(log => {
      bySeverity[log.severity]++;
    });

    return {
      total: this.errorLogs.length,
      bySeverity
    };
  }

  // Handle specific error types
  handleAgentError(error: Error, context: ErrorContext): string {
    this.logError(error, context, 'high');
    return this.getUserFriendlyMessage(error.message);
  }

  handleAuthenticationError(error: Error, context: ErrorContext): string {
    this.logError(error, context, 'critical');
    return this.getUserFriendlyMessage(error.message);
  }

  handleTransactionError(error: Error, context: ErrorContext): string {
    this.logError(error, context, 'high');
    return this.getUserFriendlyMessage(error.message);
  }

  handleValidationError(error: Error, context: ErrorContext): string {
    this.logError(error, context, 'medium');
    return this.getUserFriendlyMessage(error.message);
  }

  handleNetworkError(error: Error, context: ErrorContext): string {
    this.logError(error, context, 'medium');
    return this.getUserFriendlyMessage(error.message);
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Utility functions for common error scenarios
export const handleAgentNotFound = (agentId: string, context: ErrorContext): string => {
  const error = new Error(`Agent not found: ${agentId}`);
  return errorHandler.handleAgentError(error, context);
};

export const handlePermissionError = (action: string, context: ErrorContext): string => {
  const error = new Error(`Missing or insufficient permissions for: ${action}`);
  return errorHandler.handleAuthenticationError(error, context);
};

export const handleValidationError = (field: string, value: any, context: ErrorContext): string => {
  const error = new Error(`Validation failed for ${field}: ${value}`);
  return errorHandler.handleValidationError(error, context);
};

export const handleWalletError = (walletAddress: string, context: ErrorContext): string => {
  const error = new Error(`Invalid wallet address: ${walletAddress}`);
  return errorHandler.handleAuthenticationError(error, context);
};

export const handleEvolutionError = (agentId: string, reason: string, context: ErrorContext): string => {
  const error = new Error(`Evolution failed for agent ${agentId}: ${reason}`);
  return errorHandler.handleAgentError(error, context);
};

export const handleDelegationError = (task: string, reason: string, context: ErrorContext): string => {
  const error = new Error(`Task delegation failed for "${task}": ${reason}`);
  return errorHandler.handleAgentError(error, context);
}; 