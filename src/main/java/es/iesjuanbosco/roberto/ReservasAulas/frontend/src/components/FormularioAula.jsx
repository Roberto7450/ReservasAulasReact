// Componente de formulario para crear y editar aulas
// Recibe el aula a editar (si existe) y callbacks para guardar y cancelar

import { useState, useEffect } from 'react';

export default function FormularioAula({ aulaEditando, onGuardar, onCancelar }) {
  const [nombre, setNombre] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [esOrdenadores, setEsOrdenadores] = useState(false);
  const [error, setError] = useState('');

  // Actualizar campos del formulario cuando cambia aulaEditando
  useEffect(() => {
    if (aulaEditando) {
      setNombre(aulaEditando.nombre || '');
      setCapacidad(aulaEditando.capacidad || '');
      setEsOrdenadores(aulaEditando.esOrdenadores || false);
    } else {
      setNombre('');
      setCapacidad('');
      setEsOrdenadores(false);
    }
    setError('');
  }, [aulaEditando]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !capacidad) {
      setError('Todos los campos son obligatorios');
      return;
    }

    const aulaData = {
      nombre,
      capacidad: parseInt(capacidad),
      esOrdenadores
    };

    try {
      await onGuardar(aulaData);
      setNombre('');
      setCapacidad('');
      setEsOrdenadores(false);
      setError('');
    } catch (err) {
      let mensajeError = 'Error al guardar';

      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          mensajeError = err.response.data;
        } else if (err.response.data.message) {
          mensajeError = err.response.data.message;
        } else if (err.response.data.error) {
          mensajeError = err.response.data.error;
        }
      } else if (err.message) {
        mensajeError = err.message;
      }

      setError(mensajeError);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        {aulaEditando ? 'Editar Aula' : 'Nueva Aula'}
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Aula
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Capacidad
          </label>
          <input
            type="number"
            value={capacidad}
            onChange={(e) => setCapacidad(e.target.value)}
            required
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={esOrdenadores}
            onChange={(e) => setEsOrdenadores(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label className="ml-2 text-sm text-gray-700">
            ¿Tiene ordenadores?
          </label>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={onCancelar}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

