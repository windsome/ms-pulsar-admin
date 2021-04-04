import _ from 'lodash';

export const inCaps = (caps, cap) => {
  if (!cap) return true;
  if (!caps) return false;
  cap = cap.toLowerCase();
  if (_.isString(caps)) caps = [caps];
  if (_.isArray(caps)) {
    let index = _.findIndex(caps, item => {
      return item.toLowerCase() === cap;
    });
    if (index < 0) return false;
    else return true;
  } else return false;
};

const ROOT_USERS_PHONE = ['root', 'sharks'];

export const isRoot = user => {
  if (!user) return false;
  if (ROOT_USERS_PHONE.indexOf(user.phone) >= 0) return true;
  return inCaps(user.caps, 'root');
};

export const hasCap = (user, cap) => {
  if (!user) return false;
  if (ROOT_USERS_PHONE.indexOf(user.phone) >= 0) return true;
  return inCaps(user.caps, cap);
};
