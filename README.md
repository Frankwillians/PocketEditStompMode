# DarkStar Sim Tech // Pocket Edit Stomp Mode

![UI Status](https://img.shields.io/badge/UI/UX-Custom%20Studio%20Rack-00fff5?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-PiPedal%20/%20Headless%20Guitar%20Server-71b73c?style=for-the-badge)
![CSS Framework](https://img.shields.io/badge/CSS3-%20Advanced%20Flexbox%20%26%20Has-blueviolet?style=for-the-badge)

Esta é uma modificação de interface customizada desenvolvida pela **DarkStar Sim Tech** para o ecossistema de gerenciamento de patches de áudio **Pocket Edit**. O projeto reestrutura o layout original para se comportar como um ambiente híbrido de rack analógico de palco e pedaleira (*stompbox board*) reativa, ideal para operação headless, bancadas de simulação e controle prático no pé.

---

## 🎛️ Funcionalidades Principais

### 1. Modo Stompbox Board
O coração da modificação transforma a base da interface numa pedaleira física skeuomórfica de metal escovado com uma matriz de footswitches reativos (NR, FX1, DRV, FX2, DLY, RVB) e botões dedicados de utilidade (`PRESET -` e `PRESET +`). O chassi organiza-se dinamicamente em 3 colunas para visualização perfeita em smartphones ou 6 botões em linha reta para monitores de computador.

### 2. Mapeamento Híbrido (Joystick USB / Bluetooth)
O motor de escuta de comandos integrados permite mapear os footswitches da pedaleira a qualquer controlador físico de forma flexível:
* **Conexão Direta:** Suporte a joysticks USB, placas encoder (Zero Delay, STM32, Arduino) e teclados.
* **Conexão Sem Fio:** Compatibilidade com manetes e botões mapeados via **Bluetooth**.
* **Mapeamento Ativo:** Sistema dinâmico com botão de "Mapear" individual por pedal que detecta o clique instantâneo do hardware e salva no cache do navegador (`localStorage`).

### 3. Conexão Nativa Pocket Master (via Bluetooth)
O sistema foi projetado para sincronizar e se comunicar de forma transparente com o hardware da própria **Pocket Master via Bluetooth**, permitindo a troca rápida de presets, leitura de logs MIDI em tempo real e atualização instantânea dos LEDs indicadores sem latência perceptível.

---

## ⚡ O Novo Modo de Edição Integrado

Ao invés de deixar o painel de parâmetros nativo (`.effects-panel`) jogado de forma fixa no rodapé ou comprimido na lateral, implementamos um sistema de **Gaveta Hidráulica com Botão Interruptor de Palco**.

A área de parâmetros fica completamente oculta por padrão para dar espaço total e respiro aos footswitches e aos patches no smartphone. O controle foi embutido cirurgicamente na direita da `.signal-chain`. Quando acionado, o painel do Amp desliza suavemente de cima para baixo (usando animação de `max-height` e `opacity` via curvas de Bézier), empurrando o Stomp Rackboard para baixo de forma limpa.

### Resposta Visual Estilo Hardware:
* **Estado Inativo:** O botão exibe um visual fosco em relevo (alto) e o LED indicador esférico integrado fica escuro (apagado).
* **Estado Ativo:** O CSS detecta a abertura via pseudo-classe `:has()`, aplicando um efeito mecânico de afundamento no pedal (sombra interna e escala), a borda acende e o **LED indicador dispara um efeito Glow Néon de alta intensidade**.

---

## 📸 Demonstração do Layout

Abaixo está o design final da interface com a cadeia de sinal superior expandida, o botão de edição embutido com LED indicador ativo e a matriz Stompbox cobrindo a base:

![Pocket Edit Stomp Mode Interface](https://raw.githubusercontent.com/Frankwillians/PocketEditStompMode/main/image_683ce9.jpg)

---

## 🤝 Créditos e Fork Original

Este projeto é uma modificação visual e de mapeamento de hardware desenvolvida como um **fork** e versão customizada do software original:

* **Repositório Base:** [suckyble/PocketEdit](https://github.com/suckyble/PocketEdit)
* **Créditos do Desenvolvedor:** Todos os direitos e créditos pelo desenvolvimento do núcleo reativo do web app, tratamento MIDI, processamento e mapeamento central pertencem ao criador original no repositório do **suckyble**.
* **Modificação Stomp Mode:** Desenvolvido pela **DarkStar Sim Tech** (focada em engenharia de hardware simulador, eletrônica aplicada, modificações de periféricos de alta precisão e interfaces embarcadas).

---

## 📂 Como Aplicar no Repositório

1. Cole as novas regras de estilo no final da sua tag `<style>` no arquivo `index.html`.
2. Adicione o Listener de coordenadas do botão no final do bloco `<script>`.
3. Suba as alterações para o seu servidor local ou diretamente no seu repositório do GitHub.
