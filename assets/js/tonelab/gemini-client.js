(function () {
  window.PEToneLab = window.PEToneLab || {};
  const api = window.PEToneLab;

  api.askGemini = async function askGemini(editor, prompt, pickup) {
    const keyInput = document.getElementById('tl-api-key');
    const modelInput = document.getElementById('tl-model');

    const key = keyInput ? keyInput.value.trim() : '';
    const model = (modelInput ? modelInput.value.trim() : '') || api.DEFAULT_MODEL;

    if (!key) throw new Error('Cole sua Gemini API Key primeiro.');

    localStorage.setItem('tonelab_gemini_key', key);
    localStorage.setItem('tonelab_gemini_model', model);

    const inventory = api.inventoryForAI(editor);

    const instruction = `
Você é um especialista em timbres de guitarra e na Sonicake Pocket Master.

Objetivo:
Gerar um timbre conhecido ou aproximado a partir da referência do usuário, usando SOMENTE os recursos disponíveis no inventário real do Pocket Edit.

Exemplos:
- "Sweet Child O' Mine" => Slash, Les Paul, humbucker, Marshall-style, ganho médio, médios presentes, delay/reverb leves.
- "Metallica Black Album" => high gain tight, médios controlados, grave firme, gate mais alto.
- "John Mayer Slow Dancing" => clean/crunch leve, single coil, médio doce, reverb leve.
- "David Gilmour solo" => sustain, delay, modulação leve, reverb espacial.

Regras:
- Não invente nomes de efeitos fora do inventário.
- Responda SOMENTE JSON válido.
- Use keywords para ajudar o app a escolher os efeitos mais próximos no inventário.
- O nome deve ter no máximo 10 caracteres.
- Você pode reorganizar a signalChain para chegar melhor ao timbre desejado.
- A signalChain deve conter TODOS estes blocos exatamente uma vez: NR, FX1, DRV, AMP, IR, EQ, FX2, DLY, RVB.
- Nunca remova blocos da signalChain. Para não usar um efeito, deixe o respectivo boolean como false.
- Mantenha AMP e IR juntos sempre que possível.
- Para high gain, prefira DRV antes de AMP, EQ depois de IR ou depois de AMP, DLY/RVB no final.
- Para ambient/clean, FX1/FX2 podem aparecer antes ou depois de AMP conforme a intenção.
- Não ligue todos os módulos por padrão. Ative apenas o necessário para o timbre.
- AMP e IR normalmente ficam ligados. NR só se houver ruído/alto ganho. EQ só se precisar moldar o timbre.

Formato obrigatório:
{
 "name":"até 10 caracteres",
 "style":"explicação curta",
 "gain":0-100,
 "bass":0-100,
 "middle":0-100,
 "treble":0-100,
 "presence":0-100,
 "gate":0-100,
 "delayMix":0-100,
 "delayTime":1-1000,
 "feedback":0-100,
 "reverbMix":0-100,
 "reverbDecay":0-100,
 "nrOn":true,
 "drvOn":true,
 "fx1On":false,
 "eqOn":false,
 "fx2On":false,
 "dlyOn":false,
 "rvbOn":true,
 "ampKeys":["palavras para escolher amp"],
 "drvKeys":["palavras para escolher drive"],
 "fx1Keys":["palavras para escolher fx1"],
 "fx2Keys":["palavras para escolher fx2"],
 "dlyKeys":["palavras para escolher delay"],
 "rvbKeys":["palavras para escolher reverb"],
 "irKeys":["palavras para escolher ir/cab"],
 "signalChain":["NR","FX1","DRV","AMP","IR","EQ","FX2","DLY","RVB"]
}

Inventário real:
${JSON.stringify(inventory)}
`;

    const body = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${instruction}\n\nCaptação: ${pickup}\nReferência do usuário: ${prompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.35,
        responseMimeType: 'application/json',
      },
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Erro Gemini API: ${response.status}\n${text}`);
    }

    const data = await response.json();
    const text =
      data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || '';

    return api.extractJson(text);
  };
})();
