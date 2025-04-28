// Global debug flag - this should match the one in App.tsx
const DEBUG_MODE = true;
/**
 * Utility function for debug logging across the application
 * @param message - The message to log
 * @param data - Optional data to log along with the message
 * @param component - Optional component name to prefix the log with
 */
export const debugLog = (message, data, component) => {
    if (DEBUG_MODE && process.env.NODE_ENV !== 'production') {
        const timestamp = new Date().toISOString();
        const prefix = component ? `[${component}]` : '';
        const logMessage = `${timestamp} ${prefix} ${message}`;
        // Log to console
        console.log(logMessage);
        if (data !== undefined) {
            console.log(data);
            // For objects, add more detailed logging
            if (data && typeof data === 'object') {
                try {
                    // Check for common issues
                    if (data.toString() === '[object Object]') {
                        console.log('Object properties:', Object.keys(data));
                        // Check for response-like objects
                        if ('data' in data) {
                            console.log('Response data:', data.data);
                        }
                    }
                }
                catch (e) {
                    console.error('Error inspecting debug data:', e);
                }
            }
        }
        // Store important logs in localStorage for persistence
        try {
            const key = `debug_log_${Date.now()}`;
            const existingLogs = JSON.parse(localStorage.getItem('debug_logs') || '[]');
            const newLog = {
                timestamp,
                message: logMessage,
                data: data ? JSON.stringify(data) : undefined
            };
            // Keep only the last 50 logs
            if (existingLogs.length > 50) {
                existingLogs.shift();
            }
            existingLogs.push(newLog);
            localStorage.setItem('debug_logs', JSON.stringify(existingLogs));
        }
        catch (e) {
            console.error('Error storing debug log:', e);
        }
    }
};
/**
 * Utility function to create a component-specific debug logger
 * @param component - The name of the component
 */
export const createDebugLogger = (component) => {
    return (message, data) => debugLog(message, data, component);
};
/**
 * Retrieves all stored debug logs
 */
export const getDebugLogs = () => {
    try {
        return JSON.parse(localStorage.getItem('debug_logs') || '[]');
    }
    catch (e) {
        console.error('Error retrieving debug logs:', e);
        return [];
    }
};
/**
 * Clears all stored debug logs
 */
export const clearDebugLogs = () => {
    localStorage.removeItem('debug_logs');
};
export default debugLog;
