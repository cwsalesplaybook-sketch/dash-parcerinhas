export interface MensagemDia {
  dia: number
  titulo: string
  atividades: string
  task: string
  msgComoEsta: string
  msgAtualizacao: string
}

export const SEQUENCIA: MensagemDia[] = [
  {
    dia: 1,
    titulo: 'Abertura',
    atividades: 'Ligação, mensagem, task',
    task: 'Atualizar na planilha de feedback que você já entrou em contato com o lead.',
    msgComoEsta: `Olá {{firstName}}! Aqui é {{salesman}}, da Cardápio Web.
Tô entrando em contato com você porque nosso parceiro {{onParceiro}} me passou o seu contato. 😁

Aqui a gente trabalha em cima de 3 pilares principais: a _Automação do Atendimento, a Gestão do Negócio e o Aumento de Vendas_. Qual desses é o mais importante pra você hoje?`,
    msgAtualizacao: `Olá, {{firstName}}! Tudo bem por aí?

Aqui é o {{salesman}}, da Cardápio Web. O nosso time de parcerias me mandou o seu contato e comentou que você estava buscando melhorias pro seu estabelecimento.

Aqui na Cardápio as indicações do nossos parceiros tem atendimento premium, por isso já vou te priorizar. Então, me conta, qual o seu principal desafio hoje?`,
  },
  {
    dia: 2,
    titulo: 'Follow up 1',
    atividades: 'Ligação, mensagem, task',
    task: 'Verifique se o lead deu alguma resposta nos follow-ups anteriores. Caso não tenha dado retorno, preencha na planilha de feedback para que os responsáveis reforcem com o parceiro.',
    msgComoEsta: `Oi {{firstName}}, tudo bem?

Vi que você não conseguiu me responder ontem — imagino que a correria do dia a dia esteja intensa por aí! 😅

Queria te contar rapidamente porque somos o sistema mais indicado por profissionais de marketing, tendo hoje mais de 1000 parceiros que nos recomendam diariamente.

Já são mais de 14.000 negócios usando nossa solução e acredito que podemos fazer a diferença aí também. Você teria 2 minutos pra eu te explicar rapidamente como funciona?`,
    msgAtualizacao: `Oi, {{firstName}}! Tudo certo?

Imaginei que a mensagem de ontem pudesse ter se perdido na correria. Sei bem como é! 😅

Só passei para reforçar que estou à disposição. Quero te mostrar como a Cardápio Web pode melhorar a sua operação.

Queria tá reservando um tempinho para a gente conversar, você acha que hoje ainda dá certo?`,
  },
  {
    dia: 3,
    titulo: 'Follow up 2',
    atividades: 'Ligação, mensagem, task',
    task: 'Verifique se o lead deu alguma resposta nos follow-ups anteriores. Caso não tenha dado retorno, preencha na planilha de feedback para que os responsáveis reforcem com o parceiro.',
    msgComoEsta: `Olá, {{firstName}}! 😄

Sou eu de novo, {{salesman}} da Cardápio Web! Imagino que deve tá uma correria danada por aí. Mandei mensagem para você nos últimos dias, mas não tive retorno.

Você ainda tem interesse em uma parceria com a gente?`,
    msgAtualizacao: `Olá, {{firstName}}! 😄

Sou eu de novo, {{salesman}} da Cardápio Web! Imagino que deve tá uma correria danada por aí. Mandei mensagem para você nos últimos dias, mas não tive retorno.

Você ainda tem interesse em uma parceria com a gente?`,
  },
  {
    dia: 4,
    titulo: 'Follow up 3',
    atividades: 'Ligação, mensagem, task',
    task: 'Verifique se o lead deu alguma resposta nos follow-ups anteriores. Caso não tenha dado retorno, preencha na planilha de feedback para que os responsáveis reforcem com o parceiro.',
    msgComoEsta: `Opa {{firstName}}, tudo bem? Aqui é a {{salesman}} da Cardápio Web.
Vi que você não respondeu minha última mensagem, queria tá reservando um tempinho para a gente conversar, você acha que hoje ainda dá certo?`,
    msgAtualizacao: `Opa {{firstName}}, tudo bem? Aqui é a {{salesman}} da Cardápio Web.

Tentei falar com você nos últimos dias, mas imagino que o tempo esteja curto. Queria saber se você ainda tem interesse em conhecer a Cardápio Web, você teria 2 minutos pra te explicar como funciona?`,
  },
  {
    dia: 5,
    titulo: 'Follow up 4',
    atividades: 'Ligação e task',
    task: 'Verifique se o lead deu alguma resposta nos follow-ups anteriores. Caso não tenha dado retorno, preencha na planilha de feedback para que os responsáveis reforcem com o parceiro.',
    msgComoEsta: '',
    msgAtualizacao: `{{firstName}}, como vai?

Não queria encerrar nosso contato porque sei que a Cardápio Web tem um grande potencial para te ajudar.

Estou vendo aqui com a minha supervisão um desconto pra gente possa prosseguir o seu atendimento e firmar essa parceria.

Topa um papo super rápido de 2 minutos só para eu te explicar como aplicar esse desconto e facilitar sua operação?`,
  },
  {
    dia: 6,
    titulo: 'Follow up 5',
    atividades: 'Ligação, mensagem, task',
    task: 'Verifique se o lead deu alguma resposta nos follow-ups anteriores. Caso não tenha dado retorno, preencha na planilha de feedback para que os responsáveis reforcem com o parceiro.',
    msgComoEsta: `{{firstName}}, essa é a minha penúltima tentativa de contato com você.

Desde o início minha intenção foi te mostrar como a Cardápio Web pode te ajudar a automatizar o atendimento, organizar a operação e aumentar as vendas do seu restaurante.

E pra te incentivar a darmos esse primeiro passo juntos saiba que você tem até 15% de desconto na contratação de qualquer plano da Cardápio Web por ter sido indicado por nosso parceiro {{onParceiro}}!

Você tem dois minutos pra eu te explicar como funciona?`,
    msgAtualizacao: `Olá {{firstName}}!

Notei que não conseguimos nos falar nas últimas tentativas, queria saber se nossa parceria ainda faz sentido para você neste momento, adoraria ter uma conversa rápida pra entender mais sobre seu negócio e mostrar como podemos te ajudar.

Você consegue falar agora?`,
  },
  {
    dia: 7,
    titulo: 'Follow up 6 (Final)',
    atividades: 'Ligação, mensagem, task',
    task: 'Preencher na planilha de feedback que o lead foi dado como perdido por falta de respostas.',
    msgComoEsta: `{{firstName}}, essa é a minha última tentativa de contato com você.

Desde o início, minha intenção foi te mostrar como a Cardápio Web pode te ajudar a automatizar o atendimento, organizar a operação e aumentar as vendas do seu restaurante.

Mas até aqui, não tive retorno… e tudo bem, sei que o momento pode não ser o ideal.

Ainda assim, queria te dar uma última oportunidade de conversar com um especialista antes de encerrarmos o contato.

Me avisa se faz sentido seguir ou se prefere que eu finalize por aqui.`,
    msgAtualizacao: `Fala {{firstName}}! Aqui é o {{salesman}}, da Cardápio Web! 💜

Tentei contato com você diversas vezes nos últimos dias e não tive sucesso. Pelo respeito que temos um pelo outro, posso entender o seu silêncio como falta de interesse na nossa parceria?

Se for o caso não tem problema, posso estar finalizando seu atendimento por agora e se você tiver interesse no futuro, basta me mandar uma mensagem! 😅`,
  },
]

export const DESCONTOS = [
  { periodo: 'Mensal', desconto: '15% no 1º mês', obs: 'Apenas no primeiro mês' },
  { periodo: 'Trimestral', desconto: '9%', obs: '' },
  { periodo: 'Semestral', desconto: '7%', obs: '' },
  { periodo: 'Anual', desconto: '5%', obs: '' },
]
