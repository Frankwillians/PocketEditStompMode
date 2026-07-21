(function () {
  if (window.__PE_SPACE_TAP_FIX__) return;
  window.__PE_SPACE_TAP_FIX__ = true;

  const spaceValues = ['Key_ ', 'Key_SPACE', 'Key_Space', 'Space'];

  ['pde_map_group1', 'pde_map_group2', 'pde_map_modeToggle'].forEach((key) => {
    if (spaceValues.includes(localStorage.getItem(key))) {
      localStorage.removeItem(key);
    }
  });

  function isTypingTarget(target) {
    if (!target) return false;
    const tag = target.tagName;
    return (
      tag === 'INPUT' ||
      tag === 'TEXTAREA' ||
      tag === 'SELECT' ||
      target.isContentEditable
    );
  }

  function blockSpace(event) {
    if (event.code !== 'Space') return;
    if (isTypingTarget(document.activeElement)) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  document.addEventListener('keydown', blockSpace, true);
  document.addEventListener('keyup', blockSpace, true);
})();
