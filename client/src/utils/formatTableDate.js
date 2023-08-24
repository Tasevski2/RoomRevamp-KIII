import moment from 'moment';

export const formatTableDate = (date) =>
  moment(date).format('DD.MM.YYYY[\n]HH:mm');
