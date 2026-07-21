(function () {
  window.PEToneLab = window.PEToneLab || {};
  const api = window.PEToneLab;

  api.DEFAULT_PROVIDER = 'openrouter';

  api.PROVIDERS = {
    gemini: {
      label: 'Gemini API',
      defaultModel: 'gemini-2.5-flash',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta',
      keyLabel: 'Gemini API Key',
      modelPlaceholder: 'gemini-2.5-flash',
      endpointEditable: false,
      type: 'gemini',
      webSearch: 'gemini-google-search',
    },
    openai: {
      label: 'OpenAI / ChatGPT',
      defaultModel: 'gpt-4.1-mini',
      endpoint: 'https://api.openai.com/v1',
      keyLabel: 'OpenAI API Key',
      modelPlaceholder: 'gpt-4.1-mini',
      endpointEditable: false,
      type: 'openai-compatible',
      webSearch: 'openai-responses',
    },
    openrouter: {
      label: 'OpenRouter',
      defaultModel: 'deepseek/deepseek-r1:free',
      endpoint: 'https://openrouter.ai/api/v1',
      keyLabel: 'OpenRouter API Key',
      modelPlaceholder: 'deepseek/deepseek-r1:free',
      endpointEditable: false,
      type: 'openai-compatible',
      webSearch: 'openrouter-plugin',
      extraHeaders: {
        'HTTP-Referer': window.location.origin || 'https://github.com',
        'X-Title': 'Pocket Edit ToneLab AI',
      },
    },
    groq: {
      label: 'Groq',
      defaultModel: 'llama-3.3-70b-versatile',
      endpoint: 'https://api.groq.com/openai/v1',
      keyLabel: 'Groq API Key',
      modelPlaceholder: 'llama-3.3-70b-versatile',
      endpointEditable: false,
      type: 'openai-compatible',
      webSearch: 'groq-compound',
    },
    custom: {
      label: 'OpenAI Compatible / Local',
      defaultModel: 'gpt-4.1-mini',
      endpoint: 'http://localhost:11434/v1',
      keyLabel: 'API Key, opcional em local',
      modelPlaceholder: 'llama3.1 / qwen3 / gpt-4.1-mini',
      endpointEditable: true,
      type: 'openai-compatible',
      webSearch: 'generic-instruction',
    },
  };

  api.getProviderConfig = function getProviderConfig(providerId) {
    return api.PROVIDERS[providerId] || api.PROVIDERS[api.DEFAULT_PROVIDER];
  };

  api.getSavedProvider = function getSavedProvider() {
    return localStorage.getItem('tonelab_ai_provider') || api.DEFAULT_PROVIDER;
  };

  api.getProviderStoragePrefix = function getProviderStoragePrefix(providerId) {
    return `tonelab_${providerId}`;
  };

  api.saveProviderSettings = function saveProviderSettings(providerId, values) {
    const prefix = api.getProviderStoragePrefix(providerId);
    localStorage.setItem('tonelab_ai_provider', providerId);
    if ('apiKey' in values) localStorage.setItem(`${prefix}_key`, values.apiKey || '');
    if ('model' in values) localStorage.setItem(`${prefix}_model`, values.model || '');
    if ('endpoint' in values) localStorage.setItem(`${prefix}_endpoint`, values.endpoint || '');
  };

  api.loadProviderSettings = function loadProviderSettings(providerId) {
    const config = api.getProviderConfig(providerId);
    const prefix = api.getProviderStoragePrefix(providerId);
    return {
      providerId,
      apiKey: localStorage.getItem(`${prefix}_key`) || '',
      model: localStorage.getItem(`${prefix}_model`) || config.defaultModel,
      endpoint: localStorage.getItem(`${prefix}_endpoint`) || config.endpoint,
    };
  };

  api.buildToneSystemPrompt = function buildToneSystemPrompt(editor, options) {
    const inventory = api.inventoryForAI(editor);
    const manualKnowledge = typeof api.manualKnowledgeForPrompt === 'function'
      ? api.manualKnowledgeForPrompt()
      : '{}';

    return `
Você é um especialista em timbres de guitarra e na Sonicake Pocket Master.

Objetivo:
Gerar UM ÚNICO preset-base aplicável para a Pocket Master a partir da referência do usuário.
O fluxo obrigatório é:
1. Solicitação do usuário.
2. Pesquisa ou inferência do rig provável: artista, música, álbum, guitarra, captadores, amp, cab, pedais, delay, reverb e modulações.
3. Tradução para os recursos reais da Pocket Master usando o inventário e o manual abaixo.
4. Escolha dos algoritmos corretos: AMP, IR/Cab, DRV, FX1, FX2, EQ, DLY, RVB e NR.
5. Definição de uma signal chain com todos os blocos visíveis.
6. Criação de recomendações de parâmetros para o usuário ajustar manualmente.

Regras de aplicação no app:
- O app vai aplicar apenas a escolha dos algoritmos e a cadeia de sinal.
- O app NÃO deve aplicar parâmetros extremos ou regulagens finas da IA.
- Todos os parâmetros aplicados devem ficar em valores default/flat do próprio Pocket Edit.
- O relatório deve informar os parâmetros recomendados separadamente, para ajuste manual.

Regras críticas:
- Responda SOMENTE JSON válido, sem markdown.
- Não invente nomes de efeitos fora do inventário real.
- Não invente fontes. O campo sources deve ser [] sempre. O app só mostra fontes se a API retornar URLs/citações reais pela ferramenta de busca.
- Retorne apenas UM preset, o de maior aproximação/confiança. NÃO retorne 3 opções.
- A signalChain deve conter TODOS estes blocos exatamente uma vez: NR, FX1, DRV, AMP, IR, EQ, FX2, DLY, RVB.
- Nunca remova blocos da signalChain. Para não usar um efeito, deixe o módulo desligado.
- DRV, AMP, IR e EQ formam um bloco fixo nessa ordem. Não coloque outro módulo entre eles.
- NR, FX1, FX2, DLY e RVB podem ser posicionados antes ou depois do bloco fixo conforme fizer sentido.
- Ao aplicar, AMP e IR devem ficar ligados. Todos os outros módulos devem ficar desligados por padrão, mesmo que você selecione algoritmos para eles.
- EQ pode ser recomendado no relatório, mas aplicado desligado por padrão. O usuário liga manualmente se quiser.
- DRV/DLY/RVB/FX1/FX2/NR devem ser selecionados quando fizerem sentido, mas aplicados desligados por padrão. O usuário liga manualmente.
- Chorus/modulações devem ser sugeridos com extrema cautela. Chorus quase sempre deve ser sutil: rate baixo, depth baixo, mix baixo. Nunca sugira chorus com sensação de detune pesado a menos que a referência peça explicitamente.
- Delay e reverb devem ter sugestões conservadoras. Mix alto costuma estragar o timbre.
- Tube Screamer/Scream usado como boost geralmente deve ter Gain baixo, Level/VOL alto e Tone moderado.
- NAM: se um NAM de amp ajudaria mais do que os amps internos, sugira termos para buscar no TONE3000. Como a Pocket Master não aceita NAM de amp+IR juntos, sugira apenas NAM de AMP e mantenha IR/Cab separado. Não peça lista de NAMs do usuário.

Exemplos de tradução:
- Sweet Child O' Mine / Slash => Les Paul humbucker, Marshall/JCM800-style, 4x12 Greenback, drive/boost leve opcional, delay/reverb discretos. Pocket Master provável: Brit 800 ou Brit 45/Brit50 JP, BritGN 4x12, Scream/Boost preparado desligado.
- Metallica Black Album => Mesa/Boogie-style high gain, cab 4x12, gate/boost preparados, delay quase off, reverb curto. Pocket Master provável: CalifDualM/CalifDualV, Dual 4x12, Scream preparado desligado.
- John Mayer Slow Dancing => Strat/single coil, Fender/Two-Rock-like clean edge, spring/room reverb, Tube Screamer leve opcional. Pocket Master provável: Dark Twin/TWD Deluxe/B-Man, Double 2x12/Viblux, Scream preparado desligado.
- David Gilmour solo => clean amp platform, fuzz/drive sustain, delay, modulação leve, reverb espacial. Pocket Master provável: Dark Twin/Brit, Grey Fuzz/Scream preparado, Pure/Warm/Mag delay preparado.

Formato obrigatório:
{
 "name":"até 10 caracteres",
 "style":"explicação curta do timbre",
 "referenceRig":"rig provável em linguagem humana; se não houver browsing, diga que foi inferred from model knowledge",
 "researchSummary":"resumo do que foi pesquisado ou inferido sobre artista/música/equipamento",
 "confidence":0-100,
 "ampKeys":["palavras para escolher amp"],
 "irKeys":["palavras para escolher ir/cab"],
 "drvKeys":["palavras para escolher drive"],
 "fx1Keys":["palavras para escolher fx1"],
 "fx2Keys":["palavras para escolher fx2"],
 "dlyKeys":["palavras para escolher delay"],
 "rvbKeys":["palavras para escolher reverb"],
 "signalChain":["NR","FX1","DRV","AMP","IR","EQ","FX2","DLY","RVB"],
 "rigTranslation":[{"source":"equipamento real inferido/pesquisado","target":"equivalente Pocket Master","reason":"por que é o melhor equivalente"}],
 "moduleReasons":{
   "NR":"por que selecionar este gate ou deixar sem uso",
   "FX1":"por que selecionar este FX1 ou deixar sem uso",
   "DRV":"por que selecionar este drive ou deixar sem uso",
   "AMP":"por que escolheu este amp",
   "IR":"por que escolheu este cabinet/IR",
   "EQ":"por que preparar EQ ou deixar flat",
   "FX2":"por que selecionar este FX2 ou deixar sem uso",
   "DLY":"por que selecionar este delay ou deixar sem uso",
   "RVB":"por que selecionar este reverb ou deixar sem uso"
 },
 "manualParameterSuggestions":{
   "AMP":{"Gain":"valor sugerido e motivo","Bass":"valor sugerido e motivo","Middle":"valor sugerido e motivo","Treble":"valor sugerido e motivo","PRES/Presence":"valor sugerido e motivo","Bright":"on/off ou valor e motivo","VOL":"valor seguro"},
   "IR":{"VOL":"valor seguro"},
   "DRV":{"Gain":"sugestão manual","Tone/Filter":"sugestão manual","VOL/Level":"sugestão manual"},
   "EQ":{"bandas":"sugestões manuais se necessário"},
   "FX1":{"parâmetros":"sugestão manual, sempre sutil se modulação/chorus"},
   "FX2":{"parâmetros":"sugestão manual, sempre sutil se modulação/chorus"},
   "DLY":{"Mix":"sugestão manual","Time":"sugestão manual","F.Back":"sugestão manual"},
   "RVB":{"Mix":"sugestão manual","Decay":"sugestão manual","Damp":"sugestão manual"},
   "NR":{"THRE":"sugestão manual se high gain"}
 },
 "namSuggestions":[{"query":"termo para buscar no TONE3000","reason":"por que este NAM de amp aproximaria mais","note":"use NAM apenas para AMP/Clone e mantenha IR separado"}],
 "limitations":["aproximações ou recursos que a Pocket Master não possui"],
 "sources":[]
}

Inventário real do Pocket Edit:
${JSON.stringify(inventory)}

Base resumida do manual Pocket Master V1.3.0:
${manualKnowledge}
`;
  };

  api.OPENROUTER_FREE_MODEL_FALLBACKS = [
    { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1 (Free)' },
    { id: 'deepseek/deepseek-chat-v3-0324:free', name: 'DeepSeek Chat V3 0324 (Free)' },
    { id: 'qwen/qwen3-235b-a22b:free', name: 'Qwen 3 235B A22B (Free)' },
    { id: 'qwen/qwen-2.5-coder-32b-instruct:free', name: 'Qwen 2.5 Coder 32B (Free)' },
    { id: 'mistralai/mistral-small-3.1-24b-instruct:free', name: 'Mistral Small 3.1 24B (Free)' },
    { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B Instruct (Free)' },
  ];

  api.isFreeOpenRouterModel = function isFreeOpenRouterModel(model) {
    if (!model || !model.id) return false;
    if (String(model.id).endsWith(':free')) return true;

    const pricing = model.pricing || {};
    const prompt = Number(pricing.prompt || pricing.input || 0);
    const completion = Number(pricing.completion || pricing.output || 0);
    return prompt === 0 && completion === 0;
  };

  api.getOpenRouterModelLabel = function getOpenRouterModelLabel(model) {
    const id = model.id || '';
    const name = model.name || id;
    return `${name}${id.endsWith(':free') ? ' — Free' : ''}`;
  };

  api.fetchOpenRouterFreeModels = async function fetchOpenRouterFreeModels(force) {
    const cacheKey = 'tonelab_openrouter_free_models_cache_v1';
    const cacheTimeKey = 'tonelab_openrouter_free_models_cache_time_v1';
    const now = Date.now();

    if (!force) {
      try {
        const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
        const cachedAt = Number(localStorage.getItem(cacheTimeKey) || 0);
        if (Array.isArray(cached) && cached.length && now - cachedAt < 24 * 60 * 60 * 1000) {
          return cached;
        }
      } catch (error) {}
    }

    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          'HTTP-Referer': window.location.origin || 'https://github.com',
          'X-Title': 'Pocket Edit ToneLab AI',
        },
      });

      if (!response.ok) throw new Error(`OpenRouter models HTTP ${response.status}`);

      const payload = await response.json();
      const list = Array.isArray(payload.data) ? payload.data : [];

      const free = list
        .filter(api.isFreeOpenRouterModel)
        .map((model) => ({
          id: model.id,
          name: api.getOpenRouterModelLabel(model),
          context_length: model.context_length || model.contextLength || 0,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      if (!free.length) throw new Error('Nenhum modelo gratuito encontrado no OpenRouter.');

      localStorage.setItem(cacheKey, JSON.stringify(free));
      localStorage.setItem(cacheTimeKey, String(now));
      return free;
    } catch (error) {
      console.warn('[ToneLab AI] OpenRouter model list fallback:', error);
      return api.OPENROUTER_FREE_MODEL_FALLBACKS;
    }
  };

  api.getSelectedModelFromUI = function getSelectedModelFromUI(config) {
    const select = document.getElementById('tl-model-select');
    const input = document.getElementById('tl-model');

    if (select && select.offsetParent !== null && select.value) return select.value.trim();
    if (input && input.value.trim()) return input.value.trim();
    return config.defaultModel;
  };


  api.getWebResearchEnabled = function getWebResearchEnabled() {
    return localStorage.getItem('tonelab_web_research') === '1';
  };

  api.providerSupportsNativeSearch = function providerSupportsNativeSearch(providerId) {
    const config = api.getProviderConfig(providerId);
    return ['gemini-google-search', 'openai-responses', 'openrouter-plugin', 'groq-compound'].includes(config.webSearch);
  };

  api.getSearchModeLabel = function getSearchModeLabel(providerId) {
    const config = api.getProviderConfig(providerId);
    if (config.webSearch === 'gemini-google-search') return 'Gemini Google Search grounding';
    if (config.webSearch === 'openai-responses') return 'OpenAI Responses web search';
    if (config.webSearch === 'openrouter-plugin') return 'OpenRouter web plugin';
    if (config.webSearch === 'groq-compound') return 'Groq Compound web search';
    return 'instrução de pesquisa se o endpoint suportar';
  };

  api.buildUserTonePrompt = function buildUserTonePrompt(userPrompt, webResearch) {
    const researchInstruction = webResearch
      ? 'Pesquisa web solicitada: use a ferramenta real de busca do provedor, quando disponível, para inferir a referência musical, rig de guitarra, amplificadores, caixas, pedais e efeitos antes de gerar o JSON. Não escreva fontes manualmente no JSON: deixe sources como []. O app só mostrará fontes que vierem como citações/URLs reais retornadas pela API.'
      : 'Pesquisa web não solicitada: use conhecimento musical treinado, seja conservador e indique em referenceRig que foi inferido.';

    const audio = api.audioReferencePrompt ? api.audioReferencePrompt() : "";
    const nam = api.namPrompt ? api.namPrompt() : "";
    return `${researchInstruction}\n\nReferência do usuário: ${userPrompt}${audio}${nam}`;
  };


  api.extractProviderCitations = function extractProviderCitations(payload) {
    const results = [];
    const seen = new Set();

    function addSource(title, url) {
      if (!url || typeof url !== 'string') return;
      const trimmed = url.trim();
      if (!/^https?:\/\//i.test(trimmed)) return;
      if (seen.has(trimmed)) return;
      seen.add(trimmed);
      results.push({ title: title || new URL(trimmed).hostname, url: trimmed });
    }

    function walk(value) {
      if (!value || results.length >= 12) return;
      if (Array.isArray(value)) {
        value.forEach(walk);
        return;
      }
      if (typeof value !== 'object') return;

      // Gemini grounding chunks usually appear as { web: { uri, title } }
      if (value.web && typeof value.web === 'object') {
        addSource(value.web.title, value.web.uri || value.web.url);
      }

      // OpenAI / OpenRouter / generic annotations may use url_citation/url/uri.
      if (value.url_citation && typeof value.url_citation === 'object') {
        addSource(value.url_citation.title, value.url_citation.url);
      }
      addSource(value.title || value.name || value.hostname, value.url || value.uri || value.link);

      Object.keys(value).forEach((key) => walk(value[key]));
    }

    walk(payload);
    return results;
  };

  api.attachVerifiedSearchMetadata = function attachVerifiedSearchMetadata(profile, payload, webResearch, providerLabel) {
    if (!profile || typeof profile !== 'object') return profile;

    const verifiedSources = webResearch ? api.extractProviderCitations(payload) : [];
    profile.sources = verifiedSources;

    if (webResearch && verifiedSources.length) {
      profile.searchVerified = true;
      profile.researchSummary = [
        profile.researchSummary || '',
        `Pesquisa web verificada via ${providerLabel || 'provedor selecionado'} com ${verifiedSources.length} fonte(s) retornada(s) pela API.`
      ].filter(Boolean).join('\n');
    } else if (webResearch) {
      profile.searchVerified = false;
      profile.sources = [];
      profile.researchSummary = [
        'A API não retornou citações/URLs verificáveis para esta geração. O relatório abaixo foi tratado como inferência do modelo + base interna da Pocket Master, não como pesquisa confirmada.',
        profile.researchSummary || profile.referenceRig || ''
      ].filter(Boolean).join('\n');
      profile.referenceRig = [profile.referenceRig || '', 'Sem fontes verificáveis retornadas pela API.'].filter(Boolean).join(' | ');
    } else {
      profile.searchVerified = false;
      profile.sources = [];
    }

    return profile;
  };

  api.askAI = async function askAI(editor, userPrompt) {
    const providerId = document.getElementById('tl-provider')?.value || api.getSavedProvider();
    const config = api.getProviderConfig(providerId);
    const keyInput = document.getElementById('tl-api-key');
    const endpointInput = document.getElementById('tl-endpoint');

    const apiKey = keyInput ? keyInput.value.trim() : '';
    const model = api.getSelectedModelFromUI(config);
    const endpoint = (endpointInput ? endpointInput.value.trim() : '') || config.endpoint;
    const webResearch = api.getWebResearchEnabled();

    api.saveProviderSettings(providerId, { apiKey, model, endpoint });

    if (!apiKey && providerId !== 'custom') {
      throw new Error(`Cole sua ${config.keyLabel} primeiro.`);
    }

    if (config.type === 'gemini') {
      return api.askGeminiProvider(editor, userPrompt, { apiKey, model, endpoint, webResearch });
    }

    if (providerId === 'openai' && webResearch) {
      return api.askOpenAIResponsesProvider(editor, userPrompt, { apiKey, model, endpoint, webResearch });
    }

    return api.askOpenAICompatibleProvider(editor, userPrompt, {
      apiKey,
      model,
      endpoint,
      extraHeaders: config.extraHeaders || {},
      providerId,
      webResearch,
    });
  };

  api.askGeminiProvider = async function askGeminiProvider(editor, userPrompt, options) {
    const instruction = api.buildToneSystemPrompt(editor);
    const promptText = `${instruction}\n\n${api.buildUserTonePrompt(userPrompt, options.webResearch)}`;

    const buildBody = (withSearch) => {
      const body = {
        contents: [
          {
            role: 'user',
            parts: [{ text: promptText }],
          },
        ],
        generationConfig: {
          temperature: 0.35,
          responseMimeType: 'application/json',
        },
      };

      if (withSearch) {
        body.tools = [{ google_search: {} }];
      }

      return body;
    };

    const base = String(options.endpoint || api.PROVIDERS.gemini.endpoint).replace(/\/$/, '');
    const url = `${base}/models/${encodeURIComponent(options.model)}:generateContent?key=${encodeURIComponent(options.apiKey)}`;

    async function request(withSearch) {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildBody(withSearch)),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Erro Gemini API: ${response.status}\n${text}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || '';
      const profile = api.extractJson(text);
      return api.attachVerifiedSearchMetadata(profile, data, withSearch, 'Gemini Google Search grounding');
    }

    if (options.webResearch) {
      try {
        return await request(true);
      } catch (error) {
        console.warn('[ToneLab AI] Gemini search failed, retrying without search:', error);
        const profile = await request(false);
        profile.referenceRig = `${profile.referenceRig || ''} | Google Search grounding failed; generated without live search.`;
        return profile;
      }
    }

    return request(false);
  };

  api.askOpenAIResponsesProvider = async function askOpenAIResponsesProvider(editor, userPrompt, options) {
    const systemPrompt = api.buildToneSystemPrompt(editor);
    const base = String(options.endpoint || api.PROVIDERS.openai.endpoint).replace(/\/$/, '');
    const url = `${base}/responses`;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${options.apiKey}`,
    };

    const body = {
      model: options.model,
      input: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: api.buildUserTonePrompt(userPrompt, true) },
      ],
      tools: [{ type: 'web_search_preview' }],
      temperature: 0.35,
      text: { format: { type: 'json_object' } },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Erro OpenAI Responses API ${response.status}\n${text}`);
    }

    const data = await response.json();
    let text = data.output_text || '';

    if (!text && Array.isArray(data.output)) {
      text = data.output
        .flatMap((item) => item.content || [])
        .map((content) => content.text || content.output_text || '')
        .join('');
    }

    const profile = api.extractJson(text);
    return api.attachVerifiedSearchMetadata(profile, data, true, 'OpenAI Responses web search');
  };

  api.askOpenAICompatibleProvider = async function askOpenAICompatibleProvider(editor, userPrompt, options) {
    const systemPrompt = api.buildToneSystemPrompt(editor);
    const base = String(options.endpoint || '').replace(/\/$/, '');
    const url = `${base}/chat/completions`;

    const headers = Object.assign(
      {
        'Content-Type': 'application/json',
      },
      options.extraHeaders || {}
    );

    if (options.apiKey) headers.Authorization = `Bearer ${options.apiKey}`;

    const body = {
      model: options.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: api.buildUserTonePrompt(userPrompt, !!options.webResearch) },
      ],
      temperature: 0.35,
      response_format: { type: 'json_object' },
    };

    if (options.webResearch && options.providerId === 'openrouter') {
      body.plugins = [
        {
          id: 'web',
          max_results: 6,
          search_prompt:
            'Search the web for the guitarist/song/album guitar rig, amplifier, cabinet, pickups, pedals, delay/reverb/modulation and known tone settings. Use results only to infer the rig, then return the required JSON.',
        },
      ];
    }

    if (options.webResearch && options.providerId === 'groq') {
      // Groq web search is available through Compound systems. If the selected model is not compound,
      // use compound-beta-mini for the research generation while preserving the same output contract.
      const selected = String(options.model || '').toLowerCase();
      if (!selected.includes('compound')) {
        body.model = 'compound-beta-mini';
      }
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Erro API ${response.status}\n${text}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    const profile = api.extractJson(text);
    const label = options.providerId === 'openrouter' ? 'OpenRouter web plugin' : (options.providerId === 'groq' ? 'Groq Compound web search' : 'OpenAI-compatible endpoint');
    return api.attachVerifiedSearchMetadata(profile, data, !!options.webResearch, label);
  };
})();
