# bash
set -e

# 参数设置
VERSION=`awk -F"\"" '/version/{print $4}' package.json`
NAME=`awk -F"\"" '/\"name\"/{print $4}' package.json`
BRANCH=`awk -F"\"" '/branch/{print $4}' package.json`
if [ -n "$BRANCH" ]; then
  VERSION=${VERSION}-${BRANCH}
fi
TAG=windsome/$NAME:$VERSION

# 编译
yarn run build

# 打包相应版本
echo '开始打包:'$TAG
docker build . -t $TAG
