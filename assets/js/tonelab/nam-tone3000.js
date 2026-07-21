(function () {
  window.PEToneLab = window.PEToneLab || {};
  const api = window.PEToneLab;

  api.getNamSettingsFromUI = function getNamSettingsFromUI() {
    const enabled = !!document.getElementById('tl-use-nam')?.checked;
    const loadedNames = (document.getElementById('tl-nam-list')?.value || '')
      .split(/\n|,|;/)
      .map((s) => s.trim())
      .filter(Boolean);
    localStorage.setItem('tonelab_use_nam', enabled ? '1' : '0');
    localStorage.setItem('tonelab_loaded_nams', loadedNames.join('\n'));
    return { enabled, loadedNames };
  };

  api.namPrompt = function namPrompt() {
    const { enabled, loadedNames } = api.getNamSettingsFromUI ? api.getNamSettingsFromUI() : { enabled: false, loadedNames: [] };
    if (!enabled) return '';
    return `\n\nNAM/Clone mode requested:\n- If a NAM would be closer than the internal amps, suggest it in namSuggestions.\n- Use TONE3000 as a suggested NAM source. Do not claim a specific NAM exists unless web search returns a verified source.\n- If the user lists available NAMs, choose the closest loaded NAM and set useNamClone true.\n- If no loaded NAM matches, keep useNamClone false and suggest search terms for TONE3000.\nLoaded NAM files/user list:\n${loadedNames.length ? loadedNames.map((n) => `- ${n}`).join('\n') : '(none listed)'}\n\nNAM JSON fields to fill when useful:\n"useNamClone": true/false,\n"selectedNam":"exact loaded NAM name or empty",\n"namSuggestions":[{"query":"TONE3000 search terms","reason":"why this NAM/profile would help","loadedMatch":"loaded NAM name if any"}]`;
  };

  api.renderNamSuggestions = function renderNamSuggestions(profile) {
    const list = Array.isArray(profile?.namSuggestions) ? profile.namSuggestions : [];
    if (!list.length) return '';
    const lines = ['### NAM / TONE3000'];
    if (profile.useNamClone && profile.selectedNam) {
      lines.push(`- Clone/NAM sugerido entre seus NAMs carregados: ${profile.selectedNam}`);
    }
    list.slice(0, 6).forEach((item) => {
      if (typeof item === 'string') lines.push(`- Sugestão: ${item}`);
      else lines.push(`- ${item.query || item.name || 'NAM search'}${item.loadedMatch ? ` → match carregado: ${item.loadedMatch}` : ''}${item.reason ? `: ${item.reason}` : ''}`);
    });
    lines.push('- Observação: o app não baixa/carrega NAM automaticamente na Pocket Master. Carregue pelo Sonicake Manager/SONICLNK e selecione AMP > Clone quando necessário.');
    return lines.join('\n');
  };
})();
