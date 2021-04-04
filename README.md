## pulsar在docker-compose中运行及超级管理API使用.
pulsar的admin-api调用.
包含功能: 创建tenant,namespace,token,role,permission
### 项目目标
1. 创建租户, 及租户相关的namespace,role,token,permission
2. 删除租户, 删除所有相关.
3. tenant/namespace/topic组织结构
  + 消息由msgpush用户发出,此为系统用户,消息来源可能为电信平台,可能为yihong设备模拟器平台,此msgpush相当于超级用户,能向 `msgpush/*/*`发送消息.
  + 消费着监听 `msgpush/<own_tenant>/<topic>`下面的消息.

### 官网中以docker方式运行pulsar.
  [在 Docker 里配置单机 Pulsar](http://pulsar.apache.org/docs/zh-CN/next/standalone-docker/)
  使用`--mount`模式连接配置文件及数据文件:
  `docker run -it --name=pulsar_standalone -p 6650:6650 -p 8080:8080 --mount source=pulsardata,target=/pulsar/data --mount source=pulsarconf,target=/pulsar/conf apachepulsar/pulsar:2.7.1 bin/pulsar standalone`
  运行`docker inspect pulsar_standalone`获取到docker容器详情,找到`Mounts`字段,如果是第一次运行,pulsarconf会自动生成,`Source`字段即为存放配置的目录,该例子为`/var/lib/docker/volumes/pulsarconf/_data`,见如下:
```
        "Mounts": [
            {
                "Type": "volume",
                "Name": "pulsardata",
                "Source": "/var/lib/docker/volumes/pulsardata/_data",
                "Destination": "/pulsar/data",
                "Driver": "local",
                "Mode": "z",
                "RW": true,
                "Propagation": ""
            },
            {
                "Type": "volume",
                "Name": "pulsarconf",
                "Source": "/var/lib/docker/volumes/pulsarconf/_data",
                "Destination": "/pulsar/conf",
                "Driver": "local",
                "Mode": "z",
                "RW": true,
                "Propagation": ""
            }
        ],
```

### 为方便修改及保存配置,使用文件夹映射方式运行docker化pulsar
  先建立pulsar工作目录`./pulsar`,在其下面建立`data`用来保存数据,`conf`保存配置. 将上面`/var/lib/docker/volumes/pulsarconf/_data`中内容拷贝进目录`./pulsar/conf`
  以`-v`目录映射模式运行docker, 命令: 
  ```docker run -it -p 6650:6650 -p 8080:8080 -v `pwd`/data:/pulsar/data -v `pwd`/conf:/pulsar/conf apachepulsar/pulsar:2.7.1 bin/pulsar standalone```

### pulsar-manager通过web界面对pulsar进行管理(不是必须)
  pulsar-manager是一个pulsar的管理器,只能管理standalone型不需要认证的pulsar.他是一个web服务器,通过连接pulsar的admin-api进行管理.admin-api为一个url`http://localhost:8080`,运行命令为:
   ```docker run -it -p 9527:9527 -p 7750:7750 -e SPRING_CONFIGURATION_FILE=/pulsar-manager/pulsar-manager/application.properties apachepulsar/pulsar-manager:v0.2.0```
   初次启动此服务器后,需运行如下命令,生成管理员账号,然后访问`http://localhost:9527`,使用刚才创建的账号`admin`登录进行操作.
```
CSRF_TOKEN=$(curl http://localhost:7750/pulsar-manager/csrf-token)
curl \
   -H 'X-XSRF-TOKEN: $CSRF_TOKEN' \
   -H 'Cookie: XSRF-TOKEN=$CSRF_TOKEN;' \
   -H "Content-Type: application/json" \
   -X PUT http://localhost:7750/pulsar-manager/users/superuser \
   -d '{"name": "admin", "password": "apachepulsar", "description": "test", "email": "username@test.org"}'
```
### 真实运营部署环境介绍.
  真实运营环境中,pulsar会部署成集群,这个暂不讨论. 还有一种准真实环境,即外部使用上与真实环境一样,但部署上使用standalone单机模式+jwt-token认证.即类似电信物联网平台中pulsar的使用模式.
  电信物联网平台作为物联网设备管理平台,提供设备管理,命令转发,传感数据上报(即MQ消息推送)等功能, 其中MQ消息推送使用pulsar服务. 
  互联网设备厂商在电信物联网平台注册账号的同时, 在pulsar服务中创建了一个tenant及jwt-token及一个namespace为`/aep-msgpush/<tenant-id>`. tenant只在此namespace下具有`consume`权限.
  厂商用户可以在该namespace下创建不超过10个topic用来接收数据.不同topic可以关联不同的产品.
  厂商token可以在`https://jwt.io/`进行在线解析,查看里面内容.
  
  从真实运营环境的需求可以看出有如下需求:
  1. 需要控制访问授权,可以用jwt-token这种最简单方式.
  2. 需要有个超级用户,可以朝所有的namespace/topic发送消息.
  3. 需要能动态创建厂商租户.可以用admin-api完成.
  4. 厂商租户能接收到发送给他的消息.

### 针对真实运营环境,我们做一个准真实环境部署.
1. 首先根据原始环境制作一个pulsar的`docker-compose.yml`,如下:
```
version: '3.3'
services:
  pulsar:
    image: "apachepulsar/pulsar:2.7.1"
    command: bin/pulsar standalone
    restart: always
    ports:
      - "6650:6650"
      - "8080:8080"
    volumes:
      - ./pulsar-cfg/data:/pulsar/data
      - ./pulsar-cfg/conf:/pulsar/conf
  pulsar-manager:
    image: "apachepulsar/pulsar-manager:v0.2.0"
    restart: always
    ports:
      - "9527:9527"
      - "7750:7750"
    depends_on:
      - pulsar
    links:
      - pulsar
    environment:
      - SPRING_CONFIGURATION_FILE=/pulsar-manager/pulsar-manager/application.properties
```
直接运行`docker-compose up`即可运行测试环境.`pulsar-manager`用法见上面或官网.

2. 根据上面所列真实环境需求,进行修改.
  主要处理jwt-token认证相关,创建`secret-key`,修改`standalone.conf`.
+ jwt-token相关
运行`docker exec -it ${pulsar容器id} /bin/sh`进入容器命令行.运行如下命令:
```
# 得到base64编码的key
bin/pulsar tokens create-secret-key --output conf/auth/my-secret1-b64.key --base64
# 将base64编码的key转换成二进制.(这个命令在宿主机上运行,docker中可能没有此命令)
base64 -d conf/auth/my-secret1-b64.key > conf/auth/my-secret1.key 
# 利用先前创建的key生成超级用户的jwt.(可以生成多个不同用户名的,这里生成了test-user)
bin/pulsar tokens create --secret-key conf/auth/my-secret1.key --subject test-user 
# 得到的token是: `eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0LXVzZXIifQ.KCepkApIwUV3rDgnI7hqKk6Xv3I3rRBZCwtKWkQSIGw`
```
  这里有个注意事项,生成的my-secret1.key很重要,后续生成厂商的jwt也需要此key,做好保存工作.同时,不能让外部有机会获知此key. 否则, 该系统的认证机制等同透明, 任何人即可根据此key生成其他用户token,从而进行非法操作.
  修改`standalone.conf`,找到如下键值,进行修改或添加
```
authenticateOriginalAuthData=true
authenticationEnabled=true
authenticationProviders=org.apache.pulsar.broker.authentication.AuthenticationProviderToken
authorizationEnabled=true

superUserRoles=root,admin,test-user,msgpush
brokerClientAuthenticationPlugin=org.apache.pulsar.client.impl.auth.AuthenticationToken
brokerClientAuthenticationParameters=token:eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0LXVzZXIifQ.KCepkApIwUV3rDgnI7hqKk6Xv3I3rRBZCwtKWkQSIGw
tokenSecretKey=data:;base64,4hVFTHInIEwS4b545UpVWghv6njne1FsqMJRo4FG5O8=
```
3. 重新启动`docker-compose up`
此时该pulsar即为需要jwt-token认证的broker. 管理操作需要使用admin-api进行.

### 为开发一个管理服务做准备工作(此服务将专门用于创建厂商用户tenant和jwt)
通过调用broker的admin-api进行管理, 即访问`http://pulsar:8080`进行. 注意在api调用的http头中需要填写`Authorization`字段, 内容为: `'Bearer ' + ${adminJwt}`, 如: `Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0LXVzZXIifQ.KCepkApIwUV3rDgnI7hqKk6Xv3I3rRBZCwtKWkQSIGw`
api列表见`https://pulsar.apache.org/admin-rest-api/?version=2.7.1&apiversion=v2#`
目前主要用到的api为:
1. 创建tenant
接口:`http://localhost:8080/admin/v2/tenants/{tenant}`,
示例:
```
http://localhost:8080/admin/v2/tenants/<厂商tenant>
{
    "adminRoles": ["<厂商tenant>"],
    "allowedClusters": [
        "standalone"
    ]
}
```
为简单起见,adminRoles和tenant为同一个值.

2. 创建namespace
接口:`https://pulsar.incubator.apache.org/admin/v2/namespaces/{tenant}/{namespace}`
电信物联网平台示例: `http://localhost:8080/admin/v2/namespaces/aep-msgpush/2000016425`,其中`aep-msgpush`为超级用户,可以向所有namespace/topic发送消息.`2000016425`为厂商tenant.
电信将向此namespace`aep-msgpush/2000016425`发送设备变化等消息, 厂商消费此namespace下topic消息.

3. 授权
接口:`http://pulsar.incubator.apache.org/admin/v2/namespaces/{tenant}/{namespace}/permissions/{role}`
示例: 
```
POST http://localhost:8080/admin/v2/namespaces/aep-msgpush/2000016425/permissions/2000016425
[
"consume"
]
```
### 开发admin管理服务,使用jayson作为rpc服务协议.
封装admin-api调用的源码目录在`src/mw/adminApi/`,主要实现了tenant创建,namespace创建,授权. jwt生成接口是不需要连接broker的, 只需要使用Secret-key生成而已.
+ 目前对接的接口如下:
1. 创建tenant, 参数为`tenant, [clusters]`. `adminRoles`与tenant相同, `allowedClusters`默认为`standalone`, 见`tenant_create.js`
2. 创建namespace, 参数为`tenant, namespace`. 见`namespace_create.js`
3. 授权, 参数为`tenant, namespace, role, permissions`. 见`permission_grant.js`.
4. 生成jwt-token, 参数为`subject, secret`. 见`jwt.js`

+ 结合电信物联网应用需求,总结后,认为主要一个接口为创建tenant并同时创建namespace和jwt-token.见`tenant.js`,测试`test_tenant.js`.
+ 在源码根目录下执行`./dockerpush.sh`,生成docker,并推送到docker仓库.方便后续docker部署.

### pytest目录有python测试代码
1. 进入compose目录,执行`docker-compose up`启动服务. 注意启动过程中, 需要等一会儿, pulsar-admin服务器会访问pulsar创建`msgpush`这个tenant. 如果pulsar未启动成功, 则pulsar-admin会一直失败重启,直到成功. 这个部分可以优化, pulsar启动成功后8080访问成功才启动pulsar-admin.
2. 运行 `src/test/test_rpcs.js`创建一个厂商tenant.得到jwt,填入pytest中文件中.这里创建了`5ffd331a2222222222000003`,得到jwt为`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmZkMzMxYTIyMjIyMjIyMjIwMDAwMDMifQ.3kdXuhedpgdFjoFCmfnGhXlvKYfhDN_p0D6CeyCf0Es`. 命令为: `node src/test/test_rpcs.js`
3. 打开一个新终端,`consume-token.py`中token为厂商tenant对应的jwt-token,可以在自己有`consume`权限的namespace消费消息. 命令: `python3 consume-token.py`
4. 打开一个新终端,`produce-token.py`中token可以为超级用户的jwt-token,即写在`standalone.conf`中的用户对应的token.可以往任意`tenant/namespace/topic`发送消息. 命令为: `python3 produce-token.py`
5. 运行produce能在consume中看到消息.
