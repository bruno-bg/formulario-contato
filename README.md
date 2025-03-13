# Formulário de Contato Responsivo

Um formulário de contato moderno e responsivo com validação em tempo real e feedback visual utilizando SweetAlert2.

## Características

- Design responsivo que se adapta a diferentes tamanhos de tela
- Validação de formulário em tempo real com feedback visual
- Máscaras para campos específicos (telefone)
- Contadores de caracteres para nome e mensagem
- Alertas interativos usando SweetAlert2
- Animações e efeitos visuais suaves

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- SweetAlert2
- Font Awesome

## Como usar

1. Clone ou baixe este repositório
2. Abra o arquivo `index.html` em um navegador
3. Preencha o formulário para testar as validações

## Regras de validação

- **Nome:** Mínimo de 3 caracteres (obrigatório)
- **Email:** Formato de email válido (obrigatório)
- **Telefone:** Formato brasileiro - (99) 99999-9999 ou (99) 9999-9999 (opcional)
- **Mensagem:** Mínimo de 10 caracteres (obrigatório)

## Personalização

O formulário usa variáveis CSS, facilitando a personalização de cores e estilos:

```css
:root {
  --cor-primaria: #1abc9c;
  --cor-primaria-escura: #149279;
  --cor-primaria-hover: #0f7d66;
  --cor-erro: #e74c3c;
  --cor-sucesso: #27ae60;
  /* ...outras variáveis... */
}
```

## Créditos

Desenvolvido como parte do curso de Desenvolvimento Web - Anhanguera - 3º Semestre
