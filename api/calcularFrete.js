// api/calcularFrete.js
// Rota serverless da Vercel equivalente ao antigo calcularFrete.php

export default async function handler(req, res) {
  // ===== Cabeçalhos CORS =====
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // ===== Preflight (OPTIONS) =====
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ===== Garante que o método é POST =====
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método inválido. Use POST." });
  }

  // ===== Corpo da requisição =====
  // Na Vercel (Node.js runtime), req.body já vem parseado se o
  // Content-Type for application/json.
  const data = req.body;

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({ error: "JSON inválido ou vazio recebido." });
  }

  // ===== Token do Melhor Envio (variável de ambiente na Vercel) =====
  const token = process.env.MELHOR_ENVIO_TOKEN;

  if (!token) {
    return res.status(500).json({
      error: "Token do Melhor Envio não configurado no servidor.",
    });
  }

  const url = "https://www.melhorenvio.com.br/api/v2/me/shipment/calculate";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Aplicação yuri0909mantovani@gmail.com",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const httpCode = response.status;
    const text = await response.text();

    // ===== Se a API retornou vazio =====
    if (!text) {
      return res.status(httpCode).json({
        error: "Resposta vazia da API Melhor Envio",
        status: httpCode,
      });
    }

    // ===== Repassa exatamente o retorno da API =====
    // (assume-se JSON; se não for, devolve como texto bruto)
    try {
      const json = JSON.parse(text);
      return res.status(httpCode).json(json);
    } catch {
      return res.status(httpCode).send(text);
    }
  } catch (error) {
    // ===== Erro de conexão/fetch =====
    return res.status(500).json({ error: error.message });
  }
}
