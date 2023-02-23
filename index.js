const entrada = {
  order: "123",
  pedidos: [
    {
      id: 1,
      produtos: [
        {
          id: 11,
          quantidade: 1,
          descricao: "produto 11",
          rua: "rua 1",
        },
        {
          id: 12,
          quantidade: 2,
          descricao: "produto 12",
          rua: "rua 2",
        },
      ],
    },
    {
      id: 2,
      produtos: [
        {
          id: 21,
          quantidade: 3,
          descricao: "produto 21",
          rua: "rua 3",
        },
        {
          id: 22,
          quantidade: 4,
          descricao: "produto 22",
          rua: "rua 4",
        },
      ],
    },
  ],
  const: 'dados',
  teste: [{
    id: [{
      id: 3
    }]
  }]
}

const modelo = {
  dominantes: [
    { key: 'produtoId', caminho: ['pedidos', 'produtos', 'id'] },
    { key: 'descritivo', caminho: ['pedidos', 'produtos', 'descricao'] },
    { key: 'qtd', caminho: ['pedidos', 'produtos', 'quantidade'] },
  ],
  pertence: [
    { key: 'pedidoId', caminho: ['pedidos', 'id'] }
  ],
  identificador: { key: 'romaneio', caminho: ['order'] },
  parents: [
    {
      key: 'parents', caminho: ['const']
    },
    {
      key: 'testeParent', caminho: ['teste', 'id', 'id']
    },

  ]
}


function cuidarReduce(obj, key) {
  if (Array.isArray(obj)) return obj.map((item) => cuidarReduce(item, key))
  return obj[key]
}

function cuidarIdentificador(entrada, identificador) {
  const { caminho, key } = identificador
  const valorIdentificador = caminho.reduce((obj, key) => cuidarReduce(obj, key), entrada)
  return { [key]: valorIdentificador }
}

function cuidarParents(entrada, parents) {
  const valorParents = parents.reduce((obj, { caminho, key }) => {
    const valor = caminho.reduce((obj, key) => cuidarReduce(obj, key), entrada)
    return { ...obj, [key]: valor }
  }, {})

  Object.entries(valorParents).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      valorParents[key] = value[0].toString()
    }
  })
  return valorParents
}

function verificarSeKeyPertenceExiste(keyPertence, valorPertence, keyDominante, valorDominante, saida) {
  const arraySaidaKeys = Object.entries(saida)
  const enderecoObj = []
  for (const [key, value] of arraySaidaKeys) {
    if (value[keyPertence] === valorPertence && !value.hasOwnProperty(keyDominante)) enderecoObj.push([key, value])
  }

  if (enderecoObj.length > 0) {
    return enderecoObj[0][0]
  } else {
    return false
  }

}

////////////////////////////////////////////////////

function mapearEntradaParaModelo(entrada, modelo) {
  const { dominantes, pertence, identificador, parents } = modelo
  const saida = {}
  let contador = 0
  let valorIdentificador = cuidarIdentificador(entrada, identificador)
  const valorParents = cuidarParents(entrada, parents)
  valorIdentificador = { ...valorIdentificador, ...valorParents }

  for (const { key: keyDominante, caminho: caminhoDominante } of dominantes) {
    const valorDominante = caminhoDominante.reduce((obj, key) => cuidarReduce(obj, key), entrada)

    for (const { key: keyPertence, caminho: caminhoPertence } of pertence) {
      const valorPertence = caminhoPertence.reduce((obj, key) => cuidarReduce(obj, key), entrada)

      for (let i = 0; i < valorDominante.length; i++) {
        if (valorDominante[i].length > 0) {
          for (let j = 0; j < valorDominante[i].length; j++) {
            const endereco = verificarSeKeyPertenceExiste(keyPertence, valorPertence[i], keyDominante, valorDominante[i][j], saida)
            if (endereco) {
              saida[endereco] = {
                ...saida[endereco],
                [keyDominante]: valorDominante[i][j].toString()
              }
            } else {
              saida[contador] = {
                ...valorIdentificador,
                [keyPertence]: valorPertence[i],
                [keyDominante]: valorDominante[i][j],
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
