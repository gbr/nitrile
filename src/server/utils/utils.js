import _ from 'lodash';

export function isBadString(str) {
  if (_.isNil(str) || !_.isString(str) || _.isEmpty(str)) { return true; }
  return false;
}

