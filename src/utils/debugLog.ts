// Global debug flag - this should match the one in App.tsx
const DEBUG_MODE = true;

/**
 * Utility function for debug logging across the application
 * @param message - The message to log
 * @param data - Optional data to log along with the message
 * @param component - Optional component name to prefix the log with
 */
export const debugLog = (message: string, data?: any, component?: string) => {
  if (DEBUG_MODE && process.env.NODE_ENV !== 'production') {
    const prefix = component ? `[${component}]` : '';
    console.log(`${prefix} ${message}`);
    if (data !== undefined) {
      console.log(data);
    }
  }
};

/**
 * Utility function to create a component-specific debug logger
 * @param component - The name of the component
 */
export const createDebugLogger = (component: string) => {
  return (message: string, data?: any) => debugLog(message, data, component);
};

export default debugLog; 