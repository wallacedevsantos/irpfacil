// Variável global para armazenar a lista de ativos
const listaAtivos = [];

// Função para ler o conteúdo do arquivo CSV
function lerArquivoXLSX(arrayBuffer) {
  const workbook = XLSX.read(arrayBuffer, { type: "array" });

  // Assume-se que a primeira planilha será usada
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  // Converter a planilha em uma matriz de objetos
  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // Iterar sobre as linhas da matriz jsonData
  for (let i = 0; i < jsonData.length; i++) {
    const linha = jsonData[i];

    // Verificar se a linha tem exatamente 3 células
    if (linha.length === 3) {
      const codigoAtivo = linha[0];
      const razaoSocial = linha[1];
      const cnpj = linha[2];

      // Crie um objeto de ativo com os valores das colunas
      const ativo = {
        codigoAtivo,
        razaoSocial,
        cnpj,
      };

      // Adicione o ativo à lista de ativos
      listaAtivos.push(ativo);
    } else {
      console.log(`A linha ${i + 1} não possui 3 células. Ignorando...`);
    }
  }
}

// Função para salvar a lista atual
function salvarListaAtual() {
  const tabelaInvestimentos = document.getElementById("investment-list");

  // Obtém a chave da lista selecionada no menu de listas salvas
  const menuListasSalvas = document.getElementById("menu-listas-salvas");
  const chaveSelecionada = menuListasSalvas.value;

  // Verifica se uma lista foi selecionada
  if (chaveSelecionada) {
    // Percorre as linhas da tabela e extrai os dados de cada célula
    const listaInvestimentos = [];
    for (let i = 0; i < tabelaInvestimentos.rows.length; i++) {
      const row = tabelaInvestimentos.rows[i];
      const codigoAtivo = row.cells[0].textContent;
      const tipoAtivo = row.cells[1].textContent;
      const cnpjAtivo = row.cells[2].textContent;
      const numeroCotas = row.cells[3].textContent;
      const valorTotalAno = row.cells[4].textContent;
      const precoMedio = row.cells[5].textContent;
      const cnpjCorretora = row.cells[6].textContent;
      const nomeCorretora = row.cells[7].textContent;
      const descricao = row.cells[8].textContent;

      const investimento = {
        codigoAtivo,
        tipoAtivo,
        cnpjAtivo,
        numeroCotas,
        valorTotalAno,
        precoMedio,
        cnpjCorretora,
        nomeCorretora,
        descricao,
      };

      listaInvestimentos.push(investimento);
    }

    const listaInvestimentosJSON = JSON.stringify(listaInvestimentos);

    // Atualiza a lista selecionada no armazenamento local
    localStorage.setItem(chaveSelecionada, listaInvestimentosJSON);

    console.log("Lista atual atualizada com sucesso!");
  } else {
    console.log("Nenhuma lista selecionada.");
  }
}

// Adiciona o evento de clique ao botão "Salvar Lista Atual"
const salvarListaAtualButton = document.getElementById(
  "salvar-lista-atual-btn"
);
salvarListaAtualButton.addEventListener("click", salvarListaAtual);

// Função para salvar a lista do usuário
function salvarLista() {
  const nomeUsuario = prompt("Digite seu nome:");
  const anoSalvamento = prompt("Digite o ano de salvamento:");

  // Obtém a tabela de investimentos
  const tabelaInvestimentos = document.getElementById("investment-list");

  // Percorre as linhas da tabela e extrai os dados de cada célula
  const listaInvestimentos = [];
  for (let i = 0; i < tabelaInvestimentos.rows.length; i++) {
    const row = tabelaInvestimentos.rows[i];
    const codigoAtivo = row.cells[0].textContent;
    const tipoAtivo = row.cells[1].textContent;
    const cnpjAtivo = row.cells[2].textContent;
    const numeroCotas = row.cells[3].textContent;
    const valorTotalAno = row.cells[4].textContent;
    const precoMedio = row.cells[5].textContent;
    const cnpjCorretora = row.cells[6].textContent;
    const nomeCorretora = row.cells[7].textContent;
    const descricao = row.cells[8].textContent;

    // Cria um objeto com os dados do investimento
    const investimento = {
      codigoAtivo,
      tipoAtivo,
      cnpjAtivo,
      numeroCotas,
      valorTotalAno,
      precoMedio,
      cnpjCorretora,
      nomeCorretora,
      descricao,
    };

    // Adiciona o investimento à lista de investimentos
    listaInvestimentos.push(investimento);
  }

  // Cria a chave de salvamento com base no nome do usuário e no ano
  const chave = `${nomeUsuario}_${anoSalvamento}`;

  // Converte a lista de investimentos em uma string JSON
  const listaInvestimentosJSON = JSON.stringify(listaInvestimentos);

  // Salva a lista no armazenamento local
  localStorage.setItem(chave, listaInvestimentosJSON);

  // Atualiza a lista de listas salvas
  atualizarListasSalvas();
}

// Adiciona o evento de clique ao botão de salvar
const salvarListaButton = document.getElementById("salvar-lista");
salvarListaButton.addEventListener("click", salvarLista);

