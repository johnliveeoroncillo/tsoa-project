import moment, { Moment } from 'moment-timezone';

export const getMomentTimeZone = (date?: Date | string, tz = 'UTC'): Moment => {
    return moment(date).tz(tz);
};

export const getMonthYear = (date: string): string => {
    return moment(date).format('YYYY-MM');
};
