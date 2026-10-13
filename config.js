/* ============================================================
   CONFIGURAÇÃO DO CONVITE — edite SÓ este arquivo
   Sales Soluções · convites digitais
   ============================================================ */
window.CONVITE = {
  nome: 'Lis Caldas',
  primeiroNome: 'Lis',
  idade: 50,
  tema: 'Baile de Máscaras',
  subtitulo: '50 tons de felicidade',
  mensagem: 'Uma noite de elegância, luzes, máscaras e bons encontros para celebrar meio século de histórias.',
  convite: 'Venha brindar comigo uma nova década cercada de pessoas especiais.',
  frase: 'A vida merece ser celebrada com luz, elegância e pessoas que fazem o coração sorrir.',

  // Data e hora (manter o -03:00 no final = horário de Brasília)
  data: '2027-01-22T20:00:00-03:00',
  duracaoHoras: 6,

  local: {
    nome: 'Local da festa',
    endereco: 'Trav. 3 da Av. Domingos Maia, 260 – Mosqueiro, Aracaju/SE',
    busca: 'Rua José Domingos Maia III, 260, Mosqueiro, Aracaju - SE, 49009-073', // texto usado no Google Maps
  },
  clima: 'Baile de máscaras, mesas ao ar livre, luzes quentes e uma noite para guardar na memória.',

  traje: 'Preto · Esporte fino',
  trajeTexto: 'Todos de roupa preta, em estilo esporte fino.',
  trajeAviso: 'As máscaras serão disponibilizadas na festa.',

  // WhatsApp do cerimonial (55 + DDD + número, só números)
  whatsapp: '5579999975006',
  quemConfirma: 'Cerimonial',
  maxAcompanhantes: 4,

  // PIX — o QR Code e o "copia e cola" são gerados automaticamente com o valor certo
  pix: {
    chave: '+5579999432201',
    nome: 'LIS CALDAS', // sem acento, até 25 letras
    cidade: 'ARACAJU', // sem acento, até 15 letras
  },
  presentesTexto: 'Escolha uma experiência de bem-estar e faça parte dessa celebração tão especial. O mesmo mimo pode ser escolhido por várias pessoas.',
  presentes: [
    { icone: '💆‍♀️', titulo: 'Massagem relaxante', texto: 'Um momento para desacelerar e cuidar de mim.', valor: 100 },
    { icone: '💅', titulo: 'Dia de beleza', texto: 'Um carinho especial para celebrar os 50.', valor: 100 },
    { icone: '🧖‍♀️', titulo: 'Spa facial', texto: 'Autocuidado, relaxamento e beleza.', valor: 120 },
    { icone: '🛍️', titulo: 'Vale-mimo', texto: 'Um carinho para eu escolher algo especial.', valor: 120 },
    { icone: '🥂', titulo: 'Jantar especial para dois', texto: 'Uma experiência gostosa para brindar à vida.', valor: 300 },
    { icone: '✨', titulo: 'Experiência de bem-estar', texto: 'Um presente para transformar carinho em experiência.', valor: 300 },
    { icone: '☀️', titulo: 'Bronze de máquina', texto: 'Um momento para cuidar do visual.', valor: 300 },
    { icone: '💐', titulo: 'Buquê de flores naturais', texto: 'Flores para deixar a celebração ainda mais especial.', valor: 400 },
    { icone: '💉', titulo: 'Botox', texto: 'Autocuidado para celebrar os 50.', valor: 500 },
    { icone: '👁️', titulo: 'Micropigmentação das sobrancelhas', texto: 'Para um olhar definido e harmonioso.', valor: 500 },
  ],

  galeria: [
    { src: 'fotos/espaco1.jpg', legenda: 'O espaço' },
    { src: 'fotos/espaco2.jpg', legenda: 'A mesa do bolo' },
    { src: 'fotos/espaco3.jpg', legenda: 'Ao ar livre' },
    { src: 'fotos/espaco4.jpg', legenda: 'Mesas sob as luzes' },
  ],

  // Música: coloque o arquivo na pasta do modelo com este nome. '' = sem música
  musica: 'musica.mp3?v=202610132014',
  sons: false, // sem toques: o suspense vem do som do próprio filme
};
