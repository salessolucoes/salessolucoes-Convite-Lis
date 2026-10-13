/* ============================================================
   MOTOR DO CONVITE — não precisa editar (dados ficam no config.js)
   Sales Soluções · convites digitais
   ============================================================ */
(function () {
  'use strict';
  const C = window.CONVITE;
  const TZ = 'America/Sao_Paulo';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const el = (tag, cls, txt) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt !== undefined) e.textContent = txt;
    return e;
  };
  /* texto digitado pelo convidado: remove caracteres de controle e limita o tamanho */
  const limpa = (s, max = 300) => String(s || '').replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
  const abreLink = (url) => { location.href = url; };

  /* ---------- datas ---------- */
  const inicio = new Date(C.data);
  const fim = new Date(inicio.getTime() + (C.duracaoHoras || 5) * 36e5);
  const f = (o) => inicio.toLocaleString('pt-BR', { timeZone: TZ, ...o });
  const hh = f({ hour: '2-digit', hour12: false });
  const mm = f({ minute: '2-digit' }).padStart(2, '0');
  const reais = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  /* ---------- textos ---------- */
  const campos = {
    nome: C.nome, primeiroNome: C.primeiroNome, idade: C.idade, tema: C.tema, subtitulo: C.subtitulo,
    mensagem: C.mensagem, convite: C.convite, frase: C.frase, clima: C.clima,
    dia: f({ day: '2-digit' }), mes: f({ month: 'long' }), mesNum: f({ month: '2-digit' }), ano: f({ year: 'numeric' }),
    semana: f({ weekday: 'long' }), hora: mm === '00' ? `${hh}h` : `${hh}h${mm}`,
    dataCompleta: f({ day: 'numeric', month: 'long', year: 'numeric' }),
    dataPontos: `${f({ day: '2-digit' })} · ${f({ month: '2-digit' })} · ${f({ year: 'numeric' })}`,
    localNome: C.local.nome, localEndereco: C.local.endereco,
    traje: C.traje, trajeTexto: C.trajeTexto, trajeAviso: C.trajeAviso,
    presentesTexto: C.presentesTexto, quemConfirma: C.quemConfirma,
  };
  $$('[data-c]').forEach((e) => { const v = campos[e.dataset.c]; if (v !== undefined) e.textContent = v; });
  document.title = `${C.nome} · ${C.idade} anos | ${C.tema}`;

  const regras = { traje: !!C.traje, presentes: !!(C.presentes && C.presentes.length), galeria: !!(C.galeria && C.galeria.length), aviso: !!C.trajeAviso };
  $$('[data-se]').forEach((e) => { if (!regras[e.dataset.se]) e.remove(); });

  /* ---------- mapa ---------- */
  const busca = C.local.busca || C.local.endereco;
  $$('[data-maps]').forEach((a) => { a.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(busca); a.target = '_blank'; a.rel = 'noopener noreferrer'; });
  $$('[data-waze]').forEach((a) => { a.href = 'https://waze.com/ul?q=' + encodeURIComponent(busca) + '&navigate=yes'; a.target = '_blank'; a.rel = 'noopener noreferrer'; });
  $$('[data-mapa]').forEach((box) => {
    const ifr = el('iframe');
    ifr.loading = 'lazy';
    ifr.title = 'Mapa do local';
    ifr.referrerPolicy = 'no-referrer-when-downgrade';
    ifr.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups');
    ifr.src = 'https://maps.google.com/maps?q=' + encodeURIComponent(busca) + '&z=16&output=embed';
    box.appendChild(ifr);
  });

  /* ---------- galeria ---------- */
  $$('[data-galeria]').forEach((g) => {
    (C.galeria || []).forEach((it, i) => {
      const fig = el('figure', 'foto');
      const img = new Image();
      img.src = it.src; img.alt = it.legenda || `Foto ${i + 1}`; img.loading = 'lazy'; img.decoding = 'async';
      fig.appendChild(img);
      if (it.legenda) fig.appendChild(el('figcaption', '', it.legenda));
      g.appendChild(fig);
    });
  });

  /* ---------- contagem ---------- */
  const cd = { d: $$('[data-cd="d"]'), h: $$('[data-cd="h"]'), m: $$('[data-cd="m"]'), s: $$('[data-cd="s"]') };
  function tick() {
    let ms = inicio - Date.now();
    if (ms <= 0) { ms = 0; $$('[data-cd-fim]').forEach((b) => (b.hidden = false)); }
    const v = { d: Math.floor(ms / 864e5), h: Math.floor((ms % 864e5) / 36e5), m: Math.floor((ms % 36e5) / 6e4), s: Math.floor((ms % 6e4) / 1e3) };
    for (const k in cd) cd[k].forEach((e) => {
      const t = String(v[k]).padStart(2, '0');
      if (e.textContent !== t) { e.textContent = t; e.classList.remove('pula'); void e.offsetWidth; e.classList.add('pula'); }
    });
  }
  tick(); setInterval(tick, 1000);

  /* ---------- aviso (toast) ---------- */
  function aviso(txt) {
    let t = $('.toast');
    if (!t) { t = el('div', 'toast'); t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = txt; t.classList.add('on');
    clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('on'), 2600);
  }
  async function copiar(txt) {
    try { await navigator.clipboard.writeText(txt); }
    catch { const ta = el('textarea'); ta.value = txt; ta.setAttribute('readonly', ''); document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); }
  }

  /* ---------- agenda ---------- */
  const z = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const tituloEv = `${C.tema} – ${C.idade} anos de ${C.primeiroNome}`;
  $$('[data-agenda="google"]').forEach((a) => {
    a.href = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(tituloEv) +
      '&dates=' + z(inicio) + '/' + z(fim) + '&location=' + encodeURIComponent(C.local.endereco);
    a.target = '_blank'; a.rel = 'noopener noreferrer';
  });
  $$('[data-agenda="ics"]').forEach((b) => b.addEventListener('click', () => {
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Sales Solucoes//Convite//PT', 'BEGIN:VEVENT',
      'UID:' + z(inicio) + '-convite@salessolucoes', 'DTSTAMP:' + z(new Date()), 'DTSTART:' + z(inicio), 'DTEND:' + z(fim),
      'SUMMARY:' + tituloEv, 'LOCATION:' + C.local.endereco.replace(/,/g, '\\,'),
      'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:Amanhã é o baile!', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    const a = el('a'); a.href = url; a.download = 'convite-' + C.primeiroNome.toLowerCase() + '.ics';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 3000);
  }));
  $$('[data-share]').forEach((b) => b.addEventListener('click', async () => {
    const dados = { title: document.title, text: `Você está convidado(a) para o ${C.tema} de ${C.primeiroNome}! 🎭`, url: location.href };
    if (navigator.share) { try { await navigator.share(dados); } catch {} }
    else { await copiar(location.href); aviso('Link copiado!'); }
  }));

  /* ============================================================
     SONS — sintetizados no próprio navegador (sem arquivo)
     ============================================================ */
  window.som = (() => {
    let ctx = null;
    const ok = () => {
      if (!C.sons) return null;
      try { ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === 'suspended') ctx.resume(); } catch { return null; }
      return ctx;
    };
    /* com música tocando, os sons ficam mais baixos para não brigar com ela */
    const fator = () => (window.musica && window.musica.tocando && window.musica.tocando() ? 0.4 : 1);
    function nota(freq, t0, dur, vol, tipo = 'sine') {
      vol *= fator();
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = tipo; o.frequency.value = freq;
      g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(vol, t0 + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g).connect(ctx.destination); o.start(t0); o.stop(t0 + dur + 0.05);
    }
    return {
      /* sino de cristal */
      toque(vol = 0.16) {
        if (!ok()) return; const t = ctx.currentTime;
        [[1318.5, 1], [1975.5, 0.5], [2637, 0.28], [3951, 0.12]].forEach(([fq, k]) => nota(fq, t, 1.6, vol * k));
      },
      /* brilho mágico (arpejo) */
      revelar(vol = 0.12) {
        if (!ok()) return; const t = ctx.currentTime;
        [784, 988, 1175, 1568, 1976, 2349].forEach((fq, i) => { nota(fq, t + i * 0.07, 1.4, vol * (1 - i * 0.1)); nota(fq * 2.01, t + i * 0.07, 0.8, vol * 0.2); });
      },
      /* clique suave */
      clique(vol = 0.08) { if (fator() < 1 || !ok()) return; nota(2200, ctx.currentTime, 0.12, vol, 'triangle'); },
      /* vento / cortina */
      whoosh(vol = 0.22, dur = 1.6) {
        if (!ok()) return; const t = ctx.currentTime;
        const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate), d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        const src = ctx.createBufferSource(); src.buffer = buf;
        const fl = ctx.createBiquadFilter(); fl.type = 'bandpass'; fl.Q.value = 0.8;
        fl.frequency.setValueAtTime(300, t); fl.frequency.exponentialRampToValueAtTime(1800, t + dur * 0.45); fl.frequency.exponentialRampToValueAtTime(400, t + dur);
        const g = ctx.createGain(); vol *= fator(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + dur * 0.35); g.gain.linearRampToValueAtTime(0, t + dur);
        src.connect(fl).connect(g).connect(ctx.destination); src.start(t);
      },
      /* impacto grave de trailer */
      impacto(vol = 0.35) {
        if (!ok()) return; const t = ctx.currentTime;
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(38, t + 1.4);
        g.gain.setValueAtTime(vol * fator(), t); g.gain.exponentialRampToValueAtTime(0.001, t + 1.8);
        o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 1.9);
      },
    };
  })();

  /* ============================================================
     MÚSICA — só toca depois do primeiro toque (regra dos celulares)
     ============================================================ */
  window.musica = (() => {
    if (!C.musica) return { tocar() {}, desbloquear() {}, tocando: () => false, existe: false };
    const a = new Audio(); a.src = C.musica; a.loop = true; a.preload = 'auto'; a.volume = 0;
    let quer = false, falhou = false, btn = null;
    a.addEventListener('error', () => { falhou = true; btn && btn.remove(); });
    function botao() {
      if (btn || falhou) return;
      btn = el('button', 'btn-musica'); btn.type = 'button'; btn.setAttribute('aria-label', 'Ligar ou desligar a música');
      for (let i = 0; i < 4; i++) btn.appendChild(el('i'));
      btn.addEventListener('click', () => { quer ? pausa() : tocar(); });
      document.body.appendChild(btn);
    }
    function fade(alvo, ms = 1800) {
      const ini = a.volume, t0 = performance.now();
      (function passo(t) { const p = Math.min(1, (t - t0) / ms); a.volume = ini + (alvo - ini) * p; if (p < 1) requestAnimationFrame(passo); else if (alvo === 0) a.pause(); })(t0);
    }
    function tocar() {
      if (falhou) return; quer = true; botao();
      const p = a.play(); if (p) p.then(() => { fade(0.55); btn && btn.classList.add('tocando'); }).catch(() => { btn && btn.classList.remove('tocando'); });
    }
    function pausa() { quer = false; fade(0, 600); btn && btn.classList.remove('tocando'); }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && !a.paused) { a.pause(); } else if (!document.hidden && quer) { a.play().catch(() => {}); }
    });
    /* chamado no toque do convidado: libera o áudio no celular para tocar depois, sozinho */
    function desbloquear() {
      if (falhou) return;
      a.muted = true;
      const p = a.play();
      const fim = () => { a.pause(); a.currentTime = 0; a.muted = false; };
      if (p && p.then) p.then(fim).catch(() => { a.muted = false; }); else fim();
    }
    return { tocar, pausa, desbloquear, tocando: () => quer && !a.paused, existe: true };
  })();

  /* ============================================================
     PARTÍCULAS DOURADAS
     ============================================================ */
  const DOURADO = ['#f3d995', '#d7ad58', '#fff3c8', '#b8862f', '#ffffff'];
  window.festa = (() => {
    let cv, ctx, parts = [], rodando = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2), fator = reduz ? 0.25 : 1;
    function prepara() {
      if (cv) return;
      cv = el('canvas', 'festa-canvas'); cv.setAttribute('aria-hidden', 'true');
      document.body.appendChild(cv); ctx = cv.getContext('2d'); ajusta(); addEventListener('resize', ajusta);
    }
    function ajusta() { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    function add(p) { prepara(); parts.push(p); if (!rodando) { rodando = true; requestAnimationFrame(loop); } }
    function loop() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      parts = parts.filter((p) => p.vida > 0 && p.y < innerHeight + 40);
      for (const p of parts) {
        p.vx *= p.atr; p.vy = p.vy * p.atr + p.g; p.x += p.vx + Math.sin(p.t * 0.08) * p.bal; p.y += p.vy; p.rot += p.vr; p.t++; p.vida--;
        ctx.save(); ctx.globalAlpha = Math.min(1, p.vida / 40) * (0.6 + 0.4 * Math.sin(p.t * 0.25 + p.fase));
        ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.cor;
        if (p.forma === 'ret') { ctx.scale(1, Math.cos(p.t * 0.14)); ctx.fillRect(-p.s / 2, -p.s / 5, p.s, p.s / 2.5); }
        else { ctx.shadowColor = p.cor; ctx.shadowBlur = 8; ctx.beginPath(); ctx.arc(0, 0, p.s / 3.2, 0, 7); ctx.fill(); }
        ctx.restore();
      }
      if (parts.length) requestAnimationFrame(loop); else { rodando = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
    }
    const R = (a, b) => a + Math.random() * (b - a), pega = (a) => a[(Math.random() * a.length) | 0];
    const base = (o) => Object.assign({ t: 0, rot: R(0, 6.3), vr: R(-0.15, 0.15), bal: R(0.1, 0.6), atr: 0.97, g: 0.12, vida: R(120, 200), fase: R(0, 6) }, o);
    return {
      explodir(x = innerWidth / 2, y = innerHeight / 2, o = {}) {
        const qtd = Math.round((o.qtd || 120) * fator), forca = o.forca || 11;
        for (let i = 0; i < qtd; i++) { const a = R(0, 6.3), v = R(forca * 0.25, forca); add(base({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - forca * 0.3, s: R(4, 10), cor: pega(DOURADO), forma: Math.random() < 0.5 ? 'ret' : 'pt', atr: 0.95, g: 0.16 })); }
      },
      chuva(o = {}) {
        const dur = o.duracao || 2500, n = Math.max(1, Math.round((o.densidade || 2) * fator)), t0 = performance.now();
        (function gera() { for (let i = 0; i < n; i++) add(base({ x: R(0, innerWidth), y: -10, vx: R(-0.6, 0.6), vy: R(0.8, 2.2), s: R(4, 9), cor: pega(DOURADO), forma: Math.random() < 0.6 ? 'ret' : 'pt', g: 0.02, atr: 0.995, vida: 700 })); if (performance.now() - t0 < dur) requestAnimationFrame(gera); })();
      },
    };
  })();

  /* poeira dourada contínua (fundo) */
  window.poeira = function (alvo, qtd = 40) {
    if (reduz || !alvo) return;
    const cv = el('canvas', 'poeira'); cv.setAttribute('aria-hidden', 'true'); alvo.prepend(cv);
    const ctx = cv.getContext('2d'), dpr = Math.min(devicePixelRatio || 1, 2);
    let W, H, ps = [], vis = true;
    function ajusta() { W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    ajusta(); addEventListener('resize', ajusta);
    for (let i = 0; i < qtd; i++) ps.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.6 + 0.4, v: Math.random() * 0.35 + 0.1, d: (Math.random() - 0.5) * 0.3, f: Math.random() * 6 });
    if ('IntersectionObserver' in window) new IntersectionObserver((e) => { vis = e[0].isIntersecting; if (vis) requestAnimationFrame(loop); }).observe(cv);
    function loop() {
      if (!vis) return;
      ctx.clearRect(0, 0, W, H);
      for (const p of ps) {
        p.y -= p.v; p.x += p.d; p.f += 0.03; if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
        ctx.globalAlpha = 0.35 + 0.35 * Math.sin(p.f); ctx.fillStyle = '#f3d995'; ctx.shadowColor = '#f3d995'; ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  };

  /* ============================================================
     PIX — gera o "copia e cola" (BR Code) com o valor exato + QR Code
     ============================================================ */
  function crc16(s) {
    let c = 0xffff;
    for (const b of new TextEncoder().encode(s)) { c ^= b << 8; for (let i = 0; i < 8; i++) c = c & 0x8000 ? ((c << 1) ^ 0x1021) & 0xffff : (c << 1) & 0xffff; }
    return c.toString(16).toUpperCase().padStart(4, '0');
  }
  const semAcento = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
  function pixCodigo(valor) {
    const f = (id, v) => id + String(v.length).padStart(2, '0') + v;
    const p = C.pix;
    const corpo = f('00', '01') + f('26', f('00', 'BR.GOV.BCB.PIX') + f('01', p.chave)) + f('52', '0000') + f('53', '986') +
      (valor ? f('54', Number(valor).toFixed(2)) : '') + f('58', 'BR') + f('59', semAcento(p.nome).slice(0, 25)) +
      f('60', semAcento(p.cidade).slice(0, 15)) + f('62', f('05', '***')) + '6304';
    return corpo + crc16(corpo);
  }
  window.pixCodigo = pixCodigo;

  /* cartões de presente */
  $$('[data-presentes]').forEach((lista) => {
    C.presentes.forEach((p, i) => {
      const b = el('button', 'presente'); b.type = 'button';
      b.appendChild(el('span', 'presente-ico', p.icone));
      b.appendChild(el('strong', 'presente-titulo', p.titulo));
      b.appendChild(el('span', 'presente-texto', p.texto));
      b.appendChild(el('span', 'presente-valor', reais(p.valor)));
      b.appendChild(el('span', 'presente-cta', 'Presentear'));
      b.addEventListener('click', () => abrePresente(i));
      lista.appendChild(b);
    });
  });

  /* janela do presente (criada uma vez) */
  let modal;
  function criaModal() {
    modal = el('div', 'modal'); modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true'); modal.hidden = true;
    const caixa = el('div', 'modal-caixa');
    const fecha = el('button', 'modal-fechar', '×'); fecha.type = 'button'; fecha.setAttribute('aria-label', 'Fechar');
    const tit = el('p', 'modal-rotulo', 'Seu presente');
    const nome = el('h3', 'modal-titulo'); const valor = el('p', 'modal-valor');
    const qr = el('div', 'modal-qr'); qr.setAttribute('role', 'img'); qr.setAttribute('aria-label', 'QR Code Pix');
    const dica = el('p', 'modal-dica', 'Aponte a câmera do app do banco ou use o Pix copia e cola:');
    const cod = el('textarea', 'modal-codigo'); cod.readOnly = true; cod.rows = 3;
    const bc = el('button', 'btn btn-cheio', 'Copiar código Pix'); bc.type = 'button';
    const sep = el('div', 'modal-sep');
    const lb = el('label', 'campo'); lb.appendChild(el('span', '', 'Seu nome'));
    const inNome = el('input'); inNome.maxLength = 60; inNome.autocomplete = 'name'; inNome.placeholder = 'Para a Lis saber quem presenteou'; lb.appendChild(inNome);
    const lm = el('label', 'campo'); lm.appendChild(el('span', '', 'Mensagem para a aniversariante (opcional)'));
    const inMsg = el('textarea'); inMsg.maxLength = 300; inMsg.rows = 2; lm.appendChild(inMsg);
    const bw = el('button', 'btn', `Avisar o ${C.quemConfirma.toLowerCase()} 💌`); bw.type = 'button';
    caixa.append(fecha, tit, nome, valor, qr, dica, cod, bc, sep, lb, lm, bw);
    modal.appendChild(caixa); document.body.appendChild(modal);
    const fechar = () => { modal.classList.remove('on'); setTimeout(() => (modal.hidden = true), 300); document.body.classList.remove('travado'); };
    fecha.addEventListener('click', fechar);
    modal.addEventListener('click', (e) => { if (e.target === modal) fechar(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) fechar(); });
    bc.addEventListener('click', async () => { await copiar(cod.value); som.clique(); aviso('Código Pix copiado! Agora cole no app do banco.'); });
    bw.addEventListener('click', () => {
      const p = C.presentes[modal._i];
      const quem = limpa(inNome.value, 60), msg = limpa(inMsg.value, 300);
      let t = `Olá, ${C.quemConfirma}! 🎭 Escolhi um presente para a ${C.primeiroNome}: *${p.titulo}* (${reais(p.valor)}).`;
      if (quem) t += `\nMeu nome: ${quem}`;
      if (msg) t += `\nMensagem para a aniversariante: ${msg}`;
      abreLink(`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(t)}`);
    });
    modal._els = { nome, valor, qr, cod };
  }
  function abrePresente(i) {
    if (!modal) criaModal();
    const p = C.presentes[i], e = modal._els, code = pixCodigo(p.valor);
    modal._i = i;
    e.nome.textContent = `${p.icone} ${p.titulo}`; e.valor.textContent = reais(p.valor); e.cod.value = code;
    e.qr.innerHTML = window.gerarQR ? window.gerarQR(code) : '';
    modal.hidden = false; requestAnimationFrame(() => modal.classList.add('on'));
    document.body.classList.add('travado'); som.toque(0.1);
  }

  /* ---------- confirmação (RSVP) ---------- */
  $$('form[data-rsvp]').forEach((form) => {
    const sel = form.querySelector('[name="acomp"]');
    if (sel && !sel.options.length) for (let i = 0; i <= (C.maxAcompanhantes ?? 4); i++) sel.add(new Option(i === 0 ? 'Somente eu' : `Eu + ${i}`, i));
    const linha = form.querySelector('[data-linha-acomp]');
    form.addEventListener('change', () => { const vai = form.querySelector('[name="vai"]:checked')?.value !== 'nao'; if (linha) linha.hidden = !vai; });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = limpa(form.nome.value, 60);
      if (!nome) { form.nome.focus(); aviso('Digite seu nome, por favor.'); return; }
      const vai = form.querySelector('[name="vai"]:checked')?.value !== 'nao';
      const n = Math.max(0, Math.min(20, parseInt(sel?.value || '0', 10) || 0));
      const recado = limpa(form.recado?.value, 300);
      let msg = vai
        ? `Olá, ${C.quemConfirma}! 🎭 Sou ${nome} e *confirmo presença* no ${C.tema} de ${C.idade} anos da ${C.primeiroNome}.` + (n ? `\nIrei com ${n} acompanhante${n > 1 ? 's' : ''} (total: ${n + 1} pessoas).` : '')
        : `Olá, ${C.quemConfirma}! Sou ${nome}. Infelizmente *não poderei comparecer* ao ${C.tema} da ${C.primeiroNome}. Desejo uma noite maravilhosa!`;
      if (recado) msg += `\n\nMensagem para a aniversariante: ${recado}`;
      if (vai) { festa.explodir(innerWidth / 2, innerHeight * 0.6); som.revelar(); }
      setTimeout(() => abreLink(`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(msg)}`), vai ? 700 : 0);
    });
  });

  /* ---------- aparecer ao rolar ---------- */
  if ('IntersectionObserver' in window && !reduz) {
    const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('visivel'); io.unobserve(en.target); } }), { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach((e) => io.observe(e));
  } else $$('.reveal').forEach((e) => e.classList.add('visivel'));

  /* toque em botões = clique suave */
  document.addEventListener('click', (e) => { if (e.target.closest('.btn, .escolha label, [data-som]')) som.clique(); });


  /* ============================================================
     CINEMA — sequência de cenas com fotos em movimento + letreiros
     cenas: [{ img, pos, texto, sub, tam: ''|'grande'|'enorme', dur }]
     ============================================================ */
  window.cinema = function (op) {
    const cenas = op.cenas || [];
    const box = el('div', 'cine'); box.dataset.estilo = op.estilo || 'padrao'; box.setAttribute('aria-live', 'polite');
    const quadros = cenas.map((c) => {
      const q = el('div', 'cine-quadro');
      const f = el('div', 'cine-foto');
      f.style.backgroundImage = `url("${c.img}")`;
      if (c.pos) f.style.backgroundPosition = c.pos;
      if (c.zoom === 'sai') f.classList.add('zoom-sai');
      const t = el('div', 'cine-txt ' + (c.tam || ''));
      if (c.texto) t.appendChild(el('p', 'cine-linha', c.texto));
      if (c.sub) t.appendChild(el('p', 'cine-sub', c.sub));
      q.append(f, t); box.appendChild(q);
      return q;
    });
    box.append(el('div', 'cine-faixa topo'), el('div', 'cine-faixa base'), el('div', 'cine-vinheta'));
    const pula = el('button', 'cine-pular', 'Pular ▸▸'); pula.type = 'button'; box.appendChild(pula);
    document.body.appendChild(box);
    let acabou = false, timer;
    requestAnimationFrame(() => box.classList.add('on'));
    function mostra(i) {
      if (acabou) return;
      if (i >= quadros.length) return fim();
      quadros.forEach((q, k) => { q.classList.toggle('on', k === i); q.classList.toggle('sai', k < i); });
      if (op.aoCena) op.aoCena(i);
      timer = setTimeout(() => mostra(i + 1), cenas[i].dur || 3200);
    }
    function fim() {
      if (acabou) return; acabou = true; clearTimeout(timer);
      box.classList.add('fim');
      setTimeout(() => { op.aoFim && op.aoFim(); box.classList.add('some'); setTimeout(() => box.remove(), 1200); }, 700);
    }
    pula.addEventListener('click', fim);
    setTimeout(() => mostra(0), op.atraso || 500);
    return { fim };
  };

  /* ---------- abrir convite (usado pelo efeito de cada modelo) ---------- */
  window.abrirConvite = function () {
    document.body.classList.add('aberto');
    const ab = $('#abertura');
    if (ab) { ab.classList.add('saindo'); setTimeout(() => ab.remove(), 1400); }
    window.scrollTo(0, 0);
  };
  window.aviso = aviso;
})();
