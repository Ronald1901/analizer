/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */

export const parseJSON = (str: string) => {
  const start = str.indexOf('{');
  const end = str.lastIndexOf('}') + 1;
  return JSON.parse(str.substring(start, end));
};
