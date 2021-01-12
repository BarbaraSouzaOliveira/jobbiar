class SocketService {
  constructor() {
    this.socketMap = new Map();
    this.tm = {};
    this.timer = {};
    this.waiting = {};
    this.pingTimer = 1000;
  }

  onConnect(socket) {
    socket.on("message", data => {
      data = JSON.parse(data);
      if (data.register) {
        const key = data.identifier;
        if (this.socketMap.get(key)) {
          this.pong(key);
          clearInterval(this.timer[key]);
        }
        this.waiting[key] = false;
        this.socketMap.set(key, socket);
        this.timer[data.identifier] = setInterval(() => { this.ping(socket, key); }, this.pingTimer);


      }
      if (data.pong) {
        this.pong(data.pong);
      }
    });

    socket.on("removeRegister", identifier => {
      this.socketMap.delete(identifier);
    });

  }

  getSocket(identifier) {
    return this.socketMap.get(identifier);
  }

  abrirCatraca(id_sala) {
    let result = "A catraca foi aberta";
    try {
      let socket = this.socketMap.get(1);
      if (!socket) {
        throw "O pclocal está desconectado";
      }
      let data = JSON.stringify({ id_sala });
      socket.send(data);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  ping(socket, key) {
    if (!this.waiting[key]) {
      let data = JSON.stringify({ ping: true });
      socket.send(data);
      this.waiting[key] = true;
      this.tm[key] = setTimeout(() => {
        this.socketMap.delete(1);
        clearInterval(this.timer[key]);

      }, 5000);
    }
  }

  pong(key) {
    clearTimeout(this.tm[key]);
    this.waiting[key] = false;
  }
}

module.exports = new SocketService();
