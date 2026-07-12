import { useState, useMemo } from 'react';
import type { Producto } from '../types/Producto';

interface Props {
  inventario: Producto[];
  onCreate: (p: Producto) => void;
  onUpdate: (p: Producto) => void;
  onDelete: (id: string) => void;
}

export function VistaInventario({ inventario, onCreate, onUpdate, onDelete }: Props) {
  const [idEditando, setIdEditando] = useState<string | null>(null);
  const [sku, setSku] = useState('');
  const [nombre, setNombre] = useState('');
  const [precioUSD, setPrecioUSD] = useState('');
  const [stock, setStock] = useState('');
  const [minStock, setMinStock] = useState('');

  const categoriasExistentes = useMemo(() => Array.from(new Set(inventario.map(p => p.categoria))), [inventario]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(categoriasExistentes.length > 0 ? categoriasExistentes[0] : '');
  const [nuevaCategoria, setNuevaCategoria] = useState('');

  const cargarParaEdicion = (prod: Producto) => {
    setIdEditando(prod.id); setSku(prod.sku || ''); setNombre(prod.nombre);
    setPrecioUSD(prod.precioUSD.toString()); setStock(prod.stock.toString()); setMinStock(prod.minStock?.toString() || '5');
    if (categoriasExistentes.includes(prod.categoria)) { setCategoriaSeleccionada(prod.categoria); setNuevaCategoria(''); } 
    else { setCategoriaSeleccionada('OTRA'); setNuevaCategoria(prod.categoria); }
  };

  const cancelarEdicion = () => {
    setIdEditando(null); setSku(''); setNombre(''); setPrecioUSD(''); setStock(''); setMinStock('');
    setCategoriaSeleccionada(categoriasExistentes.length > 0 ? categoriasExistentes[0] : ''); setNuevaCategoria('');
  };

  const guardarProducto = () => {
    const categoriaFinal = categoriaSeleccionada === 'OTRA' ? nuevaCategoria.trim() : categoriaSeleccionada;
    if (!sku || !nombre || !precioUSD || !categoriaFinal || !stock || !minStock) { alert("⚠️ Llena todos los campos."); return; }
    if (!idEditando && inventario.some(p => p.sku.toLowerCase() === sku.trim().toLowerCase())) { alert("⚠️ SKU ya existe."); return; }

    const productoProcesado: Producto = {
      id: idEditando ? idEditando : new Date().getTime().toString(),
      sku: sku.trim().toUpperCase(), nombre: nombre.trim(), precioUSD: parseFloat(precioUSD),
      categoria: categoriaFinal, stock: parseInt(stock), minStock: parseInt(minStock)
    };
    idEditando ? onUpdate(productoProcesado) : onCreate(productoProcesado);
    cancelarEdicion(); 
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      <h2 style={{ color: 'var(--texto-principal)', marginTop: 0, marginBottom: '20px' }}>📦 Gestión de Inventario</h2>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* FORMULARIO */}
        <div style={{ flex: '1 1 300px', backgroundColor: 'var(--bg-panel)', padding: '20px', borderRadius: '12px', border: '1px solid var(--borde-suave)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--acento-primario)', fontSize: '16px' }}>
            {idEditando ? '✏️ Editando Producto' : '➕ Nuevo Producto'}
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="text" placeholder="SKU / Código (ej. HAR-01)" value={sku} onChange={e => setSku(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--borde-suave)', backgroundColor: 'var(--bg-app)', color: 'var(--texto-principal)', outline: 'none' }} />
            <input type="text" placeholder="Nombre (ej. Harina PAN)" value={nombre} onChange={e => setNombre(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--borde-suave)', backgroundColor: 'var(--bg-app)', color: 'var(--texto-principal)', outline: 'none' }} />
            <input type="number" step="0.01" placeholder="Precio en $ (ej. 1.20)" value={precioUSD} onChange={e => setPrecioUSD(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--borde-suave)', backgroundColor: 'var(--bg-app)', color: 'var(--texto-principal)', outline: 'none' }} />
            
            <select value={categoriaSeleccionada} onChange={e => setCategoriaSeleccionada(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--borde-suave)', backgroundColor: 'var(--bg-app)', color: 'var(--texto-principal)', outline: 'none', cursor: 'pointer' }}>
              {categoriasExistentes.length === 0 && <option value="" disabled>Sin categorías...</option>}
              {categoriasExistentes.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              <option value="OTRA">➕ Crear Nueva Categoría...</option>
            </select>
            {categoriaSeleccionada === 'OTRA' && (
              <input type="text" placeholder="Nombre de la nueva categoría..." value={nuevaCategoria} onChange={e => setNuevaCategoria(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--acento-primario)', backgroundColor: 'var(--bg-app)', color: 'var(--texto-principal)', outline: 'none' }} />
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="number" placeholder="Stock Actual" value={stock} onChange={e => setStock(e.target.value)} style={{ width: '50%', padding: '12px', borderRadius: '8px', border: '1px solid var(--borde-suave)', backgroundColor: 'var(--bg-app)', color: 'var(--texto-principal)', outline: 'none' }} />
              <input type="number" placeholder="Min. Stock" value={minStock} onChange={e => setMinStock(e.target.value)} style={{ width: '50%', padding: '12px', borderRadius: '8px', border: '1px solid var(--borde-suave)', backgroundColor: 'var(--bg-app)', color: 'var(--texto-principal)', outline: 'none' }} title="Cantidad mínima para alerta de inventario" />
            </div>
            
            <button onClick={guardarProducto} style={{ backgroundColor: idEditando ? '#f59e0b' : 'var(--exito)', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
              {idEditando ? 'Guardar Cambios' : 'Agregar al Inventario'}
            </button>
            {idEditando && (
              <button onClick={cancelarEdicion} style={{ backgroundColor: 'transparent', color: 'var(--texto-secundario)', border: '1px solid var(--texto-secundario)', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>Cancelar Edición</button>
            )}
          </div>
        </div>

        {/* LISTA DE PRODUCTOS */}
        <div style={{ flex: '2 1 400px' }}>
          <div style={{ backgroundColor: 'var(--bg-panel)', padding: '20px', borderRadius: '12px', border: '1px solid var(--borde-suave)' }}>
            <h3 style={{ marginTop: 0, color: 'var(--texto-principal)', fontSize: '16px', marginBottom: '15px' }}>Base de Datos ({inventario.length})</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '600px', overflowY: 'auto', paddingRight: '5px' }}>
              {inventario.length === 0 && <p style={{ color: 'var(--texto-secundario)', fontStyle: 'italic' }}>No hay productos registrados.</p>}
              {inventario.map(prod => (
                <div key={prod.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-app)', padding: '12px', borderRadius: '8px', border: '1px solid var(--borde-suave)' }}>
                  <div>
                    <strong style={{ color: 'var(--texto-principal)', display: 'block', fontSize: '15px' }}>{prod.nombre}</strong>
                    <span style={{ fontSize: '13px', color: 'var(--texto-secundario)', display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                      <strong style={{ color: 'var(--acento-primario)', backgroundColor: 'var(--bg-panel)', padding: '2px 6px', borderRadius: '4px' }}>{prod.sku}</strong> 
                      | ${prod.precioUSD.toFixed(2)} | Stock: {prod.stock} (Min: {prod.minStock}) | {prod.categoria}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => cargarParaEdicion(prod)} style={{ background: 'var(--bg-panel)', border: '1px solid var(--borde-suave)', borderRadius: '6px', cursor: 'pointer', padding: '6px 10px', fontSize: '14px' }}>✏️</button>
                    <button onClick={() => { if(confirm('¿Eliminar este producto permanentemente?')) onDelete(prod.id); }} style={{ background: 'var(--bg-panel)', border: '1px solid var(--borde-suave)', borderRadius: '6px', cursor: 'pointer', padding: '6px 10px', fontSize: '14px' }}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}