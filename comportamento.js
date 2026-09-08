// Seleciona o visor e todos os botões da calculadora
const display = document.querySelector('body > div > input');
const botoes = document.querySelectorAll('body > div > div > button');

// Adiciona o evento de clique a todos os botões
botoes.forEach(botao => {
  botao.addEventListener('click', () => {
    const textoBotao = botao.innerText;
    processarEntrada(textoBotao);
  });
});

// Suporte para digitação via teclado
document.addEventListener('keydown', (event) => {
  const tecla = event.key;

  if (!isNaN(tecla) || ['+', '-', '*', '/'].includes(tecla)) {
    processarEntrada(tecla);
  } else if (tecla === ',' || tecla === '.') {
    processarEntrada(',');
  } else if (tecla === 'Enter' || tecla === '=') {
    event.preventDefault();
    processarEntrada('=');
  } else if (tecla === 'Backspace') {
    processarEntrada('⌫');
  } else if (tecla === 'Escape' || tecla.toLowerCase() === 'c') {
    processarEntrada('C');
  }
});

// Função principal de processamento das entradas
function processarEntrada(valor) {
  switch (valor) {
    case 'C':
      limparDisplay();
      break;
    case '⌫':
      apagarUltimo();
      break;
    case '=':
      calcularResultado();
      break;
    case ',':
      adicionarVirgula();
      break;
    default:
      adicionarCaractere(valor);
      break;
  }
}

function limparDisplay() {
  display.value = '';
}

function apagarUltimo() {
  display.value = display.value.slice(0, -1);
}

function adicionarCaractere(caractere) {
  const ultimoCaractere = display.value.slice(-1);
  const operadores = ['+', '-', '*', '/'];

  // Evita inserir dois operadores seguidos
  if (operadores.includes(caractere) && operadores.includes(ultimoCaractere)) {
    display.value = display.value.slice(0, -1) + caractere;
    return;
  }

  display.value += caractere;
}

function adicionarVirgula() {
  // Converte a expressão atual para verificar o último número inserido
  const partes = display.value.split(/[\+\-\*\/]/);
  const ultimoNumero = partes[partes.length - 1];

  // Permite vírgula apenas se o número atual ainda não tiver uma
  if (!ultimoNumero.includes(',')) {
    display.value += display.value === '' ? '0,' : ',';
  }
}

function calcularResultado() {
  if (!display.value) return;

  try {
    // Substitui a vírgula exibida por ponto para ser compatível com a avaliação matemática
    let expressao = display.value.replace(/,/g, '.');

    // Executa o cálculo com segurança básica
    let resultado = Function(`'use strict'; return (${expressao})`)();

    // Formata números decimais longos para evitar estourar o visor
    if (typeof resultado === 'number' && !Number.isInteger(resultado)) {
      resultado = Number(resultado.toFixed(8));
    }

    // Exibe o resultado convertendo o ponto de volta para vírgula
    display.value = resultado.toString().replace(/\./g, ',');
  } catch (error) {
    display.value = 'Erro';
    setTimeout(() => {
      limparDisplay();
    }, 1500);
  }
}