import { useState } from 'react';
import type { ItemCarrito } from '../types/ItemCarrito';

interface Props {
  carrito: ItemCarrito[];
  tasaBCV: number;
  configuracion: any;
  onCobrar: (pagadoUSD: number) => any;
  onClose: () => void;
}

export function CheckoutModal({ carrito, tasaBCV, configuracion, onCobrar, onClose }: Props) {
  const [fase, setFase] = useState<'pago' | 'ticket'>('pago');
  const totalUSD = carrito.reduce((acc, item) => acc + (item.producto.precioUSD * item.cantidad), 0);
  const totalBs = totalUSD * tasaBCV;
  
  // Si cobro rápido está activo, iniciamos el input con el pago exacto
  const [pagado, setPagado] = useState(configuracion.cobroRapido ? totalUSD.toString() : '');
  const [reciboGenerado, setReciboGenerado] = useState<any>(null);

  const vuelto = Math.max(0, parseFloat(pagado || '0') - totalUSD);
  const falta = Math.max(0, totalUSD - parseFloat(pagado || '0'));

  const procesarVenta = () => {
    if (falta > 0.005) {
      alert("El monto pagado no cubre el total de la venta.");
      return;
    }
    const recibo = onCobrar(parseFloat(pagado));
    if (recibo) {
      // AQUÍ ESTÁ LA LÓGICA DE INTERRUPTOR
      if (configuracion.imprimirFactura === false) {
        onClose(); // Terminamos la venta y cerramos directo sin imprimir
      } else {
        setReciboGenerado(recibo);
        setFase('ticket'); // Pasamos al ticket
      }
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div className="modal" style={{ backgroundColor: 'var(--bg-panel)', borderRadius: '12px', width: '100%', maxWidth: '420px', overflow: 'hidden', border: '1px solid var(--borde-suave)' }}>
        
        {/* --- FASE 1: COBRO --- */}
        {fase === 'pago' && (
          <>
            <div className="modal-head" style={{ padding: '20px', borderBottom: '1px solid var(--borde-suave)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: 'var(--texto-principal)' }}>{configuracion.cobroRapido ? 'Confirmar Venta' : 'Procesar Pago'}</h3>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--texto-secundario)', cursor: 'pointer', fontSize: '18px' }}>✖</button>
            </div>
            
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold', color: 'var(--texto-principal)', marginBottom: '5px' }}>
                <span>Total a Pagar:</span>
                <span>${totalUSD.toFixed(2)}</span>
              </div>
              <div style={{ textAlign: 'right', color: 'var(--alerta)', fontWeight: 'bold', marginBottom: '20px' }}>
                Bs {totalBs.toFixed(2)}
              </div>

              {/* Si cobroRápido es FALSO, mostramos los inputs de vuelto */}
              {!configuracion.cobroRapido && (
                <>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', color: 'var(--texto-secundario)', fontSize: '14px', marginBottom: '8px', fontWeight: 'bold' }}>Monto recibido (USD):</label>
                    <input 
                      type="number" step="0.01" value={pagado} onChange={(e) => setPagado(e.target.value)} autoFocus
                      style={{ width: '100%', padding: '12px', fontSize: '18px', borderRadius: '8px', border: '1px solid var(--acento-primario)', backgroundColor: 'var(--bg-app)', color: 'var(--texto-principal)', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold', color: falta > 0 ? 'var(--alerta)' : 'var(--exito)' }}>
                    <span>{falta > 0 ? 'Falta:' : 'Vuelto:'}</span>
                    <span>${(falta > 0 ? falta : vuelto).toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            <div className="modal-foot" style={{ padding: '20px', borderTop: '1px solid var(--borde-suave)' }}>
              <button onClick={procesarVenta} disabled={falta > 0.005} style={{ width: '100%', padding: '15px', backgroundColor: falta > 0.005 ? 'var(--borde-suave)' : 'var(--exito)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: falta > 0.005 ? 'not-allowed' : 'pointer' }}>
                {configuracion.cobroRapido ? 'Cobrar Exacto y Finalizar' : 'Confirmar Venta'}
              </button>
            </div>
          </>
        )}

        {/* --- FASE 2: TICKET DE FACTURA (Se salta si se desactivó en Configuración) --- */}
        {fase === 'ticket' && reciboGenerado && (
          <>
            <div className="modal-head" style={{ padding: '15px 20px', borderBottom: '1px solid var(--borde-suave)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: 'var(--texto-principal)' }}>Factura #{reciboGenerado.numero}</h3>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--texto-secundario)', cursor: 'pointer', fontSize: '18px' }}>✖</button>
            </div>
            
            <div style={{ padding: '20px', backgroundColor: '#e2e8f0' }}>
              <div id="zona-impresion" className="receipt">
                <h3>{configuracion.nombreNegocio || 'Mi Negocio'}</h3>
                {configuracion.rif && <div className="center">{configuracion.rif}</div>}
                <hr />
                <div>Factura: #{reciboGenerado.numero}</div>
                <div>Fecha: {reciboGenerado.fecha}</div>
                <div>Tasa BCV: Bs {tasaBCV.toFixed(2)}</div>
                <hr />
                <table>
                  <thead><tr><th>Cant</th><th>Producto</th><th style={{textAlign: 'right'}}>Total</th></tr></thead>
                  <tbody>
                    {reciboGenerado.items.map((it: any, i: number) => (
                      <tr key={i}><td>{it.cantidad}</td><td>{it.producto.nombre.substring(0,15)}</td><td style={{textAlign: 'right'}}>${(it.producto.precioUSD * it.cantidad).toFixed(2)}</td></tr>
                    ))}
                  </tbody>
                </table>
                <hr />
                <div className="totals">
                  <div className="grand"><span>Total $</span><span>${reciboGenerado.totalUSD.toFixed(2)}</span></div>
                  <div><span>Total Bs</span><span>Bs {reciboGenerado.totalBs.toFixed(2)}</span></div>
                </div>
                <hr />
                <div className="center" style={{marginTop: '10px'}}>¡Gracias por su compra!</div>
              </div>
            </div>

            <div className="modal-foot" style={{ padding: '20px', borderTop: '1px solid var(--borde-suave)', display: 'flex', gap: '10px' }}>
              <button onClick={onClose} style={{ flex: 1, padding: '12px', backgroundColor: 'var(--bg-app)', color: 'var(--texto-principal)', border: '1px solid var(--borde-suave)', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Cerrar</button>
              <button onClick={() => window.print()} style={{ flex: 1, padding: '12px', backgroundColor: 'var(--acento-primario)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>🖨️ Imprimir</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}