import { useState } from 'react';

interface Venta {
  id: string; fecha: string; totalUSD: number; totalBs: number; items: any[];
}

interface Props {
  ventas: Venta[];
  onDeleteLog: (id: string) => void;
  onClearHistory: () => void;
}

export function VistaHistorial({ ventas, onDeleteLog, onClearHistory }: Props) {
  const totalCajaUSD = ventas.reduce((acc, v) => acc + v.totalUSD, 0);
  const totalCajaBs = ventas.reduce((acc, v) => acc + v.totalBs, 0);

  // Estados para controlar las confirmaciones sin usar alertas del navegador
  const [confirmandoVaciado, setConfirmandoVaciado] = useState(false);
  const [idConfirmandoEliminar, setIdConfirmandoEliminar] = useState<string | null>(null);

  // Seguro anti-fallos por si olvidamos conectar el cable en App.tsx
  const ejecutarVaciado = () => {
    if (typeof onClearHistory === 'function') {
      onClearHistory();
    } else {
      alert("⚠️ Error de arquitectura: El prop 'onClearHistory' no está conectado en App.tsx");
    }
    setConfirmandoVaciado(false);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      
      {/* CABECERA Y VACIADO GLOBAL */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h2 style={{ margin: 0, color: 'var(--texto-principal)' }}>📊 Cierre de Caja</h2>
        
        {ventas.length > 0 && (
          confirmandoVaciado ? (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: 'var(--bg-panel)', padding: '5px 10px', borderRadius: '8px', border: '1px solid var(--alerta)' }}>
              <span style={{ color: 'var(--alerta)', fontWeight: 'bold', fontSize: '14px' }}>¿Vaciar la caja?</span>
              <button 
                onClick={ejecutarVaciado} 
                style={{ backgroundColor: 'var(--alerta)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Sí, vaciar
              </button>
              <button 
                onClick={() => setConfirmandoVaciado(false)} 
                style={{ backgroundColor: 'var(--bg-app)', color: 'var(--texto-principal)', border: '1px solid var(--borde-suave)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setConfirmandoVaciado(true)}
              style={{ backgroundColor: 'transparent', color: 'var(--alerta)', border: '1px solid var(--alerta)', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              🗑️ Vaciar Historial
            </button>
          )
        )}
      </div>

      {/* MÉTRICAS */}
      <div style={{ backgroundColor: 'var(--bg-panel)', padding: '20px', borderRadius: '12px', marginBottom: '25px', display: 'flex', justifyContent: 'space-around', border: '1px solid var(--borde-suave)' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ color: 'var(--texto-secundario)', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>Total USD</span>
          <div style={{ color: 'var(--exito)', fontSize: '32px', fontWeight: '900', marginTop: '5px' }}>${totalCajaUSD.toFixed(2)}</div>
        </div>
        <div style={{ textAlign: 'center', borderLeft: '1px solid var(--borde-suave)', paddingLeft: '50px' }}>
          <span style={{ color: 'var(--texto-secundario)', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Bs</span>
          <div style={{ color: 'var(--alerta)', fontSize: '32px', fontWeight: '900', marginTop: '5px' }}>Bs {totalCajaBs.toFixed(2)}</div>
        </div>
      </div>

      {/* LISTA DE TRANSACCIONES */}
      <div style={{ backgroundColor: 'var(--bg-panel)', padding: '20px', borderRadius: '12px', border: '1px solid var(--borde-suave)' }}>
        <h3 style={{ color: 'var(--texto-principal)', marginTop: 0, fontSize: '18px', borderBottom: '1px solid var(--borde-suave)', paddingBottom: '15px' }}>
          Transacciones ({ventas.length})
        </h3>
        
        {ventas.length === 0 ? (
          <p style={{ color: 'var(--texto-secundario)', textAlign: 'center', fontStyle: 'italic', padding: '30px 0' }}>No hay ventas registradas.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {[...ventas].reverse().map((venta) => (
              <div key={venta.id} style={{ backgroundColor: 'var(--bg-app)', padding: '15px', borderRadius: '8px', border: '1px solid var(--borde-suave)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', borderBottom: '1px dashed var(--borde-suave)', paddingBottom: '10px' }}>
                  <strong style={{ color: 'var(--texto-principal)' }}>{venta.fecha}</strong>
                  <span style={{ color: 'var(--texto-secundario)', fontFamily: 'monospace' }}>ID: {venta.id.slice(-8)}</span>
                </div>
                
                <div style={{ fontSize: '14px', color: 'var(--texto-secundario)', marginBottom: '15px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                  {venta.items.map((item: any, i: number) => (
                    <div key={i}>• <strong style={{color: 'var(--texto-principal)'}}>{item.cantidad}x</strong> {item.producto.nombre}</div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  
                  {/* NUEVO: CONFIRMACIÓN INDIVIDUAL DE ANULACIÓN */}
                  {idConfirmandoEliminar === venta.id ? (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ color: 'var(--alerta)', fontSize: '12px', fontWeight: 'bold' }}>¿Anular venta?</span>
                      <button onClick={() => onDeleteLog(venta.id)} style={{ backgroundColor: 'var(--alerta)', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Sí</button>
                      <button onClick={() => setIdConfirmandoEliminar(null)} style={{ backgroundColor: 'var(--bg-panel)', color: 'var(--texto-principal)', border: '1px solid var(--borde-suave)', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>No</button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setIdConfirmandoEliminar(venta.id)}
                      style={{ background: 'none', border: '1px solid var(--alerta)', color: 'var(--alerta)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                    >
                      Anular Venta
                    </button>
                  )}

                  <div style={{ display: 'flex', gap: '20px', fontSize: '16px' }}>
                    <strong style={{ color: 'var(--alerta)' }}>Bs {venta.totalBs.toFixed(2)}</strong>
                    <strong style={{ color: 'var(--exito)' }}>${venta.totalUSD.toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}