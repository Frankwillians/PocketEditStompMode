(function() {
            let activeGamepadIdx = null;
            let lastButtonsState = [];
            let ignoreNextRelease = {};
            let learningStompTarget = null;
            let mapaBotaoStomp = { "0": null, "1": null, "2": null, "3": null, "4": null, "5": null, "6": null, "7": null, "8": null };

            // Recupera mapeamento salvo
            if (localStorage.getItem('darkstar_pocket_stomp_map')) {
                try { mapaBotaoStomp = JSON.parse(localStorage.getItem('darkstar_pocket_stomp_map')); } catch(e) {}
            }

            // Atualiza os pequenos textos nos blocos indicando qual botão está mapeado
            function atualizarLabelsMapeamentoInterface() {
                for (let mId in mapaBotaoStomp) {
                    const label = document.getElementById(`map_stomp_${mId}`);
                    if (label) {
                        label.innerText = mapaBotaoStomp[mId] !== null ? `Btn ${mapaBotaoStomp[mId]}` : "Livre";
                    }
                }
            }

            // Injeta as funções de mapeamento globalmente na janela para os botões "Mapear" funcionarem
            window.dispararMapeamentoFootswitch = function(moduleId, event) {
                if (event) event.stopPropagation();
                learningStompTarget = String(moduleId);
                document.querySelectorAll('.btn-stomp-learn').forEach(b => b.classList.remove('listening'));
                if (event && event.target) event.target.classList.add('listening');
                console.log(`[DarkStar] Aguardando botão USB para o módulo ${moduleId}...`);
            };

            // Aciona o efeito simulando o comportamento exato que a engine original do Pocket Edit escuta
            window.forçarTrocaFootswitchPé = function(moduleId, event) {
                if (event) event.stopPropagation();
                
                // 1. Busca o módulo correspondente na lista visual
                const modEl = document.querySelector(`.chain-module[data-module-id="${moduleId}"]`);
                if (modEl) {
                    // Força o clique visual para focar o painel de parâmetros do módulo
                    modEl.click();
                    
                    // 2. Procura pela bolinha de status (LED) ou chave de ativação nativa
                    const statusDot = modEl.querySelector('.module-status');
                    const enableToggle = document.getElementById(`module-enable-${moduleId}`);
                    
                    if (statusDot) {
                        statusDot.click(); // Dispara o toggle original do Pocket Edit
                    } else if (enableToggle) {
                        enableToggle.click(); // Fallback caso o seletor mude
                    }
                }
            };

            // Loop de Varredura do Joystick (Debounce Engine Isolada)
            function loopJoystickDarkStar() {
                const gps = navigator.getGamepads();
                let achou = false;
                
                const select = document.getElementById('joy_select');
                if (select && select.options.length <= 1 && gps.length > 0) {
                    let optionsHtml = '';
                    for (let i = 0; i < gps.length; i++) {
                        if (gps[i]) {
                            optionsHtml += `<option value="${i}">[USB] ${gps[i].id}</option>`;
                            if (activeGamepadIdx === null) activeGamepadIdx = i;
                            achou = true;
                        }
                    }
                    if(achou) select.innerHTML = optionsHtml;
                }

                if (activeGamepadIdx !== null && gps[activeGamepadIdx]) {
                    const gp = gps[activeGamepadIdx];
                    if (lastButtonsState.length === 0) lastButtonsState = new Array(gp.buttons.length).fill(false);

                    for (let i = 0; i < gp.buttons.length; i++) {
                        let pressed = gp.buttons[i].pressed;
                        
                        if (pressed && !lastButtonsState[i]) { // Roda estritamente uma única vez por clique
                            if (learningStompTarget !== null) {
                                mapaBotaoStomp[learningStompTarget] = i;
                                ignoreNextRelease[i] = true;
                                localStorage.setItem('darkstar_pocket_stomp_map', JSON.stringify(mapaBotaoStomp));
                                atualizarLabelsMapeamentoInterface();
                                learningStompTarget = null;
                                document.querySelectorAll('.btn-stomp-learn').forEach(b => b.classList.remove('listening'));
                            } else if (!ignoreNextRelease[i]) {
                                for (let mId in mapaBotaoStomp) {
                                    if (mapaBotaoStomp[mId] === i) {
                                        window.forçarTrocaFootswitchPé(parseInt(mId), null);
                                    }
                                }
                            }
                        }
                        if (!pressed && lastButtonsState[i]) ignoreNextRelease[i] = false;
                        lastButtonsState[i] = pressed;
                    }
                }
                requestAnimationFrame(loopJoystickDarkStar);
            }

            // Inicialização segura após o carregamento da janela
            window.addEventListener('load', () => {
                atualizarLabelsMapeamentoInterface();
                requestAnimationFrame(loopJoystickDarkStar);
                
                // Vincula mudança manual de joystick no seletor do topo
                const select = document.getElementById('joy_select');
                if (select) {
                    select.onchange = (e) => { activeGamepadIdx = parseInt(e.target.value); };
                }
            });
        })();
