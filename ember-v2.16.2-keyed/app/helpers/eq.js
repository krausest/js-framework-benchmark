import { helper } from '@ember/component/helper';

export default helper(function(params) {
  return params[0] === params[1];
});
