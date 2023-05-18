import csv
import unicodedata


def corrigir_caracteres_especiais(texto):
    return unicodedata.normalize('NFKD', texto).encode('ASCII', 'ignore').decode('utf-8')


# Abrir o arquivo de entrada e o arquivo de saída
arquivo_entrada = 'dados.csv'
arquivo_saida = 'dados_corrigido.csv'

with open(arquivo_entrada, 'r', encoding='utf-8') as file_in, open(arquivo_saida, 'w', newline='', encoding='utf-8') as file_out:
    leitor = csv.reader(file_in, delimiter=';')
    escritor = csv.writer(file_out, delimiter=';')

    # Percorrer cada linha do arquivo de entrada, corrigir os caracteres especiais e escrever no arquivo de saída
    for linha in leitor:
        codigoAtivo = linha[0]
        razaoSocial = corrigir_caracteres_especiais(linha[1])
        cnpj = linha[2]

        # Escrever a linha corrigida no arquivo de saída
        linha_corrigida = [codigoAtivo, razaoSocial, cnpj]
        escritor.writerow(linha_corrigida)

print("Arquivo corrigido salvo com sucesso.")
