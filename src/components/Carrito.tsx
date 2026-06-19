import type { ItemCarrito } from '../types/ItemCarrito';
import type { Producto } from '../types/Producto'; // Importamos el molde de Producto

// Actualizamos los Props para recibir las funciones nuevas
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
      backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', 
      border: '1px solid #dee2e6', display: 'flex', flexDirection: 'column', gap: '15px'
    }}>
      <h3 style={{ marginTop: 0, color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '8px' }}>
        🛒 Factura Actual
      </h3>

      {items.length === 0 ? (
        <p style={{ color: '#7f8c8d', fontStyle: 'italic', textAlign: 'center', margin: '20px 0' }}>
          La caja está vacía. Selecciona productos.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto' }}>
          {items.map((item) => (
            <div key={item.producto.id} style={{ 
              display: 'flex', flexDirection: 'column', padding: '8px 0', borderBottom: '1px dashed #ced4da'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <strong style={{ color: '#2c3e50', fontSize: '14px' }}>{item.producto.nombre}</strong>
                <span style={{ fontWeight: 'bold', color: '#27ae60', fontSize: '14px' }}>
                  ${(item.producto.precioUSD * item.cantidad).toFixed(2)}
                </span>
              </div>
              
              {/* Controles de Cantidad */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  <button onClick={() => onRestar(item.producto.id)} style={{ padding: '2px 8px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #bdc3c7', backgroundColor: 'white' }}>-</button>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{item.cantidad}</span>
                  <button onClick={() => onSumar(item.producto)} style={{ padding: '2px 8px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #bdc3c7', backgroundColor: 'white' }}>+</button>
                </div>
                
                <button onClick={() => onEliminar(item.producto.id)} style={{ padding: '4px 8px', cursor: 'pointer', borderRadius: '4px', border: 'none', backgroundColor: '#e74c3c', color: 'white', fontSize: '12px' }}>
                  🗑️ Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sección de Totales */}
      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '2px solid #dee2e6' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span style={{ fontWeight: 'bold', color: '#34495e' }}>Total USD:</span>
          <span style={{ fontWeight: 'bold', color: '#27ae60', fontSize: '18px' }}>${totalUSD.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 'bold', color: '#34495e' }}>Total Bs:</span>
          <span style={{ fontWeight: 'bold', color: '#c0392b', fontSize: '18px' }}>Bs {totalBs.toFixed(2)}</span>
        </div>
      </div>

      <button 
        onClick={onCobrar}
        disabled={items.length === 0} 
        style={{ 
          backgroundColor: items.length === 0 ? '#bdc3c7' : '#2ecc71', 
          color: 'white', border: 'none', padding: '12px', borderRadius: '5px', 
          fontWeight: 'bold', fontSize: '16px', cursor: items.length === 0 ? 'not-allowed' : 'pointer', marginTop: '10px'
      }}>
        Finalizar Venta 💳
      </button>
    </div>
  );
}