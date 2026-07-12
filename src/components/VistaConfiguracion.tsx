import { useRef } from 'react';

interface Props {
  configuracion: any;
  setConfiguracion: (conf: any) => void;
  temaActual: string;
  cambiarTema: (tema: string) => void;
  onExportar: () => void;
  onImportar: (jsonData: string) => void;
}

export function VistaConfiguracion({ configuracion, setConfiguracion, temaActual, cambiarTema, onExportar, onImportar }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const temasDisponibles = [
    { id: 'clasico', nombre: 'Clásico ⚪' },
    { id: 'oscuro', nombre: 'Oscuro ⚫' },
    { id: 'menta', nombre: 'Menta 🟢' },
    { id: 'atardecer', nombre: 'Ocaso 🟠' },
    { id: 'faded', nombre: 'Faded 🟤' }
  ];

  const manejarSubida = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        if(confirm('⚠️ ESTO SOBREESCRIBIRÁ TU INVENTARIO Y VENTAS ACTUALES. ¿Estás seguro?')) {
          onImportar(event.target.result);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = ''; 
  };

  const actualizarDato = (campo: string, valor: string) => {
    setConfiguracion({ ...configuracion, [campo]: valor });
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      <h2 style={{ color: 'var(--texto-principal)', marginTop: 0, marginBottom: '20px' }}>⚙️ Configuración del Sistema</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* TARJETA 1: DATOS DEL NEGOCIO */}
        <div style={{ backgroundColor: 'var(--bg-panel)', padding: '20px', borderRadius: '12px', border: '1px solid var(--borde-suave)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--texto-principal)', fontSize: '16px', borderBottom: '1px solid var(--borde-suave)', paddingBottom: '10px' }}>Datos para la Factura</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--texto-secundario)', marginBottom: '5px', display: 'block' }}>Nombre del Negocio</label>
              <input type="text" value={configuracion.nombreNegocio} onChange={(e) => actualizarDato('nombreNegocio', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--borde-suave)', backgroundColor: 'var(--bg-app)', color: 'var(--texto-principal)', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--texto-secundario)', marginBottom: '5px', display: 'block' }}>RIF / Documento</label>
              <input type="text" placeholder="J-12345678-9" value={configuracion.rif} onChange={(e) => actualizarDato('rif', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--borde-suave)', backgroundColor: 'var(--bg-app)', color: 'var(--texto-principal)', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--texto-secundario)', marginBottom: '5px', display: 'block' }}>Dirección Física</label>
              <input type="text" value={configuracion.direccion} onChange={(e) => actualizarDato('direccion', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--borde-suave)', backgroundColor: 'var(--bg-app)', color: 'var(--texto-principal)', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--texto-secundario)', marginBottom: '5px', display: 'block' }}>Teléfono</label>
              <input type="text" value={configuracion.telefono} onChange={(e) => actualizarDato('telefono', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--borde-suave)', backgroundColor: 'var(--bg-app)', color: 'var(--texto-principal)', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>
        </div>

        {/* TARJETA 2: APARIENCIA */}
        <div style={{ backgroundColor: 'var(--bg-panel)', padding: '20px', borderRadius: '12px', border: '1px solid var(--borde-suave)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--texto-principal)', fontSize: '16px', borderBottom: '1px solid var(--borde-suave)', paddingBottom: '10px' }}>Apariencia (Temas)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px', marginTop: '15px' }}>
            {temasDisponibles.map(t => (
              <button 
                key={t.id}
                onClick={() => cambiarTema(t.id)}
                style={{
                  padding: '12px 5px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px',
                  backgroundColor: temaActual === t.id ? 'var(--acento-primario)' : 'var(--bg-app)',
                  color: temaActual === t.id ? 'white' : 'var(--texto-principal)',
                  border: temaActual === t.id ? '1px solid var(--acento-primario)' : '1px solid var(--borde-suave)'
                }}
              >
                {t.nombre}
              </button>
            ))}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--texto-secundario)', marginTop: '15px' }}>El cambio de tema se aplica y se guarda automáticamente para tus próximas sesiones.</p>
        </div>

        {/* TARJETA 3: SEGURIDAD Y RESPALDOS */}
        <div style={{ backgroundColor: 'var(--bg-panel)', padding: '20px', borderRadius: '12px', border: '1px solid var(--alerta)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--alerta)', fontSize: '16px', borderBottom: '1px solid var(--borde-suave)', paddingBottom: '10px' }}>Seguridad y Respaldos</h3>
          <p style={{ fontSize: '13px', color: 'var(--texto-secundario)', marginBottom: '20px' }}>
            Como MS POS opera sin internet (Offline-First), <strong>tú eres responsable de tus datos</strong>. Crea un respaldo JSON al cerrar la caja cada día.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button onClick={onExportar} style={{ width: '100%', backgroundColor: 'var(--bg-app)', color: 'var(--texto-principal)', border: '1px solid var(--acento-primario)', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
              ⬇️ Descargar Respaldo JSON
            </button>

            <button onClick={() => fileInputRef.current?.click()} style={{ width: '100%', backgroundColor: 'var(--bg-app)', color: 'var(--texto-principal)', border: '1px solid var(--alerta)', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
              ⬆️ Subir Respaldo (Restaura el sistema)
            </button>
            
            {/* Input oculto alojado directamente aquí, de forma limpia */}
            <input type="file" accept=".json" ref={fileInputRef} onChange={manejarSubida} style={{ display: 'none' }} />
          </div>
        </div>

        {/* TARJETA 4: PREFERENCIAS DE FLUJO (NUEVA) */}
        <div style={{ backgroundColor: 'var(--bg-panel)', padding: '20px', borderRadius: '12px', border: '1px solid var(--borde-suave)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--texto-principal)', fontSize: '16px', borderBottom: '1px solid var(--borde-suave)', paddingBottom: '10px' }}>
            Preferencias de Flujo
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={configuracion.usarSKU ?? true} 
                onChange={(e) => actualizarDato('usarSKU', e.target.checked)} 
                style={{ width: '18px', height: '18px', accentColor: 'var(--acento-primario)' }} 
              />
              <div>
                <span style={{ display: 'block', color: 'var(--texto-principal)', fontWeight: 'bold', fontSize: '14px' }}>Habilitar Códigos SKU</span>
                <span style={{ fontSize: '12px', color: 'var(--texto-secundario)' }}>Usa códigos de barras para buscar productos.</span>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={configuracion.imprimirFactura ?? true} 
                onChange={(e) => actualizarDato('imprimirFactura', e.target.checked)} 
                style={{ width: '18px', height: '18px', accentColor: 'var(--acento-primario)' }} 
              />
              <div>
                <span style={{ display: 'block', color: 'var(--texto-principal)', fontWeight: 'bold', fontSize: '14px' }}>Emitir Factura</span>
                <span style={{ fontSize: '12px', color: 'var(--texto-secundario)' }}>Muestra el ticket para imprimir al finalizar la venta.</span>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={configuracion.cobroRapido ?? false} 
                onChange={(e) => actualizarDato('cobroRapido', e.target.checked)} 
                style={{ width: '18px', height: '18px', accentColor: 'var(--acento-primario)' }} 
              />
              <div>
                <span style={{ display: 'block', color: 'var(--texto-principal)', fontWeight: 'bold', fontSize: '14px' }}>Cobro Rápido (Pago Exacto)</span>
                <span style={{ fontSize: '12px', color: 'var(--texto-secundario)' }}>No calcula vueltos. Asume que el cliente pagó exacto.</span>
              </div>
            </label>
          </div>
        </div>

      </div>
    </div>
  );
}