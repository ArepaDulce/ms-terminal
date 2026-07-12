import { forwardRef } from 'react';

interface Props {
  venta: any;
  configuracion: any;
}

// Usamos forwardRef para que el navegador pueda "ver" este componente y mandarlo a imprimir
export const TicketFactura = forwardRef<HTMLDivElement, Props>(({ venta, configuracion }, ref) => {
  return (
    <div ref={ref} style={{ display: 'none' }} className="ticket-print">
      <style>{`
        @media print {
          .ticket-print { display: block !important; width: 80mm; font-family: 'Courier New', monospace; color: black; padding: 10px; }
          .no-print { display: none; }
        }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h2 style={{ margin: 0 }}>{configuracion.nombreNegocio || 'Mi Negocio'}</h2>
        <p style={{ margin: 0, fontSize: '12px' }}>RIF: {configuracion.rif}</p>
        <p style={{ margin: 0, fontSize: '12px' }}>{configuracion.direccion}</p>
        <p style={{ margin: 0, fontSize: '12px' }}>{configuracion.telefono}</p>
      </div>

      <div style={{ borderTop: '1px dashed black', borderBottom: '1px dashed black', padding: '5px 0', fontSize: '12px' }}>
        <p>Fecha: {venta.fecha}</p>
        <p>ID: {venta.id.slice(-8)}</p>
      </div>

      <table style={{ width: '100%', fontSize: '12px', marginTop: '10px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid black' }}>
            <th style={{ textAlign: 'left' }}>Item</th>
            <th style={{ textAlign: 'center' }}>Cant</th>
            <th style={{ textAlign: 'right' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {venta.items.map((item: any, i: number) => (
            <tr key={i}>
              <td>{item.producto.nombre}</td>
              <td style={{ textAlign: 'center' }}>{item.cantidad}</td>
              <td style={{ textAlign: 'right' }}>${(item.producto.precioUSD * item.cantidad).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '10px', textAlign: 'right', fontSize: '14px', fontWeight: 'bold' }}>
        <p>Total USD: ${venta.totalUSD.toFixed(2)}</p>
        <p>Total Bs: Bs {venta.totalBs.toFixed(2)}</p>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '10px' }}>
        <p>¡Gracias por su compra!</p>
      </div>
    </div>
  );
});