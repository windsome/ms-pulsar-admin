## 项目简介
pulsar的admin-api调用.
包含功能: 创建tenant,namespace,token,role,permission

## 业务
1. 创建租户, 及租户相关的namespace,role,token,permission
2. 删除租户, 删除所有相关.

## tenant/namespace/topic组织结构
1. 消息由msgpush用户发出,此为系统用户,消息来源可能为电信平台,可能为yihong设备模拟器平台,此msgpush相当于超级用户,能向 `msgpush/*/*`发送消息.
2. 消费着监听 `msgpush/<own_tenant>/<topic>`下面的消息.

