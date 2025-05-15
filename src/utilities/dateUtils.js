import moment from 'moment';
export const serializeMomentDate = (date) => {
    return date ? date.toISOString() : null;
};
export const deserializeMomentDate = (dateString) => {
    return dateString ? moment(dateString) : null;
};
export const formatAppointmentDate = (date) => {
    if (!date)
        return null;
    try {
        return moment(date);
    }
    catch (error) {
        console.error('Error formatting appointment date:', error);
        return null;
    }
};
