/*
  DEPOIMENTOS DA V.REC FILMS
  ---------------------------------------------------------------
  Este é o único arquivo que muda quando entra um depoimento novo.
  Enquanto a lista estiver vazia, a seção não aparece no site.

  Cada depoimento segue este modelo (só "casal" e "texto" são obrigatórios):

  {
    casal: "Nome & Nome",
    tipo:  "Casamento na praia",          // opcional
    local: "Trancoso",                     // opcional
    ano:   "2026",                         // opcional
    foto:  "assets/depo-nome-nome.jpg",    // opcional (foto quadrada, autorizada pelo casal)
    filme: "ID_DO_YOUTUBE",                // opcional: mostra "Assistir ao filme"
    fonte: "Avaliação no Google",          // opcional: de onde veio
    destaque: true,                        // opcional: aparece grande, no topo
    texto: "O que o casal escreveu, como escreveu."
  },

  Regra: só entram depoimentos reais, enviados pelos casais, sobre os
  filmes da V.REC. Ajustar pontuação pode; reescrever o sentido, não.
*/
window.VREC_DEPOIMENTOS = [

  {
    casal: "Amana Lima",
    destaque: true,
    texto: "Você pode ter apenas memórias do seu dia especial, ou você pode ter uma recordação para viver todas as emoções, todas as vezes que olhar pra ela. No caso da segunda opção, não haverá arrependimentos na escolha do profissional."
  },

  {
    casal: "Gabi & João",
    tipo: "Casamento",
    texto: "Se você quer um vídeo maker alto astral, animado e que contagia todo mundo, pode contratar ele de olhos fechados!\n\nDesde a chegada ele já deixou todo mundo à vontade, rindo, leve, com aquela energia boa que faz o dia fluir! Ele não ficou só filmando, ele viveu o nosso casamento com a gente!\n\nEle pegou cada detalhe, cada emoção, cada risada, cada abraço... e transformou tudo em um filme que parece que a gente está revivendo o dia toda vez que assiste!\n\nO Jr é talentoso, profissional, pontual, carinhoso e tem um astral que não tem igual! Foi a melhor escolha que fizemos!\n\nObrigada, Jr, por eternizar o dia mais feliz das nossas vidas com tanta alegria e tanto amor!"
  },

  {
    casal: "Milena Vieira",
    texto: "O trabalho dele é incrível! Além da qualidade dos vídeos, ele tem um jeito muito leve e divertido de conduzir tudo. Faz a gente rir, brincar e, principalmente, se sentir à vontade diante das câmeras. Consegue transformar cada momento em uma experiência gostosa, sem aquela sensação de estar sendo filmado o tempo todo. E o resultado fica maravilhoso! É um profissional que faz tudo com muito carinho e dedicação. Recomendo de olhos fechados!"
  },

  {
    casal: "Ingrid Gomes",
    texto: "Excelente profissional! Trabalho impecável, com muita dedicação, criatividade e sensibilidade para registrar cada momento especial. É nítido o cuidado em cada detalhe e a paixão pelo que faz. O resultado é um registro lindo, que permite reviver cada emoção desse dia tão importante. Super recomendo para quem deseja eternizar momentos especiais com qualidade e profissionalismo!"
  },

  {
    casal: "Hellen Lima",
    tipo: "Pré-wedding",
    texto: "Junior é bem atencioso e solícito. Fizemos nosso ensaio pré-wedding com ele e nos sentimos bem confortáveis, à vontade. Uma pessoa bem alegre e brincalhão. Gostamos muito e sempre indicamos para outras pessoas."
  }

];
