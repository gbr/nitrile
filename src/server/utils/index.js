import _ from 'lodash';

export const isNonEmptyString = (str) =>
  (!_.isNil(str) && _.isString(str) && !_.isEmpty(str));
