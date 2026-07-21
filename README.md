# Pocket Edit Professional Web

![Version](https://img.shields.io/badge/version-v11-blue)
![Platform](https://img.shields.io/badge/platform-Web-orange)
![Status](https://img.shields.io/badge/status-Active-success)
![Fork](https://img.shields.io/badge/fork-PocketEdit-green)

**🇧🇷 Português | 🇺🇸 English**

---

# 🇧🇷 Português

## Sobre

O **Pocket Edit Professional Web** é uma evolução do projeto **PocketEdit**, desenvolvido para a **Sonicake Pocket Master**.

Este projeto mantém toda a base de comunicação do editor original e adiciona novos recursos voltados para edição rápida de timbres, controle ao vivo, compatibilidade com dispositivos móveis e integração com o fluxo **ToneLab AI**.

---

## Principais Recursos

### 🎛️ Editor Completo

- Edição de todos os módulos da Pocket Master
- Alteração de parâmetros em tempo real
- Organização da cadeia de sinal
- Controle de presets
- Comunicação direta com a pedaleira

---

### 🎸 Visual Stompboard

Controle sua Pocket Master através de um painel visual com LEDs de status.

Inclui:

- Noise Reduction
- FX1
- Drive
- FX2
- Delay
- Reverb
- Preset Anterior
- Próximo Preset

---

### 🎮 Controle por Gamepad

Compatível com:

- Gamepad USB
- Controle Bluetooth
- Gamepad API
- Teclado

O sistema possui modo de aprendizado para mapear rapidamente qualquer botão.

Todos os mapeamentos são salvos automaticamente no navegador.

---

### 🍫 Chocolate Dual Control Engine

Sistema que transforma apenas **dois botões físicos** em quatro comandos.

Grupo 1

- Clique curto → FX1
- Clique longo → FX2

Grupo 2

- Clique curto → Drive
- Clique longo → Reverb

Ideal para quem utiliza controladores compactos.

---

### 🤖 ToneLab AI

O ToneLab auxilia na criação de timbres através de um fluxo inteligente.

Em vez de aplicar automaticamente dezenas de parâmetros, o sistema cria um **preset-base limpo**, mantendo:

- AMP ligado
- IR ligado
- Cadeia preservada
- Parâmetros neutros

Após isso, são apresentadas sugestões para ajustes manuais.

---

### 🎸 Suporte a NAM

Compatível com perfis NAM.

Fluxo recomendado:

- AMP em Clone Mode
- NAM aplicado no AMP
- IR separado

---

### 📱 Interface Mobile

O projeto foi otimizado para:

- Android
- iPhone
- Tablets

Possui:

- Interface responsiva
- Controles maiores
- Drag & Drop
- Melhor experiência em telas pequenas

---

### 💾 Presets

Suporta:

- Exportação JSON
- Backup
- Compartilhamento de presets

---

# Como utilizar

Clone o projeto:

```bash
git clone https://github.com/Frankwillians/PocketEditStompMode.git
```

Entre na pasta:

```bash
cd PocketEditStompMode
```

Execute um servidor local:

Python

```bash
python -m http.server 8080
```

ou

Node

```bash
npx serve .
```

Abra:

```
http://localhost:8080
```

Conecte sua Pocket Master e aproveite.

---

## Estrutura

```
assets/
    css/
    js/

legacy/

index.html
README.md
```

---

## Fork Original

Este projeto foi desenvolvido a partir do excelente trabalho disponível em:

https://github.com/suckyble/PocketEdit

Todo o sistema de comunicação com a Pocket Master pertence ao projeto original.

Este fork adiciona:

- Visual Stompboard
- Chocolate Dual Control Engine
- ToneLab AI Workflow
- Interface Mobile
- Suporte a Gamepad
- Exportação JSON
- Melhor organização do código

---

## Créditos

Projeto original

**suckyble / PocketEdit**

Fork e melhorias

**Frankwillians / PocketEditStompMode**

---

## Aviso

Projeto comunitário e não oficial.

Pocket Master, Sonicake e demais marcas pertencem aos seus respectivos proprietários.

---

# 🇺🇸 English

## About

**Pocket Edit Professional Web** is an enhanced version of the original **PocketEdit** project for the **Sonicake Pocket Master**.

This fork preserves the original communication layer while introducing new features focused on live performance, mobile usability, gamepad support and ToneLab AI integration.

---

## Main Features

### 🎛️ Complete Editor

- Full Pocket Master editing
- Real-time parameter changes
- Signal chain management
- Preset editing
- Direct communication with the pedal

---

### 🎸 Visual Stompboard

Control your Pocket Master using a live stompboard interface with status LEDs.

Includes:

- Noise Reduction
- FX1
- Drive
- FX2
- Delay
- Reverb
- Previous Preset
- Next Preset

---

### 🎮 Gamepad Support

Supports:

- USB Gamepads
- Bluetooth Controllers
- Browser Gamepad API
- Keyboard

A built-in Learn Mode allows fast hardware mapping.

Mappings are automatically stored in LocalStorage.

---

### 🍫 Chocolate Dual Control Engine

Turns only **two physical buttons** into four independent commands.

Group 1

- Short Press → FX1
- Long Press → FX2

Group 2

- Short Press → Drive
- Long Press → Reverb

Perfect for compact MIDI and USB controllers.

---

### 🤖 ToneLab AI

ToneLab assists users by creating a safe base preset instead of blindly applying dozens of parameters.

Default workflow:

- AMP enabled
- IR enabled
- Flat parameters
- Original signal chain preserved

After that, manual adjustment suggestions are provided.

---

### 🎸 NAM Support

Compatible with NAM amplifier profiles.

Recommended workflow:

- AMP Clone Mode
- NAM loaded into AMP
- Independent IR/Cab block

---

### 📱 Mobile Interface

Optimized for:

- Android
- iPhone
- Tablets

Features:

- Responsive layout
- Touch-friendly controls
- Drag & Drop
- Improved mobile workflow

---

### 💾 Presets

Supports:

- JSON Export
- Backup
- Preset Sharing

---

# Running Locally

Clone the repository:

```bash
git clone https://github.com/Frankwillians/PocketEditStompMode.git
```

Enter the folder:

```bash
cd PocketEditStompMode
```

Run a local server.

Python

```bash
python -m http.server 8080
```

or

Node

```bash
npx serve .
```

Open:

```
http://localhost:8080
```

Connect your Pocket Master and start editing.

---

## Project Structure

```
assets/
    css/
    js/

legacy/

index.html
README.md
```

---

## Original Fork

Based on the excellent work from:

https://github.com/suckyble/PocketEdit

This fork adds:

- Visual Stompboard
- Chocolate Dual Control Engine
- ToneLab AI Workflow
- Mobile-first interface
- USB Gamepad Support
- JSON Export
- Cleaner project structure

---

## Credits

Original Project

**suckyble / PocketEdit**

Enhanced Fork

**Frankwillians / PocketEditStompMode**

---

## Disclaimer

This is an unofficial community project.

Pocket Master, Sonicake and all related trademarks belong to their respective owners.
