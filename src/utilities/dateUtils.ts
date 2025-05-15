import moment from 'moment';

export const serializeMomentDate = (date: moment.Moment | null): string | null => {
  return date ? date.toISOString() : null;
};

export const deserializeMomentDate = (dateString: string | null): moment.Moment | null => {
  return dateString ? moment(dateString) : null;
};

export const formatAppointmentDate = (date: string | null): moment.Moment | null => {
  if (!date) return null;
  try {
    return moment(date);
  } catch (error) {
    console.error('Error formatting appointment date:', error);
    return null;
  }
}; 