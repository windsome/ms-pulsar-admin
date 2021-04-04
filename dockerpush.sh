# bash
set -e

. dockerbuild.sh

# 登录部分移到了dockerlogin.sh中,方便提交到公共代码库,避免暴露用户名密码.
if [ -f dockerlogin.sh ]; then
   . dockerlogin.sh
fi

# 推送到阿里云
URL=registry.cn-shanghai.aliyuncs.com/$TAG
# docker login --username=<用户名> --password=<密码> registry.cn-shanghai.aliyuncs.com
docker tag $TAG $URL
echo '开始推送到阿里云:'$URL
docker push $URL

# 推送到hub.docker.com
echo '开始推送到hub.docker.com:'$TAG
# docker login --username=<用户名> --password=<密码> https://index.docker.io/v1/
docker push $TAG
