(function () {
  'use strict';
  const SITE_URL = 'https://nexvora-ux.github.io/floreria-rosalinda/';
  const cfg = window.ROSALINDA_CONFIG || {};
  // Si se indica redesUrl en config.js, los tres iconos abrirán esa dirección.
  // Los enlaces propios de facebook, instagram, tiktok tienen prioridad cuando existan.
  document.querySelectorAll('[data-platform]').forEach(a => {
    const specific = cfg[a.dataset.platform];
    const target = (typeof specific === 'string' && /^https:\/\//i.test(specific)) ? specific
                 : (typeof cfg.redesUrl === 'string' && /^https:\/\//i.test(cfg.redesUrl)) ? cfg.redesUrl : SITE_URL;
    a.href = target;
  });
  function showInfo(html) {
    const content = document.getElementById('dialogContent');
    const overlay = document.getElementById('overlay');
    if (!content || !overlay) return;
    content.innerHTML = html;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function qrDialog() {
    showInfo(`<div class="rosalinda-share-dialog"><h2>Comparte Florería Rosalinda</h2><p>Escanea el QR o envía el enlace de nuestra tienda.</p><img class="qr-image" src="assets/qr-tienda.png" alt="Código QR para abrir la tienda Rosalinda"><div class="share-url">${SITE_URL}</div><div class="share-buttons"><button type="button" id="copyRosalindaUrl">Copiar enlace</button><button type="button" id="nativeRosalindaShare">Compartir</button></div><p id="shareNotice" role="status" style="margin-top:10px"></p></div>`);
    document.getElementById('copyRosalindaUrl').onclick = async () => {
      try { await navigator.clipboard.writeText(SITE_URL); document.getElementById('shareNotice').textContent='¡Enlace copiado!'; }
      catch { document.getElementById('shareNotice').textContent='Mantén pulsado el enlace de arriba para copiarlo.'; }
    };
    document.getElementById('nativeRosalindaShare').onclick = async () => {
      if (navigator.share) {
        try { await navigator.share({title:'Florería Rosalinda',text:'Descubre los arreglos de Florería Rosalinda',url:SITE_URL}); } catch(e) {if(e.name!=='AbortError')document.getElementById('shareNotice').textContent='Puedes copiar el enlace para compartirlo.';}
      } else { document.getElementById('copyRosalindaUrl').click(); }
    };
  }
  for (const id of ['shareRosalinda','footerShareRosalinda']) document.getElementById(id)?.addEventListener('click',qrDialog);
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt=e; });
  function showInstallInstructions() {
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    showInfo(`<div class="rosalinda-share-dialog"><h2>Instala Rosalinda en tu celular</h2>${ios ? '<p>En Safari toca <b>Compartir</b> y elige <b>Agregar a pantalla de inicio</b>.</p>' : '<p>En Chrome abre el menú <b>⋮</b> y selecciona <b>Instalar aplicación</b> o <b>Agregar a pantalla de inicio</b>.</p>'}<p>Después podrás abrir la tienda desde su icono, como una aplicación.</p></div>`);
  }
  async function install() {
    if (!deferredPrompt) { showInstallInstructions(); return; }
    const p=deferredPrompt; deferredPrompt=null;
    try { await p.prompt(); await p.userChoice; } catch { showInstallInstructions(); }
  }
  for (const id of ['installRosalinda','footerInstallRosalinda']) document.getElementById(id)?.addEventListener('click',install);
  if ('serviceWorker' in navigator && location.protocol==='https:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(console.warn));
  }
})();
