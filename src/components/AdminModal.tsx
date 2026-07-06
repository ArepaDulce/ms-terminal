import { useState, useMemo } from 'react';
import type { Producto } from '../types/Producto';

interface Props {
  inventario: Producto[];
  onClose: () => void;
  onCreate: (p: Producto) => void;
  onUpdate: (p: Producto) => void;
  onDelete: (id: string) => void;
}

export function AdminModal({ inventario, onClose, onCreate, onUpdate, onDelete }: Props) {
  const [idEditando, setIdEditando] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [precioUSD, setPrecioUSD] = useState('');
  const [stock, setStock] = useState('');

  // 1. Extraemos las categorías que ya existen en la base de datos
  const categoriasExistentes = useMemo(() => {
    const cats = inventario.map(p => p.categoria);
    return Array.from(new Set(cats));
  }, [inventario]);

  // 2. Estados para el selector inteligente
  // Por defecto, selecciona la primera categoría existente. Si no hay, queda vacío.
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    categoriasExistentes.length > 0 ? categoriasExistentes[0] : ''
  );
  // Estado para guardar el texto si eligen crear una nueva
  const [nuevaCategoria, setNuevaCategoria] = useState('');

  const cargarParaEdicion = (prod: Producto) => {
    setIdEditando(prod.id);
    setNombre(prod.nombre);
    setPrecioUSD(prod.precioUSD.toString());
    setStock(prod.stock.toString());

    // Si la categoría del producto ya existe en la lista, la seleccionamos
    if (categoriasExistentes.includes(prod.categoria)) {
      setCategoriaSeleccionada(prod.categoria);
      setNuevaCategoria('');
    } else {
      // Si por alguna razón es una categoría fantasma, forzamos el modo "OTRA"
      setCategoriaSeleccionada('OTRA');
      setNuevaCategoria(prod.categoria);
    }
  };

  const cancelarEdicion = () => {
    setIdEditando(null);
    setNombre('');
    setPrecioUSD('');
    setStock('');
    setCategoriaSeleccionada(categoriasExistentes.length > 0 ? categoriasExistentes[0] : '');
    setNuevaCategoria('');
  };

  const guardarProducto = () => {
    // Definimos qué valor usar: el del menú o el del texto nuevo
    const categoriaFinal = categoriaSeleccionada === 'OTRA' ? nuevaCategoria.trim() : categoriaSeleccionada;

    if (!nombre || !precioUSD || !categoriaFinal || !stock) {
      alert("⚠️ Por favor, llena todos los campos.");
      return;
    }

    const productoProcesado: Producto = {
      id: idEditando ? idEditando : new Date().getTime().toString(),
      nombre: nombre.trim(),
      precioUSD: parseFloat(precioUSD),
      categoria: categoriaFinal,
      stock: parseInt(stock)
    };

    if (idEditando) {
      onUpdate(productoProcesado);
    } else {
      onCreate(productoProcesado);
    }
    cancelarEdicion(); 
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(3px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'var(--bg-app)', padding: '25px', borderRadius: '12px',
        width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto',
        border: '1px solid var(--borde-suave)', boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        display: 'flex', gap: '20px', flexWrap: 'wrap'
      }}>
        
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--borde-suave)', paddingBottom: '10px' }}>
          <h2 style={{ margin: 0, color: 'var(--texto-principal)' }}>⚙️ Gestión de Inventario</h2>
          <button onClick={onClose} style={{ backgroundColor: 'var(--alerta)', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', fontWeight: 'bold' }}>
            Cerrar ✖
          </button>
        </div>

        {/* COLUMNA 1: FORMULARIO */}
        <div style={{ flex: '1 1 250px', backgroundColor: 'var(--bg-panel)', padding: '15px', borderRadius: '8px', border: '1px solid var(--borde-suave)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--acento-primario)', fontSize: '16px' }}>
            {idEditando ? '✏️ Editando Producto' : '📦 Nuevo Producto'}
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Nombre (ej. Harina PAN)" value={nombre} onChange={e => setNombre(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid var(--borde-suave)', backgroundColor: 'var(--bg-app)', color: 'var(--texto-principal)', outline: 'none' }} />
            <input type="number" step="0.01" placeholder="Precio en $ (ej. 1.20)" value={precioUSD} onChange={e => setPrecioUSD(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid var(--borde-suave)', backgroundColor: 'var(--bg-app)', color: 'var(--texto-principal)', outline: 'none' }} />
            
            {/* SELECTOR INTELIGENTE */}
            <select 
              value={categoriaSeleccionada} 
              onChange={e => setCategoriaSeleccionada(e.target.value)}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid var(--borde-suave)', backgroundColor: 'var(--bg-app)', color: 'var(--texto-principal)', outline: 'none', cursor: 'pointer' }}
            >
              {categoriasExistentes.length === 0 && <option value="" disabled>Sin categorías...</option>}
              {categoriasExistentes.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="OTRA">➕ Crear Nueva Categoría...</option>
            </select>

            {/* INPUT CONDICIONAL (Solo aparece si seleccionan "Crear Nueva Categoría") */}
            {categoriaSeleccionada === 'OTRA' && (
              <input 
                type="text" 
                placeholder="Nombre de la nueva categoría..." 
                value={nuevaCategoria} 
                onChange={e => setNuevaCategoria(e.target.value)} 
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid var(--acento-primario)', backgroundColor: 'var(--bg-app)', color: 'var(--texto-principal)', outline: 'none' }} 
              />
            )}

            <input type="number" placeholder="Cantidad en Stock (ej. 20)" value={stock} onChange={e => setStock(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid var(--borde-suave)', backgroundColor: 'var(--bg-app)', color: 'var(--texto-principal)', outline: 'none' }} />
            
            <button onClick={guardarProducto} style={{ backgroundColor: idEditando ? '#f59e0b' : 'var(--exito)', color: 'white', border: 'none', padding: '12px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
              {idEditando ? 'Guardar Cambios' : 'Agregar al Inventario'}
            </button>
            
            {idEditando && (
              <button onClick={cancelarEdicion} style={{ backgroundColor: 'transparent', color: 'var(--texto-secundario)', border: '1px solid var(--texto-secundario)', padding: '8px', borderRadius: '5px', cursor: 'pointer' }}>
                Cancelar Edición
              </button>
            )}
          </div>
        </div>

        {/* COLUMNA 2: LISTA DE PRODUCTOS ACTUALES */}
        <div style={{ flex: '2 1 350px', maxHeight: '400px', overflowY: 'auto' }}>
          <h3 style={{ marginTop: 0, color: 'var(--texto-principal)', fontSize: '16px' }}>Base de Datos ({inventario.length})</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {inventario.map(prod => (
              <div key={prod.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-panel)', padding: '10px', borderRadius: '6px', border: '1px solid var(--borde-suave)' }}>
                
                <div>
                  <strong style={{ color: 'var(--texto-principal)', display: 'block' }}>{prod.nombre}</strong>
                  <span style={{ fontSize: '12px', color: 'var(--texto-secundario)' }}>${prod.precioUSD.toFixed(2)} | Stock: {prod.stock} | {prod.categoria}</span>
                </div>
                
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button onClick={() => cargarParaEdicion(prod)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>✏️</button>
                  <button onClick={() => { if(confirm('¿Eliminar este producto permanentemente?')) onDelete(prod.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>🗑️</button>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}