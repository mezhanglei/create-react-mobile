// 事件类型
export enum IMEvent {
  USER_REG = "user_reg", // 用户注册事件
  CONNECTED = "connected", // 链接时触发的事件名
  MESSAGE = 'message', // 接收消息触发事件名
  DISCONNECTED = "disconnected", // 意外断开事件名
  CLOSE = "close", // 关闭事件名
  ERROR = "error", // 错误事件名
  HEARTBEAT = "heartbeat", // 心跳检测事件
}

export interface WebSocketProxyProps {
  url: string; // 接口地址
  heartBeat?: boolean; // 是否执行心跳检测
}

export enum WebsocketStatus {
  OPEN = 'open',
  CLOSE = 'close'
}

export type SendData = string | ArrayBufferLike | Blob | ArrayBufferView;

// WebSocket 协议本质上是一个基于 TCP 的协议。为了建立一个 WebSocket 连接，客户端浏览器首先要向服务器发起一个 HTTP请求
// 这个请求和通常的 HTTP 请求不同，包含了一些附加头信息，其中附加头信息"Upgrade: WebSocket"表明这是一个申请协议升级的 HTTP请求
// Websocket 使用和 HTTP 相同的 TCP 端口，可以绕过大多数防火墙的限制。默认情况下，Websocket 协议使用 80 端口；如果运行在 TLS 之上时，默认使用 443 端口。
export default class WebSocketProxy {
  url: string;
  heartBeat?: boolean;
  constructor(config: WebSocketProxyProps) {
    this.url = config?.url;
    this.heartBeat = config?.heartBeat;
  }

  lockReconnect: boolean = false // true禁止重连
  status: `${WebsocketStatus}` = WebsocketStatus.OPEN
  handlerMap: Map<string, Set<Function>> = new Map() // 存储事件Map结构
  dataQueue: Set<SendData> = new Set() // 消息队列
  socket?: WebSocket = undefined // webscoket实例
  heartBeatTimer?: Timeout = undefined;
  timeoutCloseTimer?: Timeout = undefined;
  reconnectTimer?: Timeout = undefined;

  // 监听事件
  addEventListener(type: `${IMEvent}`, handler: Function) {
    let handlers = this.handlerMap?.get(type);
    if (!handlers) {
      handlers = new Set();
    }
    handlers?.add(handler);
    this.handlerMap?.set(type, handlers);
  };

  // 移除指定事件函数
  removeEventListener(type: `${IMEvent}`, handler: Function) {
    const handlers = this.handlerMap?.get(type);
    if (handlers?.size) {
      for (const item of handlers) {
        if (item === handler) {
          handlers.delete(item)
          this.handlerMap?.set(type, handlers);
        }
      }
    }
  };

  // 清空消息队列
  clearMsgQueue() {
    if (this.dataQueue?.size > 0) {
      //清空消息队列
      this.dataQueue?.clear();
    }
  };

  // 向服务器发送数据包
  sendMessage(data: SendData) {
    // 如果服务器链接状态则可以发送,如果服务器是断开状态,则将发送数据添加到消息队列
    if (this.socket?.readyState === WebSocket.OPEN) {
      //执行发送消息事件
      this.socket?.send(data);
    } else {
      this.dataQueue.add(data);
    }
  };

  // 触发type类型的所有监听事件
  emitEvent(type: `${IMEvent}`, ...args: unknown[]) {
    const handlers = this.handlerMap?.get(type);
    if (handlers?.size) {
      for (const item of handlers) {
        item?.call(this, ...args)
      }
    }
  };

  // 重新连接的方法
  reconnect() {
    if (this.lockReconnect) return;
    console.log(`意外断开，重连websocket`);
    this.clearReconnect();
    this.lockReconnect = true;
    this.reconnectTimer = window.setTimeout(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.clearReconnect();
      } else {
        this.socket?.close();
        this.connect();
      }
    }, 5000);
  }

  // 清除重新链接的定时器
  clearReconnect() {
    this.reconnectTimer && clearTimeout(this.reconnectTimer);
  }

  // 重置心跳检测
  clearHeartBeat() {
    this.heartBeatTimer && clearTimeout(this.heartBeatTimer);
    this.timeoutCloseTimer && clearTimeout(this.timeoutCloseTimer);
  }

  // 心跳检测
  heartCheck() {
    if (!this.heartBeat) return;
    this.clearHeartBeat();
    const timeout = 5000;
    this.heartBeatTimer = setTimeout(() => {
      this.emitEvent(IMEvent.HEARTBEAT);
      this.timeoutCloseTimer = setTimeout(() => {
        console.log('超时关闭ws');
        this.socket?.close();
      }, timeout)
    }, timeout)
  }

  // 创建websocket实例
  connect() {
    this.socket = new WebSocket(this.url);
    // 接收消息
    this.socket.onmessage = (evt) => {
      let message = evt.data;
      // 根据消息类型触发对应的监听事件
      let data = message && JSON.parse(message);
      this.emitEvent(IMEvent.MESSAGE, data);
      this.lockReconnect = false;
      this.clearReconnect();
      this.heartCheck();
    };

    //打开通讯
    this.socket.onopen = () => {
      //触发链接事件
      this.emitEvent(IMEvent.CONNECTED);
      // 打开事件重置
      this.lockReconnect = false;
      this.clearReconnect();
      this.heartCheck();
      // 如果有消息队列，则连通时就开始发送
      if (this.dataQueue?.size > 0) {
        this.dataQueue?.forEach(msg => {
          this.sendMessage(msg);
          this.dataQueue?.delete(msg);
        })
      }
    };

    // 断开通讯
    this.socket.onclose = (evt) => {
      if (this.status !== IMEvent.CLOSE) {
        // 触发断开事件
        this.emitEvent(IMEvent.DISCONNECTED);
        this.reconnect();
      } else {
        console.log(`websocket主动关闭链接`);
      }
    };

    //通讯出错
    this.socket.onerror = (evt) => {
      console.error(`WebSocket error: `);
      this.emitEvent(IMEvent.ERROR);
      this.reconnect();
    };
  };

  // 主动关闭Websocket
  closeWebsocket() {
    this.status = IMEvent.CLOSE;
    this.clearHeartBeat();
    this.clearReconnect();
    this.clearMsgQueue();
    // 发送给后端关闭事件
    this.emitEvent(IMEvent.CLOSE);
    // 前端关闭websocket链接
    this.socket?.close();
  }
}