# Pocket Dual Control Engine

![UI Status](https://img.shields.io/badge/UI/UX-Custom%20Stage%20Rack-00fff5?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-Pocket%20Edit%20/%20WebMIDI%20/%20WebBluetooth-71b73c?style=for-the-badge)
![Control Mode](https://img.shields.io/badge/Mode-Stomp%20%2B%20Preset%20Bank%20Engine-ffd000?style=for-the-badge)
![Responsive](https://img.shields.io/badge/Mobile-iPhone%20%2F%20Android%20Optimized-blueviolet?style=for-the-badge)

Custom fork of **Pocket Edit** with a stage-oriented stompboard interface, physical controller mapping, preset bank control, short/long press actions, and mobile-friendly layout.

---

- [Português](#português)
- [English](#english)

---

# Português

## Visão geral

**Pocket Dual Control Engine** é um fork customizado do **Pocket Edit** focado em transformar a interface original em uma central de controle mais prática para uso ao vivo, bancada, setups headless e controladores físicos.

O projeto adiciona uma camada extra de controle com:

- modo efeitos;
- modo banco;
- mapeamento de botões físicos;
- suporte a teclado, joystick USB e controladores HID/Bluetooth;
- clique curto e clique longo;
- troca de presets via comando SysEx;
- Bank Shift A/B;
- Mode Toggle mapeável;
- Stompboard visual;
- layout responsivo para desktop e mobile.

---

## Acesso online

Use diretamente pelo navegador:

🚀 **[Abrir Pocket Dual Control Engine](https://frankwillians.github.io/PocketEditStompMode/)**

---

## Compatibilidade

### Desktop

Funciona em navegadores modernos com suporte a:

- WebMIDI;
- WebBluetooth;
- USB/HID;
- teclado;
- joystick/gamepad.

### Android

Recomendado usar:

- Google Chrome;
- Samsung Internet.

Compatível com:

- controladores USB via OTG;
- joysticks;
- footswitches Bluetooth;
- placas encoder;
- controladores HID.

### iPhone / iOS

O Safari possui limitações com WebBluetooth. Para BLE, recomenda-se usar:

- Bluefy;
- WebBLE Browser.

Para uso apenas como interface touch, é possível abrir no Safari e instalar como web app:

**Compartilhar → Adicionar à Tela de Início**

---

## Principais recursos

## 1. Dual Control Engine

O **Dual Control Engine** adiciona uma camada de operação sobre o Pocket Edit, permitindo alternar entre dois modos:

- **Modo Efeitos**
- **Modo Banco**

Essa camada não substitui o núcleo original do Pocket Edit. Ela apenas adiciona novas rotas de controle físico e visual.

---

## 2. Modo Efeitos

No **Modo Efeitos**, os dois botões principais funcionam como controle stomp:

### Botão 1
- clique curto → FX1
- clique longo → FX2

### Botão 2
- clique curto → DRV
- clique longo → RVB

Esse modo é ideal para ligar/desligar efeitos durante a execução, sem trocar de preset.

---

## 3. Modo Banco

No **Modo Banco**, os mesmos botões deixam de controlar efeitos e passam a chamar presets completos.

Cada botão possui duas ações:

### Botão 1
- clique curto → preset configurável
- clique longo → preset configurável

### Botão 2
- clique curto → preset configurável
- clique longo → preset configurável

---

## 4. Bank Shift A/B

O sistema possui um botão mapeável chamado **Bank Shift**.

Ele alterna entre:

- **Banco A**
- **Banco B**

Cada banco possui 4 presets configuráveis.

### Banco A
- Botão 1 curto
- Botão 1 longo
- Botão 2 curto
- Botão 2 longo

### Banco B
- Botão 1 curto
- Botão 1 longo
- Botão 2 curto
- Botão 2 longo

Com isso, usando apenas dois botões principais + um Bank Shift, é possível acessar até **8 presets diretos**.

---

## 5. Mode Toggle mapeável

O sistema também possui um botão mapeável de **Mode Toggle**.

Esse botão alterna entre:

- **Modo Efeitos**
- **Modo Banco**

Assim, é possível trocar o comportamento dos botões físicos sem tocar na tela.

---

## 6. Clique curto e clique longo

O motor de entrada diferencia:

- toque rápido;
- toque segurado por aproximadamente 500ms.

Isso permite duas funções por botão físico, dobrando a quantidade de comandos disponíveis sem exigir mais hardware.

---

## 7. Envio de presets via rota manual do Pocket Edit

A troca de presets no modo banco usa a rota manual do Pocket Edit.

O sistema:

1. identifica o preset configurado;
2. busca o comando SysEx correspondente;
3. injeta o comando no campo manual;
4. aciona o botão de envio do Pocket Edit;
5. aguarda resposta da pedaleira;
6. sincroniza a interface visual;
7. atualiza o preset selecionado na lista.

Isso permite que o preset mude no hardware e também na tela.

---

## 8. Stompboard visual

A interface adiciona uma área visual de pedaleira com:

- NR;
- FX1;
- DRV;
- FX2;
- DLY;
- RVB;
- PRESET -;
- PRESET +.

Cada pedal possui:

- footswitch visual;
- LED;
- botão de mapeamento;
- label mostrando tecla ou botão atribuído.

---

## 9. Navegação PRESET + / PRESET -

Além dos bancos diretos, a interface mantém botões de navegação sequencial:

- PRESET -
- PRESET +

Eles permitem navegar pela lista de presets da forma tradicional.

---

## 10. Mapeamento físico

O sistema permite mapear comandos para:

- teclado;
- joystick USB;
- gamepad;
- controlador HID;
- footswitch Bluetooth;
- placas encoder;
- projetos com Arduino, STM32 ou Zero Delay.

Os mapeamentos são salvos no navegador via `localStorage`.

---

## 11. Observação sobre conflitos de mapeamento

O projeto possui duas camadas de mapeamento:

1. **Stompboard normal**
2. **Dual Control Engine**

Por limitação da integração atual, é recomendado **não usar o mesmo botão físico nas duas camadas ao mesmo tempo**.

Exemplo a evitar:

- mapear `Key A` no Stompboard;
- e também mapear `Key A` no Botão 1 do Dual Control Engine.

Isso pode causar acionamento duplicado ou conflito de comportamento.

### Recomendação

Use botões diferentes para cada função.

Exemplo seguro:

- Botão 1 do Dual Engine → `Key A`
- Botão 2 do Dual Engine → `Key D`
- Bank Shift → `Key C`
- Mode Toggle → `Key M`
- Stompboard normal → outras teclas ou botões

---

## 12. Layout responsivo

A interface foi adaptada para telas menores, incluindo smartphones como iPhone 11 e Android.

Melhorias mobile:

- layout compacto;
- botões maiores para toque;
- reorganização da cadeia de sinal;
- redução de overflow horizontal;
- suporte a WebApp em tela cheia;
- Stompboard reorganizado para uso touch.

---

## 13. Uso recomendado

Este fork é indicado para:

- uso ao vivo;
- setups compactos;
- rigs headless;
- testes de bancada;
- controladores personalizados;
- footswitches USB/Bluetooth;
- operação via celular ou tablet.

---

## Créditos

Este projeto é um fork customizado do **Pocket Edit**.

### Repositório original

- **Pocket Edit:** [suckyble/PocketEdit](https://github.com/suckyble/PocketEdit)

Todos os créditos pelo núcleo original do editor, comunicação MIDI, sincronização de presets, gerenciamento de módulos e lógica base pertencem ao autor original do Pocket Edit.

---

## Screenshot

![Pocket Dual Control Engine Interface](/img/gui.png)

---

# English

## Overview

**Pocket Dual Control Engine** is a custom fork of **Pocket Edit** focused on turning the original editor into a more practical control surface for live use, bench testing, headless setups, and physical controllers.

This project adds an extra control layer with:

- effects mode;
- preset bank mode;
- physical button mapping;
- keyboard, USB joystick and HID/Bluetooth controller support;
- short press and long press actions;
- SysEx preset switching;
- Bank Shift A/B;
- mappable Mode Toggle;
- visual stompboard;
- responsive desktop and mobile layout.

---

## Online access

Use it directly in your browser:

🚀 **[Open Pocket Dual Control Engine](https://frankwillians.github.io/PocketEditStompMode/)**

---

## Compatibility

### Desktop

Works in modern browsers with support for:

- WebMIDI;
- WebBluetooth;
- USB/HID;
- keyboard;
- joystick/gamepad.

### Android

Recommended browsers:

- Google Chrome;
- Samsung Internet.

Compatible with:

- USB controllers through OTG;
- joysticks;
- Bluetooth footswitches;
- encoder boards;
- HID controllers.

### iPhone / iOS

Safari has WebBluetooth limitations. For BLE support, recommended browsers include:

- Bluefy;
- WebBLE Browser.

For touch-only use, Safari can still be used as a web app:

**Share → Add to Home Screen**

---

## Main features

## 1. Dual Control Engine

The **Dual Control Engine** adds a new control layer on top of Pocket Edit, allowing the user to switch between two modes:

- **Effects Mode**
- **Bank Mode**

This layer does not replace Pocket Edit’s original core. It only adds new physical and visual control routes.

---

## 2. Effects Mode

In **Effects Mode**, the two main physical buttons work as stomp controls:

### Button 1
- short press → FX1
- long press → FX2

### Button 2
- short press → DRV
- long press → RVB

This mode is useful for toggling effects without changing presets.

---

## 3. Bank Mode

In **Bank Mode**, the same buttons trigger full presets instead of toggling effects.

Each button has two actions:

### Button 1
- short press → configurable preset
- long press → configurable preset

### Button 2
- short press → configurable preset
- long press → configurable preset

---

## 4. Bank Shift A/B

The system includes a mappable **Bank Shift** button.

It switches between:

- **Bank A**
- **Bank B**

Each bank contains 4 configurable presets.

### Bank A
- Button 1 short
- Button 1 long
- Button 2 short
- Button 2 long

### Bank B
- Button 1 short
- Button 1 long
- Button 2 short
- Button 2 long

With only two main buttons plus one Bank Shift button, the user can access up to **8 direct presets**.

---

## 5. Mappable Mode Toggle

The system also includes a mappable **Mode Toggle** button.

This button switches between:

- **Effects Mode**
- **Bank Mode**

This allows changing the behavior of the physical buttons without touching the screen.

---

## 6. Short press and long press

The input engine distinguishes between:

- quick tap;
- press held for about 500ms.

This allows two actions per physical button, doubling the number of commands without requiring more hardware.

---

## 7. Preset switching through Pocket Edit’s manual route

Preset switching in Bank Mode uses Pocket Edit’s manual command route.

The system:

1. identifies the configured preset;
2. finds the corresponding SysEx command;
3. injects it into the manual command input;
4. triggers Pocket Edit’s send button;
5. waits for the pedal response;
6. syncs the visual interface;
7. updates the selected preset in the list.

This allows the preset to change both on the hardware and on the screen.

---

## 8. Visual stompboard

The interface adds a visual pedalboard area with:

- NR;
- FX1;
- DRV;
- FX2;
- DLY;
- RVB;
- PRESET -;
- PRESET +.

Each pedal includes:

- visual footswitch;
- LED;
- mapping button;
- label showing the assigned key or button.

---

## 9. PRESET + / PRESET - navigation

In addition to direct preset banks, the interface keeps sequential preset navigation through:

- PRESET -
- PRESET +

This allows browsing presets in the traditional way.

---

## 10. Physical mapping

The system can map commands to:

- keyboard;
- USB joystick;
- gamepad;
- HID controller;
- Bluetooth footswitch;
- encoder boards;
- Arduino, STM32 or Zero Delay projects.

Mappings are stored in the browser through `localStorage`.

---

## 11. Mapping conflict note

The project currently has two mapping layers:

1. **Normal Stompboard**
2. **Dual Control Engine**

Because of the current integration limits, it is recommended **not to use the same physical button in both layers at the same time**.

Example to avoid:

- mapping `Key A` to the Stompboard;
- and also mapping `Key A` to Button 1 in the Dual Control Engine.

This can cause duplicate triggers or conflicting behavior.

### Recommendation

Use different buttons for each function.

Safe example:

- Dual Engine Button 1 → `Key A`
- Dual Engine Button 2 → `Key D`
- Bank Shift → `Key C`
- Mode Toggle → `Key M`
- Normal Stompboard → other keys or buttons

---

## 12. Responsive layout

The interface was adapted for smaller screens, including devices such as iPhone 11 and Android phones.

Mobile improvements:

- compact layout;
- larger touch-friendly buttons;
- signal chain reorganization;
- reduced horizontal overflow;
- full-screen WebApp support;
- touch-friendly Stompboard layout.

---

## 13. Recommended use

This fork is recommended for:

- live performance;
- compact setups;
- headless rigs;
- bench testing;
- custom controllers;
- USB/Bluetooth footswitches;
- phone or tablet operation.

---

## Credits

This project is a custom fork of **Pocket Edit**.

### Original repository

- **Pocket Edit:** [suckyble/PocketEdit](https://github.com/suckyble/PocketEdit)

All credits for the original editor core, MIDI communication, preset synchronization, module management, and base logic belong to the original Pocket Edit author.

---

## Screenshot

![Pocket Dual Control Engine Interface](/img/gui.png)
