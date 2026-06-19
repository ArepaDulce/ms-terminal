import type { Producto } from '../types/Producto';

interface Props {
  producto: Producto;
  tasaBCV: number;
  onAgregarAlCarrito: (producto: Producto) => void; // Nueva función requerida
}

export function ProductoCard({ producto, tasaBCV, onAgregarAlCarrito }: Props) {
  const precioBs = (producto.precioUSD * tasaBCV).toFixed(2);

  return (
    <div style={{ 
      border: '1px solid #ddd', borderRadius: '8px', padding: '15px', 
      backgroundColor: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
      display: 'flex', flexDirection: 'column', gap: '8px',
      minWidth: '180px', flex: '1 1 180px'
    }}>
      <h4 style={{ margin: 0, color: '#2c3e50', fontSize: '15px' }}>{producto.nombre}</h4>
      <span style={{ fontSize: '11px', color: '#7f8c8d', backgroundColor: '#ecf0f1', padding: '3px 6px', borderRadius: '4px', alignSelf: 'flex-start' }}>
        {producto.categoria}
      </span>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: '#27ae60', fontWeight: 'bold', fontSize: '16px' }}>
            ${producto.precioUSD.toFixed(2)}
          </span>
          <span style={{ color: '#c0392b', fontSize: '13px', fontWeight: 'bold' }}>
            Bs {precioBs}
          </span>
        </div>
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: producto.stock > 0 ? '#34495e' : '#e74c3c' }}>
          Stock: {producto.stock}
        </span>
      </div>
      
      <button 
        onClick={() => onAgregarAlCarrito(producto)} // ¡Fuego al hacer clic!
        disabled={producto.stock === 0}
        style={{ 
          backgroundColor: producto.stock === 0 ? '#bdc3c7' : '#3498db', 
          color: 'white', border: 'none', padding: '8px', borderRadius: '5px', 
          cursor: producto.stock === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold', marginTop: '10px' 
        }}
      >
        {producto.stock === 0 ? 'Agotado 🚫' : 'Llevar 🛒'}
      </button>
    </div>
  );
}