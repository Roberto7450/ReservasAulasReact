import { useState, useMemo } from 'react';
import { useFetch } from '../hooks/useFetch';
import { reservaService } from '../services/reservaService';
import { aulaService } from '../services/aulaService';
import { horarioService } from '../services/horarioService';
import { formatDateToISO } from '../utils/api';

// Obtener el nombre del día de la semana en español
const getDayName = (dateStr) => {
  const date = new Date(dateStr);
  const days = [
    'domingo',
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado',
  ];
  return days[date.getDay()];
};

// Convertir nombre del día a capitalizado
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export default function Reservas() {
  const { data: reservas, error, isLoading, mutate } = useFetch('/reservas');
  const { data: aulas } = useFetch('/aulas');
  const { data: horarios } = useFetch('/horarios');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    aulaId: '',
    horarioId: '',
    fecha: '',
    motivo: '',
    asistentes: '',
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitErrorDetails, setSubmitErrorDetails] = useState('');

  // Filtrar horarios según el día de la semana de la fecha seleccionada
  const filteredHorarios = useMemo(() => {
    if (!formData.fecha || !horarios) return horarios || [];
    
    const selectedDay = getDayName(formData.fecha);
    return horarios.filter(
      (horario) =>
        horario.diaSemana.toLowerCase() === selectedDay.toLowerCase()
    );
  }, [formData.fecha, horarios]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Si se cambia la fecha, resetear el horarioId para forzar selección correcta
    if (name === 'fecha') {
      setFormData({
        ...formData,
        [name]: value,
        horarioId: '', // Reset horario cuando cambia la fecha
      });
      setSubmitError('');
      setSubmitErrorDetails('');
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError('');
    setSubmitErrorDetails('');

    try {
      const payload = {
        aulaId: parseInt(formData.aulaId),
        horarioId: parseInt(formData.horarioId),
        fecha: formData.fecha,
        motivo: formData.motivo,
        asistentes: parseInt(formData.asistentes),
      };

      if (editingId) {
        await reservaService.actualizar(editingId, payload);
      } else {
        await reservaService.crear(payload);
      }

      mutate();
      setFormData({
        aulaId: '',
        horarioId: '',
        fecha: '',
        motivo: '',
        asistentes: '',
      });
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      // Capturar el mensaje de error del servidor
      let errorMessage = 'Error al guardar la reserva';
      let errorDetails = '';

      if (err.response?.data) {
        // Servidor envió un mensaje específico
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        }
      }

      // Extraer detalles si es un error de validación
      if (errorMessage.includes('Error de validación:')) {
        const parts = errorMessage.split('Error de validación: ');
        if (parts.length > 1) {
          errorDetails = parts[1];
          errorMessage = 'Error de validación:';
        }
      }

      setSubmitError(errorMessage);
      setSubmitErrorDetails(errorDetails);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (reserva) => {
    setFormData({
      aulaId: reserva.aulaId,
      horarioId: reserva.horarioId,
      fecha: formatDateToISO(reserva.fecha),
      motivo: reserva.motivo,
      asistentes: reserva.asistentes,
    });
    setEditingId(reserva.id);
    setShowForm(true);
    setSubmitError('');
    setSubmitErrorDetails('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta reserva?'))
      return;

    try {
      await reservaService.eliminar(id);
      mutate();
    } catch (err) {
      let errorMessage = 'Error al eliminar la reserva';
      
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }
      
      setSubmitError(errorMessage);
      setSubmitErrorDetails('');
    }
  };

  const handleCancel = () => {
    setFormData({
      aulaId: '',
      horarioId: '',
      fecha: '',
      motivo: '',
      asistentes: '',
    });
    setShowForm(false);
    setEditingId(null);
    setSubmitError('');
    setSubmitErrorDetails('');
  };

  if (isLoading) {
    return <div className="p-8">Cargando reservas...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Error al cargar las reservas</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reservas</h1>
        <button
          onClick={() => {
            if (!showForm) {
              // Limpiar formulario y errores cuando se abre
              setFormData({
                aulaId: '',
                horarioId: '',
                fecha: '',
                motivo: '',
                asistentes: '',
              });
              setEditingId(null);
              setSubmitError('');
              setSubmitErrorDetails('');
            }
            setShowForm(!showForm);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancelar' : 'Nueva Reserva'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            {editingId ? 'Editar Reserva' : 'Nueva Reserva'}
          </h2>

          {submitError && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <p className="font-semibold">{submitError}</p>
              {submitErrorDetails && (
                <p className="mt-2 text-sm">{submitErrorDetails}</p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aula
                </label>
                <select
                  name="aulaId"
                  value={formData.aulaId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500"
                >
                  <option value="">Seleccionar aula</option>
                  {aulas?.map((aula) => (
                    <option key={aula.id} value={aula.id}>
                      {aula.nombre} (Cap: {aula.capacidad})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horario
                </label>
                {formData.fecha && filteredHorarios.length === 0 ? (
                  <div className="w-full px-3 py-2 border border-red-300 rounded-lg bg-red-50 text-red-600 text-sm">
                    No hay horarios disponibles para {capitalize(getDayName(formData.fecha))}
                  </div>
                ) : (
                  <select
                    name="horarioId"
                    value={formData.horarioId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500"
                  >
                    <option value="">
                      {formData.fecha
                        ? `Seleccionar horario para ${capitalize(getDayName(formData.fecha))}`
                        : 'Seleccionar horario'}
                    </option>
                    {filteredHorarios?.map((horario) => (
                      <option key={horario.id} value={horario.id}>
                        {horario.horaInicio} - {horario.horaFin}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo
              </label>
              <input
                type="text"
                name="motivo"
                value={formData.motivo}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Asistentes
              </label>
              <input
                type="number"
                name="asistentes"
                value={formData.asistentes}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {submitLoading ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Aula
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Horario
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Motivo
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Asistentes
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {reservas?.map((reserva) => (
              <tr key={reserva.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-900">{reserva.aulaNombre}</td>
                <td className="px-6 py-4 text-gray-900">{reserva.fecha}</td>
                <td className="px-6 py-4 text-gray-900">
                  {reserva.horarioDiaSemana} ({reserva.horarioHoraInicio} -{' '}
                  {reserva.horarioHoraFin})
                </td>
                <td className="px-6 py-4 text-gray-900">{reserva.motivo}</td>
                <td className="px-6 py-4 text-gray-900">{reserva.asistentes}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(reserva)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(reserva.id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
