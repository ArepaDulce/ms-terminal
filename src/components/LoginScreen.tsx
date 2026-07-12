import { useState } from 'react';

interface Props {
  configuracion: any;
  onLogin: (sesion: any) => void;
}

export function LoginScreen({ configuracion, onLogin }: Props) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const manejarIngreso = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Verificar si es la clave maestra del Administrador
    if (pin === configuracion.pinAdmin) {
      onLogin({ rol: 'admin', nombre: 'Administrador' });
      return;
    }

    // 2. Verificar si es el PIN de un cajero registrado
    const cajero = configuracion.cajeros?.find((c: any) => c.pin === pin);
    if (cajero) {
      onLogin({ rol: 'cajero', nombre: cajero.nombre });
      return;
    }

    // 3. Fallo de seguridad
    setError(true);
    setPin('');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-app)', padding: '20px' }}>
      <div style={{ backgroundColor: 'var(--bg-panel)', padding: '40px', borderRadius: '15px', border: '1px solid var(--borde-suave)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', textAlign: 'center', width: '100%', maxWidth: '350px' }}>
        
        <div style={{ width: '60px', height: '60px', backgroundColor: 'var(--acento-primario)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '28px', color: 'white', fontWeight: 'bold' }}>
          {configuracion.nombreNegocio ? configuracion.nombreNegocio.charAt(0).toUpperCase() : 'M'}
        </div>
        
        <h2 style={{ color: 'var(--texto-principal)', margin: '0 0 5px 0' }}>{configuracion.nombreNegocio || 'MS POS'}</h2>
        <p style={{ color: 'var(--texto-secundario)', fontSize: '14px', marginBottom: '25px' }}>Ingresa tu PIN de acceso</p>

        <form onSubmit={manejarIngreso}>
          <input 
            type="password" 
            value={pin}
            onChange={(e) => { setPin(e.target.value); setError(false); }}
            placeholder="••••"
            maxLength={4}
            style={{ width: '100%', padding: '15px', fontSize: '24px', letterSpacing: '8px', textAlign: 'center', borderRadius: '10px', border: error ? '2px solid var(--alerta)' : '1px solid var(--borde-suave)', backgroundColor: 'var(--bg-app)', color: 'var(--texto-principal)', outline: 'none', marginBottom: '15px', boxSizing: 'border-box' }}
            autoFocus
          />
          {error && <p style={{ color: 'var(--alerta)', fontSize: '13px', marginTop: '-5px', marginBottom: '15px', fontWeight: 'bold' }}>PIN incorrecto</p>}
          
          <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: 'var(--acento-primario)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}