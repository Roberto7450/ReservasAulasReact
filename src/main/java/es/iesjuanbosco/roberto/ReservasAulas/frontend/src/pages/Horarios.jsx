import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { horarioService } from '../services/horarioService';

const DIAS = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

export default function Horarios() {
  const { data: horarios, error, isLoading, mutate } = useFetch('/horarios');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    diaSemana: 'LUNES',
    horaInicio: '',
    horaFin: '',
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
        diaSemana: formData.diaSemana,
        horaInicio: formData.horaInicio,
        horaFin: formData.horaFin,
      };

      if (editingId) {
        await horarioService.actualizar(editingId, payload);
      } else {
        await horarioService.crear(payload);
      }

      mutate();
      setFormData({ diaSemana: 'LUNES', horaInicio: '', horaFin: '' });
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Error al guardar el horario');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (horario) => {
    setFormData({
      diaSemana: horario.diaSemana,
      horaInicio: horario.horaInicio,
      horaFin: horario.horaFin,
    });
    setEditingId(horario.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este horario?'))
      return;

    try {
      await horarioService.eliminar(id);
      mutate();
    } catch (err) {
      setSubmitError('Error al eliminar el horario');
    }
  };

  const handleCancel = () => {
    setFormData({ diaSemana: 'LUNES', horaInicio: '', horaFin: '' });
    setShowForm(false);
    setEditingId(null);
  };

  if (isLoading) {
    return <div className="p-8">Cargando horarios...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Error al cargar los horarios</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Horarios</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancelar' : 'Nuevo Horario'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            {editingId ? 'Editar Horario' : 'Nuevo Horario'}
          </h2>

          {submitError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Día de la Semana
              </label>
              <select
                name="diaSemana"
                value={formData.diaSemana}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500"
              >
                {DIAS.map((dia) => (
                  <option key={dia} value={dia}>
                    {dia}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora Inicio
                </label>
                <input
                  type="time"
                  name="horaInicio"
                  value={formData.horaInicio}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora Fin
                </label>
                <input
                  type="time"
                  name="horaFin"
                  value={formData.horaFin}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500"
                />
              </div>
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
                Día
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Hora Inicio
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Hora Fin
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {horarios?.map((horario) => (
              <tr key={horario.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-900">{horario.diaSemana}</td>
                <td className="px-6 py-4 text-gray-900">{horario.horaInicio}</td>
                <td className="px-6 py-4 text-gray-900">{horario.horaFin}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(horario)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(horario.id)}
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
