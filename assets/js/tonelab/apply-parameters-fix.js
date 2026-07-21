(function () {
  window.PEToneLab = window.PEToneLab || {};
  const api = window.PEToneLab;

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function findControl(moduleId, algId) {
    return document.querySelector(`[data-module-id="${moduleId}"][data-alg-id="${algId}"]`);
  }

  function setControlVisual(editor, control, value) {
    if (!control) return false;

    if (control.classList.contains('slider')) {
      control.value = value;
      const valueDisplay = control.nextElementSibling;
      if (valueDisplay && valueDisplay.classList.contains('slider-value')) {
        valueDisplay.textContent = value;
      }
      if (typeof editor.updateSliderProgress === 'function') {
        editor.updateSliderProgress(control);
      }
      control.dispatchEvent(new Event('input', { bubbles: true }));
      control.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }

    if (control.classList.contains('toggle-switch')) {
      const shouldBeOn = Number(value) === 1 || value === true;
      control.classList.toggle('on', shouldBeOn);
      control.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }

    if (control.tagName === 'SELECT') {
      control.value = String(value);
      control.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }

    return false;
  }

  function forceModuleState(editor, moduleName, isOn) {
    const moduleDef = editor.definitions.modules.find((m) => m.name === moduleName);
    if (!moduleDef) return;
    const moduleId = moduleDef.moduleId;
    const toggleId = moduleId === 9 ? 3 : moduleId;
    const enableToggle = document.getElementById(`module-enable-${toggleId}`);
    if (enableToggle) {
      enableToggle.classList.toggle('on', !!isOn);
      if (typeof editor.updateModuleStatus === 'function') editor.updateModuleStatus(toggleId);
    }
  }

  function forceEffectSelection(editor, moduleId, fxId) {
    const cloneModeToggle = document.getElementById('amp-clone-mode');
    const isClone = cloneModeToggle && cloneModeToggle.classList.contains('on');
    const uiModuleId = moduleId === 9 ? 3 : moduleId;

    if (moduleId === 9 && !isClone) return;
    if (moduleId === 3 && isClone) return;

    const select = document.getElementById(`module-type-${uiModuleId}`);
    if (select && Array.from(select.options).some((option) => Number(option.value) === Number(fxId))) {
      select.value = String(fxId);
      if (typeof editor.createParameterControls === 'function') {
        editor.createParameterControls(uiModuleId, Number(fxId));
      } else {
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }

  api.forceApplyToneLabPresetToUI = async function forceApplyToneLabPresetToUI(editor, fullPresetData) {
    if (!editor || !fullPresetData) return;

    const previousApplying = editor.isApplyingState;
    editor.isApplyingState = true;

    try {
      if (fullPresetData.states) {
        Object.entries(fullPresetData.states).forEach(([moduleName, isOn]) => {
          forceModuleState(editor, moduleName, isOn);
        });
      }

      if (fullPresetData.selectedEffects) {
        Object.entries(fullPresetData.selectedEffects).forEach(([moduleId, fxId]) => {
          forceEffectSelection(editor, Number(moduleId), Number(fxId));
        });
      }

      await sleep(60);

      if (fullPresetData.parameters) {
        Object.entries(fullPresetData.parameters).forEach(([moduleId, params]) => {
          const uiModuleId = Number(moduleId) === 9 ? 3 : Number(moduleId);
          Object.entries(params || {}).forEach(([algId, value]) => {
            const control = findControl(uiModuleId, algId) || findControl(moduleId, algId);
            setControlVisual(editor, control, value);
          });
        });
      }
    } finally {
      editor.isApplyingState = previousApplying;
    }
  };
})();
