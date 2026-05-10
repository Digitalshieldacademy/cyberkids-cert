/* =========================================================
   CYBER KIDS · Certificado personalizado
   100% client-side. Cero envío de datos.
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

  /* ---------- Fecha actual en español ---------- */
  function formatDateEs(d) {
    const meses = ['enero','febrero','marzo','abril','mayo','junio',
                   'julio','agosto','septiembre','octubre','noviembre','diciembre'];
    const dia   = String(d.getDate()).padStart(2, '0');
    const mes   = meses[d.getMonth()];
    const anio  = d.getFullYear();
    return `${dia} de ${mes} de ${anio}`;
  }
  certDate.textContent = formatDateEs(new Date());

  /* ---------- Sanitizar entrada (sin guardar nada) ---------- */
  function cleanName(raw) {
    if (!raw) return '';
    // Solo letras, espacios, acentos, ñ, apóstrofes y guiones (nombres compuestos)
    return raw
      .replace(/[^\p{L}\s'’\-]/gu, '')
      .replace(/\s+/g, ' ')
      .trimStart();
  }

  /* ---------- Actualización en vivo ---------- */
  function updatePreview() {
    const v = cleanName(input.value);
    charCount.textContent = v.length;

    if (v.trim()) {
      certName.textContent = v.trim();
      certName.classList.remove('placeholder');
      enableButtons(true);
    } else {
      certName.textContent = PLACEHOLDER;
      certName.classList.add('placeholder');
      enableButtons(false);
    }
  }

  function enableButtons(on) {
    btnPdf.disabled = !on;
    btnPng.disabled = !on;
    btnPrint.disabled = !on;
  }

  input.addEventListener('input', () => {
    // forzar limpieza visible
    const cleaned = cleanName(input.value);
    if (cleaned !== input.value) input.value = cleaned;
    updatePreview();
  });

  // Estado inicial
  certName.classList.add('placeholder');
  enableButtons(false);

  /* ---------- Capturar el certificado a canvas ---------- */
  async function renderCertCanvas() {
    // Forzamos buena calidad sin importar zoom móvil
    return await html2canvas(certificate, {
      backgroundColor: '#ffffff',
      scale: 2,                // alta resolución
      useCORS: true,
      logging: false,
      windowWidth: 1000,
      windowHeight: 720
    });
  }

  function safeFileName(name) {
    return cleanName(name)
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^\p{L}_\-]/gu, '')
      .substring(0, 40) || 'CyberKid';
  }

  /* ---------- Descargar PNG ---------- */
  btnPng.addEventListener('click', async () => {
    if (btnPng.disabled) return;
    btnPng.textContent = 'Generando…';
    btnPng.disabled = true;
    try {
      const canvas = await renderCertCanvas();
      const link = document.createElement('a');
      link.download = `Certificado_CyberKid_${safeFileName(input.value)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      alert('Hubo un problema al generar la imagen. Intenta de nuevo.');
      console.error(err);
    } finally {
      btnPng.innerHTML = '<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><circle cx=\"9\" cy=\"9\" r=\"2\"/><path d=\"M21 15l-5-5L5 21\"/></svg> Descargar Imagen';
      enableButtons(true);
    }
  });

  /* ---------- Descargar PDF ---------- */
  btnPdf.addEventListener('click', async () => {
    if (btnPdf.disabled) return;
    btnPdf.textContent = 'Generando…';
    btnPdf.disabled = true;
    try {
      const canvas = await renderCertCanvas();
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const { jsPDF } = window.jspdf;
      // Carta horizontal (Letter landscape) - tamaño impresión global
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'letter'
      });
      const pageW = pdf.internal.pageSize.getWidth();   // ~279.4 mm
      const pageH = pdf.internal.pageSize.getHeight();  // ~215.9 mm

      // Mantener proporción del certificado (1000:720 ≈ 1.389)
      const certRatio = 1000 / 720;
      const margin = 8;
      let w = pageW - margin * 2;
      let h = w / certRatio;
      if (h > pageH - margin * 2) {
        h = pageH - margin * 2;
        w = h * certRatio;
      }
      const x = (pageW - w) / 2;
      const y = (pageH - h) / 2;

      pdf.addImage(imgData, 'JPEG', x, y, w, h);
      pdf.save(`Certificado_CyberKid_${safeFileName(input.value)}.pdf`);
    } catch (err) {
      alert('Hubo un problema al generar el PDF. Intenta de nuevo.');
      console.error(err);
    } finally {
      btnPdf.innerHTML = '<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3v12m0 0l-4-4m4 4l4-4M5 21h14\"/></svg> Descargar PDF';
      enableButtons(true);
    }
  });

  /* ---------- Imprimir ---------- */
  btnPrint.addEventListener('click', async () => {
    if (btnPrint.disabled) return;
    btnPrint.textContent = 'Preparando…';
    btnPrint.disabled = true;
    try {
      const canvas = await renderCertCanvas();
      const imgData = canvas.toDataURL('image/png');
      const win = window.open('', '_blank');
      if (!win) {
        alert('Permite las ventanas emergentes para imprimir.');
        return;
      }
      win.document.write(`
        <!doctype html><html><head><title>Imprimir Certificado</title>
        <style>
          @page { size: letter landscape; margin: 8mm; }
          html, body { margin: 0; padding: 0; background: white; }
          img { width: 100%; height: auto; display: block; }
        </style></head>
        <body><img src=\"${imgData}\" onload=\"window.focus(); window.print(); setTimeout(() => window.close(), 500);\" /></body>
        </html>`);
      win.document.close();
    } catch (err) {
      alert('Hubo un problema al imprimir. Intenta descargar el PDF.');
      console.error(err);
    } finally {
      btnPrint.innerHTML = '<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z\"/></svg> Imprimir';
      enableButtons(true);
    }
  });

  /* ---------- Escalado responsive del certificado en móvil ---------- */
  function scaleCertificate() {
    const stage = document.querySelector('.cert-stage');
    if (!stage) return;
    const stageW = stage.clientWidth - 36; // padding interno
    const certW  = 1000;
    if (stageW < certW) {
      const scale = stageW / certW;
      certificate.style.transform = `scale(${scale})`;
      certificate.style.marginBottom = `${(scale - 1) * 720}px`;
    } else {
      certificate.style.transform = '';
      certificate.style.marginBottom = '';
    }
  }
  window.addEventListener('resize', scaleCertificate);
  window.addEventListener('load', scaleCertificate);
  scaleCertificate();

  /* ---------- Garantía de privacidad ---------- */
  // Reafirmar al usuario en consola: cero llamadas externas tras carga inicial
  console.log('%c🔒 Cyber Kids · Cero datos guardados.',
    'background:#0d4d8c;color:#7fd3ff;padding:6px 12px;border-radius:6px;font-weight:bold;');
  console.log('Tu nombre nunca sale de este navegador. Verifica el código en GitHub.');
})();

