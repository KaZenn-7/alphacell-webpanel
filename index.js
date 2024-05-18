// Importação dos módulos
const express = require("express");
const fs = require("fs");
const path = require("path");
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
// Instância do express e definição da porta
const app = express();
const port = 80;
// Conecta o websocket
wss.on('connection', function connection(ws) {
  console.log('Cliente conectado');

  ws.on('close', function () {
      console.log('Cliente desconectado');
  });
});


// Middleware para permitir análise do corpo da solicitação JSON
app.use(express.json());
// Servir arquivos estáticos do diretório public
app.use(express.static(path.join(__dirname, "public")));

// Carregar dados do arquivo JSON
// let pagos = [];
// try {
//   pagos = JSON.parse(fs.readFileSync("./database/pagos.json", "utf8"));
// } catch (err) {
//   console.error("Erro ao ler o arquivo pagos.json:", err);
// }


// Pagina inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ROUTERS
//========================================\\
const navRouters = require('./routes/nav');
const apiRouters = require('./routes/api');

//MIDDLEWARES
//========================================\\
app.use('/api', apiRouters);
app.use('/nav', navRouters);
// Middleware para permitir análise do corpo da solicitação JSON
app.use(express.json());

// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
