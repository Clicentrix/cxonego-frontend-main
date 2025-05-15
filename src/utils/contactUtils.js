/**
 * Utility functions for handling contact IDs and data
 */
/**
 * Extracts a valid contactId string from various input formats
 * This ensures consistent handling of contactId across the application
 *
 * @param contactInput - The input that may contain a contact ID (string, object, etc.)
 * @returns A valid string contactId or empty string if none can be extracted
 */
export const extractContactId = (contactInput) => {
    // For debugging
    console.log('[ContactUtils] Extracting contactId from:', contactInput);
    console.log('[ContactUtils] Input type:', typeof contactInput);
    // If it's null or undefined, return empty string
    if (contactInput === null || contactInput === undefined) {
        console.log('[ContactUtils] Input is null or undefined');
        return '';
    }
    // Special case: If it's the literal string "[object Object]", it's invalid
    if (typeof contactInput === 'string' && contactInput === '[object Object]') {
        console.log('[ContactUtils] Input is the string "[object Object]" - invalid');
        return '';
    }
    // If it's already a string, return it directly
    if (typeof contactInput === 'string') {
        console.log('[ContactUtils] Input is a string');
        return contactInput;
    }
    // If it's an object, try to extract contactId or id property
    if (typeof contactInput === 'object') {
        console.log('[ContactUtils] Input is an object');
        // Try common property names for contact ID
        const possibleIdProps = ['contactId', 'id', '_id', 'uid'];
        for (const prop of possibleIdProps) {
            if (contactInput[prop] && typeof contactInput[prop] === 'string') {
                console.log(`[ContactUtils] Found ID in property '${prop}':`, contactInput[prop]);
                return contactInput[prop];
            }
        }
        // If no valid ID property is found, check if the object itself is convertible to a string ID
        if (contactInput.toString && typeof contactInput.toString === 'function' &&
            contactInput.toString() !== '[object Object]') {
            const stringValue = contactInput.toString();
            console.log('[ContactUtils] Using object.toString():', stringValue);
            return stringValue;
        }
        // If we still don't have an ID, try to get a value from the first property
        try {
            // Prevent full object stringification by just taking key properties
            if (Object.keys(contactInput).length > 0) {
                console.log('[ContactUtils] Unable to find proper ID property, using first property');
                const firstProp = Object.keys(contactInput)[0];
                if (typeof contactInput[firstProp] === 'string') {
                    return contactInput[firstProp];
                }
            }
        }
        catch (e) {
            console.error('[ContactUtils] Error extracting ID from object:', e);
        }
    }
    // If all else fails, generate a temporary ID
    console.log('[ContactUtils] Using fallback temporary ID');
    try {
        // Generate a temporary ID based on timestamp to avoid [object Object]
        return `temp-${Date.now()}`;
    }
    catch (e) {
        console.error('[ContactUtils] Error in fallback conversion:', e);
        return '';
    }
};
