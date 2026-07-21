(function () {
    if (window.__PDE_ELECTRON_BRIDGE_PATCH__) return;
    window.__PDE_ELECTRON_BRIDGE_PATCH__ = true;

    function findPDEAction(type, buttonId) {
        if (type === 'down') {
            if (typeof window.PDE_press === 'function') {
                window.PDE_press(buttonId);
                return true;
            }
        }

        if (type === 'up') {
            if (typeof window.PDE_release === 'function') {
                window.PDE_release(buttonId);
                return true;
            }
        }

        return false;
    }

    function triggerFallback(buttonId, pressed) {
        const keyMap = {
            group1: localStorage.getItem('pde_map_group1') || 'Key_A',
            group2: localStorage.getItem('pde_map_group2') || 'Key_D',
            modeToggle: localStorage.getItem('pde_map_modeToggle') || 'Key_M'
        };

        const mapped = keyMap[buttonId];
        if (!mapped || !mapped.startsWith('Key_')) return;

        const key = mapped.replace('Key_', '');

        document.dispatchEvent(new KeyboardEvent(pressed ? 'keydown' : 'keyup', {
            key: key,
            code: mapped,
            bubbles: true,
            cancelable: true
        }));
    }

    function handleElectronButton(data) {
        if (!data || !data.buttonId) return;

        const buttonId = data.buttonId;
        const pressed = !!data.pressed;

        const ok = findPDEAction(pressed ? 'down' : 'up', buttonId);

        if (!ok) {
            triggerFallback(buttonId, pressed);
        }
    }

    if (window.electronAPI && typeof window.electronAPI.onHidButton === 'function') {
        window.electronAPI.onHidButton(handleElectronButton);
        console.log('[Pocket Dual Engine] Electron HID bridge ativo');
    } else {
        console.log('[Pocket Dual Engine] Electron bridge ignorado: modo Web/GitHub Pages');
    }
})();
