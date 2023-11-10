import moment from 'moment';
import { getLocalDate } from '../../../utils/dates';

export const buildDates = () => {
  const now = getLocalDate();
  const dates = [];

  const m = moment(now).startOf('month').subtract(1, 'month').subtract(3, 'days');
  const end = moment(now).endOf('month').add(1, 'month').add(3, 'days').format('YYYY-MM-DDTHH:mm:ss');

  while (m.format('YYYY-MM-DD') <= end) {
    dates.push(m.format('YYYY-MM-DD'));
    m.add(1, 'day');
  }

  return dates;
};

export const getIndex = (dates, date) => {
  return dates.indexOf(date) - 3;
};

export const getDate = (dates, index) => {
  return dates[index + 3];
};
