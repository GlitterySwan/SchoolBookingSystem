// utils.ts

/**
 * Gets the start (Sunday) and end (Saturday) of a week in UTC.
 * @param date The date within the desired week.
 * @returns An object with the start and end Date objects.
 */
export const getWeekDateRange = (date: Date): { start: Date; end: Date } => {
    const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const day = d.getUTCDay();
    const diffToSunday = d.getUTCDate() - day;
    const start = new Date(d.setUTCDate(diffToSunday));
    const end = new Date(start);
    end.setUTCDate(start.getUTCDate() + 6);
    return { start, end };
};

/**
 * Gets the start and end of a month in UTC.
 * @param date The date within the desired month.
 * @returns An object with the start and end Date objects.
 */
export const getMonthDateRange = (date: Date): { start: Date; end: Date } => {
    const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
    const end = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));
    return { start, end };
};

/**
 * Formats a date range for display based on the current calendar view.
 * @param date The reference date.
 * @param view The current calendar view ('day', 'week', 'month').
 * @returns A formatted string representing the date or range.
 */
export const formatDateRangeForDisplay = (date: Date, view: 'day' | 'week' | 'month'): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };

    if (view === 'day') {
        return date.toLocaleDateString('en-US', options);
    }
    if (view === 'week') {
        const { start, end } = getWeekDateRange(date);
        const startMonth = start.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
        const endMonth = end.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
        if (start.getUTCMonth() === end.getUTCMonth()) {
            return `${startMonth} ${start.getUTCDate()} - ${end.getUTCDate()}, ${start.getUTCFullYear()}`;
        }
        return `${startMonth} ${start.getUTCDate()} - ${endMonth} ${end.getUTCDate()}, ${start.getUTCFullYear()}`;
    }
    if (view === 'month') {
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', timeZone: 'UTC' });
    }
    return '';
};