// Função para atualizar o menu de listas salvas
function atualizarListasSalvas() {
  const menuListasSalvas = document.getElementById("menu-listas-salvas");
  menuListasSalvas.innerHTML = "";

  // Adiciona a opção de lista em branco
  const blankOption = document.createElement("option");
  blankOption.value = "";
  blankOption.textContent = "Listas";
  menuListasSalvas.appendChild(blankOption);

  // Percorre todas as chaves do armazenamento local
  for (let i = 0; i < localStorage.length; i++) {
    const chave = localStorage.key(i);

    // Verifica se a chave é uma lista salva (com base em um padrão específico, como "nome_ano")
    if (chave.includes("_")) {
      const option = document.createElement("option");
      option.value = chave;
      option.textContent = chave;
      menuListasSalvas.appendChild(option);
    }
  }
}

// Função para apagar a lista selecionada
function apagarListaSelecionada() {
  const menuListasSalvas = document.getElementById("menu-listas-salvas");
  const chaveSelecionada = menuListasSalvas.value;

  // Verifica se uma lista foi selecionada
  if (chaveSelecionada) {
    localStorage.removeItem(chaveSelecionada);
    atualizarListasSalvas();
    carregarListaSalva();
  }
}

// Adiciona o evento de clique ao botão "Apagar Lista"
const apagarListaBtn = document.getElementById("apagar-lista-btn");
apagarListaBtn.addEventListener("click", apagarListaSelecionada);

function downloadPlanilhaExcel() {
  const tabela = document.getElementById("tabela");

  // Crie uma nova planilha do tipo XLSX
  const workbook = XLSX.utils.book_new();

  // Crie uma nova planilha dentro do arquivo XLSX
  const worksheet = XLSX.utils.table_to_sheet(tabela);

  // Adicione a planilha ao arquivo XLSX
  XLSX.utils.book_append_sheet(workbook, worksheet, "Planilha");

  // Converta o arquivo XLSX para um Blob
  const wbout = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  // Crie um Blob a partir do array de bytes
  const blob = new Blob([wbout], { type: "application/octet-stream" });

  // Crie um URL temporário para o Blob
  const url = URL.createObjectURL(blob);

  // Crie um elemento de link de download
  const link = document.createElement("a");
  link.href = url;
  link.download = "planilha.xlsx";

  // Adicione o link à página e clique nele para iniciar o download
  document.body.appendChild(link);
  link.click();

  // Limpe o URL temporário
  URL.revokeObjectURL(url);

  // Remova o link da página
  document.body.removeChild(link);
}

const downloadButton = document.getElementById("download-button");
downloadButton.addEventListener("click", downloadPlanilhaExcel);

// Função para carregar uma lista salva
function carregarListaSalva() {
  const menuListasSalvas = document.getElementById("menu-listas-salvas");
  const chaveSelecionada = menuListasSalvas.value;
  const listaInvestimentosJSON = localStorage.getItem(chaveSelecionada);

  // Converte a string JSON em uma lista de investimentos
  const listaInvestimentos = JSON.parse(listaInvestimentosJSON);

  // Atualiza o investment-list com a lista carregada
  const tableBody = document.getElementById("investment-list");
  tableBody.innerHTML = "";

  listaInvestimentos.forEach((investimento) => {
    const row = tableBody.insertRow();

    // Cria as células da linha com os dados do investimento
    const codigoAtivoCell = row.insertCell();
    codigoAtivoCell.textContent = investimento.codigoAtivo;

    const tipoAtivoCell = row.insertCell();
    tipoAtivoCell.textContent = investimento.tipoAtivo;

    const cnpjAtivoCell = row.insertCell();
    cnpjAtivoCell.textContent = investimento.cnpjAtivo;

    const numeroCotasCell = row.insertCell();
    numeroCotasCell.textContent = investimento.numeroCotas;

    const valorTotalAnoCell = row.insertCell();
    valorTotalAnoCell.textContent = investimento.valorTotalAno;

    const precoMedioCell = row.insertCell();
    precoMedioCell.textContent = investimento.precoMedio;

    const cnpjCorretoraCell = row.insertCell();
    cnpjCorretoraCell.textContent = investimento.cnpjCorretora;

    const nomeCorretoraCell = row.insertCell();
    nomeCorretoraCell.textContent = investimento.nomeCorretora;

    const descricaoCell = row.insertCell();
    descricaoCell.textContent = investimento.descricao;

    const acoesCell = row.insertCell();
    const copiarButton = document.createElement("button");
    copiarButton.textContent = "Copiar";
    copiarButton.addEventListener("click", copiarDescricao);
    copiarButton.classList.add("button");
    acoesCell.appendChild(copiarButton);

    const apagarButton = document.createElement("button");
    apagarButton.textContent = "Apagar";
    apagarButton.addEventListener("click", apagarLinha);
    apagarButton.classList.add("button");
    acoesCell.appendChild(apagarButton);
  });
}

// Função para apagar linha da tabela
function apagarLinha(event) {
  const button = event.target;
  const row = button.parentNode.parentNode;
  const tableBody = document.getElementById("investment-list");
  tableBody.removeChild(row);
}

