import { requestGet } from './_request';

/**
 * 从url中获得直播间ID, 即url的最后一段
 * @param {string} roomUrl https://live.bilibili.com/11
 */
const getRoomIdFromRoomUrl = roomUrl => {
  if (!roomUrl) return null;
  let url = roomUrl.split('?')[0];
  let subs = url.split('/');
  let roomId = subs[subs.length - 1];
  roomId = parseInt(roomId);
  return roomId;
};

/**
 * 得到真实直播间id
 * https://api.live.bilibili.com/room/v1/Room/get_info?room_id=11
 * @param {number} roomId 11
 */
const getRealRoomId = roomId => {
  // https://api.live.bilibili.com/room/v1/Room/get_info?room_id=11
  return requestGet(
    'https://api.live.bilibili.com/room/v1/Room/get_info?room_id=' + roomId
  ).then(ret => {
    let realRoomId = ret && ret.data && ret.data.room_id;
    return realRoomId;
  });
};

/**
 * 获取直播流的真实地址
 * https://api.live.bilibili.com/room/v1/Room/playUrl?cid=1612585&platform=h5&otype=json&quality=0
 * @param {number} roomId
 */
const getStreamUrls = roomId => {
  return requestGet(
    'https://api.live.bilibili.com/room/v1/Room/playUrl?platform=h5&otype=json&quality=0&cid=' +
      roomId
  ).then(ret => {
    let durl = ret && ret.data && ret.data.durl;
    return durl;
  });
};

/**
 * 获取直播地址
 * 组合接口.
 * @param {string} roomUrl
 */
export const getBroadcastUrl = async roomUrl => {
  let roomId = getRoomIdFromRoomUrl(roomUrl);
  if (!roomId) return null;
  let realRoomId = await getRealRoomId(roomId);
  if (!realRoomId) return null;
  let realUrls = await getStreamUrls(realRoomId);
  if (!realUrls) return null;
  let streams = [];
  realUrls.map((item, index) => {
    if (item && item.url) {
      streams.push({ ...item, count: 0 });
    }
  });
  if (streams.length === 0) return;
  return streams;
};

export default getBroadcastUrl;
