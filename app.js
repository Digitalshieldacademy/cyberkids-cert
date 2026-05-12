/* =========================================================
   CYBER KIDS · CERTIFICADO PREMIUM
   Digital Shield Academy
   by Oscar Rivera
   ========================================================= */

(function () {
  'use strict';

  const input        = document.getElementById('kidName');
  const charCount    = document.getElementById('charCount');
  const certName     = document.getElementById('certName');
  const certDate     = document.getElementById('certDate');
  const certificate  = document.getElementById('certificate');

  const btnPdf       = document.getElementById('downloadPdfBtn');
  const btnPng       = document.getElementById('downloadPngBtn');
  const btnPrint     = document.getElementById('printBtn');

  const PLACEHOLDER  = 'NOMBRE DEL HÉROE';

  /* =========================================================
     FECHA ACTUAL
     ========================================================= */

  function formatDateEs(d) {

    const meses = [
      'enero','febrero','marzo','abril','mayo','junio',
      'julio','agosto','septiembre','octubre','noviembre','diciembre'
    ];

    const dia  = String(d.getDate()).padStart(2, '0');
    const mes  = meses[d.getMonth()];
    const anio = d.getFullYear();

    return `${dia} de ${mes} de ${anio}`;
  }

  certDate.textContent = formatDateEs(new Date());

  /* =========================================================
     EFECTO ESCRITURA CYBER
     ========================================================= */

  function cyberTypeEffect(text) {

    certName.innerHTML = '';

    let index = 0;

    const interval = setInterval(() => {

      certName.textContent += text[index];

      index++;

      if (index >= text.length) {
        clearInterval(interval);
      }

    }, 45);
  }

  /* =========================================================
     LIMPIAR NOMBRE
     ========================================================= */

  function cleanName(raw) {

    if (!raw) return '';

    return raw
      .replace(/[^\p{L}\s'’\-]/gu, '')
      .replace(/\s+/g, ' ')
      .trimStart();
  }

  /* =========================================================
     BOTONES
     ========================================================= */

  function enableButtons(on) {

    btnPdf.disabled   = !on;
    btnPng.disabled   = !on;
    btnPrint.disabled = !on;
  }

  /* =========================================================
     ACTUALIZAR PREVIEW
     ========================================================= */

  function updatePreview() {

    const v = cleanName(input.value);

    charCount.textContent = v.length;

    if (v.trim()) {

      certName.classList.remove('placeholder');

      cyberTypeEffect(v.trim());

      enableButtons(true);

      activateHeroMode();

    } else {

      certName.textContent = PLACEHOLDER;

      certName.classList.add('placeholder');

      enableButtons(false);

      deactivateHeroMode();
    }
  }

  input.addEventListener('input', () => {

    const cleaned = cleanName(input.value);

    if (cleaned !== input.value) {
      input.value = cleaned;
    }

    updatePreview();
  });

  /* =========================================================
     HERO MODE
     ========================================================= */

  function activateHeroMode() {

    certificate.classList.add('hero-active');

    launchParticles();
  }

  function deactivateHeroMode() {

    certificate.classList.remove('hero-active');
  }

  /* =========================================================
     PARTICULAS CYBER
     ========================================================= */

  function launchParticles() {

    const existing = document.querySelectorAll('.cyber-particle');

    existing.forEach(el => el.remove());

    for (let i = 0; i < 18; i++) {

      const p = document.createElement('div');

      p.className = 'cyber-particle';

      p.style.left = Math.random() * 100 + '%';

      p.style.animationDelay = (Math.random() * 2) + 's';

      p.style.animationDuration = (3 + Math.random() * 3) + 's';

      certificate.appendChild(p);

      setTimeout(() => {

        p.remove();

      }, 7000);
    }
  }

  /* =========================================================
     RENDER CERTIFICADO
     ========================================================= */

  async function renderCertCanvas() {

    return await html2canvas(certificate, {

      backgroundColor: '#ffffff',

      scale: 3,

      useCORS: true,

      logging: false,

      windowWidth: 1200,

      windowHeight: 900
    });
  }

  /* =========================================================
     NOMBRE ARCHIVO
     ========================================================= */

  function safeFileName(name) {

    return cleanName(name)
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^\p{L}_\-]/gu, '')
      .substring(0, 40) || 'CyberKid';
  }

  /* =========================================================
     CONFETTI
     ========================================================= */

  function launchConfetti() {

    for (let i = 0; i < 40; i++) {

      const conf = document.createElement('div');

      conf.className = 'confetti-piece';

      conf.style.left = Math.random() * 100 + '%';

      conf.style.animationDelay = Math.random() * 2 + 's';

      conf.style.background =
        ['#3aa9ff','#ffd84d','#6d4ad6','#4ee79a'][Math.floor(Math.random() * 4)];

      document.body.appendChild(conf);

      setTimeout(() => {

        conf.remove();

      }, 5000);
    }
  }

  /* =========================================================
     DESCARGAR PNG
     ========================================================= */

  btnPng.addEventListener('click', async () => {

    if (btnPng.disabled) return;

    btnPng.textContent = 'GENERANDO...';

    btnPng.disabled = true;

    try {

      launchConfetti();

      const canvas = await renderCertCanvas();

      const link = document.createElement('a');

      link.download =
        `Certificado_CyberKid_${safeFileName(input.value)}.png`;

      link.href = canvas.toDataURL('image/png');

      link.click();

    } catch (err) {

      alert('Error al generar la imagen.');

      console.error(err);

    } finally {

      btnPng.innerHTML =
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4"><rect x="3" y="3" width="18" height="18" rx="2"/></svg> Descargar Imagen';

      enableButtons(true);
    }
  });

  /* =========================================================
     DESCARGAR PDF
     ========================================================= */

  btnPdf.addEventListener('click', async () => {

    if (btnPdf.disabled) return;

    btnPdf.textContent = 'GENERANDO...';

    btnPdf.disabled = true;

    try {

      launchConfetti();

      const canvas = await renderCertCanvas();

      const imgData = canvas.toDataURL('image/jpeg', 1);

      const { jsPDF } = window.jspdf;

      const pdf = new jsPDF({

        orientation: 'landscape',

        unit: 'mm',

        format: 'letter'
      });

      const pageW = pdf.internal.pageSize.getWidth();

      const pageH = pdf.internal.pageSize.getHeight();

      const margin = 6;

      const w = pageW - margin * 2;

      const h = pageH - margin * 2;

      pdf.addImage(imgData, 'JPEG', margin, margin, w, h);

      pdf.save(
        `Certificado_CyberKid_${safeFileName(input.value)}.pdf`
      );

    } catch (err) {

      alert('Error al generar el PDF.');

      console.error(err);

    } finally {

      btnPdf.innerHTML =
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"/></svg> Descargar PDF';

      enableButtons(true);
    }
  });

  /* =========================================================
     IMPRIMIR
     ========================================================= */

  btnPrint.addEventListener('click', async () => {

    if (btnPrint.disabled) return;

    btnPrint.textContent = 'PREPARANDO...';

    btnPrint.disabled = true;

    try {

      const canvas = await renderCertCanvas();

      const imgData = canvas.toDataURL('image/png');

      const win = window.open('', '_blank');

      if (!win) {

        alert('Permite ventanas emergentes.');

        return;
      }

      win.document.write(`

        <!doctype html>

        <html>

        <head>

        <title>Imprimir Certificado</title>

        <style>

        @page {
          size: letter landscape;
          margin: 8mm;
        }

        body {
          margin:0;
          background:white;
        }

        img{
          width:100%;
          display:block;
        }

        </style>

        </head>

        <body>

        <img src="${imgData}"
        onload="window.print();setTimeout(()=>window.close(),500)" />

        </body>

        </html>
      `);

      win.document.close();

    } catch (err) {

      alert('Error al imprimir.');

      console.error(err);

    } finally {

      btnPrint.innerHTML =
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z"/></svg> Imprimir';

      enableButtons(true);
    }
  });

  /* =========================================================
     RESPONSIVE SCALE
     ========================================================= */

  function scaleCertificate() {

    const stage = document.querySelector('.cert-stage');

    if (!stage) return;

    const stageW = stage.clientWidth - 20;

    const certW = 1000;

    if (stageW < certW) {

      const scale = stageW / certW;

      certificate.style.transform =
        `scale(${scale})`;

      certificate.style.transformOrigin =
        'top left';

      certificate.style.marginBottom =
        `${(scale - 1) * 720}px`;

    } else {

      certificate.style.transform = '';

      certificate.style.marginBottom = '';
    }
  }

  window.addEventListener('resize', scaleCertificate);

  window.addEventListener('load', scaleCertificate);

  scaleCertificate();

  /* =========================================================
     INICIAL
     ========================================================= */

  certName.classList.add('placeholder');

  enableButtons(false);

  console.log(
    '%c🔒 CYBER KIDS · PRIVACIDAD TOTAL',
    'background:#0d4d8c;color:#7fd3ff;padding:8px 14px;border-radius:6px;font-weight:bold;'
  );

})();
