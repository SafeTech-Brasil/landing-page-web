export interface IPerguntaDemo {
  id: string;
  ordem: number;
  descricao: string;
}

export interface IRespostaPossivelDemo {
  valor: number;
  descricao: string;
}

export interface IRespostaDemo {
  perguntaId: string;
  valor: number;
}
