/* MODELO 2 — A Revelação (versão final da Lis)
   máscara na fumaça → toque → filme (Lis de costas → sai da fumaça → nome/50 → troca de vestido) → convite + música */
(function () {
  'use strict';
  const $ = (s) => document.getElementById(s);
  const ab = $('abertura'), btn = $('revelar'), mascara = $('abVideo');
  const filme = $('filme'), video = $('filmeVideo'), pular = $('pular');
  const letreiros = [...document.querySelectorAll('.letreiro')].map((e) => ({ e, ini: +e.dataset.t, fim: +e.dataset.ate }));
  const DURACAO = 15.2;
  let comecou = false, terminou = false, relogio = false, t0 = 0, ultimo = -1, parado = 0;

  if (mascara) { const p = mascara.play(); if (p && p.catch) p.catch(() => {}); }
  poeira(ab, 30);
  poeira(document.querySelector('.hero'), 30);

  const tempo = () => (relogio ? (performance.now() - t0) / 1000 : video.currentTime);
  function usarRelogio() {
    if (relogio) return;
    relogio = true; t0 = performance.now() - (video.currentTime || 0) * 1000;
    filme.classList.add('sem-video');
  }

  function quadro() {
    if (terminou) return;
    const t = tempo();
    letreiros.forEach(({ e, ini, fim }) => {
      e.classList.toggle('on', t >= ini && t < fim);
      e.classList.toggle('fora', t >= fim);
    });
    if (!relogio) { if (t === ultimo) { if (++parado > 150) usarRelogio(); } else { parado = 0; ultimo = t; } }
    if (t >= DURACAO) return terminar();
    requestAnimationFrame(quadro);
  }

  function comecar() {
    if (comecou) return; comecou = true;
    som.toque();
    musica.desbloquear();             // libera a música para tocar sozinha no fim do filme
    ab.classList.add('virou');
    filme.hidden = false;
    requestAnimationFrame(() => filme.classList.add('on'));
    t0 = performance.now();
    const p = video.play();
    if (p && p.catch) p.catch(usarRelogio);
    video.addEventListener('error', usarRelogio, { once: true });
    const src = video.querySelector('source');
    if (src) src.addEventListener('error', usarRelogio, { once: true });
    video.addEventListener('ended', terminar, { once: true });
    setTimeout(() => som.revelar(0.1), 5200);
    setTimeout(() => requestAnimationFrame(quadro), 200);
  }

  function terminar() {
    if (terminou) return; terminou = true;
    filme.classList.add('fechando');
    setTimeout(() => {
      try { video.pause(); } catch {}
      abrirConvite();
      musica.tocar();                 // música começa sozinha depois do filme e repete no fim
      festa.chuva({ duracao: 2400, densidade: 2 });
    }, 700);
  }

  btn.addEventListener('click', comecar);
  pular.addEventListener('click', terminar);
})();
