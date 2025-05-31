import moment, { Moment } from 'moment';

export const getLast7Days = (): Moment[] => {
  const days: Moment[] = [];
  for (let i = 6; i >= 0; i--) {
    days.push(moment().subtract(i, 'days'));
  }
  return days;
};
