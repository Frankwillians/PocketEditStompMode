# Pocket Edit Web Control Mode

![UI Status](https://img.shields.io/badge/UI/UX-Custom%20Dual%20Control%20Rack-00fff5?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-Web%20/%20GitHub%20Pages-71b73c?style=for-the-badge)
![Control Engine](https://img.shields.io/badge/Engine-Pocket%20Dual%20Control%20Mode-blueviolet?style=for-the-badge)

> **PT-BR:** Modificação avançada de interface e controle para o **Pocket Edit** da **Sonicake Pocket Master**, com foco em uso prático no desktop e no celular, incluindo **Pocket Dual Control Engine**, **modo efeitos**, **modo banco**, **troca A/B**, **mapeamento por teclado/joystick** e **arraste da cadeia de sinal no mobile**.  
> **EN:** Advanced interface and control mod for **Pocket Edit** for the **Sonicake Pocket Master**, focused on practical desktop and mobile use, including **Pocket Dual Control Engine**, **effects mode**, **bank mode**, **A/B switching**, **keyboard/joystick mapping**, and **mobile signal-chain drag support**.

---

## Table of Contents / Sumário

- [Português (PT-BR)](#português-pt-br)
  - [Acesse online](#-acesse-online)
  - [Visão geral](#-visão-geral)
  - [Funcionalidades principais](#️-funcionalidades-principais)
  - [Diferenças para o PocketEdit original](#-diferenças-para-o-pocketedit-original)
  - [Controle por joystick / gamepad USB](#-controle-por-joystick--gamepad-usb)
  - [Experiência mobile](#-experiência-mobile)
  - [Demonstração do layout](#-demonstração-do-layout)
  - [Melhorias implementadas nesta versão](#-melhorias-implementadas-nesta-versão)
  - [Créditos e fork original](#-créditos-e-fork-original)
  - [Observações importantes](#️-observações-importantes)
  - [Roadmap sugerido](#️-roadmap-sugerido)
- [English](#english)
  - [Access online](#-access-online)
  - [Overview](#-overview)
  - [Main features](#️-main-features)
  - [What’s different from original PocketEdit](#-whats-different-from-original-pocketedit)
  - [USB joystick / gamepad control](#-usb-joystick--gamepad-control)
  - [Mobile experience](#-mobile-experience)
  - [Layout preview](#-layout-preview)
  - [Improvements included in this version](#-improvements-included-in-this-version)
  - [Credits and original fork](#-credits-and-original-fork)
  - [Important notes](#️-important-notes)
  - [Suggested roadmap](#️-suggested-roadmap)

---

# Português (PT-BR)

## 🌐 Acesse online

🚀 **[Abrir Pocket Edit Web Control Mode](https://frankwillians.github.io/PocketEditStompMode/)**

### 📱 Uso em smartphones

- **Android:** recomenda-se usar **Google Chrome** ou **Samsung Internet**.
- **iPhone (iOS):** funciona para uso touch, edição e navegação visual. Para usar como web app, abra no Safari e selecione **Compartilhar → Adicionar à Tela de Início**.

---

## 🎛️ Visão geral

O **Pocket Edit Web Control Mode** é uma versão expandida do Pocket Edit original, reorganizada para funcionar não apenas como editor de presets, mas também como uma interface de controle mais prática para palco, bancada e uso mobile.

A principal adição desta versão é o **Pocket Dual Control Engine**, uma camada de controle que permite operar a interface usando **dois grupos de botões**, com suporte a:

- **clique curto**
- **clique longo**
- **modo efeitos**
- **modo banco**
- **troca de banco A/B**
- **mapeamento por teclado**
- **mapeamento por joystick / gamepad USB**
- **persistência de configurações via navegador**

Além disso, a interface também recebeu melhorias visuais e de usabilidade, incluindo um **stompboard visual**, **drag da cadeia de sinal no mobile** e **exportação de presets em JSON**.

---

## ⚙️ Funcionalidades principais

### 1. Pocket Dual Control Engine

O **Pocket Dual Control Engine** é a camada de controle adicional embutida nesta versão do projeto.

Ele trabalha com **dois grupos de botões**, permitindo controlar tanto efeitos individuais quanto presets completos, sem depender apenas da navegação tradicional do Pocket Edit original.

Cada grupo de botão suporta:

- **Clique curto**
- **Clique longo**
- comportamento diferente dependendo do modo selecionado

Também existe um **Mode Toggle** mapeável, usado para alternar entre os modos de operação.

---

### 2. Modo Efeitos

No **Modo Efeitos**, os botões se comportam como footswitches para acionar efeitos.

Cada grupo possui duas ações:

- **Botão 1 curto** → primeira função do grupo 1
- **Botão 1 longo** → segunda função do grupo 1
- **Botão 2 curto** → primeira função do grupo 2
- **Botão 2 longo** → segunda função do grupo 2

Exemplo de uso:

- Botão 1 curto → **FX1**
- Botão 1 longo → **FX2**
- Botão 2 curto → **DRV**
- Botão 2 longo → **RVB**

Isso permite operar múltiplas funções usando apenas dois botões físicos.

---

### 3. Modo Banco

No **Modo Banco**, os mesmos dois grupos deixam de controlar stomp individual e passam a chamar presets.

Cada banco possui quatro ações configuráveis:

- **Botão 1 curto**
- **Botão 1 longo**
- **Botão 2 curto**
- **Botão 2 longo**

Essa estrutura foi pensada para permitir navegação rápida entre presets sem precisar tocar diretamente na lista da interface.

---

### 4. Banco A/B

O sistema possui **dois bancos independentes de presets**:

- **Banco A**
- **Banco B**

A troca entre eles é feita pressionando:

```txt
Botão 1 + Botão 2 juntos
```

O banco ativo é exibido diretamente na barra superior do **Pocket Dual Control Engine**, deixando a navegação mais clara durante o uso.

---

### 5. Mapeamento híbrido

O sistema de mapeamento aceita diferentes formas de controle físico:

- **teclado**
- **joystick / gamepad USB**
- **placas encoder**
- **footswitches que se comportem como teclado ou gamepad**
- **controladores externos reconhecidos pelo navegador**

As associações ficam salvas no navegador via `localStorage`, então o mapeamento permanece salvo entre sessões.

---

### 6. Stompboard visual

A interface mantém uma pedaleira visual com módulos como:

- **NR**
- **FX1**
- **DRV**
- **FX2**
- **DLY**
- **RVB**
- **PRESET -**
- **PRESET +**

Cada stomp possui botão visual, LED e integração com a lógica do engine.

---

### 7. Drag da cadeia de sinal no mobile

A cadeia de sinal pode ser reorganizada diretamente no celular.

Recursos adicionados:

- arraste por toque
- área de toque ampliada
- reordenação dos módulos
- auto-scroll lateral ao arrastar perto das bordas
- destaque visual do alvo durante o movimento

Na prática, isso torna a edição no smartphone muito mais confortável.

---

### 8. Exportação de presets

A interface permite exportar o preset atual em **JSON legível**, incluindo:

- nome do preset
- volume
- modo do amp
- módulos ativos
- efeitos selecionados
- parâmetros de cada módulo
- ordem da cadeia de sinal

Esse recurso é útil para backup, compartilhamento e documentação de presets.

---

## 🔍 Diferenças para o PocketEdit original

Esta versão não altera apenas o visual — ela adiciona uma nova camada de operação ao projeto original.

### O que foi adicionado nesta modificação

- **Pocket Dual Control Engine**
- sistema de **clique curto / clique longo**
- **Modo Efeitos** para controle rápido de stomps
- **Modo Banco** para navegação de presets
- **Banco A/B** com troca por combinação de botões
- **Mode Toggle** mapeável
- mapeamento por **teclado**
- mapeamento por **joystick / gamepad USB**
- persistência de mapeamento e preferências via `localStorage`
- **stompboard visual** integrado à interface
- **drag da cadeia de sinal no mobile**
- **auto-scroll** durante arraste em telas touch
- **exportação de presets em JSON**

### O que continua vindo do PocketEdit original

- estrutura base do editor
- comunicação principal com a Pocket Master
- manipulação central de presets
- lógica principal dos módulos e parâmetros
- fluxo original de edição do projeto base

---

## 🎮 Controle por joystick / gamepad USB

O projeto usa a **Gamepad API** do navegador para reconhecer controladores compatíveis.

Fluxo básico:

1. Conecte o controle ao computador.
2. Abra a página do projeto.
3. Entre no modo de aprendizado da função desejada.
4. Pressione o botão físico correspondente.
5. O navegador salva automaticamente a associação.

---

## 📱 Experiência mobile

A versão web recebeu ajustes específicos para telas pequenas:

- barra superior mais compacta
- rack responsivo
- botões otimizados para toque
- drag da cadeia de sinal
- auto-scroll horizontal
- painel de edição mais acessível

O objetivo é fazer a interface funcionar bem tanto como editor quanto como uma central de controle touch para a Pocket Master.

---

## 📸 Demonstração do layout

![Pocket Edit Web Control Mode Interface](/img/gui.png)

> Você pode substituir essa imagem por um screenshot atualizado da versão com o **Pocket Dual Control Engine** já ativo, mostrando o **modo banco**, o **banco A/B** e a barra superior final.

---

## 🧠 Melhorias implementadas nesta versão

- **Pocket Dual Control Engine**
- **Modo Efeitos**
- **Modo Banco**
- **Banco A/B**
- troca de banco com **Botão 1 + Botão 2**
- **clique curto / clique longo**
- **Mode Toggle mapeável**
- mapeamento por **teclado**
- mapeamento por **joystick / gamepad USB**
- persistência via **localStorage**
- **stompboard visual**
- **PRESET +** e **PRESET -**
- drag da cadeia de sinal no mobile
- auto-scroll durante arraste
- exportação de presets em JSON
- layout responsivo para desktop e mobile

---

## 🤝 Créditos e fork original

Este projeto é uma modificação visual, estrutural e de controle desenvolvida como um **fork customizado** do software original:

- **Repositório base original:** [suckyble/PocketEdit](https://github.com/suckyble/PocketEdit)

Todo o núcleo do editor, comunicação base, estrutura principal de edição, manipulação de presets e integração central pertencem ao projeto original.

Esta versão adiciona uma camada extra de interface, controle físico, usabilidade mobile e fluxo de operação ao vivo sobre o Pocket Edit original.

---

## ⚠️ Observações importantes

- Esta documentação descreve somente a **versão Web**.
- O uso de joystick/gamepad depende da compatibilidade do navegador.
- Controles físicos funcionam melhor com a aba ativa.
- BLE, USB e permissões podem variar conforme navegador, sistema operacional e dispositivo.
- Evite mapear o mesmo botão físico em várias funções ao mesmo tempo para prevenir conflitos.

---

## 🛠️ Roadmap sugerido

- importação de presets JSON
- perfis salvos de mapeamento
- modo setlist
- suporte a mais de dois bancos
- indicador visual de clique longo
- export/import das preferências do engine
- labels customizados para presets dos bancos

---

# English

## 🌐 Access online

🚀 **[Open Pocket Edit Web Control Mode](https://frankwillians.github.io/PocketEditStompMode/)**

### 📱 Smartphone usage

- **Android:** **Google Chrome** or **Samsung Internet** is recommended.
- **iPhone (iOS):** works for touch use, editing and visual navigation. To use it as a web app, open it in Safari and choose **Share → Add to Home Screen**.

---

## 🎛️ Overview

**Pocket Edit Web Control Mode** is an expanded version of the original Pocket Edit, redesigned to work not only as a preset editor but also as a more practical control interface for live use, bench setups and mobile editing.

The main addition in this version is the **Pocket Dual Control Engine**, a control layer that allows the interface to be operated using **two button groups**, with support for:

- **short press**
- **long press**
- **effects mode**
- **bank mode**
- **A/B bank switching**
- **keyboard mapping**
- **USB joystick / gamepad mapping**
- **browser-based persistent settings**

On top of that, the interface also includes usability and visual improvements such as a **visual stompboard**, **mobile signal-chain drag support**, and **JSON preset export**.

---

## ⚙️ Main features

### 1. Pocket Dual Control Engine

The **Pocket Dual Control Engine** is the additional control layer built into this version of the project.

It works with **two button groups**, allowing the user to control both individual effects and full presets without relying only on the original Pocket Edit navigation flow.

Each button group supports:

- **short press**
- **long press**
- different behavior depending on the selected mode

There is also a mappable **Mode Toggle** used to switch between operating modes.

---

### 2. Effects Mode

In **Effects Mode**, the buttons behave like footswitches for effect control.

Each group has two actions:

- **Button 1 short press** → first Group 1 function
- **Button 1 long press** → second Group 1 function
- **Button 2 short press** → first Group 2 function
- **Button 2 long press** → second Group 2 function

Example setup:

- Button 1 short → **FX1**
- Button 1 long → **FX2**
- Button 2 short → **DRV**
- Button 2 long → **RVB**

This makes it possible to control multiple functions using only two physical buttons.

---

### 3. Bank Mode

In **Bank Mode**, the same two button groups stop acting as stomp controls and start triggering presets.

Each bank has four configurable actions:

- **Button 1 short press**
- **Button 1 long press**
- **Button 2 short press**
- **Button 2 long press**

This structure was designed to allow quick preset navigation without having to interact directly with the preset list.

---

### 4. A/B Banks

The system includes **two independent preset banks**:

- **Bank A**
- **Bank B**

Switching between them is done by pressing:

```txt
Button 1 + Button 2 together
```

The active bank is shown directly in the **Pocket Dual Control Engine** top bar for clearer navigation during live use.

---

### 5. Hybrid mapping

The mapping system accepts multiple physical control sources:

- **keyboard**
- **USB joystick / gamepad**
- **encoder boards**
- **footswitches that behave as keyboard or gamepad devices**
- **external controllers recognized by the browser**

Mappings are stored in the browser via `localStorage`, so they persist across sessions.

---

### 6. Visual stompboard

The interface keeps a visual pedalboard with modules such as:

- **NR**
- **FX1**
- **DRV**
- **FX2**
- **DLY**
- **RVB**
- **PRESET -**
- **PRESET +**

Each stomp includes a visual button, LED indicator and engine integration.

---

### 7. Mobile signal-chain drag

The signal chain can be reorganized directly on mobile devices.

Added features include:

- touch drag support
- larger touch interaction area
- module reordering
- side auto-scroll when dragging near the edges
- visual drop target highlighting

In practice, this makes smartphone editing much more comfortable.

---

### 8. Preset export

The interface allows exporting the current preset as **readable JSON**, including:

- preset name
- volume
- amp mode
- active modules
- selected effects
- module parameters
- signal-chain order

This is useful for backups, sharing and documenting presets.

---

## 🔍 What’s different from original PocketEdit

This version does more than just change the visuals — it adds a new control layer on top of the original project.

### Added in this mod

- **Pocket Dual Control Engine**
- **short press / long press** button logic
- **Effects Mode** for quick stomp control
- **Bank Mode** for preset navigation
- **A/B Banks** with combo switching
- mappable **Mode Toggle**
- **keyboard mapping**
- **USB joystick / gamepad mapping**
- mapping and preference persistence via `localStorage`
- integrated **visual stompboard**
- **mobile signal-chain drag**
- **auto-scroll** during drag on touch screens
- **JSON preset export**

### Still provided by the original PocketEdit base

- the main editor structure
- primary Pocket Master communication logic
- central preset handling
- core module and parameter logic
- the original editing workflow of the base project

---

## 🎮 USB joystick / gamepad control

The project uses the browser’s **Gamepad API** to recognize compatible controllers.

Basic flow:

1. Connect the controller to the computer.
2. Open the project page.
3. Enter learn mode for the desired function.
4. Press the physical button you want to assign.
5. The browser stores the mapping automatically.

---

## 📱 Mobile experience

The web version includes specific adjustments for smaller screens:

- more compact top bar
- responsive rack
- touch-friendly buttons
- signal-chain drag support
- horizontal auto-scroll
- more accessible editing panel

The goal is to make the interface work well both as an editor and as a touch-based control hub for the Pocket Master.

---

## 📸 Layout preview

![Pocket Edit Web Control Mode Interface](/img/gui.png)

> You can replace this image with an updated screenshot showing the **Pocket Dual Control Engine** active, including **Bank Mode**, **A/B bank display**, and the final top bar layout.

---

## 🧠 Improvements included in this version

- **Pocket Dual Control Engine**
- **Effects Mode**
- **Bank Mode**
- **A/B Banks**
- bank switching with **Button 1 + Button 2**
- **short press / long press**
- mappable **Mode Toggle**
- **keyboard mapping**
- **USB joystick / gamepad mapping**
- **localStorage persistence**
- **visual stompboard**
- **PRESET +** and **PRESET -**
- mobile signal-chain drag support
- auto-scroll during drag
- JSON preset export
- responsive layout for desktop and mobile

---

## 🤝 Credits and original fork

This project is a custom visual, structural and control-oriented modification built on top of the original software:

- **Original base repository:** [suckyble/PocketEdit](https://github.com/suckyble/PocketEdit)

All editor core logic, base communication, main editing structure, preset handling and central integration belong to the original project.

This version adds an extra layer of interface, physical control support, mobile usability and live-oriented workflow on top of the original Pocket Edit.

---

## ⚠️ Important notes

- This documentation describes the **Web version only**.
- Joystick/gamepad support depends on browser compatibility.
- Physical controls work best with the browser tab active.
- BLE, USB and permission behavior may vary depending on browser, operating system and device.
- Avoid mapping the same physical button to multiple functions at the same time to prevent conflicts.

---

## 🛠️ Suggested roadmap

- JSON preset import
- saved hardware mapping profiles
- setlist mode
- support for more than two banks
- visual long-press indicator
- import/export for engine preferences
- custom labels for bank presets
