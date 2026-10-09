import { put } from "@vercel/blob";
const safe = n => String(n || "curriculo").replace(/[^\w.]+/g, "_").slice(0, 60);
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const b = req.body || {};
    const id = Date.now() + "-" + Math.random().toString(36).slice(2, 8);
    const up = async (data, name, type) => data ? (await put(`resp/${id}/${name}`, Buffer.from(data, "base64"), { access: "public", contentType: type || "application/octet-stream", addRandomSuffix: false })).url : null;
    const audio = await up(b.audio, "audio." + (b.audioExt || "webm"), b.audioType);
    const cvName = safe(b.cvName);
    const cv = await up(b.cv, cvName, b.cvType);
    const rec = { id, em: new Date().toISOString(), nome: b.nome, idade: b.idade, zap: b.zap, nota: b.nota, respostas: b.respostas, audio, cv, cvName: b.cv ? cvName : null };
    await put(`resp/${id}/dados.json`, JSON.stringify(rec), { access: "public", contentType: "application/json", addRandomSuffix: false });
    res.status(200).json({ ok: true });
  } catch (e) { res.status(500).json({ ok: false }); }
}
