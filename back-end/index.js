const cors = require("cors");
const app = require("express")();
const server = require("http").createServer(app);
const socketService = require("./services/socketService");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const moment = require("moment-timezone");
require("dotenv").config();

const WebSocket = require("ws");
const wss = new WebSocket.Server({ server });
const portExpress = process.env.PORT_EXPRESS || 3008;

app.use(cors());

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

//Log Format
morgan.token("date", (req, res, tz) => moment().tz(tz).format("YYYY-MM-DD HH:mm:ss Z"));
morgan.format("back-end-format", "\x1b[36m[:date[America/Sao_Paulo]]\x1b[0m [:response-time ms] [:status] :remote-addr :method :url");
app.use(morgan("back-end-format"));

// Recupera todas as rotas
app.use(require("./communications/rest/routes"));

wss.on("connection", (socket) => socketService.onConnect(socket));

server.listen(portExpress, () => {
  console.log("\x1b[33m%s\x1b[0m", "Express server is up and listening on port:", portExpress);
});