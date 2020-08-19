function createApiBackend (url, onMessage) {
  var ws;
  var connect = function () {
    ws = new WebSocket(url);
    ws.onmessage = function (event) {
      onMessage(JSON.parse(event.data));
    };
    ws.onclose = function () {
      // Try to reconnect in 5 seconds
      setTimeout(connect, 5000);
    };
  };
  var connected = false;
  window.addEventListener('beforeunload', function () {
    ws.onclose = null;
    ws.close();
  });
  return {
    read: function (options) {
      if (connected) {
        return;
      }
      connected = true;
      connect();
      options.success();
    },
    send: function (options) {
      ws.send(JSON.stringify(options.data));
      options.success();
    }
  };
}

var dp = new DPlayer({
  container: document.getElementById('player'),
  theme: '#FADFA3',
  live: true,
  lang: 'zh-cn',
  screenshot: true,
  volume: 0.7,
  autoplay: true,
  danmaku: true,
  apiBackend: createApiBackend('wss://dplayer-api.seon.me/live', function (dan) {
    dp.danmaku.draw(dan);
  }),
  video: {
    url: 'https://live.seon.me/play/hls/fuji2020/index.m3u8',
    type: 'hls'
  }
});
