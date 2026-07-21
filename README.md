# Pocket Edit Professional Web — v11 Clean ToneLab

Esta versão simplifica o ToneLab AI para criar um preset-base confiável.

## Fluxo

1. Solicitação do usuário.
2. Pesquisa/inferência do rig provável quando a API/provedor suportar.
3. Tradução para os recursos reais da Sonicake Pocket Master.
4. Aplicação de um preset-base com:
   - AMP ligado;
   - IR/Cab ligado;
   - todos os outros módulos desligados;
   - parâmetros em default/flat;
   - cadeia de sinal preservada com todos os blocos.
5. Relatório com sugestões manuais de parâmetros para ajustar de ouvido.

## Por que mudou?

As versões anteriores tentavam aplicar parâmetros automaticamente. Isso podia gerar chorus/modulação exagerada, delay/reverb altos e resultados inconsistentes. Nesta versão, a IA escolhe os algoritmos corretos e informa os ajustes recomendados, mas o preset aplicado começa limpo e seguro.

## NAM/TONE3000

O ToneLab pode sugerir termos de busca para NAMs de amp no TONE3000 quando fizer sentido. A Pocket Master deve usar NAM somente no AMP em modo Clone, mantendo IR/Cab separado.
