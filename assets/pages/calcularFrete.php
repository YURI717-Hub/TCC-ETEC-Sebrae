<?php
// ===== Cabeçalhos CORS e JSON =====
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// ===== Preflight (OPTIONS) =====
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ===== Garante que o método é POST =====
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["error" => "Método inválido. Use POST."]);
    http_response_code(405);
    exit();
}

// ===== Lê o JSON enviado =====
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Se JSON vier vazio, evita erro no JS
if (!$data) {
    echo json_encode(["error" => "JSON inválido ou vazio recebido."]);
    http_response_code(400);
    exit();
}

// ===== ENDPOINT DO MELHOR ENVIO =====
$url = "https://www.melhorenvio.com.br/api/v2/me/shipment/calculate";

// ===== Cabeçalhos obrigatórios =====
$headers = [
    "Accept: application/json",
    "Content-Type: application/json",
    "User-Agent: Aplicação yuri0909mantovani@gmail.com",
    "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzU1MjdhNGExODY4ZjRhNzc1MTQxZmQ5ZmEyNTE1NjU3Mzc1Y2Y4NDZjOTQwNzMwYjdlY2IyNTcyYmMzN2JmODUyOTJkMjFjNzg1ODIwYjQiLCJpYXQiOjE3NjE4Njk1NzcuNzUwNjUxLCJuYmYiOjE3NjE4Njk1NzcuNzUwNjUzLCJleHAiOjE3OTM0MDU1NzcuNzM5Mzk4LCJzdWIiOiJhMDJkMGNlNy01NjhmLTQ1MzMtOWNiNy1hOTcwZjAzM2RjZjciLCJzY29wZXMiOlsic2hpcHBpbmctY2FsY3VsYXRlIl19.3YIA7O4UQvu_kXRDi9ZgBFDV-vLFPdQM3P2TI8Gh__Svl8IPlP0AOScD00eNzwDPAyPoGKNVDrSdM2ATKEX4u9EL1CJ3cjlTaBZaj7DYBpo8xuI5PlIoaTTmtHW2NZIe8DcqbVpnJBOFzh7jvxapEDePbYjNbgp6jzAuVMq0Ns7z33Z6MyqrNAs3wc0SV1h11oF10usEP3kcwaU42uISVbkVSK3S-fOr3PO24BS6Q9hia1zT1EVOalgbrLyXuFELJlvjPeBCk1k1Fm6_aZk4PMdAr6tTMVlZ8mjpg0hvTQT80mXYMdPpZhkmABt9ayye2J5lPJZRi8TyY78kKsMIA_5Vbt63Q36JxKnZoTHPeNHagvan8IEfRzwcgG15MN8PmsOY6AtActphRfrF27O5iay5nQdl3c13FL1LwbTlEnY-UVxmOSgZ9G5K9QbIm9jXuWDeo6ZxAqnjL5K2peaRXUhaz0WbBCvnZx-ph3f8XsxIePdia8XsXcVIOdd6coNHhlsgY2f9ZPGI2hYaFKUo7ExuKr5UE5QPhw_L-4cYam7r_ujEgfvkC0gI9zKdCb3nOAWVFD9oTOs9hAfolhvpJlkLJh3lojS953MdajzDnQ3HEgYzKhlY7upEnSwirAchfv8-E8vmgnvLB9vw-ytNX7GvLG9D9RtFpwut6Yv-Sok" // <-- TROQUE POR UM TOKEN VÁLIDO!
];

// ===== Inicializa cURL =====
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_TIMEOUT, 20);

// ===== Executa a request =====
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// ===== ERRO na conexão / CURL =====
if (curl_errno($ch)) {
    echo json_encode(["error" => curl_error($ch)]);
    curl_close($ch);
    exit();
}

// ===== Se a API retornou vazio =====
if (!$response) {
    echo json_encode([
        "error" => "Resposta vazia da API Melhor Envio",
        "status" => $httpCode
    ]);
    curl_close($ch);
    exit();
}

// ===== Retorna exatamente o JSON da API =====
http_response_code($httpCode);
echo $response;

// ===== Debug opcional =====
file_put_contents("debug_input.json", json_encode($data, JSON_PRETTY_PRINT));
file_put_contents("debug_output.json", $response);

curl_close($ch);
?>
