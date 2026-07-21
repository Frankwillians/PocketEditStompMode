(function () {
  window.PEToneLab = window.PEToneLab || {};
  const api = window.PEToneLab;

  function flatParams(effect) {
    const out = {};
    if (!effect || !Array.isArray(effect.alg)) return out;
    for (const param of effect.alg) {
      let value = param.defaultValue;
      if (typeof value === 'undefined' || value === null || Number.isNaN(Number(value))) {
        value = typeof param.min === 'number' && typeof param.max === 'number'
          ? Math.round((param.min + param.max) / 2)
          : 50;
      }
      if (typeof param.min === 'number') value = Math.max(param.min, Number(value));
      if (typeof param.max === 'number') value = Math.min(param.max, Number(value));
      out[param.name] = value;
    }
    return out;
  }

  api.buildPreset = function buildPreset(editor, profile) {
    const p = api.clampProfile ? api.clampProfile(profile || {}) : (profile || {});

    const fxNR = api.pickEffect(editor, 'NR', ['noise', 'gate', 'nr']);
    const fxFX1 = api.pickEffect(editor, 'FX1', p.fx1Keys || ['comp', 'chorus']);
    const fxDRV = api.pickEffect(editor, 'DRV', p.drvKeys || ['scream', 'od', 'drive']);
    const fxAMP = api.pickEffect(editor, 'AMP', p.ampKeys || ['brit', 'deluxe', 'clean']);
    const fxIR = api.pickEffect(editor, 'IR', p.irKeys || ['4x12', '2x12', 'cab']);
    const fxEQ = api.pickEffect(editor, 'EQ', ['eq', 'graphic']);
    const fxFX2 = api.pickEffect(editor, 'FX2', p.fx2Keys || ['chorus', 'phase']);
    const fxDLY = api.pickEffect(editor, 'DLY', p.dlyKeys || ['pure', 'digital', 'delay']);
    const fxRVB = api.pickEffect(editor, 'RVB', p.rvbKeys || ['room', 'plate', 'hall']);

    // Philosophy for v11:
    // - Apply the correct algorithms and chain as a clean starting point.
    // - Apply flat/default parameters only.
    // - Enable only AMP + IR. Everything else is prepared but OFF for manual activation.
    // This avoids AI-created extreme settings, especially chorus/modulation rate/depth/mix issues.
    return {
      version: '1.0',
      presetName: String(p.name || 'AI Tone').substring(0, 10),
      description: [p.style || 'ToneLab AI guide', p.referenceRig || ''].filter(Boolean).join(' | ').slice(0, 220),
      ampMode: 'Normal',
      presetVolume: 75,
      signalChain: api.normalizeSignalChain ? api.normalizeSignalChain(p.signalChain) : ['NR', 'FX1', 'DRV', 'AMP', 'IR', 'EQ', 'FX2', 'DLY', 'RVB'],
      modules: {
        NR: { enabled: false, effect: fxNR?.name || null, parameters: flatParams(fxNR) },
        FX1: { enabled: false, effect: fxFX1?.name || null, parameters: flatParams(fxFX1) },
        DRV: { enabled: false, effect: fxDRV?.name || null, parameters: flatParams(fxDRV) },
        AMP: { enabled: true, effect: fxAMP?.name || null, parameters: flatParams(fxAMP) },
        IR: { enabled: true, effect: fxIR?.name || null, parameters: flatParams(fxIR) },
        EQ: { enabled: false, effect: fxEQ?.name || null, parameters: flatParams(fxEQ) },
        FX2: { enabled: false, effect: fxFX2?.name || null, parameters: flatParams(fxFX2) },
        DLY: { enabled: false, effect: fxDLY?.name || null, parameters: flatParams(fxDLY) },
        RVB: { enabled: false, effect: fxRVB?.name || null, parameters: flatParams(fxRVB) },
      },
      metadata: {
        createdDate: new Date().toISOString().split('T')[0],
        author: 'ToneLab AI v11',
        tags: ['ai', 'tone-guide', 'flat-start'],
        style: p.style || '',
        referenceRig: p.referenceRig || '',
        confidence: p.confidence || 0,
        namSuggestions: p.namSuggestions || [],
        manualParameterSuggestions: p.manualParameterSuggestions || {},
      },
    };
  };
})();
