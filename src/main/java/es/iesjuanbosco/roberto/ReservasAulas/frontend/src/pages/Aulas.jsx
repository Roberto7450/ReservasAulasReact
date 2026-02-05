import { useState, useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';
import { aulaService } from '../services/aulaService';

export default function Aulas() {
  const { data: aulas, error, isLoading, mutate } = useFetch('/aulas');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    capacidad: '',
    esOrdenadores: false,
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError('');

    try {
      if (editingId) {
        await aulaService.actualizar(editingId, formData);
      } else {
        await aulaService.crear(formData);
      }
      mutate();
      setFormData({ nombre: '', capacidad: '', esOrdenadores: false });
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Error al guardar el aula');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (aula) => {
    setFormData({
      nombre: aula.nombre,
      capacidad: aula.capacidad,
      esOrdenadores: aula.esOrdenadores || false,
    });
    setEditingId(aula.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta aula?')) return;

    try {
      await aulaService.eliminar(id);
      mutate();
    } catch (err) {
      setSubmitError('Error al eliminar el aula');
    }
  };

  const handleCancel = () => {
    setFormData({ nombre: '', capacidad: '', esOrdenadores: false });
    setShowForm(false);
    setEditingId(null);
  };

  if (isLoading) {
    return <div className="p-8">Cargando aulas...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Error al cargar las aulas</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Aulas</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancelar' : 'Nueva Aula'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            {editingId ? 'Editar Aula' : 'Nueva Aula'}
          </h2>

          {submitError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Aula
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacidad
              </label>
              <input
                type="number"
                name="capacidad"
                value={formData.capacidad}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="esOrdenadores"
                checked={formData.esOrdenadores}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label className="ml-2 text-sm text-gray-700">
                ¿Tiene ordenadores?
              </label>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aulas?.map((aula) => (
          <div key={aula.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {aula.nombre}
            </h3>
            <div className="space-y-2 text-gray-600 mb-4">
              <p>
                <span className="font-medium">Capacidad:</span> {aula.capacidad}
              </p>
              <p>
                <span className="font-medium">Ordenadores:</span>{' '}
                {aula.esOrdenadores ? 'Sí' : 'No'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(aula)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(aula.id)}
                className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
