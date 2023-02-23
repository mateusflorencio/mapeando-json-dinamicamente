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
    caminho: [{
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
  parentes: [
    { key: 'parentes', caminho: ['const'] },
    { key: 'testeParente', caminho: ['teste', 'caminho', 'id'] },
  ]
}

export {
  entrada,
  modelo
}