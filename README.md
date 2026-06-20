# Pocket Edit - Stomp Mode & Gamepad Integration 🎛️⚡

[![GitHub Pages](https://img.shields.io/badge/Hospedado_no-GitHub_Pages-00fff5?style=for-the-badge&logo=github)](https://frankwillians.github.io/PocketEditStompMode/)
[![License: MIT](https://img.shields.io/badge/Licença-MIT-94a3b8?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Tech: Systems for Internet](https://img.shields.io/badge/Focado_em-Sistemas_para_Internet-00adb5?style=for-the-badge)](https://github.com)

Esta é uma modificação estética, de interface e de engenharia de hardware construída sobre o software open-source original *Pocket Edit*. O objetivo principal deste projeto é transformar o editor web da pedaleira Sonicake Pocket Master num ecossistema robusto para performance ao vivo, facilitando o controlo em palcos e ensaios através da integração de comandos físicos.

Esta versão adiciona suporte completo a hardware externo (joysticks, placas controladoras makers, footswitches USB/Bluetooth) e reformula a experiência visual do músico através de uma integração limpa e não invasiva.

---

## 📸 Interface em Funcionamento

![Pocket Edit Stomp Mode em Ação](/img/gui.png)
*Visualização do painel integrado com o novo Visor LED de Preset e a matriz física do Stomp Control Rack.*

---

## 🚀 Principais Novidades e Recursos

### 1. 🎚️ Stomp Control Rack (Modo Stomp)
Uma matriz horizontal cirúrgica injetada diretamente abaixo da cadeia de sinal da pedaleira. Diferente da interface padrão baseada em sliders, o Modo Stomp replica o comportamento físico de uma pedaleira de palco tradicional:
* **Foco em Efeitos e Dinâmica:** Exibição exclusiva dos módulos de modulação e ambiência (**NR, FX1, DRV, FX2, DLY, RVB**). Os blocos de AMP, IR ou EQ foram ocultados para garantir um controlo de bypass limpo e focado no que realmente se altera durante a execução.
* **LEDs Virtuais de Alta Visibilidade:** LEDs vermelhos com efeito de brilho (*glow*) em tempo real, que sincronizam instantaneamente com o estado físico e visual da pedaleira.

### 2. 🎛️ Integração de Controles USB & Bluetooth (Gamepad Engine)
Equipado com um motor JavaScript assíncrono conectado à **Gamepad API nativa do navegador**, o estúdio aceita qualquer dispositivo reconhecido pelo sistema operacional como Joystick ou Controlador de Jogo:
* **Comunicação Direta por Eventos Brutos:** Acionamento reprogramado para disparar eventos nativos (`MouseEvent`) em cascata. Isso elimina falhas comuns de clique (*debounce locks*), garantindo a ativação imediata **na primeira pisada**.
* **Gravação Inteligente Anti-Conflito:** O sistema faz uma varredura automática no mapa ao registar um novo pedal. Se o mesmo botão físico for atribuído a outro efeito, o mapeamento antigo é limpo automaticamente, impedindo que uma pisada acione dois blocos por engano.
* **Suporte Total Sem Fio:** Compatível com controladoras via cabo USB ou conexões sem fio Bluetooth (controles de Xbox, PlayStation, placas Zero Delay, Arduino, etc.). O seletor foi posicionado na barra lateral esquerda junto aos botões de conexão.

### 3. 📟 Visor LED Estilo Rack de Estúdio (Novo Tema Dark)
A barra superior do sistema foi totalmente reformulada com um tema *Dark Premium* focado em acessibilidade no escuro:
* **Brilho Néon Ciano:** A numeração do preset agora utiliza uma tipografia monospace de alta definição com efeitos de sombreamento e emanação de luz (*text-shadow*).
* **Fundo Fosco Profundo:** Caixa de informações estruturada com efeitos de profundidade interna (*inset box-shadow*) imitando os displays analógicos de racks profissionais.

---

## 📲 Como Usar no Smartphone (Mobile Ready)

Por estar hospedado de forma segura no **GitHub Pages (protocolo HTTPS obrigatório)**, o estúdio liberta o acesso à **Web Bluetooth API** do navegador do teu telemóvel:

* **No Android:** Abre o link do teu projeto diretamente no **Google Chrome**. Liga o Bluetooth do aparelho, clica em **"Conectar BLE"** na barra lateral, seleciona a pedaleira na lista pop-up e controla todo o setup via touch ou controle Bluetooth emparelhado.
* **No iOS (iPhone):** Devido às restrições nativas do Safari ao Web Bluetooth, basta baixar um navegador focado em BLE na App Store (como o **Bluefy** ou **WebBLE**) e aceder ao link do teu GitHub Pages por dentro dele.

---

## 🛠️ Estrutura de Instalação e Arquivos

O projeto foi planeado para manter o núcleo (*core*) do Pocket Edit intocado, injetando os estilos e o motor assíncrono inteiramente num bloco autônomo no final do arquivo principal:

```html
