(function () {
    if (window.__PocketDualControlEngineUnifiedFinal) return;
    window.__PocketDualControlEngineUnifiedFinal = true;

    const PRESET_MAP = {
        1:"8080f0060c000100000006010104030000000000000000f7",
        2:"8080f0070a000100000006010104030001000000000000f7",
        3:"8080f00400000100000006010104030002000000000000f7",
        4:"8080f00506000100000006010104030003000000000000f7",
        5:"8080f00304000100000006010104030004000000000000f7",
        6:"8080f00202000100000006010104030005000000000000f7",
        7:"8080f00108000100000006010104030006000000000000f7",
        8:"8080f0000e000100000006010104030007000000000000f7",
        9:"8080f00d0c000100000006010104030008000000000000f7",
        10:"8080f00c0a000100000006010104030009000000000000f7",
        11:"8080f00f0000010000000601010403000a000000000000f7",
        12:"8080f00e0600010000000601010403000b000000000000f7",
        13:"8080f0080400010000000601010403000c000000000000f7",
        14:"8080f0090200010000000601010403000d000000000000f7",
        15:"8080f00a0800010000000601010403000e000000000000f7",
        16:"8080f00b0e00010000000601010403000f000000000000f7",
        17:"8080f0000b000100000006010104030100000000000000f7",
        18:"8080f0010d000100000006010104030101000000000000f7",
        19:"8080f00207000100000006010104030102000000000000f7",
        20:"8080f00301000100000006010104030103000000000000f7",
        21:"8080f00503000100000006010104030104000000000000f7",
        22:"8080f00405000100000006010104030105000000000000f7",
        23:"8080f0070f000100000006010104030106000000000000f7",
        24:"8080f00609000100000006010104030107000000000000f7",
        25:"8080f00b0b000100000006010104030108000000000000f7",
        26:"8080f00a0d000100000006010104030109000000000000f7",
        27:"8080f0090700010000000601010403010a000000000000f7",
        28:"8080f0080100010000000601010403010b000000000000f7",
        29:"8080f00e0300010000000601010403010c000000000000f7",
        30:"8080f00f0500010000000601010403010d000000000000f7",
        31:"8080f00c0f00010000000601010403010e000000000000f7",
        32:"8080f00d0900010000000601010403010f000000000000f7",
        33:"8080f00a02000100000006010104030200000000000000f7",
        34:"8080f00b04000100000006010104030201000000000000f7",
        35:"8080f0080e000100000006010104030202000000000000f7",
        36:"8080f00908000100000006010104030203000000000000f7",
        37:"8080f00f0a000100000006010104030204000000000000f7",
        38:"8080f00e0c000100000006010104030205000000000000f7",
        39:"8080f00d06000100000006010104030206000000000000f7",
        40:"8080f00c00000100000006010104030207000000000000f7",
        41:"8080f00102000100000006010104030208000000000000f7",
        42:"8080f00004000100000006010104030209000000000000f7",
        43:"8080f0030e00010000000601010403020a000000000000f7",
        44:"8080f0020800010000000601010403020b000000000000f7",
        45:"8080f0040a00010000000601010403020c000000000000f7",
        46:"8080f0050c00010000000601010403020d000000000000f7",
        47:"8080f0060600010000000601010403020e000000000000f7",
        48:"8080f0070000010000000601010403020f000000000000f7",
        49:"8080f00c05000100000006010104030300000000000000f7",
        50:"8080f00d03000100000006010104030301000000000000f7"
    };

    const state = {
        mode: localStorage.getItem('pde_mode') || 'stomp',
        bank: localStorage.getItem('pde_bank') || 'A',
        learning: null,
        lock: false,
        keyDownAt: {},
        keyLongDone: {},
        joyDownAt: {},
        joyLongDone: {},
        joyState: {},
        combo: { g1:false, g2:false, fired:false },
        renderCache: ''
    };

    const defaults = {
        group1: 'Key_A',
        group2: 'Key_D',
        modeToggle: 'Key_M'
    };

    const presets = {
        a_g1_short: 1,
        a_g1_long: 2,
        a_g2_short: 8,
        a_g2_long: 5,
        b_g1_short: 2,
        b_g1_long: 6,
        b_g2_short: 9,
        b_g2_long: 12
    };

    Object.keys(presets).forEach(k => {
        presets[k] = parseInt(localStorage.getItem('pde_' + k) || presets[k], 10);
    });

    function getMap(id) {
        return localStorage.getItem('pde_map_' + id) || defaults[id];
    }

    function setMap(id, value) {
        localStorage.setItem('pde_map_' + id, value);
        state.learning = null;
        renderPanel(true);
    }

    function label(value) {
        if (!value) return 'Livre';
        value = String(value);
        if (value.startsWith('Joy_')) return 'Btn ' + value.split('_')[1];
        if (value.startsWith('Key_')) return 'Tec: ' + value.replace('Key_', '');
        return value;
    }

    function setMode(mode) {
        state.mode = mode;
        localStorage.setItem('pde_mode', mode);

        /* compatibilidade com scripts antigos */
        localStorage.setItem('dse_mode', mode);
        localStorage.setItem('darkstar_chocolate_mode', mode);

        renderPanel(true);
    }

    function toggleMode() {
        setMode(state.mode === 'stomp' ? 'preset' : 'stomp');
    }

    function toggleBank() {
        if (state.mode !== 'preset') return;
        state.bank = state.bank === 'A' ? 'B' : 'A';
        localStorage.setItem('pde_bank', state.bank);
        localStorage.setItem('dse_bank', state.bank);
        renderPanel(true);
    }

    function getSelectedGamepadIndex() {
        const select = document.getElementById('darkstar_joy_select') || document.getElementById('joy_select');

        if (select && select.value !== '') {
            const idx = parseInt(select.value, 10);
            if (!isNaN(idx)) return idx;
        }

        const gps = navigator.getGamepads ? navigator.getGamepads() : [];

        for (let i = 0; i < gps.length; i++) {
            if (gps[i]) return i;
        }

        return null;
    }

    function currentPreset(group, isLong) {
        const prefix = state.bank === 'A' ? 'a' : 'b';
        const key = `${prefix}_${group}_${isLong ? 'long' : 'short'}`;
        return presets[key] || 1;
    }

    function syncPresetVisual(num) {
        setTimeout(() => {
            const patches = document.querySelectorAll('.patch-item');
            const target = patches[num - 1];
            if (target) target.click();
        }, 180);
    }

    function sendPreset(num) {
        if (state.lock) return false;

        state.lock = true;
        setTimeout(() => state.lock = false, 1100);

        const hex = PRESET_MAP[num];
        const input = document.getElementById('manualCommandInput') || document.getElementById('commandInput');
        const btn = document.getElementById('sendManualCommandBtn');

        if (hex && input && btn && !btn.disabled) {
            input.value = hex;
            input.dispatchEvent(new Event('input', { bubbles:true }));
            input.dispatchEvent(new Event('change', { bubbles:true }));
            btn.click();
            syncPresetVisual(num);
            console.log('[Pocket Dual Engine] Banco:', state.bank, 'Preset:', num);
        }

        return false;
    }

    window.__pdeOriginalActivate = window.__pdeOriginalActivate || window.forçarAtivacaoModuloDarkStar;

    function triggerGroup(group, isLong) {
        if (state.mode === 'preset') {
            return sendPreset(currentPreset(group, isLong));
        }

        if (typeof window.__pdeOriginalActivate === 'function') {
            if (group === 'g1') return window.__pdeOriginalActivate(isLong ? '6' : '1', null);
            if (group === 'g2') return window.__pdeOriginalActivate(isLong ? '8' : '2', null);
        }
    }

    function navigatePreset(dir) {
        const patches = Array.from(document.querySelectorAll('.patch-item'));
        if (!patches.length) return false;

        let i = patches.findIndex(p => p.classList.contains('selected') || p.classList.contains('active'));
        if (i < 0) i = 0;

        let target = i + dir;
        if (target >= patches.length) target = 0;
        if (target < 0) target = patches.length - 1;

        patches[target].click();
        return false;
    }

    window.forçarAtivacaoModuloDarkStar = function(moduleId, event) {
        const id = String(moduleId);
        if (event) event.stopPropagation();

        if (id === 'nav_prev') return navigatePreset(-1);
        if (id === 'nav_next') return navigatePreset(1);

        if (state.mode === 'preset') {
            if (id === '1') return sendPreset(currentPreset('g1', false));
            if (id === '6') return sendPreset(currentPreset('g1', true));
            if (id === '2') return sendPreset(currentPreset('g2', false));
            if (id === '8') return sendPreset(currentPreset('g2', true));
        }

        if (typeof window.__pdeOriginalActivate === 'function') {
            return window.__pdeOriginalActivate(moduleId, event);
        }
    };

    function press(id, source) {
        if (id === 'modeToggle') return toggleMode();

        const group = id === 'group1' ? 'g1' : 'g2';

        /* combo B1 + B2 = troca A/B no modo banco */
        if (state.mode === 'preset') {
            if (id === 'group1') state.combo.g1 = true;
            if (id === 'group2') state.combo.g2 = true;

            if (state.combo.g1 && state.combo.g2 && !state.combo.fired) {
                state.combo.fired = true;
                toggleBank();
                return;
            }
        }

        const store = source === 'joy' ? state.joyDownAt : state.keyDownAt;
        const longStore = source === 'joy' ? state.joyLongDone : state.keyLongDone;

        store[id] = performance.now();
        longStore[id] = false;

        setTimeout(() => {
            if (store[id] && !longStore[id]) {
                if (performance.now() - store[id] >= 500) {
                    longStore[id] = true;
                    triggerGroup(group, true);
                }
            }
        }, 520);
    }

    function release(id, source) {
        if (id === 'modeToggle') return;

        if (state.mode === 'preset') {
            if (id === 'group1') state.combo.g1 = false;
            if (id === 'group2') state.combo.g2 = false;
            if (!state.combo.g1 && !state.combo.g2) state.combo.fired = false;
        }

        const group = id === 'group1' ? 'g1' : 'g2';
        const store = source === 'joy' ? state.joyDownAt : state.keyDownAt;
        const longStore = source === 'joy' ? state.joyLongDone : state.keyLongDone;

        const start = store[id];
        if (!start) return;

        const duration = performance.now() - start;

        if (!longStore[id] && duration < 500) {
            triggerGroup(group, false);
        }

        store[id] = null;
        longStore[id] = false;
    }

    /* exposto para Electron preload/main.js */
    window.PDE_press = function(id) {
        press(id, 'electron');
    };

    window.PDE_release = function(id) {
        release(id, 'electron');
    };

    function bindInput(id, prop) {
        const el = document.getElementById(id);
        if (!el || el.dataset.pdeBound) return;

        el.dataset.pdeBound = '1';
        el.addEventListener('input', function () {
            presets[prop] = parseInt(this.value, 10) || 1;
            localStorage.setItem('pde_' + prop, this.value);
        });
    }

    function renderPanel(force) {
        const rack = document.getElementById('darkstar-stomp-rack');
        if (!rack) return;

        let panel = document.getElementById('pocket-dual-engine');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'pocket-dual-engine';
            rack.insertBefore(panel, rack.firstChild);
        }

        const pill = state.mode === 'preset'
            ? `<span class="pde-status-pill ${state.bank === 'B' ? 'bank-b' : ''}">
                    Banco ativo: <strong>${state.bank}</strong>
                    <small>Botão 1 + Botão 2 alterna A/B</small>
               </span>`
            : `<span class="pde-status-pill">
                    <strong>Modo Efeitos</strong>
                    <small>curto = efeito 1 · segurar = efeito 2</small>
               </span>`;

        const html = `
            <div class="pde-top">
                <div class="pde-title">▣ Pocket Dual Control Engine</div>

                <div class="pde-hint">${pill}</div>

                <div class="pde-mode-row">
                    <button class="pde-btn ${state.mode === 'stomp' ? 'active-stomp' : ''}" id="pde-mode-stomp">Modo Efeitos</button>
                    <button class="pde-btn ${state.mode === 'preset' ? 'active-bank' : ''}" id="pde-mode-bank">Modo Banco</button>
                    <button class="pde-btn" id="pde-learn-mode">${label(getMap('modeToggle'))}</button>
                </div>
            </div>

            <div class="pde-grid">
                <div class="pde-card" style="border-left:3px solid #00fff5;">
                    <div>
                        <b style="color:#00fff5;">Botão 1</b><br>
                        <span>Curto / Longo</span>
                    </div>
                    <button class="pde-btn" id="pde-learn-g1">${label(getMap('group1'))}</button>
                </div>

                <div class="pde-card" style="border-left:3px solid #ffd000;">
                    <div>
                        <b style="color:#ffd000;">Botão 2</b><br>
                        <span>Curto / Longo</span>
                    </div>
                    <button class="pde-btn" id="pde-learn-g2">${label(getMap('group2'))}</button>
                </div>
            </div>

            ${
                state.mode === 'stomp'
                ? `
                    <div class="pde-bank-grid">
                        <div class="pde-bank-box" style="border-left:3px solid #00fff5;">
                            <b style="color:#00fff5;">Botão 1 — Modo Efeitos</b>
                            <span>Clique curto → liga/desliga FX1</span>
                            <span>Segurar 500ms → liga/desliga FX2</span>
                        </div>
                        <div class="pde-bank-box" style="border-left:3px solid #ffd000;">
                            <b style="color:#ffd000;">Botão 2 — Modo Efeitos</b>
                            <span>Clique curto → liga/desliga DRV</span>
                            <span>Segurar 500ms → liga/desliga RVB</span>
                        </div>
                    </div>
                `
                : `
                    <div class="pde-bank-panel">
                        <div class="pde-bank-grid">
                            <div class="pde-bank-box" style="border-left:3px solid #00fff5;">
                                <b style="color:#00fff5;">Banco A</b>
                                <label>B1 curto: P<input id="pde-a-g1-short" type="number" min="1" max="50" value="${presets.a_g1_short}"></label>
                                <label>B1 longo: P<input id="pde-a-g1-long" type="number" min="1" max="50" value="${presets.a_g1_long}"></label>
                                <label>B2 curto: P<input id="pde-a-g2-short" type="number" min="1" max="50" value="${presets.a_g2_short}"></label>
                                <label>B2 longo: P<input id="pde-a-g2-long" type="number" min="1" max="50" value="${presets.a_g2_long}"></label>
                            </div>

                            <div class="pde-bank-box" style="border-left:3px solid #ffd000;">
                                <b style="color:#ffd000;">Banco B</b>
                                <label>B1 curto: P<input id="pde-b-g1-short" type="number" min="1" max="50" value="${presets.b_g1_short}"></label>
                                <label>B1 longo: P<input id="pde-b-g1-long" type="number" min="1" max="50" value="${presets.b_g1_long}"></label>
                                <label>B2 curto: P<input id="pde-b-g2-short" type="number" min="1" max="50" value="${presets.b_g2_short}"></label>
                                <label>B2 longo: P<input id="pde-b-g2-long" type="number" min="1" max="50" value="${presets.b_g2_long}"></label>
                            </div>
                        </div>
                    </div>
                `
            }
        `;

        if (!force && state.renderCache === html) return;
        state.renderCache = html;
        panel.innerHTML = html;

        document.getElementById('pde-mode-stomp').onclick = () => setMode('stomp');
        document.getElementById('pde-mode-bank').onclick = () => setMode('preset');

        document.getElementById('pde-learn-mode').onclick = () => {
            state.learning = 'modeToggle';
            document.getElementById('pde-learn-mode').textContent = 'OUVINDO...';
        };

        document.getElementById('pde-learn-g1').onclick = () => {
            state.learning = 'group1';
            document.getElementById('pde-learn-g1').textContent = 'OUVINDO...';
        };

        document.getElementById('pde-learn-g2').onclick = () => {
            state.learning = 'group2';
            document.getElementById('pde-learn-g2').textContent = 'OUVINDO...';
        };

        bindInput('pde-a-g1-short', 'a_g1_short');
        bindInput('pde-a-g1-long', 'a_g1_long');
        bindInput('pde-a-g2-short', 'a_g2_short');
        bindInput('pde-a-g2-long', 'a_g2_long');

        bindInput('pde-b-g1-short', 'b_g1_short');
        bindInput('pde-b-g1-long', 'b_g1_long');
        bindInput('pde-b-g2-short', 'b_g2_short');
        bindInput('pde-b-g2-long', 'b_g2_long');
    }

    document.addEventListener('keydown', function(e) {
        if (document.activeElement && ['INPUT','SELECT','TEXTAREA'].includes(document.activeElement.tagName)) return;

        const keyId = 'Key_' + e.key.toUpperCase();

        if (state.learning) {
            e.preventDefault();
            setMap(state.learning, keyId);
            return;
        }

        if (e.repeat) return;

        ['group1','group2','modeToggle'].forEach(id => {
            if (getMap(id).toUpperCase() === keyId.toUpperCase()) {
                e.preventDefault();
                press(id, 'key');
            }
        });
    }, true);

    document.addEventListener('keyup', function(e) {
        const keyId = 'Key_' + e.key.toUpperCase();

        ['group1','group2','modeToggle'].forEach(id => {
            if (getMap(id).toUpperCase() === keyId.toUpperCase()) {
                release(id, 'key');
            }
        });
    }, true);

    function matchJoy(value, index) {
        if (!value) return false;
        return value === 'Joy_' + index || value === String(index);
    }

    function joyLoop() {
        const idx = getSelectedGamepadIndex();
        const gps = navigator.getGamepads ? navigator.getGamepads() : [];

        if (idx !== null && gps[idx]) {
            const gp = gps[idx];

            for (let i = 0; i < gp.buttons.length; i++) {
                const pressed = gp.buttons[i].pressed;
                const stateKey = idx + '_' + i;
                const joyId = 'Joy_' + i;

                if (state.joyState[stateKey] === undefined) state.joyState[stateKey] = false;

                if (pressed && state.learning) {
                    setMap(state.learning, joyId);
                    state.joyState[stateKey] = true;
                    continue;
                }

                if (pressed && !state.joyState[stateKey]) {
                    ['group1','group2','modeToggle'].forEach(id => {
                        if (matchJoy(getMap(id), i)) press(id, 'joy');
                    });
                }

                if (!pressed && state.joyState[stateKey]) {
                    ['group1','group2','modeToggle'].forEach(id => {
                        if (matchJoy(getMap(id), i)) release(id, 'joy');
                    });
                }

                state.joyState[stateKey] = pressed;
            }
        }

        requestAnimationFrame(joyLoop);
    }

    setInterval(() => renderPanel(false), 700);
    requestAnimationFrame(joyLoop);

    /* ==========================================================
       ELECTRON OPTIONAL BRIDGE
       ========================================================== */

    if (window.electronAPI && typeof window.electronAPI.onHidButton === 'function') {
        window.electronAPI.onHidButton((data) => {
            if (!data || !data.buttonId) return;

            if (data.pressed) {
                window.PDE_press(data.buttonId);
            } else {
                window.PDE_release(data.buttonId);
            }
        });

        console.log('[Pocket Dual Engine] Electron HID bridge ativo');
    } else {
        console.log('[Pocket Dual Engine] Web/GitHub Pages mode ativo');
    }

    /* ==========================================================
       MOBILE TOUCH DRAG + AUTO SCROLL
       ========================================================== */

    let dragging = null;
    let startX = 0;
    let startY = 0;
    let moved = false;
    let lastX = null;
    let autoScrollTimer = null;

    function isMobile() {
        return window.innerWidth <= 767;
    }

    function getScrollContainer() {
        return document.querySelector('.signal-chain') || document.querySelector('.chain-flow');
    }

    function moduleFromPoint(x, y) {
        const el = document.elementFromPoint(x, y);
        return el ? el.closest('.chain-module[data-module-id]') : null;
    }

    function clearTargets() {
        document.querySelectorAll('.pde-drag-target').forEach(el => el.classList.remove('pde-drag-target'));
    }

    function startAutoScroll(x) {
        lastX = x;
        if (autoScrollTimer) return;

        autoScrollTimer = setInterval(() => {
            const scroller = getScrollContainer();
            if (!scroller || lastX === null) return;

            const rect = scroller.getBoundingClientRect();
            const edge = 55;
            const speed = 14;

            if (lastX > rect.right - edge) scroller.scrollLeft += speed;
            if (lastX < rect.left + edge) scroller.scrollLeft -= speed;
        }, 16);
    }

    function stopAutoScroll() {
        lastX = null;
        if (autoScrollTimer) {
            clearInterval(autoScrollTimer);
            autoScrollTimer = null;
        }
    }

    function reorder(dragEl, targetEl) {
        if (!dragEl || !targetEl || dragEl === targetEl) return;

        const parent = dragEl.parentElement;
        if (!parent || parent !== targetEl.parentElement) return;

        const modules = Array.from(parent.children).filter(el =>
            el.classList && el.classList.contains('chain-module')
        );

        const dragIndex = modules.indexOf(dragEl);
        const targetIndex = modules.indexOf(targetEl);

        if (dragIndex < 0 || targetIndex < 0) return;

        if (dragIndex < targetIndex) {
            parent.insertBefore(dragEl, targetEl.nextSibling);
        } else {
            parent.insertBefore(dragEl, targetEl);
        }

        parent.dispatchEvent(new Event('change', { bubbles:true }));
        document.dispatchEvent(new CustomEvent('pde-chain-reordered', {
            bubbles:true,
            detail:{
                from: dragEl.getAttribute('data-module-id'),
                to: targetEl.getAttribute('data-module-id')
            }
        }));
    }

    function startDrag(e) {
        if (!isMobile()) return;

        const mod = e.target.closest('.chain-module[data-module-id]');
        if (!mod) return;

        const t = e.touches ? e.touches[0] : e;

        dragging = mod;
        startX = t.clientX;
        startY = t.clientY;
        moved = false;

        mod.classList.add('pde-dragging');
    }

    function moveDrag(e) {
        if (!dragging || !isMobile()) return;

        const t = e.touches ? e.touches[0] : e;
        const dx = Math.abs(t.clientX - startX);
        const dy = Math.abs(t.clientY - startY);

        if (dx > 8 || dy > 8) moved = true;
        if (!moved) return;

        e.preventDefault();

        startAutoScroll(t.clientX);
        clearTargets();

        dragging.style.transform = `translate(${t.clientX - startX}px, ${t.clientY - startY}px) scale(.96)`;

        dragging.style.pointerEvents = 'none';
        const target = moduleFromPoint(t.clientX, t.clientY);
        dragging.style.pointerEvents = '';

        if (target && target !== dragging) target.classList.add('pde-drag-target');
    }

    function endDrag(e) {
        if (!dragging) return;

        const t = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0] : e;

        dragging.style.pointerEvents = 'none';
        const target = moduleFromPoint(t.clientX, t.clientY);
        dragging.style.pointerEvents = '';

        dragging.classList.remove('pde-dragging');
        dragging.style.transform = '';
        clearTargets();
        stopAutoScroll();

        if (moved && target && target !== dragging) reorder(dragging, target);

        dragging = null;
        moved = false;
    }

    function bindDrag() {
        document.querySelectorAll('.chain-module[data-module-id]').forEach(mod => {
            if (mod.dataset.pdeDragBound === '1') return;
            mod.dataset.pdeDragBound = '1';

            mod.addEventListener('touchstart', startDrag, { passive:true });
            mod.addEventListener('touchmove', moveDrag, { passive:false });
            mod.addEventListener('touchend', endDrag, { passive:false });
            mod.addEventListener('touchcancel', endDrag, { passive:false });
        });
    }

    setInterval(bindDrag, 500);
})();
