// DarkStar Native Engine V7 - Controlador Adaptativo Concorrente
        (function() {
            function injectNavbarEditButton() {
                if (window.innerWidth < 768) {
                    const topBar = document.querySelector('.top-bar');
                    if (topBar && !document.getElementById('darkstar-nav-edit-btn')) {
                        const editBtn = document.createElement('button');
                        editBtn.id = 'darkstar-nav-edit-btn';
                        editBtn.textContent = ' ⚙ EDIT';
                        // Estilo micro e perfeitamente casado na direita da barra entre o PREV e o MENU
                        editBtn.style.cssText = "position: absolute; right: 38px; top: 50%; transform: translateY(-50%); background: #1a1d26; border: 1px solid #00fff5; color: #00fff5; font-size: 7.5px; font-weight: 900; padding: 4px 6px; border-radius: 3px; cursor: pointer; z-index: 100005; white-space: nowrap;";
                        topBar.appendChild(editBtn);
                    }
                }
            }

            // Injeta imediatamente e monitora se o framework reconstruiu a barra
            injectNavbarEditButton();
            setInterval(injectNavbarEditButton, 500);

            // Gerenciador de eventos unificado
            document.addEventListener('click', function(e) {
                const sidebar = document.querySelector('.sidebar');
                const panel = document.getElementById('effectsPanel') || document.querySelector('.effects-panel');
                const chain = document.querySelector('.signal-chain');
                
                // 💻 CLIQUES NO PC
                if (window.innerWidth >= 768 && chain) {
                    const isPcEditBtn = e.target.classList.contains('signal-chain') && e.offsetX >= (e.target.clientWidth - 170);
                    if (isPcEditBtn) {
                        panel.classList.toggle('darkstar-show-panel');
                    }
                    return;
                }

                // 📲 CLIQUES NO SMARTPHONE
                if (window.innerWidth < 768) {
                    const rectTopBar = document.querySelector('.top-bar').getBoundingClientRect();
                    const clickX = e.clientX - rectTopBar.left;

                    // 1. Toque no botão PREV (Detectado por coordenadas de área)
                    if (e.target.classList.contains('top-bar') && clickX >= (rectTopBar.width - 85) && clickX <= (rectTopBar.width - 50)) {
                        const prevBtn = document.querySelector('button:contains("-")') || document.querySelectorAll('#preset-navigation-container button')[0];
                        if (prevBtn) prevBtn.click();
                        return;
                    }

                    // 2. Toque no botão EDIT
                    if (e.target.id === 'darkstar-nav-edit-btn') {
                        panel.classList.toggle('darkstar-show-panel');
                        e.target.style.background = panel.classList.contains('darkstar-show-panel') ? '#00fff5' : '#1a1d26';
                        e.target.style.color = panel.classList.contains('darkstar-show-panel') ? '#000' : '#00fff5';
                        return;
                    }

                    // 3. Toque no botão MENU ☰
                    if (e.target.textContent === '☰' || (e.target.classList.contains('top-bar') && clickX >= (rectTopBar.width - 32))) {
                        if (sidebar) sidebar.classList.toggle('darkstar-open-menu');
                        return;
                    }

                    // Fecha a barra se clicar fora, mas ignora interações com a top-bar
                    if (sidebar && sidebar.classList.contains('darkstar-open-menu') && !sidebar.contains(e.target) && e.target.id !== 'darkstar-nav-edit-btn' && !e.target.classList.contains('top-bar')) {
                        sidebar.classList.remove('darkstar-open-menu');
                    }
                }
            });
        })();
        
        // ========================================================== //
        /* DARKSTAR PC RESET: LIMPA RESQUÍCIOS DO MÓVEL AO REDIMENSIONAR */
        // ========================================================== //
        window.addEventListener('resize', function() {
            // Se voltou para o monitor (PC / Modo Normal Web)
            if (window.innerWidth >= 768) {
                const panel = document.getElementById('effectsPanel') || document.querySelector('.effects-panel');
                const mobileEditBtn = document.getElementById('darkstar-nav-edit-btn');
                
                if (panel) {
                    // Remove a classe de exibição mobile e limpa os styles em bloco forçados
                    panel.classList.remove('darkstar-show-panel');
                    panel.style.removeProperty('display');
                }
                
                // Remove o botão micro injetado da navbar se ele ainda existir
                if (mobileEditBtn) {
                    mobileEditBtn.remove();
                }
            }
        });
