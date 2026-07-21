(function () {
  if (window.__TONELAB_PRESET_UI_V11__) return;
  window.__TONELAB_PRESET_UI_V11__ = true;

  const api = window.PEToneLab || {};
  let currentSuggestion = null;
  let lastReportText = '';

  function $(id) { return document.getElementById(id); }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function setProgress(percent, text) {
    const bar = $('tl-progress-bar');
    const label = $('tl-progress-text');
    if (bar) bar.style.width = `${Math.max(0, Math.min(100, percent))}%`;
    if (label) label.textContent = text || '';
  }

  function waitRack() {
    const rack = document.getElementById('darkstar-stomp-rack');
    if (!rack) return setTimeout(waitRack, 500);
    inject(rack);
  }

  function inject(rack) {
    document.getElementById('tonelab-ai')?.remove();

    const box = document.createElement('div');
    box.id = 'tonelab-ai';
    box.innerHTML = `
      <div class="tl-top">
        <div>
          <div class="tl-title">✦ ToneLab AI — Clean Preset Starter</div>
          <div class="tl-small">Solicitação → rig → tradução Pocket Master → preset flat com AMP + IR ligados.</div>
        </div>
        <button class="tl-btn" id="tl-toggle">Abrir IA</button>
      </div>

      <div class="tl-body">
        <div class="tl-grid">
          <select id="tl-provider" class="tl-select">
            <option value="gemini">Gemini API</option>
            <option value="openai">OpenAI / ChatGPT</option>
            <option value="openrouter">OpenRouter</option>
            <option value="groq">Groq</option>
            <option value="custom">OpenAI Compatible / Local</option>
          </select>
          <input id="tl-api-key" class="tl-input tl-single" type="password" placeholder="API Key">
        </div>

        <div class="tl-grid">
          <select id="tl-model-select" class="tl-select tl-hidden"></select>
          <input id="tl-model" class="tl-input tl-single" placeholder="Modelo">
          <input id="tl-endpoint" class="tl-input tl-single" placeholder="Endpoint">
          <button class="tl-btn tl-hidden" id="tl-refresh-models" type="button">Atualizar modelos grátis</button>
        </div>

        <div class="tl-grid">
          <select id="tl-guitar-type" class="tl-select">
            <option value="unspecified">Tipo de guitarra: não especificado</option>
            <option value="single-coil-strat">Strat / Single coil</option>
            <option value="tele-single-coil">Tele / Single coil</option>
            <option value="humbucker-les-paul">Les Paul / Humbucker</option>
            <option value="superstrat-humbucker">Superstrat / Humbucker</option>
            <option value="active-pickups">Captadores ativos</option>
            <option value="p90">P90</option>
            <option value="bass">Baixo</option>
          </select>
        </div>

        <textarea id="tl-prompt" class="tl-input" placeholder="Ex: Sweet Child O' Mine, Slash, solo principal, som quente, médio forte, delay/reverb leves."></textarea>

        <label class="tl-checkline" title="Usa a ferramenta de pesquisa nativa do provedor selecionado quando existir. Se não houver citações reais, o relatório avisará que foi inferência.">
          <input id="tl-web-research" type="checkbox">
          <span id="tl-web-research-label">Pesquisar rig na web se a API suportar</span>
        </label>

        <div class="tl-actions">
          <button class="tl-btn" id="tl-save-key">Salvar API</button>
          <button class="tl-btn" id="tl-generate">Gerar preset-base</button>
          <button class="tl-btn" id="tl-apply">Aplicar preset-base</button>
          <button class="tl-btn" id="tl-copy-report">Copiar relatório</button>
        </div>

        <div class="tl-progress-wrap"><div id="tl-progress-bar"></div></div>
        <div id="tl-progress-text" class="tl-small">Aguardando...</div>
        <div id="tl-report" class="tl-report tl-hidden"></div>
        <div id="tl-output" class="tl-output">Escolha a API, cole a chave, informe o tipo de guitarra se quiser, descreva o timbre e clique em gerar. O preset aplicado vem flat: somente AMP + IR ligados.</div>
      </div>
    `;

    rack.insertBefore(box, rack.firstChild);

    $('tl-provider').value = api.getSavedProvider ? api.getSavedProvider() : 'gemini';
    setupProviderFields();

    $('tl-provider').onchange = setupProviderFields;
    $('tl-refresh-models').onclick = () => loadOpenRouterModels(true);
    $('tl-toggle').onclick = () => box.classList.toggle('open');
    $('tl-save-key').onclick = saveKey;
    $('tl-generate').onclick = generateBasePreset;
    $('tl-apply').onclick = applyBasePreset;
    $('tl-copy-report').onclick = copyReport;

    $('tl-guitar-type').value = localStorage.getItem('tonelab_guitar_type') || 'unspecified';
  }

  async function setupProviderFields() {
    const providerId = $('tl-provider').value || (api.getSavedProvider ? api.getSavedProvider() : 'gemini');
    const config = api.getProviderConfig ? api.getProviderConfig(providerId) : {};
    const saved = api.loadProviderSettings ? api.loadProviderSettings(providerId) : {};

    $('tl-api-key').value = saved.apiKey || '';
    $('tl-api-key').placeholder = config.keyLabel || 'API Key';
    $('tl-endpoint').value = saved.endpoint || config.endpoint || '';
    $('tl-endpoint').disabled = !config.endpointEditable;

    const webResearch = $('tl-web-research');
    if (webResearch) {
      webResearch.checked = localStorage.getItem('tonelab_web_research') === '1';
      const label = $('tl-web-research-label');
      const searchMode = api.getSearchModeLabel ? api.getSearchModeLabel(providerId) : 'se suportado';
      if (label) label.textContent = `Pesquisar rig na web via ${searchMode}`;
      webResearch.onchange = () => localStorage.setItem('tonelab_web_research', webResearch.checked ? '1' : '0');
    }

    if (providerId === 'openrouter') {
      $('tl-model').classList.add('tl-hidden');
      $('tl-model-select').classList.remove('tl-hidden');
      $('tl-refresh-models').classList.remove('tl-hidden');
      await loadOpenRouterModels(false, saved.model || config.defaultModel);
    } else {
      $('tl-model-select').classList.add('tl-hidden');
      $('tl-refresh-models').classList.add('tl-hidden');
      $('tl-model').classList.remove('tl-hidden');
      $('tl-model').value = saved.model || config.defaultModel || '';
      $('tl-model').placeholder = config.modelPlaceholder || config.defaultModel || 'modelo';
    }
  }

  async function loadOpenRouterModels(force, preferredModel) {
    const modelSelect = $('tl-model-select');
    if (!modelSelect || !api.fetchOpenRouterFreeModels) return;

    const oldValue = preferredModel || modelSelect.value || (api.loadProviderSettings ? api.loadProviderSettings('openrouter').model : '');
    modelSelect.innerHTML = '<option value="">Carregando modelos grátis...</option>';

    try {
      const models = await api.fetchOpenRouterFreeModels(force);
      modelSelect.innerHTML = models.map((model) => `<option value="${escapeHtml(model.id)}">${escapeHtml(model.name || model.id)}</option>`).join('');
      if (models.some((model) => model.id === oldValue)) modelSelect.value = oldValue;
      else if (api.PROVIDERS?.openrouter && models.some((model) => model.id === api.PROVIDERS.openrouter.defaultModel)) modelSelect.value = api.PROVIDERS.openrouter.defaultModel;
      else if (models[0]) modelSelect.value = models[0].id;
      api.saveProviderSettings?.('openrouter', { model: modelSelect.value });
      if (force) $('tl-output').textContent = `Modelos gratuitos do OpenRouter atualizados. Modelo selecionado: ${modelSelect.value}`;
    } catch (error) {
      const fallback = api.OPENROUTER_FREE_MODEL_FALLBACKS || [];
      modelSelect.innerHTML = fallback.map((model) => `<option value="${escapeHtml(model.id)}">${escapeHtml(model.name || model.id)}</option>`).join('');
      if (fallback[0]) modelSelect.value = fallback[0].id;
      $('tl-output').textContent = 'Não consegui baixar a lista do OpenRouter. Usando lista local de segurança.';
    }
  }

  function saveKey() {
    const providerId = $('tl-provider').value;
    const config = api.getProviderConfig(providerId);
    const model = api.getSelectedModelFromUI(config);
    api.saveProviderSettings(providerId, {
      apiKey: $('tl-api-key').value.trim(),
      model,
      endpoint: $('tl-endpoint').value.trim(),
    });
    localStorage.setItem('tonelab_web_research', $('tl-web-research')?.checked ? '1' : '0');
    localStorage.setItem('tonelab_guitar_type', $('tl-guitar-type')?.value || 'unspecified');
    $('tl-output').textContent = `${config.label}: API, modelo e preferências salvos neste navegador.`;
  }

  function getPromptWithContext() {
    const guitar = $('tl-guitar-type')?.value || 'unspecified';
    const guitarLabel = $('tl-guitar-type')?.selectedOptions?.[0]?.textContent || guitar;
    const prompt = $('tl-prompt').value.trim();
    localStorage.setItem('tonelab_guitar_type', guitar);
    return `${prompt}\n\nTipo de guitarra/captação informado pelo usuário: ${guitarLabel}.`;
  }

  function getBestProfile(result, prompt) {
    let candidates = [];
    if (Array.isArray(result)) candidates = result;
    else if (result && Array.isArray(result.variants)) candidates = result.variants;
    else if (result && Array.isArray(result.options)) candidates = result.options;
    else if (result && typeof result === 'object') candidates = [result];
    candidates = candidates.filter((item) => item && typeof item === 'object');
    if (!candidates.length && api.fallbackProfile) candidates = [api.fallbackProfile(prompt || '')];

    const inherited = (result && !Array.isArray(result) && typeof result === 'object') ? {
      researchSummary: result.researchSummary,
      referenceRig: result.referenceRig,
      rigTranslation: result.rigTranslation,
      limitations: result.limitations,
      sources: result.sources,
      searchVerified: result.searchVerified,
      confidence: result.confidence,
    } : {};

    candidates = candidates.map((item) => {
      const merged = Object.assign({}, inherited, item || {});
      const p = api.clampProfile ? api.clampProfile(merged) : merged;
      p.name = String(p.name || 'AI Tone').substring(0, 10);
      p.signalChain = api.normalizeSignalChain ? api.normalizeSignalChain(p.signalChain) : ['NR','FX1','DRV','AMP','IR','EQ','FX2','DLY','RVB'];
      return p;
    });

    candidates.sort((a, b) => Number(b.confidence || 0) - Number(a.confidence || 0));
    return candidates[0];
  }

  async function generateBasePreset() {
    const editor = api.getEditor && api.getEditor();
    const output = $('tl-output');
    const prompt = $('tl-prompt').value.trim();
    const providerId = $('tl-provider').value;
    const provider = api.getProviderConfig(providerId);

    if (!editor) { output.textContent = 'Erro: não encontrei bleEditor/Pocket Edit.'; return; }
    if (!prompt) { output.textContent = 'Digite a referência do timbre primeiro.'; return; }

    try {
      saveKey();
      setProgress(12, 'Preparando inventário da Pocket Master...');
      output.textContent = 'Pesquisando/inferindo rig e traduzindo para Pocket Master...';
      setProgress(35, `Consultando ${provider.label}...`);
      const aiResult = await api.askAI(editor, getPromptWithContext());
      setProgress(72, 'Escolhendo melhor equivalente de AMP/IR/effects...');
      const profile = getBestProfile(aiResult, prompt);
      const preset = api.buildPreset ? api.buildPreset(editor, profile) : { modules: {}, signalChain: profile.signalChain };
      currentSuggestion = { profile, preset };
      lastReportText = buildReport(currentSuggestion);
      renderReport(lastReportText);
      setProgress(100, 'Preset-base pronto. AMP + IR ligados; extras preparados e desligados.');
      output.textContent = '✅ Preset-base pronto. Clique em “Aplicar preset-base”. Os parâmetros ficarão flat; use o relatório para ajustes manuais.';
    } catch (error) {
      console.warn('[ToneLab v11] fallback:', error);
      setProgress(100, 'Erro/API indisponível. Usando sugestão local por regras.');
      const profile = api.fallbackProfile ? api.fallbackProfile(prompt) : { name: 'AI Tone' };
      const preset = api.buildPreset ? api.buildPreset(editor, profile) : { modules: {}, signalChain: profile.signalChain };
      currentSuggestion = { profile, preset };
      lastReportText = buildReport(currentSuggestion);
      renderReport(lastReportText);
      output.textContent = `⚠️ ${provider.label} indisponível/erro. Usei sugestão local por regras:\n${error.message}`;
    }
  }

  function formatFlatParams(params) {
    if (!params || !Object.keys(params).length) return 'default/flat';
    return Object.entries(params).map(([k, v]) => `${k}: ${v}`).join(' | ');
  }

  function formatManualSuggestion(value) {
    if (!value) return 'Sem sugestão específica; ajuste de ouvido.';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (typeof value === 'object') {
      return Object.entries(value).map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`).join(' | ');
    }
    return String(value);
  }

  function buildReport(suggestion) {
    const p = suggestion.profile || {};
    const preset = suggestion.preset || {};
    const modules = preset.modules || {};
    const order = preset.signalChain || p.signalChain || [];
    const manual = p.manualParameterSuggestions || preset.metadata?.manualParameterSuggestions || {};
    const lines = [];

    lines.push('# ToneLab AI — Preset-base flat');
    lines.push('');
    lines.push(`## ${p.name || 'AI Tone'} — confiança aproximada ${p.confidence || 0}%`);
    lines.push(p.style || '');
    lines.push('');

    lines.push('### Como este preset será aplicado');
    lines.push('- O app aplica a cadeia de sinal e os algoritmos escolhidos.');
    lines.push('- AMP e IR/Cab ficam ligados.');
    lines.push('- NR, FX1, DRV, EQ, FX2, DLY e RVB ficam selecionados, mas desligados.');
    lines.push('- Todos os parâmetros aplicados ficam em default/flat para evitar timbres exagerados.');
    lines.push('- Use as sugestões manuais abaixo para ajustar o som de ouvido.');
    lines.push('');

    lines.push('### Pesquisa / rig provável');
    lines.push(p.researchSummary || p.referenceRig || 'Sem fonte verificável retornada. Tratado como inferência do modelo + base Pocket Master.');
    if (p.sources && p.sources.length) {
      lines.push('');
      lines.push('Fontes verificáveis retornadas pela API:');
      p.sources.slice(0, 8).forEach((source) => lines.push(`- ${source.title || source.name || source.url || source}${source.url ? ` — ${source.url}` : ''}`));
    }
    lines.push('');

    if (Array.isArray(p.rigTranslation) && p.rigTranslation.length) {
      lines.push('### Tradução para Pocket Master');
      p.rigTranslation.slice(0, 14).forEach((item) => {
        if (typeof item === 'string') lines.push(`- ${item}`);
        else lines.push(`- ${item.source || item.original || 'Referência'} → ${item.target || item.pocket || 'Pocket Master'}${item.reason ? `: ${item.reason}` : ''}`);
      });
      lines.push('');
    }

    if (Array.isArray(p.namSuggestions) && p.namSuggestions.length) {
      lines.push('### NAM/TONE3000 sugerido');
      p.namSuggestions.slice(0, 5).forEach((item) => {
        if (typeof item === 'string') lines.push(`- ${item}`);
        else lines.push(`- Buscar: ${item.query || item.name || 'NAM relacionado'} — ${item.reason || 'pode aproximar o amp real'}${item.note ? ` (${item.note})` : ''}`);
      });
      lines.push('Obs.: a Pocket Master usa NAM no AMP em modo Clone. Use NAM apenas de AMP e mantenha IR/Cab separado.');
      lines.push('');
    }

    lines.push('### Cadeia de sinal');
    lines.push(order.join(' → '));
    lines.push('');

    lines.push('### Módulos aplicados flat');
    order.forEach((moduleName) => {
      const module = modules[moduleName] || {};
      const state = module.enabled ? 'LIGADO' : 'desligado';
      const reason = p.moduleReasons?.[moduleName] || (module.enabled ? 'Base do timbre.' : 'Preparado para teste manual, mas desligado por segurança.');
      lines.push(`#### ${moduleName} — ${state}`);
      lines.push(`Algoritmo: ${module.effect || 'não definido'}`);
      lines.push(`Motivo: ${reason}`);
      lines.push(`Parâmetros aplicados: ${formatFlatParams(module.parameters)}`);
      lines.push(`Sugestão manual: ${formatManualSuggestion(manual[moduleName])}`);
      lines.push('');
    });

    if (p.limitations && p.limitations.length) {
      lines.push('### Limitações / aproximações');
      p.limitations.slice(0, 10).forEach((item) => lines.push(`- ${typeof item === 'string' ? item : JSON.stringify(item)}`));
      lines.push('');
    }

    return lines.filter((line) => line !== undefined && line !== null).join('\n');
  }

  function renderReport(markdown) {
    const report = $('tl-report');
    if (!report) return;
    report.classList.remove('tl-hidden');
    report.innerHTML = escapeHtml(markdown)
      .replace(/^# (.*)$/gm, '<h3>$1</h3>')
      .replace(/^## (.*)$/gm, '<h4>$1</h4>')
      .replace(/^### (.*)$/gm, '<h5>$1</h5>')
      .replace(/^#### (.*)$/gm, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  async function applyBasePreset() {
    const editor = api.getEditor && api.getEditor();
    const output = $('tl-output');
    if (!editor) { output.textContent = 'Erro: bleEditor não encontrado.'; return; }
    if (!currentSuggestion) { output.textContent = 'Gere um preset-base primeiro.'; return; }

    try {
      setProgress(20, 'Convertendo preset flat...');
      const fullPreset = editor.convertHumanReadableToFullPresetData(currentSuggestion.preset);
      setProgress(50, 'Aplicando cadeia, AMP e IR...');
      editor.applyPresetState(fullPreset);
      if (editor.isConnected && typeof editor.syncPresetStateToDevice === 'function') {
        setProgress(78, 'Sincronizando com a Pocket Master...');
        await editor.syncPresetStateToDevice(fullPreset);
      }
      setProgress(100, 'Preset-base aplicado. Ajuste manualmente usando o relatório.');
      output.textContent = '✅ Preset-base aplicado: AMP + IR ligados, demais módulos desligados e parâmetros flat. Use o relatório para ajustar manualmente.';
    } catch (error) {
      console.error('[ToneLab Apply v11]', error);
      setProgress(100, 'Erro ao aplicar preset-base.');
      output.textContent = 'Erro ao aplicar preset-base:\n' + error.message + '\n\nJSON usado:\n' + JSON.stringify(currentSuggestion.preset, null, 2);
    }
  }

  async function copyReport() {
    if (!lastReportText) { $('tl-output').textContent = 'Gere um preset-base primeiro.'; return; }
    await navigator.clipboard.writeText(lastReportText);
    $('tl-output').textContent = 'Relatório copiado para a área de transferência.';
  }

  waitRack();
})();
