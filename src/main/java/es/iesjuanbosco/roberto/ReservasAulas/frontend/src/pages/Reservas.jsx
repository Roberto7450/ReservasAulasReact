import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { reservaService } from '../services/reservaService';
import { aulaService } from '../services/aulaService';
import { horarioService } from '../services/horarioService';
import { formatDateToISO } from '../utils/api';

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError('');

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
      setSubmitError(
        err.response?.data?.message || 'Error al guardar la reserva'
      );
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
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta reserva?'))
      return;

    try {
      await reservaService.eliminar(id);
      mutate();
    } catch (err) {
      setSubmitError('Error al eliminar la reserva');
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
          onClick={() => setShowForm(!showForm)}
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
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {submitError}
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
                <select
                  name="horarioId"
                  value={formData.horarioId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500"
                >
                  <option value="">Seleccionar horario</option>
                  {horarios?.map((horario) => (
                    <option key={horario.id} value={horario.id}>
                      {horario.diaSemana} ({horario.horaInicio} - {horario.horaFin})
                    </option>
                  ))}
                </select>
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
