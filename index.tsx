
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { registerSW } from 'virtual:pwa-register';

console.log("🚀 Mueblesdaso: Iniciando secuencia de arranque...");

// Register Service Worker
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Nueva versión disponible. ¿Recargar?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('App lista para trabajar offline');
  },
});

const mountApp = () => {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    console.error("❌ Mueblesdaso: No se encontró el elemento #root en el DOM.");
    return;
  }

  try {
    console.log("🚀 Mueblesdaso: Elemento root encontrado. Creando instancia de React...");
    const root = createRoot(rootElement);
    
    console.log("🚀 Mueblesdaso: Ejecutando renderizado inicial...");
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("✅ Mueblesdaso: Aplicación montada con éxito.");
  } catch (error) {
    console.error("❌ Mueblesdaso: Fallo durante el montaje de React:", error);
    const display = document.getElementById('error-display');
    if (display) {
        display.style.display = 'block';
        const message = error instanceof Error ? error.message : String(error);
        display.innerHTML = `<strong>Error de Renderizado:</strong><br>${message}`;
    }
  }
};

// Asegurar que el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountApp);
} else {
    mountApp();
}
