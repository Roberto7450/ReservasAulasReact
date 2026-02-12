// COMPONENTE: Formulario reutilizable para crear/editar
import { useState, useEffect } from 'react';

// Obtener día de la semana desde fecha
const getDayName = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr + 'T00:00:00');
  const days = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
  return days[date.getDay()];
};

export default function FormularioReserva({
  reservaEditando,
  onGuardar,
  onCancelar,
  aulas,
  horarios
}) {
  // Estados para los campos del formulario
  const [aulaId, setAulaId] = useState('');
  const [horarioId, setHorarioId] = useState('');
  const [fecha, setFecha] = useState('');
  const [motivo, setMotivo] = useState('');
  const [asistentes, setAsistentes] = useState('');
  const [error, setError] = useState('');

  // Filtrar horarios según día de la semana
  const horariosFiltrados = fecha && horarios
    ? horarios.filter(h => h.diaSemana === getDayName(fecha))
    : horarios || [];

  // Actualizar campos del formulario cuando cambia reservaEditando
  useEffect(() => {
    if (reservaEditando) {
      setAulaId(reservaEditando.aulaId || '');
      setHorarioId(reservaEditando.horarioId || '');
      setFecha(reservaEditando.fecha || '');
      setMotivo(reservaEditando.motivo || '');
      setAsistentes(reservaEditando.asistentes || '');
    } else {
      setAulaId('');
      setHorarioId('');
      setFecha('');
      setMotivo('');
      setAsistentes('');
    }
    setError('');
  }, [reservaEditando]);

  // Cuando cambia la fecha, resetear el horario seleccionado
  const handleFechaChange = (e) => {
    setFecha(e.target.value);
    setHorarioId('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!aulaId || !horarioId || !fecha || !asistentes) {
      setError('Todos los campos obligatorios deben estar completos');
      return;
    }

    const reservaData = {
      aulaId: parseInt(aulaId),
      horarioId: parseInt(horarioId),
      fecha,
      motivo,
      asistentes: parseInt(asistentes)
    };

    try {
      await onGuardar(reservaData);
      setAulaId('');
      setHorarioId('');
      setFecha('');
      setMotivo('');
      setAsistentes('');
      setError('');
    } catch (err) {
      // Extraer mensaje de error del backend
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
        {reservaEditando ? 'Editar Reserva' : 'Nueva Reserva'}
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Aula *
          </label>
          <select
            value={aulaId}
            onChange={(e) => setAulaId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Selecciona un aula</option>
            {aulas?.map(aula => (
              <option key={aula.id} value={aula.id}>
                {aula.nombre} (Capacidad: {aula.capacidad})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha *
          </label>
          <input
            type="date"
            value={fecha}
            onChange={handleFechaChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Horario *
          </label>
          <select
            value={horarioId}
            onChange={(e) => setHorarioId(e.target.value)}
            required
            disabled={!fecha}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
          >
            <option value="">{fecha ? 'Selecciona un horario' : 'Primero selecciona una fecha'}</option>
            {horariosFiltrados.map(horario => (
              <option key={horario.id} value={horario.id}>
                {horario.horaInicio} - {horario.horaFin}
              </option>
            ))}
          </select>
          {fecha && horariosFiltrados.length === 0 && (
            <p className="mt-1 text-sm text-yellow-600">
              No hay horarios disponibles para este día
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de asistentes *
          </label>
          <input
            type="number"
            value={asistentes}
            onChange={(e) => setAsistentes(e.target.value)}
            required
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Motivo
          </label>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Motivo de la reserva (opcional)"
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