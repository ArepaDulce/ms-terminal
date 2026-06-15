import { useState } from 'react';

export function TasaBCV() {
	// 1. Declaramos nuestro Estado.
	// Le decimos a TypeScript (<number>) que aquí SOLO pueden entrar números.
	// Empezamos con una tasa de ejemplo
	const [tasa, setTasa] = useState<number>(39.59);

	// 2. Esta función atrapa lo que escribas en el input y actualiza el Estado
	const manejarCambio = (evento: React.ChangeEvent<HTMLInputElement>) => {

		// Validamos que no sea un texto raro (NaN= Not a Number)
		if (!isNaN(nuevoValor)) {
			setTasa(nuevoValor);
		}
	};

	// 3. Lo que se dibujará en pantalla (JSX = HTML mexclado con JS)
	return (
		<div style={{ backgroundColor: '#e8f4f8', padding: '20px', borderRadius: '10px', maxWidth: '300', borderLeft: '5px solid #3498db' }}>
			<h3 style={{ marginTop: 0, color: '#2c3e50'}}>🇻🇪 Tasa BCV del Día</h3>

			<labe style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
				Valor en Bs:			
			</labe>

			<input 
				type="number"
				step="0.01" // Permite decimales
				value={tasa}
				onChange={manejarCambio}
				style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #bdc3c7', fontSize: '16px' }}
			/> 

			<p style={{ marginTop: '15px', color: '#7f8c8d', fontSize: '14px' }}>
			Tasa resgistrada en sistema: <strong style={{ color: '#e84c3c', fontSize: '18px' }}>{tasa} Bs/$</strong>				
			</p>
		</div>

		);
}