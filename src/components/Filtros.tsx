interface Props {
  busqueda: string;
  setBusqueda: (texto: string) => void;
  categoriaFiltro: string;
  setCategoriaFiltro: (cat: string) => void;
  categorias: string[];
  onEnter?: () => void; // NUEVA PROP OPCIONAL
}

export function Filtros({ busqueda, setBusqueda, categoriaFiltro, setCategoriaFiltro, categorias, onEnter }: Props) {
  return (
    <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center', backgroundColor: 'var(--bg-panel)', padding: '15px', borderRadius: '8px', border: '1px solid var(--borde-suave)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
      
      <div style={{ flex: '1 1 200px' }}>
        <input
          type="text"
          placeholder="🔍 Buscar producto (ej. Harina, Coca-Cola)..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyDown={(e) => {
            // Si presionan Enter y hay una función onEnter pasadada, ejecútala
            if (e.key === 'Enter' && onEnter) {
              onEnter();
            }
          }}
          style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--borde-suave)', boxSizing: 'border-box', outline: 'none', backgroundColor: 'var(--bg-app)', color: 'var(--texto-principal)' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button
          onClick={() => setCategoriaFiltro('')}
          style={{ 
            padding: '8px 15px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap',
            backgroundColor: categoriaFiltro === '' ? 'var(--acento-primario)' : 'var(--bg-app)', 
            color: categoriaFiltro === '' ? 'white' : 'var(--texto-secundario)',
            border: '1px solid var(--borde-suave)'
          }}
        >
          Todas
        </button>
        
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoriaFiltro(cat)}
            style={{ 
              padding: '8px 15px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap',
              backgroundColor: categoriaFiltro === cat ? 'var(--acento-primario)' : 'var(--bg-app)', 
              color: categoriaFiltro === cat ? 'white' : 'var(--texto-secundario)',
              border: '1px solid var(--borde-suave)'
            }}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}