// Chamar a função para atualizar o menu de listas salvas ao carregar a página
document.addEventListener("DOMContentLoaded", function () {
  atualizarListasSalvas();
  carregarListaSalva(); // Carrega a lista salva ao carregar a página
});
// Chamar a função para carregar a lista salva quando uma opção do menu for selecionada
const menuListasSalvas = document.getElementById("menu-listas-salvas");
menuListasSalvas.addEventListener("change", carregarListaSalva);

// Função para validar o código do ativo
function validarCodigoAtivo(codigoAtivo) {
  // Verifica se o código do ativo contém apenas letras maiúsculas e números
  const regex = /^[A-Z0-9]+$/;
  return regex.test(codigoAtivo);
}

// Função para registrar um novo investimento
function registrarInvestimento(event) {
  event.preventDefault(); // Impede o envio do formulário

  const codigoAtivoInput = document.getElementById("codigo-ativo");
  const tipoAtivoInput = document.querySelector(
    'input[name="tipo-ativo"]:checked'
  );
  const numeroCotasInput = document.getElementById("numero-cotas");
  const valorTotalAnoInput = document.getElementById("valor-total-ano");
  const cnpjCorretoraInput = document.getElementById("cnpj-corretora");
  const nomeCorretoraInput = document.getElementById("nome-corretora");

  const codigoAtivo = codigoAtivoInput.value.toUpperCase();
  const tipoAtivo = tipoAtivoInput.value.toUpperCase();
  const numeroCotas = parseFloat(numeroCotasInput.value.replace(",", "."));
  const valorTotalAno = parseFloat(valorTotalAnoInput.value.replace(",", "."));
  const cnpjCorretora = cnpjCorretoraInput.value.toUpperCase();
  const nomeCorretora = nomeCorretoraInput.value.toUpperCase();

  // Verifica se o código do ativo é válido
  if (!validarCodigoAtivo(codigoAtivo)) {
    console.log("Código de ativo inválido.");
    return;
  }

  // Função para buscar um ativo pelo código
  function buscarAtivoPorCodigo(codigo) {
    // Encontre o ativo na lista de ativos pelo código
    const ativoEncontrado = listaAtivos.find(
      (ativo) => ativo.codigoAtivo === codigo
    );

    // Retorna o ativo encontrado ou null se não encontrado
    return ativoEncontrado || null;
  }
  // Busca as informações do ativo pelo código
  const informacoesAtivo = buscarAtivoPorCodigo(codigoAtivo);

  if (informacoesAtivo) {
    const razaoSocial = informacoesAtivo.razaoSocial;
    const cnpjAtivo = informacoesAtivo.cnpj;

    // Cálculo do preço médio
    const precoMedio = valorTotalAno / numeroCotas;

    // Cria a descrição do investimento
    const descricao = `${numeroCotas} COTAS DE ${codigoAtivo} ${razaoSocial} CNPJ ${cnpjAtivo} DISTRIBUÍDOS NA CORRETORA ${nomeCorretora} CNPJ ${cnpjCorretora} COM PREÇO MÉDIO DE R$ ${precoMedio.toFixed(
      2
    )}`;

    // Cria uma nova linha na tabela com os dados do investimento
    const tableBody = document.getElementById("investment-list");
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${codigoAtivo}</td>
      <td>${tipoAtivo}</td>
      <td>${cnpjAtivo}</td>
      <td>${numeroCotas}</td>
      <td>${valorTotalAno}</td>
      <td>${precoMedio.toFixed(2)}</td>
      <td>${cnpjCorretora}</td>
      <td>${nomeCorretora}</td>
      <td>${descricao}</td>
      <td><button onclick="copiarDescricao(event)">Copiar</button><button onclick="apagarLinha(event)">Apagar</button></td>
     
    `;
    tableBody.appendChild(newRow);

    // Limpa os campos do formulário
    document.getElementById("investment-form").reset();
  } else {
    console.log("Código de ativo inválido.");
  }
}

// Adiciona o evento ao formulário "investment-form"
document
  .getElementById("investment-form")
  .addEventListener("submit", registrarInvestimento);

function copiarDescricao(event) {
  const button = event.target; // Obtém o elemento do botão clicado
  const descricao = button.parentElement.previousElementSibling.textContent; // Obtém o texto da descrição

  navigator.clipboard.writeText(descricao); // Copia o texto para a área de transferência
  button.textContent = "Copiado"; // Altera o texto do botão para "Copiado"

  button.classList.add("button-clicked");
}

// Função para carregar o arquivo CSV e iniciar o aplicativo
function carregarArquivoXLSX() {
  // Lógica para carregar o arquivo XLSX
  // Exemplo:
  fetch("dados_fiis_b3.xlsx")
    .then((response) => response.arrayBuffer())
    .then((data) => lerArquivoXLSX(data))
    .catch((error) =>
      console.log("Ocorreu um erro ao carregar o arquivo XLSX:", error)
    );
}

// Chama a função para carregar o arquivo CSV e iniciar o aplicativo
carregarArquivoXLSX();
