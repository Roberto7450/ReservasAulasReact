// Componente de formulario para crear y editar horarios

import { useState, useEffect } from 'react';

const DIAS = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

const DIA_LABELS = {
  LUNES: 'Lunes',
  MARTES: 'Martes',
  MIERCOLES: 'Miércoles',
  JUEVES: 'Jueves',
  VIERNES: 'Viernes',
  SABADO: 'Sábado',
  DOMINGO: 'Domingo',
};

export default function FormularioHorario({ horarioEditando, onGuardar, onCancelar }) {
  const [diaSemana, setDiaSemana] = useState('LUNES');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [error, setError] = useState('');

  // Actualizar campos del formulario cuando cambia horarioEditando
  useEffect(() => {
    if (horarioEditando) {
      setDiaSemana(horarioEditando.diaSemana || 'LUNES');
      setHoraInicio(horarioEditando.horaInicio || '');
      setHoraFin(horarioEditando.horaFin || '');
    } else {
      setDiaSemana('LUNES');
      setHoraInicio('');
      setHoraFin('');
    }
    setError('');
  }, [horarioEditando]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!diaSemana || !horaInicio || !horaFin) {
      setError('Todos los campos son obligatorios');
      return;
    }

    const horarioData = {
      diaSemana,
      horaInicio,
      horaFin
    };

    try {
      await onGuardar(horarioData);
      setDiaSemana('LUNES');
      setHoraInicio('');
      setHoraFin('');
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
        {horarioEditando ? 'Editar Horario' : 'Nuevo Horario'}
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Día de la semana
          </label>
          <select
            value={diaSemana}
            onChange={(e) => setDiaSemana(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            {DIAS.map(dia => (
              <option key={dia} value={dia}>
                {DIA_LABELS[dia]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hora de inicio
          </label>
          <input
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hora de fin
          </label>
          <input
            type="time"
            value={horaFin}
            onChange={(e) => setHoraFin(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
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

