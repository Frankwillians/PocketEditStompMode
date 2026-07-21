(function () {
  window.PEToneLab = window.PEToneLab || {};

  const api = window.PEToneLab;

  api.DEFAULT_MODEL = 'gemini-2.5-flash';

  api.getEditor = function getEditor() {
    if (window.bleEditor) return window.bleEditor;

    for (const key of Object.keys(window)) {
      const value = window[key];
      if (
        value &&
        value.definitions &&
        value.definitions.effectLibrary &&
        typeof value.convertHumanReadableToFullPresetData === 'function'
      ) {
        return value;
      }
    }

    return null;
  };

  api.norm = function norm(value) {
    return String(value || '').toLowerCase();
  };

  api.moduleDef = function moduleDef(editor, name) {
    return editor.definitions.modules.find(
      (module) => module.name.toLowerCase() === name.toLowerCase()
    );
  };

  api.effectDef = function effectDef(editor, id) {
    return editor.definitions.effectLibrary[id];
  };

  api.inventoryForAI = function inventoryForAI(editor) {
    const modules = {};

    for (const module of editor.definitions.modules) {
      modules[module.name] = (module.effects || [])
        .map((id) => {
          const fx = editor.definitions.effectLibrary[id];
          if (!fx) return null;

          return {
            name: fx.name,
            params: (fx.alg || []).map((param) => ({
              name: param.name,
              min: param.min,
              max: param.max,
              defaultValue: param.defaultValue,
            })),
          };
        })
        .filter(Boolean);
    }

    return modules;
  };

  api.pickEffect = function pickEffect(editor, moduleName, keywords) {
    const module = api.moduleDef(editor, moduleName);
    if (!module) return null;

    const compact = (value) => api.norm(value).replace(/[^a-z0-9]/g, '');
    const rawKeywords = (keywords || []).filter(Boolean).map(String);
    const keywordData = rawKeywords.map((keyword) => ({
      raw: api.norm(keyword),
      compact: compact(keyword),
      tokens: api.norm(keyword).split(/[^a-z0-9]+/).filter((token) => token.length > 1),
    }));

    let best = null;
    let bestScore = -999;

    for (const id of module.effects) {
      const fx = api.effectDef(editor, id);
      if (!fx) continue;

      const name = api.norm(fx.name);
      const nameCompact = compact(fx.name);
      let score = 1;

      for (const keyword of keywordData) {
        if (!keyword.raw) continue;
        if (name === keyword.raw) score += 35;
        if (name.includes(keyword.raw)) score += 18;
        if (keyword.compact && nameCompact.includes(keyword.compact)) score += 16;
        for (const token of keyword.tokens) {
          if (name.includes(token)) score += 6;
          if (nameCompact.includes(token)) score += 4;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        best = fx;
      }
    }

    return best || api.effectDef(editor, module.effects[0]);
  };

  api.paramMap = function paramMap(effect, rules) {
    const output = {};
    if (!effect || !effect.alg) return output;

    for (const param of effect.alg) {
      const name = api.norm(param.name);
      let value = param.defaultValue;

      for (const rule of rules) {
        if (rule.keys.some((key) => name.includes(key))) {
          value = rule.value;
          break;
        }
      }

      if (typeof param.min === 'number') value = Math.max(param.min, value);
      if (typeof param.max === 'number') value = Math.min(param.max, value);

      output[param.name] = value;
    }

    return output;
  };

  api.extractJson = function extractJson(text) {
    const cleaned = String(text || '').replace(/```json|```/g, '').trim();

    try {
      return JSON.parse(cleaned);
    } catch (error) {
      const first = cleaned.indexOf('{');
      const last = cleaned.lastIndexOf('}');
      if (first >= 0 && last > first) {
        return JSON.parse(cleaned.slice(first, last + 1));
      }
      throw new Error('A IA não retornou JSON válido.');
    }
  };


  api.VALID_SIGNAL_CHAIN = ['NR', 'FX1', 'DRV', 'AMP', 'IR', 'EQ', 'FX2', 'DLY', 'RVB'];

  api.normalizeSignalChain = function normalizeSignalChain(chain) {
    const valid = api.VALID_SIGNAL_CHAIN;
    const fixed = ['DRV', 'AMP', 'IR', 'EQ'];
    const seen = new Set();
    const requested = [];

    if (Array.isArray(chain)) {
      for (const raw of chain) {
        const name = String(raw || '').trim().toUpperCase();
        if (valid.includes(name) && !seen.has(name)) {
          requested.push(name);
          seen.add(name);
        }
      }
    }

    for (const name of valid) {
      if (!seen.has(name)) {
        requested.push(name);
        seen.add(name);
      }
    }

    // The Pocket Edit UI treats DRV+AMP+IR+EQ as a fixed block. Keep that block intact
    // and allow only NR/FX1/FX2/DLY/RVB to move around it.
    const firstFixedIndex = requested.findIndex((name) => fixed.includes(name));
    const floating = requested.filter((name) => !fixed.includes(name));
    const before = [];
    const after = [];

    requested.forEach((name, index) => {
      if (fixed.includes(name)) return;
      if (firstFixedIndex >= 0 && index < firstFixedIndex) before.push(name);
      else after.push(name);
    });

    const output = [...before, ...fixed, ...after];
    const finalSeen = new Set();
    return output.filter((name) => {
      if (!valid.includes(name) || finalSeen.has(name)) return false;
      finalSeen.add(name);
      return true;
    });
  };

  api.clampProfile = function clampProfile(profile) {
    const fallback = api.fallbackProfile('');
    const output = Object.assign({}, fallback, profile || {});

    [
      'gain',
      'bass',
      'middle',
      'treble',
      'presence',
      'gate',
      'delayMix',
      'delayTime',
      'feedback',
      'reverbMix',
      'reverbDecay',
      'bright',
    ].forEach((key) => {
      output[key] = Number(output[key]);
      if (Number.isNaN(output[key])) output[key] = fallback[key];
    });

    [
      'gain',
      'bass',
      'middle',
      'treble',
      'presence',
      'gate',
      'delayMix',
      'feedback',
      'reverbMix',
      'reverbDecay',
      'bright',
    ].forEach((key) => {
      output[key] = Math.max(0, Math.min(100, output[key]));
    });

    output.delayTime = Math.max(1, Math.min(1000, output.delayTime));
    // Bright is treated as a switch/intensity value. It is useful on amps such as Dark Twin, Voks and Jazz-style models.
    output.bright = Math.max(0, Math.min(100, output.bright || 0));

    [
      'ampKeys',
      'drvKeys',
      'fx1Keys',
      'fx2Keys',
      'dlyKeys',
      'rvbKeys',
      'irKeys',
    ].forEach((key) => {
      if (!Array.isArray(output[key])) output[key] = fallback[key];
    });

    output.signalChain = api.normalizeSignalChain(output.signalChain);

    // AMP and IR are always enabled. Other modules only start enabled when the AI explicitly marks them as necessary.
    // This keeps presets from becoming overloaded while still allowing complete automatic application when needed.
    ['nrOn', 'drvOn', 'fx1On', 'fx2On', 'dlyOn', 'rvbOn', 'eqOn'].forEach((key) => {
      output[key] = output[key] === true || output[key] === 1 || output[key] === 'true';
    });

    output.name = String(output.name || 'AI Tone').substring(0, 10);
    output.style = String(output.style || fallback.style || '').slice(0, 180);
    output.referenceRig = String(output.referenceRig || fallback.referenceRig || '').slice(0, 260);
    output.confidence = Number(output.confidence || fallback.confidence || 0);
    if (Number.isNaN(output.confidence)) output.confidence = 0;
    output.confidence = Math.max(0, Math.min(100, output.confidence));

    output.researchSummary = String(output.researchSummary || output.referenceRig || fallback.researchSummary || 'Sem pesquisa detalhada retornada.').slice(0, 900);

    if (!Array.isArray(output.rigTranslation)) output.rigTranslation = fallback.rigTranslation || [];
    if (!Array.isArray(output.limitations)) output.limitations = fallback.limitations || [];
    if (!Array.isArray(output.sources)) output.sources = fallback.sources || [];
    if (!output.moduleReasons || typeof output.moduleReasons !== 'object') output.moduleReasons = fallback.moduleReasons || {};
    if (!output.moduleParameters || typeof output.moduleParameters !== 'object') output.moduleParameters = fallback.moduleParameters || {};
    output.useNamClone = output.useNamClone === true || output.useNamClone === 1 || output.useNamClone === 'true';
    output.selectedNam = String(output.selectedNam || '').slice(0, 120);
    if (!Array.isArray(output.namSuggestions)) output.namSuggestions = [];

    return output;
  };

  api.fallbackProfile = function fallbackProfile(text) {
    const value = api.norm(text);

    const profile = {
      name: 'AI Tone',
      style: 'Generic balanced guitar tone',
      referenceRig: 'inferred from model knowledge',
      researchSummary: 'No live web research was used. The tone was inferred from the prompt and the internal Pocket Master knowledge base.',
      confidence: 55,
      rigTranslation: [],
      limitations: [],
      sources: [],
      moduleReasons: {
        NR: 'Off by default; enable only for noisy/high-gain sounds.',
        FX1: 'Off by default; enable for compressor/wah/boost if the reference needs it.',
        DRV: 'Off by default; enable only when a drive/boost/fuzz is needed.',
        AMP: 'Always on: base amplifier tone.',
        IR: 'Always on: cabinet/IR base tone.',
        EQ: 'Off by default; enable only for corrective shaping.',
        FX2: 'Off by default; enable only for modulation/pitch needs.',
        DLY: 'Off by default; enable for solos/ambient references.',
        RVB: 'Off by default; enable only when ambience is part of the tone.'
      },
      gain: 48,
      bass: 50,
      middle: 50,
      treble: 55,
      presence: 55,
      bright: 0,
      gate: 25,
      delayMix: 12,
      delayTime: 420,
      feedback: 25,
      reverbMix: 18,
      reverbDecay: 35,
      nrOn: false,
      drvOn: false,
      fx1On: false,
      eqOn: false,
      fx2On: false,
      dlyOn: false,
      rvbOn: false,
      ampKeys: ['brit', '800', 'deluxe'],
      drvKeys: ['scream', 'od', 'drive'],
      fx1Keys: ['comp'],
      fx2Keys: ['chorus'],
      dlyKeys: ['digital', 'delay'],
      rvbKeys: ['plate', 'room'],
      irKeys: ['4x12', 'v30', 'cab'],
      signalChain: ['NR', 'FX1', 'DRV', 'AMP', 'IR', 'EQ', 'FX2', 'DLY', 'RVB'],
    };

    if (/sweet child|slash|guns|november rain|appetite/.test(value)) {
      Object.assign(profile, {
        name: 'Slash',
        gain: 58,
        bass: 52,
        middle: 68,
        treble: 58,
        presence: 55,
        gate: 20,
        delayMix: 18,
        delayTime: 360,
        feedback: 22,
        reverbMix: 20,
        reverbDecay: 35,
        nrOn: true,
        drvOn: true,
        eqOn: true,
        dlyOn: true,
        rvbOn: true,
        ampKeys: ['brit', '800', 'plexi', 'mars'],
        drvKeys: ['drive', 'od', 'boost'],
        irKeys: ['4x12', 'v30'],
        signalChain: ['NR', 'DRV', 'AMP', 'IR', 'EQ', 'DLY', 'RVB'],
      });
    } else if (/metallica|black album|enter sandman|master of puppets/.test(value)) {
      Object.assign(profile, {
        name: 'Metallic',
        gain: 76,
        bass: 62,
        middle: 34,
        treble: 68,
        presence: 72,
        gate: 62,
        delayMix: 4,
        reverbMix: 10,
        reverbDecay: 24,
        nrOn: true,
        drvOn: true,
        eqOn: true,
        dlyOn: false,
        rvbOn: true,
        ampKeys: ['rect', 'modern', 'dizzy', 'sol'],
        drvKeys: ['scream', 'dist'],
        irKeys: ['4x12', 'metal', 'v30'],
        signalChain: ['NR', 'DRV', 'AMP', 'IR', 'EQ', 'RVB'],
      });
    } else if (/mayer|slow dancing|john/.test(value)) {
      Object.assign(profile, {
        name: 'Mayer',
        gain: 28,
        bass: 50,
        middle: 62,
        treble: 58,
        presence: 48,
        gate: 12,
        delayMix: 8,
        reverbMix: 24,
        reverbDecay: 42,
        nrOn: false,
        drvOn: false,
        eqOn: false,
        dlyOn: false,
        rvbOn: true,
        ampKeys: ['clean', 'deluxe', 'twin'],
        drvKeys: ['scream'],
        rvbKeys: ['spring', 'room'],
        signalChain: ['NR', 'FX1', 'AMP', 'IR', 'EQ', 'RVB'],
      });
    } else if (/gilmour|pink floyd|comfortably/.test(value)) {
      Object.assign(profile, {
        name: 'Gilmour',
        gain: 48,
        bass: 50,
        middle: 60,
        treble: 62,
        presence: 58,
        gate: 18,
        delayMix: 30,
        delayTime: 520,
        feedback: 34,
        reverbMix: 30,
        reverbDecay: 55,
        nrOn: true,
        drvOn: true,
        eqOn: true,
        fx2On: true,
        dlyOn: true,
        rvbOn: true,
        ampKeys: ['clean', 'hiwatt', 'brit'],
        drvKeys: ['muff', 'dist', 'drive'],
        fx2Keys: ['chorus', 'phase'],
        dlyKeys: ['digital', 'tape'],
        rvbKeys: ['hall', 'plate'],
        signalChain: ['NR', 'DRV', 'AMP', 'IR', 'EQ', 'FX2', 'DLY', 'RVB'],
      });
    }

    if (/single/.test(value)) {
      profile.gain += 5;
      profile.middle += 5;
      profile.treble -= 4;
    }

    if (/active/.test(value)) {
      profile.gate += 8;
      profile.gain -= 4;
    }

    const ref = typeof api.findReferenceTranslation === 'function' ? api.findReferenceTranslation(value) : null;
    if (ref && ref.pocket) {
      profile.referenceRig = ref.rig;
      profile.confidence = Math.max(profile.confidence || 0, 72);
      Object.keys(ref.pocket).forEach((key) => {
        if (Array.isArray(ref.pocket[key])) profile[key] = ref.pocket[key];
      });
    }

    return profile;
  };

  api.buildToneReport = function buildToneReport(profile, preset) {
    const p = api.clampProfile(profile || {});
    const modules = preset && preset.modules ? preset.modules : {};
    const order = (preset && preset.signalChain) || api.normalizeSignalChain(p.signalChain);

    const lines = [];
    lines.push('## ToneLab AI Report');
    lines.push('');
    lines.push(`Preset: ${preset?.presetName || p.name}`);
    lines.push(`Confidence: ${p.confidence || 0}%`);
    lines.push('');

    lines.push('### Pesquisa / inferência');
    lines.push(p.researchSummary || p.referenceRig || 'Sem pesquisa detalhada retornada.');
    lines.push('');

    if (p.sources && p.sources.length) {
      lines.push('### Fontes / referências');
      p.sources.slice(0, 8).forEach((source) => {
        if (typeof source === 'string') lines.push(`- ${source}`);
        else lines.push(`- ${source.title || source.name || source.url || 'Fonte'}${source.url ? ` — ${source.url}` : ''}`);
      });
      lines.push('');
    }

    lines.push('### Tradução para Pocket Master');
    if (Array.isArray(p.rigTranslation) && p.rigTranslation.length) {
      p.rigTranslation.slice(0, 12).forEach((item) => {
        if (typeof item === 'string') {
          lines.push(`- ${item}`);
        } else {
          lines.push(`- ${item.source || item.original || 'Referência'} → ${item.target || item.pocket || 'Pocket Master'}${item.reason ? `: ${item.reason}` : ''}`);
        }
      });
    } else {
      lines.push('- A IA não retornou uma lista detalhada; o preset foi montado a partir dos keywords e do banco interno.');
    }
    lines.push('');

    const namBlock = api.renderNamSuggestions ? api.renderNamSuggestions(p) : '';
    if (namBlock) { lines.push(namBlock); lines.push(''); }

    if (api.audioReference) {
      lines.push('### Áudio de referência');
      lines.push(JSON.stringify(api.audioReference, null, 2));
      lines.push('');
    }

    lines.push('### Por que cada módulo foi escolhido');
    order.forEach((moduleName) => {
      const module = modules[moduleName];
      const status = module?.enabled ? 'ON' : 'OFF';
      const effect = module?.effect || (['AMP','IR'].includes(moduleName) ? 'base' : 'não usado');
      const reason = p.moduleReasons?.[moduleName] || (module?.enabled ? 'Ativado porque ajuda a aproximar o timbre pedido.' : 'Mantido desligado para evitar excesso de processamento.');
      lines.push(`- ${moduleName} [${status}] — ${effect}: ${reason}`);
    });
    lines.push('');

    if (p.limitations && p.limitations.length) {
      lines.push('### Limitações / aproximações');
      p.limitations.slice(0, 10).forEach((item) => lines.push(`- ${typeof item === 'string' ? item : JSON.stringify(item)}`));
      lines.push('');
    }

    lines.push('### Ajustes de parâmetros');
    lines.push(`- Bright: ${p.bright ? 'preparado/ativo quando o amp suportar' : 'desligado ou mínimo'}.`);
    lines.push('- Parâmetros diretos retornados pela IA em moduleParameters são aplicados sobre os controles reais quando o nome do parâmetro bate ou é parecido.');
    lines.push('- Modulações são programadas de forma sutil para evitar chorus/detune exagerado.');
    lines.push('');

    lines.push('### Estado inicial seguro');
    lines.push('- O preset sempre mantém todos os blocos na signal chain.');
    lines.push('- Por padrão, AMP e IR ficam ligados; EQ pode iniciar ligado somente quando necessário para correção tonal.');
    lines.push('- NR, FX1, DRV, FX2, DLY e RVB ficam preparados, mas desligados para ativação manual.');

    return lines.join('\n');
  };


  api.getProfileVariants = function getProfileVariants(result, promptText) {
    let rawVariants = [];

    if (Array.isArray(result)) rawVariants = result;
    else if (result && Array.isArray(result.variants)) rawVariants = result.variants;
    else if (result && Array.isArray(result.options)) rawVariants = result.options;
    else if (result && typeof result === 'object') rawVariants = [result];

    rawVariants = rawVariants.filter((item) => item && typeof item === 'object');

    if (!rawVariants.length) rawVariants = api.createFallbackVariants(promptText || '');

    const inherited = (result && !Array.isArray(result) && typeof result === 'object') ? {
      researchSummary: result.researchSummary,
      referenceRig: result.referenceRig,
      rigTranslation: result.rigTranslation,
      limitations: result.limitations,
      sources: result.sources,
      searchVerified: result.searchVerified,
      confidence: result.confidence,
    } : {};

    const variants = rawVariants.slice(0, 3).map((item, index) => {
      item = Object.assign({}, inherited, item || {});
      const profile = api.clampProfile(item);
      if (!profile.variantLabel) {
        profile.variantLabel = ['Versão A', 'Versão B', 'Versão C'][index] || `Versão ${index + 1}`;
      }
      return profile;
    });

    if (variants.length < 3) {
      const extras = api.createFallbackVariants(promptText || '', variants[0]);
      for (const extra of extras) {
        if (variants.length >= 3) break;
        const duplicate = variants.some((v) => JSON.stringify(v.ampKeys) === JSON.stringify(extra.ampKeys));
        if (!duplicate) variants.push(api.clampProfile(extra));
      }
    }

    return variants.slice(0, 3).map((profile, index) => {
      profile.variantLabel = profile.variantLabel || ['Versão A', 'Versão B', 'Versão C'][index];
      profile.name = String(profile.name || profile.variantLabel || 'AI Tone').substring(0, 10);
      // Only enable extra modules when the AI/fallback explicitly marks them as necessary.
      ['nrOn', 'drvOn', 'fx1On', 'fx2On', 'dlyOn', 'rvbOn', 'eqOn'].forEach((key) => {
        profile[key] = profile[key] === true || profile[key] === 1 || profile[key] === 'true';
      });
      return profile;
    });
  };

  api.createFallbackVariants = function createFallbackVariants(promptText, baseProfile) {
    const base = api.clampProfile(baseProfile || api.fallbackProfile(promptText || ''));
    const variants = [
      Object.assign({}, base, {
        variantLabel: 'Britânico',
        name: 'BritTone',
        style: `${base.style || 'Tone'} — British amp interpretation`,
        ampKeys: ['brit', '800', 'plexi', 'mars', '45'],
        irKeys: ['britgn', 'green', '4x12', 'v30'],
        gain: Math.max(0, Math.min(100, base.gain + 2)),
        middle: Math.max(0, Math.min(100, base.middle + 8)),
        treble: Math.max(0, Math.min(100, base.treble + 2)),
        presence: Math.max(0, Math.min(100, base.presence + 2)),
        rigTranslation: (base.rigTranslation || []).concat([{ source: 'Alternative amp voicing', target: 'Brit-style Pocket Master amp', reason: 'Versão com médios fortes e ataque de rock clássico.' }]),
      }),
      Object.assign({}, base, {
        variantLabel: 'Americano',
        name: 'USTone',
        style: `${base.style || 'Tone'} — American amp interpretation`,
        ampKeys: ['twin', 'deluxe', 'b-man', 'clean', 'califdual'],
        irKeys: ['double', 'twd', 'dual', '2x12', '4x12'],
        gain: Math.max(0, Math.min(100, base.gain - 4)),
        bass: Math.max(0, Math.min(100, base.bass + 4)),
        middle: Math.max(0, Math.min(100, base.middle - 4)),
        treble: Math.max(0, Math.min(100, base.treble + 4)),
        rigTranslation: (base.rigTranslation || []).concat([{ source: 'Alternative amp voicing', target: 'American-style Pocket Master amp', reason: 'Versão com resposta mais aberta, limpa ou com grave firme.' }]),
      }),
      Object.assign({}, base, {
        variantLabel: 'Moderno',
        name: 'ModTone',
        style: `${base.style || 'Tone'} — modern/high-gain interpretation`,
        ampKeys: ['califdualm', 'califdualv', 'dizzy', 'halen', 'sol100', 'eng', 'flyman', 'bog'],
        irKeys: ['dual', 'dizzy', 'halen', 'sol', 'bog', '4x12', 'v30'],
        gain: Math.max(0, Math.min(100, base.gain + 8)),
        bass: Math.max(0, Math.min(100, base.bass + 4)),
        middle: Math.max(0, Math.min(100, base.middle - 6)),
        treble: Math.max(0, Math.min(100, base.treble + 5)),
        presence: Math.max(0, Math.min(100, base.presence + 6)),
        gate: Math.max(0, Math.min(100, base.gate + 10)),
        rigTranslation: (base.rigTranslation || []).concat([{ source: 'Alternative amp voicing', target: 'Modern high-gain Pocket Master amp', reason: 'Versão mais apertada e agressiva para timbres modernos.' }]),
      }),
    ];

    return variants.map((profile) => api.clampProfile(profile));
  };

  api.buildVariantSummary = function buildVariantSummary(profile, preset) {
    const p = api.clampProfile(profile || {});
    const modules = preset && preset.modules ? preset.modules : {};
    const amp = modules.AMP?.effect || 'AMP';
    const ir = modules.IR?.effect || 'IR';
    const drv = modules.DRV?.effect || 'Drive preparado';
    const dly = modules.DLY?.effect || 'Delay preparado';
    const rvb = modules.RVB?.effect || 'Reverb preparado';

    return [
      `${p.variantLabel || p.name || 'Versão'} — ${p.style || ''}`.trim(),
      `AMP: ${amp}`,
      `IR: ${ir}`,
      `Extras selecionados: ${drv}, ${dly}, ${rvb}`,
      `EQ base: Gain ${p.gain}, Bass ${p.bass}, Mid ${p.middle}, Treble ${p.treble}, Presence ${p.presence}`,
    ].join('\n');
  };

})();
