interface Venta {
  id: string;
  fecha: string;
  totalUSD: number;
  totalBs: number;
  items: any[];
}

interface Props {
  ventas: Venta[];
  onCerrar: () => void;
  onDeleteLog: (id: string) => void;
  onClearHistory: () => void;
}

export function HistorialModal({ ventas, onCerrar, onDeleteLog, onClearHistory }: Props) {
  const totalCajaUSD = ventas.reduce((acc, v) => acc + v.totalUSD, 0);
  const totalCajaBs = ventas.reduce((acc, v) => acc + v.totalBs, 0);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(3px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'var(--bg-app)', padding: '25px', borderRadius: '12px',
        width: '90%', maxWidth: '600px', maxHeight: '85vh', overflowY: 'auto',
        border: '1px solid var(--borde-suave)', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
      }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--borde-suave)', paddingBottom: '10px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: 'var(--texto-principal)' }}>📊 Cierre de Caja</h2>
          <button 
            onClick={onCerrar}
            style={{ backgroundColor: 'var(--alerta)', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Cerrar ✖
          </button>
        </div>

        {/* Resumen Global de la Caja */}
        <div style={{ backgroundColor: 'var(--bg-panel)', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-around', border: '1px solid var(--borde-suave)' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: 'var(--texto-secundario)', fontSize: '14px', fontWeight: 'bold' }}>Total Ingresos USD</span>
            <div style={{ color: 'var(--exito)', fontSize: '24px', fontWeight: 'bold' }}>${totalCajaUSD.toFixed(2)}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: 'var(--texto-secundario)', fontSize: '14px', fontWeight: 'bold' }}>Total Ingresos Bs</span>
            <div style={{ color: 'var(--alerta)', fontSize: '24px', fontWeight: 'bold' }}>Bs {totalCajaBs.toFixed(2)}</div>
          </div>
        </div>

        {/* Lista de Facturas */}
        <h3 style={{ color: 'var(--texto-principal)', marginTop: 0, fontSize: '16px' }}>Historial de Transacciones ({ventas.length})</h3>
        
        {ventas.length === 0 ? (
          <p style={{ color: 'var(--texto-secundario)', textAlign: 'center', fontStyle: 'italic' }}>No hay ventas registradas aún.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* Invertimos el array para que la venta más reciente salga arriba */}
            {[...ventas].reverse().map((venta) => (
              <div key={venta.id} style={{ backgroundColor: 'var(--bg-panel)', padding: '12px', borderRadius: '6px', border: '1px solid var(--borde-suave)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                  <span style={{ color: 'var(--texto-secundario)' }}>{venta.fecha}</span>
                  <span style={{ color: 'var(--texto-secundario)', fontSize: '12px' }}>ID: {venta.id.slice(-6)}</span>
                </div>
                
                <div style={{ fontSize: '13px', color: 'var(--texto-principal)', marginBottom: '10px' }}>
                  {venta.items.map((item: any, i: number) => (
                    <div key={i}>• {item.cantidad}x {item.producto.nombre}</div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--borde-suave)', paddingTop: '8px' }}>
                  <button 
                    onClick={() => { if(confirm('¿Borrar este registro? Se ajustará el total de la caja.')) onDeleteLog(venta.id); }} 
                    style={{ background: 'none', border: 'none', color: 'var(--alerta)', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                  >
                    🗑️ Anular Venta
                  </button>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <strong style={{ color: 'var(--alerta)' }}>Bs {venta.totalBs.toFixed(2)}</strong>
                    <strong style={{ color: 'var(--exito)' }}>${venta.totalUSD.toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BOTÓN MAESTRO DE REINICIO */}
        {ventas.length > 0 && (
          <button 
            onClick={() => { if(confirm('⚠️ ¿ESTÁS SEGURO? Esto borrará todo el historial de ventas del día. Te recomendamos descargar un Respaldo JSON primero.')) { onClearHistory(); onCerrar(); } }}
            style={{ width: '100%', backgroundColor: 'transparent', color: 'var(--alerta)', border: '1px solid var(--alerta)', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', marginTop: '20px' }}
          >
            🗑️ Vaciar Historial y Reiniciar Día
          </button>
        )}

      </div>
    </div>
  );
}