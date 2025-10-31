export abstract class BaseService {
  protected static instance: any;
  
  static getInstance<T>(): T {
    if (!this.instance) {
      throw new Error('getInstance must be implemented by concrete class');
    }
    return this.instance;
  }
  
  protected async handleRequest<T>(
    request: () => Promise<T>,
    errorMessage: string = 'Request failed'
  ): Promise<T> {
    try {
      return await request();
    } catch (error) {
      console.error(errorMessage, error);
      throw new Error(`${errorMessage}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  protected validateParams(params: any, required: string[]): void {
    for (const field of required) {
      if (!params[field]) {
        throw new Error(`Missing required parameter: ${field}`);
      }
    }
  }
}
