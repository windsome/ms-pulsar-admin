## pulsar在docker-compose中运行及超级管理API使用.
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
   初次启动此服务器后,需运行如下命令,生成管理员账号,然后访问`pulsar://localhost:6650`,使用刚才创建的账号`admin`登录进行操作.
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
  
  从真实运营环境的需求可以看出有如下需求:
  1. 需要控制访问授权,可以用jwt-token这种最简单方式.
  2. 需要有个超级用户,可以朝所有的namespace/topic发送消息.
  3. 需要能动态创建厂商租户.可以用admin-api完成.
  4. 厂商租户能接收到发送给他的消息.

### 针对真实运营环境,我们做一个准真实环境部署.
