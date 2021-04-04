import moment from 'moment';

export const getWeekStartDateSunday1 = date => {
  // deprecated.
  if (!date) return null;
  let weekOfday = moment(date).format('e'); //计算今天是这周第几天
  let strWeekBegin = moment(date)
    .subtract(weekOfday, 'days')
    .format('YYYY-MM-DD'); //周日日期
  return moment(strWeekBegin).toDate();
};

export const getWeekStartDateSunday2 = date => {
  // deprecated.
  if (!date) return null;
  return moment(date)
    .startOf('week')
    .toDate();
};

export const getWeekStartDate = date => {
  if (!date) return null;
  return moment(date)
    .startOf('isoWeek')
    .toDate();
};

export const getWeekStartDateString = date => {
  let ndate = getWeekStartDate(date);
  if (!ndate) return null;
  return moment(ndate).format('YYYY-MM-DD');
};

export const getDayStartDate = date => {
  if (!date) return null;

  let stime = moment(date)
    .startOf('day')
    .toDate();
  // console.log('getDayStartDate', stime, stime.getTime());
  return stime;
};

export const getDayEndDate = date => {
  if (!date) return null;

  let etime = moment(date)
    .endOf('day')
    .toDate();
  // console.log('getDayEndDate', etime, etime.getTime());
  return etime;
};

export const inTimeRange = (theTime, timeBegin, timeEnd) => {
  if (!theTime) return false;
  theTime = new Date(theTime);
  if (timeBegin) {
    timeBegin = new Date(timeBegin);
    if (theTime < timeBegin) return false;
  }
  if (timeEnd) {
    timeEnd = new Date(timeEnd);
    if (theTime > timeEnd) return false;
  }
  return true;
};

export const inValidRange = (theTime, begin, end) => {
  if (!theTime) return false;
  theTime = new Date(theTime);
  if (begin) {
    begin = new Date(begin);
    if (theTime < begin) return false;
  }
  if (end) {
    end = new Date(end);
    if (theTime > end) return false;
  }
  return true;
};

export const inVipRange = (theTime, begin, end) => {
  if (!theTime) return false;
  if (!begin) return false;
  if (!end) return false;
  theTime = new Date(theTime);
  begin = new Date(begin);
  if (theTime < begin) return false;
  end = new Date(end);
  if (theTime > end) return false;
  return true;
};
