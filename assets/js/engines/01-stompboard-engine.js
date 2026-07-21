(function() {
            let activeGamepadIdx = null;
            let learningStompTarget = null;
            
            const modulosBypass = [
                { id: "0", name: "NR", color: "#4a5568" },
                { id: "1", name: "FX1", color: "#00ffaa" },
                { id: "2", name: "DRV", color: "#ffd000" },
                { id: 6, name: "FX2", color: "#3399ff" },
                { id: 7, name: "DLY", color: "#ff6600" },
                { id: 8, name: "RVB", color: "#b366ff" }
            ];

            const modulosNavegacao = [
                { id: "nav_prev", name: "PRESET -", color: "#00fff5" },
                { id: "nav_next", name: "PRESET +", color: "#00fff5" }
            ];

            let mapaBotaoStomp = { "0": null, "1": null, "2": null, "6": null, "7": null, "8": null, "nav_prev": null, "nav_next": null };

            if (localStorage.getItem('darkstar_pocket_stomp_map')) {
                try { mapaBotaoStomp = JSON.parse(localStorage.getItem('darkstar_pocket_stomp_map')); } catch(e) {}
            }

            function inicializarInterfaceDarkStar() {
                const editorContainer = document.getElementById('editor-container');
                const signalChainOriginal = document.querySelector('.signal-chain');
                
                if (editorContainer && signalChainOriginal && !document.getElementById('darkstar-stomp-rack')) {
                    const template = document.getElementById('darkstar-rack-template');
                    const rackClone = template.content.cloneNode(true);
                    signalChainOriginal.after(rackClone);
                    construirMatrizStompsFixas();
                    
                    // Inicia o interceptador de nós para capturar e mover os painéis de edição originais
                    ativarCapturadorDePainelOriginal();
                }

                const connectionPanel = document.querySelector('.connection-panel');
                if (connectionPanel && !document.getElementById('joy_select_group')) {
                    const selectGroup = document.createElement('div');
                    selectGroup.id = 'joy_select_group';
                    selectGroup.className = 'darkstar-sidebar-select-group';
                    selectGroup.innerHTML = `
                        <label>Controle USB / Joystick</label>
                        <select id="darkstar_joy_select" class="darkstar-sidebar-select">
                            <option value="">Buscando dispositivo...</option>
                        </select>
                    `;
                    connectionPanel.appendChild(selectGroup);

                    document.getElementById('darkstar_joy_select').onchange = (e) => {
                        if (e.target.value !== "") activeGamepadIdx = parseInt(e.target.value);
                    };
                }
            }

            // MOTOR MUTATION OBSERVER: Monitoriza e redireciona os menus originais para o topo do nosso rack
            function ativarCapturadorDePainelOriginal() {
                const slotDestino = document.getElementById('darkstar-dynamic-editor-slot');
                const bodyContainer = document.body;

                const observer = new MutationObserver((mutations) => {
                    // Procura por painéis de parâmetros gerados pelo clique nos módulos (Amp, Delay, etc.)
                    const painelOriginal = document.querySelector('.module-edit-panel, .param-panel, [class*="-panel-container"]');
                    
                    if (painelOriginal && painelOriginal.parentElement !== slotDestino) {
                        // Move o painel do rodapé para cima das nossas stomps na mesma fração de segundo
                        slotDestino.appendChild(painelOriginal);
                    }
                });

                observer.observe(bodyContainer, { childList: true, subtree: true });
            }

            function construirMatrizStompsFixas() {
                const containerEfeitos = document.getElementById('stomp-matrix-container');
                const containerNavegacao = document.getElementById('preset-navigation-container');
                if (!containerEfeitos || !containerNavegacao) return;

                containerEfeitos.innerHTML = '';
                containerNavegacao.innerHTML = '';

                modulosBypass.forEach(mod => {
                    const box = document.createElement('div');
                    box.className = 'darkstar-stompbox';
                    box.style.borderTopColor = mod.color;
                    box.innerHTML = `
                        <div class="stomp-name">${mod.name}</div>
                        <div id="stomp-led-${mod.id}" class="stomp-led"></div>
                        <div class="stomp-footswitch" onclick="window.forçarAtivacaoModuloDarkStar('${mod.id}', event)"></div>
                        <div class="stomp-mapping-label" id="map_label_${mod.id}">Livre</div>
                        <button class="darkstar-learn-btn" onclick="window.dispararMapeamentoStomp('${mod.id}', event)">Mapear</button>
                    `;
                    containerEfeitos.appendChild(box);
                });

                modulosNavegacao.forEach(mod => {
                    const box = document.createElement('div');
                    box.className = 'darkstar-stompbox navigation-box';
                    box.style.borderTopColor = mod.color;
                    box.innerHTML = `
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <div id="stomp-led-${mod.id}" class="stomp-led utility-led"></div>
                            <div class="stomp-name">${mod.name}</div>
                        </div>
                        <div class="stomp-footswitch" onclick="window.forçarAtivacaoModuloDarkStar('${mod.id}', event)"></div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div class="stomp-mapping-label" id="map_label_${mod.id}">Livre</div>
                            <button class="darkstar-learn-btn" onclick="window.dispararMapeamentoStomp('${mod.id}', event)">Mapear</button>
                        </div>
                    `;
                    containerNavegacao.appendChild(box);
                });

                atualizarApenasLabelsTexto();
            }

            function atualizarApenasLabelsTexto() {
                [...modulosBypass, ...modulosNavegacao].forEach(mod => {
                    const labelNode = document.getElementById(`map_label_${mod.id}`);
                    if (labelNode) {
                        const mapped = mapaBotaoStomp[mod.id];
                        if (mapped !== null && mapped !== undefined) {
                            const partes = String(mapped).split("_");
                            const tipo = partes[0];
                            const valor = partes[1] || "";
                            labelNode.innerText = (tipo === "Joy") ? `Btn ${valor}` : `Tec: ${valor}`;
                        } else {
                            labelNode.innerText = "Livre";
                        }
                    }
                });
            }

            function sincronizarLedsDoRack() {
                modulosBypass.forEach(mod => {
                    const ledRack = document.getElementById(`stomp-led-${mod.id}`);
                    const modOriginal = document.querySelector(`.chain-module[data-module-id="${mod.id}"]`);
                    if (modOriginal && ledRack) {
                        const statusDotOriginal = modOriginal.querySelector('.module-status');
                        if (statusDotOriginal && statusDotOriginal.classList.contains('on')) {
                            ledRack.classList.add('active');
                        } else {
                            ledRack.classList.remove('active');
                        }
                    }
                });
            }

            window.dispararMapeamentoStomp = function(moduleId, event) {
                if (event) event.stopPropagation();
                learningStompTarget = String(moduleId);
                
                document.querySelectorAll('.darkstar-learn-btn').forEach(b => {
                    b.classList.remove('listening');
                    b.innerText = 'Mapear';
                });

                if (event && event.target) {
                    event.target.classList.add('listening');
                    event.target.innerText = 'Aperte...';
                }
            };

            window.forçarAtivacaoModuloDarkStar = function(moduleId, event) {
                if (event) event.stopPropagation();
                
                if (modulosBypass.some(m => m.id === Number(moduleId) || m.id === String(moduleId))) {
                    const modOriginal = document.querySelector(`.chain-module[data-module-id="${moduleId}"]`);
                    if (modOriginal) {
                        modOriginal.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
                        const statusDotOriginal = modOriginal.querySelector('.module-status');
                        if (statusDotOriginal) statusDotOriginal.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
                    }
                } else if (moduleId === "nav_prev" || moduleId === "nav_next") {
                    const listItems = Array.from(document.querySelectorAll('.patch-item, .patch-list-item, [id*="patch-"], [class*="patch-item"]'))
                        .filter(item => {
                            const txt = item.innerText.trim();
                            return txt.match(/^[PF]?\d+/i) || item.getAttribute('data-patch-id') !== null;
                        });

                    if (listItems.length === 0) return;

                    let activeIndex = listItems.findIndex(item => 
                        item.classList.contains('active') || 
                        item.classList.contains('selected') ||
                        item.classList.contains('current')
                    );

                    if (activeIndex === -1) {
                        const currentPatchNum = document.querySelector('.patch-number');
                        if (currentPatchNum) {
                            const numInt = parseInt(currentPatchNum.value || currentPatchNum.innerText || "1", 10);
                            activeIndex = isNaN(numInt) ? 0 : Math.max(0, Math.min(numInt - 1, listItems.length - 1));
                        } else {
                            activeIndex = 0;
                        }
                    }

                    let targetIndex = activeIndex;
                    if (moduleId === "nav_next") {
                        targetIndex = (activeIndex + 1) >= listItems.length ? 0 : activeIndex + 1;
                    } else {
                        targetIndex = (activeIndex - 1) < 0 ? listItems.length - 1 : activeIndex - 1;
                    }

                    const targetBtn = listItems[targetIndex];
                    if (targetBtn) {
                        targetBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
                        targetBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
                        targetBtn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
                        targetBtn.dispatchEvent(new Event('change', { bubbles: true }));
                        targetBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }

                    const ledUtil = document.getElementById(`stomp-led-${moduleId}`);
                    if (ledUtil) {
                        ledUtil.classList.add('active');
                        setTimeout(() => ledUtil.classList.remove('active'), 200);
                    }
                }
            };

            function gerenciarAntiConflitoMapeamento(idIdentificador, targetId) {
                for (let mId in mapaBotaoStomp) {
                    if (mapaBotaoStomp[mId] === idIdentificador && mId !== targetId) {
                        mapaBotaoStomp[mId] = null;
                    }
                }
            }

            document.addEventListener('keydown', function(e) {
                if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT') return;

                const keyId = `Key_${e.key}`;

                if (learningStompTarget !== null) {
                    e.preventDefault();
                    let targetCache = learningStompTarget;
                    learningStompTarget = null;
                    
                    gerenciarAntiConflitoMapeamento(keyId, targetCache);
                    mapaBotaoStomp[targetCache] = keyId;
                    localStorage.setItem('darkstar_pocket_stomp_map', JSON.stringify(mapaBotaoStomp));

                    document.querySelectorAll('.darkstar-learn-btn').forEach(b => {
                        b.classList.remove('listening');
                        b.innerText = 'Mapear';
                    });

                    atualizarApenasLabelsTexto();
                } else {
                    for (let mId in mapaBotaoStomp) {
                        if (mapaBotaoStomp[mId] === keyId) {
                            e.preventDefault();
                            window.forçarAtivacaoModuloDarkStar(mId, null);
                        }
                    }
                }
            });

            function processarMotorDarkStar() {
                inicializarInterfaceDarkStar();
                sincronizarLedsDoRack();

                const gps = navigator.getGamepads();
                
                const selectSide = document.getElementById('darkstar_joy_select');
                if (selectSide && gps.length > 0) {
                    let validGamepads = 0;
                    for (let i = 0; i < gps.length; i++) { if (gps[i]) validGamepads++; }
                    
                    if (selectSide.options.length <= 1 && validGamepads > 0) {
                        let optionsHtml = '';
                        for (let i = 0; i < gps.length; i++) {
                            if (gps[i]) {
                                optionsHtml += `<option value="${i}">[USB] ${gps[i].id.substring(0, 14)}...</option>`;
                                if (activeGamepadIdx === null) activeGamepadIdx = i;
                            }
                        }
                        selectSide.innerHTML = optionsHtml;
                    }
                }

                if (activeGamepadIdx !== null && gps[activeGamepadIdx]) {
                    const gp = gps[activeGamepadIdx];
                    if (window.darkStarButtonsState === undefined) window.darkStarButtonsState = new Array(gp.buttons.length).fill(false);
                    if (window.darkStarIgnoreNextRelease === undefined) window.darkStarIgnoreNextRelease = {};

                    for (let i = 0; i < gp.buttons.length; i++) {
                        let pressed = gp.buttons[i].pressed;
                        
                        if (pressed && learningStompTarget !== null) {
                            const joyId = `Joy_${i}`;
                            let targetCache = learningStompTarget;
                            learningStompTarget = null;
                            
                            gerenciarAntiConflitoMapeamento(joyId, targetCache);
                            mapaBotaoStomp[targetCache] = joyId;
                            localStorage.setItem('darkstar_pocket_stomp_map', JSON.stringify(mapaBotaoStomp));
                            
                            window.darkStarButtonsState[i] = true;
                            window.darkStarIgnoreNextRelease = {}; 

                            document.querySelectorAll('.darkstar-learn-btn').forEach(b => {
                                b.classList.remove('listening');
                                b.innerText = 'Mapear';
                            });
                            
                            atualizarApenasLabelsTexto();
                            break;
                        }
                        
                        if (pressed && !window.darkStarButtonsState[i]) {
                            const joyId = `Joy_${i}`;
                            if (!window.darkStarIgnoreNextRelease[i]) {
                                for (let mId in mapaBotaoStomp) {
                                    if (mapaBotaoStomp[mId] === joyId) {
                                        window.forçarAtivacaoModuloDarkStar(mId, null);
                                    }
                                }
                            }
                        }
                        if (!pressed && window.darkStarButtonsState[i]) {
                            if (window.darkStarIgnoreNextRelease) window.darkStarIgnoreNextRelease[i] = false;
                        }
                        window.darkStarButtonsState[i] = pressed;
                    }
                }
                requestAnimationFrame(processarMotorDarkStar);
            }

            window.addEventListener('load', () => {
                requestAnimationFrame(processarMotorDarkStar);
            });
        })();
