import type { ItemCarrito } from '../types/ItemCarrito';
import type { Producto } from '../types/Producto';

interface Props {
  items: ItemCarrito[];
  tasaBCV: number;
  onSumar: (producto: Producto) => void;
  onRestar: (idProducto: string) => void;
  onEliminar: (idProducto: string) => void;
  onCobrar: () => void;
}

export function Carrito({ items, tasaBCV, onSumar, onRestar, onEliminar, onCobrar }: Props) {
  const totalUSD = items.reduce((acc, item) => acc + (item.producto.precioUSD * item.cantidad), 0);
  const totalBs = totalUSD * tasaBCV;

  return (
    <div style={{ 
      backgroundColor: 'var(--bg-panel)', padding: '15px', borderRadius: '8px', 
      border: '1px solid var(--borde-suave)', display: 'flex', flexDirection: 'column', gap: '15px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
    }}>
      <h3 style={{ marginTop: 0, color: 'var(--texto-principal)', borderBottom: '2px solid var(--acento-primario)', paddingBottom: '8px' }}>
        🛒 Factura Actual
      </h3>

      {items.length === 0 ? (
        <p style={{ color: 'var(--texto-secundario)', fontStyle: 'italic', textAlign: 'center', margin: '20px 0' }}>
          La caja está vacía. Selecciona productos.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto' }}>
          {items.map((item) => (
            <div key={item.producto.id} style={{ 
              display: 'flex', flexDirection: 'column', padding: '8px 0', borderBottom: '1px dashed var(--borde-suave)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <strong style={{ color: 'var(--texto-principal)', fontSize: '14px' }}>{item.producto.nombre}</strong>
                <span style={{ fontWeight: 'bold', color: 'var(--exito)', fontSize: '14px' }}>
                  ${(item.producto.precioUSD * item.cantidad).toFixed(2)}
                </span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  <button onClick={() => onRestar(item.producto.id)} style={{ padding: '2px 8px', cursor: 'pointer', borderRadius: '4px', border: '1px solid var(--borde-suave)', backgroundColor: 'var(--bg-app)', color: 'var(--texto-principal)' }}>-</button>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', width: '20px', textAlign: 'center', color: 'var(--texto-principal)' }}>{item.cantidad}</span>
                  <button onClick={() => onSumar(item.producto)} style={{ padding: '2px 8px', cursor: 'pointer', borderRadius: '4px', border: '1px solid var(--borde-suave)', backgroundColor: 'var(--bg-app)', color: 'var(--texto-principal)' }}>+</button>
                </div>
                
                <button onClick={() => onEliminar(item.producto.id)} style={{ padding: '4px 8px', cursor: 'pointer', borderRadius: '4px', border: 'none', backgroundColor: 'var(--alerta)', color: 'white', fontSize: '12px' }}>
                  🗑️ Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '2px solid var(--borde-suave)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span style={{ fontWeight: 'bold', color: 'var(--texto-secundario)' }}>Total USD:</span>
          <span style={{ fontWeight: 'bold', color: 'var(--exito)', fontSize: '18px' }}>${totalUSD.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 'bold', color: 'var(--texto-secundario)' }}>Total Bs:</span>
          <span style={{ fontWeight: 'bold', color: 'var(--alerta)', fontSize: '18px' }}>Bs {totalBs.toFixed(2)}</span>
        </div>
      </div>

      <button 
        onClick={onCobrar}
        disabled={items.length === 0} 
        style={{ 
          backgroundColor: items.length === 0 ? 'var(--borde-suave)' : 'var(--exito)', 
          color: items.length === 0 ? 'var(--texto-secundario)' : 'white', border: 'none', padding: '12px', borderRadius: '5px', 
          fontWeight: 'bold', fontSize: '16px', cursor: items.length === 0 ? 'not-allowed' : 'pointer', marginTop: '10px'
      }}>
        Finalizar Venta 💳
      </button>
    </div>
  );
}