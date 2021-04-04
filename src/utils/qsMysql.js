import querystring from 'qs';

export const parseQueryString = (args, { pageSize = 20 } = {}) => {
  // GET /users/1
  // GET /users/<key1=xxx>;<key2=yyy>;<page=1>;<order=status+&createAt+>
  // GET /query/users/order[0][0]=status;order[0][1]=ASC;order[1][0]=createdAt;order[1][1]=DESC;page=2 => {order:[['status', 'ASC'], ['createdAt', 'DESC']], page:2}
  // GET /users
  // var regexed = qs.parse('a=b;c=d,e=f', { delimiter: /[;,]/, allowDots: true, ignoreQueryPrefix: true,parameterLimit: 1,depth: 1,allowPrototypes: true,plainObjects: true });
  let { order, page = 0, fuzzy, raw, ...where } =
    querystring.parse(args, { delimiter: /[;,&]/ }) || {};
  if (page < 0) page = 0;
  let options = {
    where,
    order: order || [['id', 'DESC']],
    limit: pageSize,
    offset: pageSize * page,
    fuzzy,
    raw
  };
  return options;
};

export default parseQueryString;
