import moment from 'moment';

export const calculateDates = (date) => {
  const dates = [];

  const startOfMonth = moment.utc(date).startOf('month');

  const sWeekday = startOfMonth.isoWeekday();
  const m = sWeekday === 1 ? startOfMonth : startOfMonth.subtract(sWeekday - 1, 'days');

  for (let i = 0; i < 35; i++) {
    dates.push(m.format('YYYY-MM-DD'));
    m.add(1, 'days');
  }

  return dates;
};
