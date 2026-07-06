import type { Producto } from '../types/Producto';

interface Props {
  producto: Producto;
  tasaBCV: number;
  onAgregarAlCarrito: (producto: Producto) => void;
}

export function ProductoCard({ producto, tasaBCV, onAgregarAlCarrito }: Props) {
  const precioBs = (producto.precioUSD * tasaBCV).toFixed(2);

  return (
    <div style={{ 
      border: '1px solid var(--borde-suave)', borderRadius: '8px', padding: '15px', 
      backgroundColor: 'var(--bg-panel)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      display: 'flex', flexDirection: 'column', gap: '8px',
      minWidth: '180px', flex: '1 1 180px'
    }}>
      <h4 style={{ margin: 0, color: 'var(--texto-principal)', fontSize: '15px' }}>{producto.nombre}</h4>
      <span style={{ fontSize: '11px', color: 'var(--texto-secundario)', backgroundColor: 'var(--bg-app)', padding: '3px 6px', borderRadius: '4px', alignSelf: 'flex-start' }}>
        {producto.categoria}
      </span>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: 'var(--exito)', fontWeight: 'bold', fontSize: '16px' }}>
            ${producto.precioUSD.toFixed(2)}
          </span>
          <span style={{ color: 'var(--alerta)', fontSize: '13px', fontWeight: 'bold' }}>
            Bs {precioBs}
          </span>
        </div>
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: producto.stock > 0 ? 'var(--texto-secundario)' : 'var(--alerta)' }}>
          Stock: {producto.stock}
        </span>
      </div>
      
      <button 
        onClick={() => onAgregarAlCarrito(producto)}
        disabled={producto.stock === 0}
        style={{ 
          backgroundColor: producto.stock === 0 ? 'var(--borde-suave)' : 'var(--acento-primario)', 
          color: producto.stock === 0 ? 'var(--texto-secundario)' : 'white', 
          border: 'none', padding: '8px', borderRadius: '5px', 
          cursor: producto.stock === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold', marginTop: '10px' 
        }}
      >
        {producto.stock === 0 ? 'Agotado 🚫' : 'Llevar 🛒'}
      </button>
    </div>
  );
}