const PI_BASE = "https://api.minepi.com/v2";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  const { paymentId, txid } = JSON.parse(event.body || "{}");
  if (!paymentId || !txid) return { statusCode: 400, body: "Missing paymentId or txid" };

  const key = process.env.PI_API_KEY;
  if (!key) return { statusCode: 500, body: "Server not configured (PI_API_KEY missing)" };

  const r = await fetch(`${PI_BASE}/payments/${paymentId}/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Key ${key}` },
    body: JSON.stringify({ txid })
  });
  const text = await r.text();
  return { statusCode: r.status, body: text, headers: { "content-type": "application/json" } };
};
