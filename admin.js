import { list } from "@vercel/blob";
export default async function handler(req, res) {
  if (!process.env.ADMIN_PASSWORD || req.headers["x-admin-key"] !== process.env.ADMIN_PASSWORD) return res.status(401).json({ erro: "senha" });
  let cursor, items = [];
  do { const r = await list({ prefix: "resp/", cursor }); items.push(...r.blobs.filter(b => b.pathname.endsWith("dados.json"))); cursor = r.cursor; } while (cursor);
  const data = await Promise.all(items.map(b => fetch(b.url + "?t=" + Date.now()).then(r => r.json())));
  data.sort((a, b) => b.em.localeCompare(a.em));
  res.status(200).json(data);
}
