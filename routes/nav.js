var express = require("express");
var router = express.Router();
const path = require("path");

// Pagina inicial
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Painel mobile para balcão
router.get("/balcao", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "balcao.html"));
});
// Painel desktop para caixa
router.get("/caixa", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "pedidos.html"));
});

module.exports = router;
