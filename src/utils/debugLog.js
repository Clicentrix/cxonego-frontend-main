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
 * Specialized utility for debugging API responses
 * Shows the structure and important details about the response
 * 
 * @param {string} endpoint - The API endpoint called
 * @param {object} response - The response object received
 * @param {string} component - Optional component name
 */
export const debugApiResponse = (endpoint, response, component = 'API') => {
    if (!DEBUG_MODE || process.env.NODE_ENV === 'production') return;
    
    try {
        // Create a structured analysis of the response
        const analysis = {
            endpoint,
            timestamp: new Date().toISOString(),
            status: response?.status,
            statusText: response?.statusText,
            dataType: typeof response?.data,
        };
        
        // Analyze the data structure
        if (response?.data) {
            const data = response.data;
            
            // Check if data is an object
            if (typeof data === 'object' && data !== null) {
                analysis.hasDataProperty = 'data' in data;
                analysis.topLevelKeys = Object.keys(data);
                
                // Check for pagination info
                analysis.hasPagination = 
                    ('pagination' in data) || 
                    (data.data && 'pagination' in data.data) ||
                    ('page' in data) ||
                    (data.data && 'page' in data.data);
                
                // Check for nested data structure
                if ('data' in data && data.data) {
                    analysis.nestedDataType = typeof data.data;
                    
                    if (typeof data.data === 'object' && data.data !== null) {
                        analysis.nestedDataKeys = Object.keys(data.data);
                        
                        // Check for doubly nested data
                        if ('data' in data.data) {
                            analysis.hasDoublyNestedData = true;
                            analysis.doublyNestedDataType = typeof data.data.data;
                            
                            if (Array.isArray(data.data.data)) {
                                analysis.doublyNestedDataIsArray = true;
                                analysis.doublyNestedDataLength = data.data.data.length;
                                
                                // Show sample of first item if available
                                if (data.data.data.length > 0) {
                                    analysis.firstItemSample = data.data.data[0];
                                }
                            }
                        }
                    }
                }
                
                // Check for documents property
                if ('documents' in data) {
                    analysis.hasDocumentsProperty = true;
                    analysis.documentsIsArray = Array.isArray(data.documents);
                    analysis.documentsLength = Array.isArray(data.documents) ? data.documents.length : 'not an array';
                    
                    // Show sample of first document if available
                    if (Array.isArray(data.documents) && data.documents.length > 0) {
                        analysis.firstDocumentSample = data.documents[0];
                    }
                }
            }
            
            // Check if data is an array
            if (Array.isArray(data)) {
                analysis.isArray = true;
                analysis.arrayLength = data.length;
                
                // Show sample of first item if available
                if (data.length > 0) {
                    analysis.firstItemSample = data[0];
                }
            }
        }
        
        console.group(`API Response Debug [${component}]: ${endpoint}`);
        console.log('Analysis:', analysis);
        console.log('Raw Response:', response);
        console.groupEnd();
        
        // Store in debug logs as well
        debugLog(`API Response Analysis for ${endpoint}`, analysis, component);
        
        return analysis;
    } catch (error) {
        console.error('Error analyzing API response:', error);
        // Still log the original response
        debugLog(`API Response for ${endpoint} (analysis failed)`, response, component);
        return null;
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
