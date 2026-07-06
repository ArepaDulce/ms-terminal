import React from 'react';

interface Props {
  tasa: number;
  setTasa: (valor: number) => void;
}

export function TasaBCV({ tasa, setTasa }: Props) {
  const manejarCambio = (evento: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoValor = parseFloat(evento.target.value);
    if (!isNaN(nuevoValor)) {
      setTasa(nuevoValor);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-panel)', padding: '15px', borderRadius: '8px', border: '1px solid var(--borde-suave)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
      <h3 style={{ marginTop: 0, color: 'var(--acento-primario)' }}>Tasa del Día</h3>
      <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: 'var(--texto-principal)' }}>
        Valor en Bs:
      </label>
      <input
        type="number"
        step="0.01"
        value={tasa}
        onChange={manejarCambio}
        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--borde-suave)', boxSizing: 'border-box', color: 'var(--texto-principal)', outline: 'none' }}
      />
      <p style={{ marginTop: '15px', color: 'var(--texto-secundario)', fontSize: '14px' }}>
        Tasa registrada en sistema: <br/>
        <strong style={{ color: 'var(--alerta)', fontSize: '18px' }}>{tasa} Bs/$</strong>
      </p>
    </div>
  );
}