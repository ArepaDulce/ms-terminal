interface Props {
  vistaActual: string;
  cambiarVista: (vista: string) => void;
  sesion: any; // NUEVO: Recibimos la sesión
}

export function Sidebar({ vistaActual, cambiarVista, sesion }: Props) {
  // Lógica de seguridad:
  const esAdmin = sesion?.rol === 'admin';

  const getBtnStyle = (vista: string) => ({
    backgroundColor: vistaActual === vista ? 'var(--bg-app)' : 'transparent',
    borderLeft: vistaActual === vista ? '4px solid var(--acento-primario)' : '4px solid transparent',
    color: vistaActual === vista ? 'var(--acento-primario)' : 'var(--texto-principal)'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid var(--borde-suave)' }}>
        <h2 style={{ margin: 0, color: 'var(--texto-principal)', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🏪</span> MS POS
        </h2>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--texto-secundario)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Navegación</span>
        
        {/* El Punto de Venta es para todos */}
        <button className="sidebar-btn" style={getBtnStyle('pos')} onClick={() => cambiarVista('pos')}>🛒 Punto de Venta</button>
        
        {/* RUTA PROTEGIDA: Solo para el Admin */}
        {esAdmin && (
          <>
            <button className="sidebar-btn" style={getBtnStyle('inventario')} onClick={() => cambiarVista('inventario')}>📦 Inventario</button>
            <button className="sidebar-btn" style={getBtnStyle('historial')} onClick={() => cambiarVista('historial')}>📊 Historial</button>
            
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--texto-secundario)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '15px', marginBottom: '5px' }}>Sistema</span>
            <button className="sidebar-btn" style={getBtnStyle('configuracion')} onClick={() => cambiarVista('configuracion')}>⚙️ Configuración</button>
          </>
        )}
      </div>
    </div>
  );
}