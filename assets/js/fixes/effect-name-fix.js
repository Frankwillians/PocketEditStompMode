(function () {
  if (window.__PE_EFFECT_NAME_FIX__) return;
  window.__PE_EFFECT_NAME_FIX__ = true;

  function getEditor() {
    if (window.bleEditor) return window.bleEditor;

    for (const key of Object.keys(window)) {
      const value = window[key];
      if (value && value.definitions && value.definitions.effectLibrary) {
        return value;
      }
    }

    return null;
  }

  function getEffectName(editor, moduleId, select) {
    const selectedValue = select ? parseInt(select.value, 10) : NaN;

    if (!Number.isNaN(selectedValue) && editor.definitions.effectLibrary[selectedValue]) {
      return editor.definitions.effectLibrary[selectedValue].name;
    }

    const preset = editor.currentPreset || editor.presetState || editor.state || {};
    const candidates = [
      preset.selectedEffects,
      preset.effectIds,
      preset.modules,
      editor.selectedEffects,
      editor.moduleEffects,
    ].filter(Boolean);

    for (const map of candidates) {
      const value =
        map[moduleId] ||
        map[String(moduleId)] ||
        (map[moduleId] && map[moduleId].effectId) ||
        (map[String(moduleId)] && map[String(moduleId)].effectId);

      const fxId = parseInt(value, 10);
      if (!Number.isNaN(fxId) && editor.definitions.effectLibrary[fxId]) {
        if (select && Array.from(select.options).some((option) => parseInt(option.value, 10) === fxId)) {
          select.value = String(fxId);
        }
        return editor.definitions.effectLibrary[fxId].name;
      }
    }

    if (select && select.selectedOptions && select.selectedOptions[0]) {
      const text = select.selectedOptions[0].textContent.trim();
      if (text && !/empty|nan|undefined|null/i.test(text)) return text;
    }

    return null;
  }

  function repairEffectNames() {
    const editor = getEditor();
    if (!editor || !editor.definitions || !editor.definitions.effectLibrary) return;

    document.querySelectorAll('.chain-module[data-module-id]').forEach((moduleEl) => {
      const moduleId = moduleEl.getAttribute('data-module-id');
      const label = moduleEl.querySelector('.module-type');
      const select = document.getElementById(`module-type-${moduleId}`);

      if (!label && !select) return;

      const visibleText = label ? label.textContent.trim() : '';
      const needsRepair = !visibleText || /empty|nan|undefined|null/i.test(visibleText);

      const name = getEffectName(editor, moduleId, select);
      if (name && (needsRepair || (label && label.textContent.trim() !== name))) {
        if (label) label.textContent = name;
      }
    });
  }

  function patchMethod(object, methodName) {
    if (!object || typeof object[methodName] !== 'function') return;
    if (object[methodName].__peEffectNameFixPatched) return;

    const original = object[methodName];
    object[methodName] = function patchedEffectNameMethod(...args) {
      const result = original.apply(this, args);
      setTimeout(repairEffectNames, 80);
      setTimeout(repairEffectNames, 350);
      return result;
    };

    object[methodName].__peEffectNameFixPatched = true;
  }

  function installPatches() {
    const editor = getEditor();
    if (!editor) return;

    [
      'applyPresetState',
      'syncPresetStateToDevice',
      'loadPreset',
      'selectPatch',
      'updateUI',
      'updateSignalChain',
      'renderSignalChain',
    ].forEach((method) => patchMethod(editor, method));

    repairEffectNames();
  }

  setInterval(installPatches, 1000);
  const observer = new MutationObserver(() => repairEffectNames());
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
