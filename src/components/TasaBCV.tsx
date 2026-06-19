import React from 'react';

// Ahora le decimos que recibirá la tasa y la función para actualizarla desde App
interface Props {
  tasa: number;
  setTasa: (valor: number) => void;
}

export function TasaBCV({ tasa, setTasa }: Props) {
  const manejarCambio = (evento: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoValor = parseFloat(evento.target.value);
    if (!isNaN(nuevoValor)) {
      setTasa(nuevoValor); // Usa la función que viene del jefe
    }
  };

  return (
    <div style={{ backgroundColor: '#e8f4f8', padding: '15px', borderRadius: '8px', border: '1px solid #bde0ec' }}>
      <h3 style={{ marginTop: 0, color: '#2980b9' }}>Tasa del Día</h3>
      <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
        Valor en Bs:
      </label>
      <input
        type="number"
        step="0.01"
        value={tasa}
        onChange={manejarCambio}
        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
      />
      <p style={{ marginTop: '15px', color: '#7f8c8d', fontSize: '14px' }}>
        Tasa registrada en sistema: <br/>
        <strong style={{ color: '#c0392b', fontSize: '18px' }}>{tasa} Bs/$</strong>
      </p>
    </div>
  );
}