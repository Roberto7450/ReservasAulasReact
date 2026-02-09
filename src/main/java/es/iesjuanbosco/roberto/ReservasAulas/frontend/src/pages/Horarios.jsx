import { useState, useEffect } from 'react';
import { horarioService } from '../services/horarioService';
import { useAuth } from '../context/AuthContext';
import FormularioHorario from '../components/FormularioHorario';
import TarjetaHorario from '../components/TarjetaHorario';

export default function Horarios() {
  const { isAdmin } = useAuth();

  // Estados principales
  const [horarios, setHorarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  // Estados para controlar el formulario
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [horarioEditando, setHorarioEditando] = useState(null);

  // Cargar horarios al montar el componente
  useEffect(() => {
    cargarHorarios();
  }, []);

  // Función para cargar todos los horarios desde el backend
  const cargarHorarios = async () => {
    setCargando(true);
    setError('');

    try {
      const data = await horarioService.obtenerTodos();
      setHorarios(data);
    } catch (err) {
      setError('Error al cargar los horarios');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  // Guardar horario (crear o actualizar)
  const handleGuardar = async (horarioData) => {
    try {
      if (horarioEditando) {
        await horarioService.actualizar(horarioEditando.id, horarioData);
      } else {
        await horarioService.crear(horarioData);
      }

      await cargarHorarios();
      setMostrarFormulario(false);
      setHorarioEditando(null);
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
      }

      throw new Error(mensajeError);
    }
  };

  // Editar horario existente
  const handleEditar = (horario) => {
    setHorarioEditando(horario);
    setMostrarFormulario(true);
  };

  // Eliminar horario
  const handleEliminar = async (id) => {
    try {
      await horarioService.eliminar(id);
      setHorarios(horarios.filter(horario => horario.id !== id));
    } catch (err) {
      setError(err.response?.data || 'Error al eliminar');
    }
  };

  // Cancelar edición o creación
  const handleCancelar = () => {
    setMostrarFormulario(false);
    setHorarioEditando(null);
  };

  if (cargando) {
    return <div className="p-8">Cargando horarios...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Cabecera con título y botón para nuevo horario */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Horarios</h1>

        {isAdmin && (
          <button
            onClick={() => {
              setHorarioEditando(null);
              setMostrarFormulario(!mostrarFormulario);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {mostrarFormulario ? 'Cancelar' : 'Nuevo Horario'}
          </button>
        )}
      </div>

      {/* Mensajes de error globales */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Formulario de creación/edición de horarios */}
      {mostrarFormulario && (
        <FormularioHorario
          horarioEditando={horarioEditando}
          onGuardar={handleGuardar}
          onCancelar={handleCancelar}
        />
      )}

      {/* Grid de tarjetas de horarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {horarios.map((horario) => (
          <TarjetaHorario
            key={horario.id}
            horario={horario}
            onEditar={handleEditar}
            onEliminar={handleEliminar}
            isAdmin={isAdmin}
          />
        ))}
      </div>

      {/* Mensaje cuando no hay resultados */}
      {horarios.length === 0 && !cargando && (
        <p className="text-center text-gray-500 mt-8">
          No hay horarios disponibles
        </p>
      )}
    </div>
  );
}

