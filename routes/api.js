var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");

// Função para enviar atualizações para os clientes conectados
function enviarAtualizacao() {
  wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
          client.send('Novo pedido recebido!');
      }
  });
}

// Rota para dar GET nos pedidos
router.get("/pedidos", (req, res) => {
  let pedidos = [];
  try {
    pedidos = JSON.parse(fs.readFileSync(path.join(__dirname, "../database/pedidos.json"), "utf8"));
  } catch (err) {
    console.error("Erro ao ler o arquivo pedidos.json:", err);
  }
  res.status(200).json(pedidos);
});

// Rota para criar um novo pedido
router.post("/newPedido", (req, res) => {
  let pedidos = [];
  try {
    pedidos = JSON.parse(fs.readFileSync(path.join(__dirname, "../database/pedidos.json"), "utf8"));
  } catch (err) {
    console.error("Erro ao ler o arquivo pedidos.json:", err);
  }
  let { name, valor } = req.body;
  // name = name.charAt(0).toUpperCase() + name.slice(1);

  // Verifique se o cliente está na fila
  if (pedidos.map((i) => i.name).includes(name)) {
    console.log("Ja existe um cliente com este nome na fila.");
    return res
      .status(400)
      .json({ error: "Já existe um cliente com este nome na fila." });
  }

  let obj = { name: name, valor: valor };
  pedidos.push(obj);

  // Salve as alterações no arquivo premium.json
  fs.writeFileSync(path.join(__dirname, "../database/pedidos.json"), JSON.stringify(pedidos, null, 2));

  // Responda com uma mensagem de sucesso
  res
    .status(200)
    .json({ message: `${name} foi adicionado à fila de pagamento.` });

  enviarAtualizacao();
});

// Rota para deletar um pedido
router.post("/delPedido", (req, res) => {
  let { name } = req.body;
  // name = name.charAt(0).toUpperCase() + name.slice(1);

  let pedidos = [];
  try {
    pedidos = JSON.parse(fs.readFileSync(path.join(__dirname, "../database/pedidos.json"), "utf8"));
  } catch (err) {
    console.error("Erro ao ler o arquivo pedidos.json:", err);
  }

  // Verifique se o cliente está na fila
  let index = pedidos.map((i) => i.name).indexOf(name);
  if (index === -1) {
    console.log("Não existe um cliente com este nome na fila.");
    return res
      .status(400)
      .json({ error: "Não existe um cliente com este nome na fila." });
  }

  // Remova o usuário da lista premium
  pedidos.splice(index, 1);

  // Salve as alterações no arquivo premium.json
  fs.writeFileSync(path.join(__dirname, "../database/pedidos.json"), JSON.stringify(pedidos, null, 2));

  // Responda com uma mensagem de sucesso
  res.status(200).json({ message: `${name} foi removido da fila!` });

  enviarAtualizacao();
});

module.exports = router;