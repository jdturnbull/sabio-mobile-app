import moment from 'moment-timezone';

export const getLocalDT = (timezone) => moment.tz(timezone).format('YYYY-MM-DDTHH:mm:ss');
export const getLocalDate = (timezone) => moment.tz(timezone).format('YYYY-MM-DD');
export const getLocalTime = (timezone) => moment.tz(timezone).format('HH:mm:ss');

export const localiseDT = (dt, timezone) => moment.utc(dt).tz(timezone).format('YYYY-MM-DDTHH:mm:ss');
