export default EC => ({
  [EC.ERR_SYSTEM_ERROR]: '系统错误',
  [EC.OK]: '操作正常',
  [EC.ERR_UNAUTH]: '未登录',
  [EC.ERR_3RD_API_FAIL]: '第三方API调用失败',
  [EC.ERR_UNKNOWN]: '未知错误',
  [EC.ERR_BUSY]: '系统忙',
  [EC.ERR_PARAM_ERROR]: '参数错误',
  [EC.ERR_NO_SUCH_API]: '没有此API',
  [EC.ERR_NOT_ALLOW]: '不允许的操作',

  [EC.ERR_NO_SUCH_ENTITY]: '数据库没有该实体',
  [EC.ERR_DB_ENTITY_DAMAGE]: '数据库中实体不一致',

  [EC.ERR_PULSAR_NETWORK_FAIL]: '网络失败!',
  [EC.ERR_PULSAR_OP_FAIL]: '命令失败!',
  [EC.ERR_PULSAR_OP_CONFLICT]: '冲突,一般表示已经存在!'
});
