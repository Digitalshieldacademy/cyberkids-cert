/* =========================================================
   CYBER KIDS · CERTIFICADO PREMIUM
   Digital Shield Academy
   FIXED VERSION · SIN DUPLICAR NOMBRE
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

  const dia = String(d.getDate()).padStart(2, '0');

  const mes = String(d.getMonth() + 1).padStart(2, '0');

  const anio = d.getFullYear();

  return `${dia}/${mes}/${anio}`;
  }

  certDate.textContent = formatDateEs(new Date());

  /* =========================================================
     EFECTO TEXTO FIXED
  ========================================================= */

  function cyberTypeEffect(text) {

    certName.textContent = text;
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
     PARTICULAS
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

    await document.fonts.ready;

    return await html2canvas(certificate, {

      backgroundColor: '#ffffff',

      scale: 2,

      useCORS: true,

      logging: false
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

      btnPng.textContent = 'Descargar Imagen';

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

      btnPdf.textContent = 'Descargar PDF';

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

      btnPrint.textContent = 'Imprimir';

      enableButtons(true);
    }
  });

  /* =========================================================
     INICIAL
  ========================================================= */

  certName.classList.add('placeholder');

  enableButtons(false);

})();
