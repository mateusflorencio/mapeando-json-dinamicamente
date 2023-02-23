import { entrada, modelo } from './feed.js'

/// Funções auxiliares

function cuidarReduce(obj, key) {
  if (Array.isArray(obj)) return obj.map((item) => cuidarReduce(item, key))
  return obj[key]
}

function cuidarIdentificador(entrada, identificador) {
  const { caminho, key } = identificador
  const valorIdentificador = caminho.reduce((obj, key) => cuidarReduce(obj, key), entrada)
  return { [key]: valorIdentificador }
}

function cuidarParentes(entrada, parents) {
  const valorParents = parents.reduce((obj, { caminho, key }) => {
    const valor = caminho.reduce((obj, key) => cuidarReduce(obj, key), entrada)
    return { ...obj, [key]: valor }
  }, {})
  Object.entries(valorParents).forEach(([key, value]) => Array.isArray(value) && (valorParents[key] = value[0].toString()))
  return valorParents
}

function verificarSeKeyPertenceExiste(keyPertence, valorPertence, keyDominante, objetos) {
  const enderecoObj = []
  for (const [key, value] of Object.entries(objetos)) {
    (value[keyPertence] === valorPertence && !value.hasOwnProperty(keyDominante)) && enderecoObj.push([key, value])
  }
  return enderecoObj.length > 0 ? enderecoObj[0][0] : false
}

///// Função principal

function mapearEntradaParaModelo(entrada, modelo) {
  const { dominantes, pertence, identificador, parentes } = modelo
  const saida = {}
  let contador = 0
  const valorIdentificador = {
    ...cuidarIdentificador(entrada, identificador),
    ...cuidarParentes(entrada, parentes)
  }

  for (const { key: keyDominante, caminho: caminhoDominante } of dominantes) {
    const valorDominante = caminhoDominante.reduce(cuidarReduce, entrada)

    for (const { key: keyPertence, caminho: caminhoPertence } of pertence) {
      const valorPertence = caminhoPertence.reduce(cuidarReduce, entrada)

      for (let i = 0; i < valorDominante.length; i++) {
        if (valorDominante[i].length > 0) {

          for (let j = 0; j < valorDominante[i].length; j++) {
            const endereco = verificarSeKeyPertenceExiste(keyPertence, valorPertence[i], keyDominante, saida)

            if (endereco) {
              saida[endereco] = {
                ...saida[endereco],
                [keyDominante]: valorDominante[i][j]
              }
            } else {
              saida[contador] = {
                ...valorIdentificador,
                [keyPertence]: valorPertence[i],
                [keyDominante]: valorDominante[i][j]
              }
              contador++
            }

          }

        }
      }

    }

  }

  return saida
}

console.log('\n\n<---------------resultado--------------------->\n', mapearEntradaParaModelo(entrada, modelo))
