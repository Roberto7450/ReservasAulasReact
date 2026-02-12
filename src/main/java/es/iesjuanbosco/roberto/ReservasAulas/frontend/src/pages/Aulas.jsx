// PÁGINA: Gestión de Aulas - CRUD completo con filtros
import { useState, useEffect } from 'react';
import { aulaService } from '../services/aulaService';
import { useAuth } from '../context/AuthContext';
import FormularioAula from '../components/FormularioAula';
import TarjetaAula from '../components/TarjetaAula';

export default function Aulas() {
  const { isAdmin } = useAuth();

  // Estados: lista de datos, cargando, errores, formulario y filtros
  const [todasLasAulas, setTodasLasAulas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [aulaEditando, setAulaEditando] = useState(null);
  const [filtros, setFiltros] = useState({
    capacidadMinima: '',
    soloConOrdenadores: false
  });

  // useEffect: cargar datos al montar el componente
  useEffect(() => {
    cargarAulas();
  }, []);

  const cargarAulas = async () => {
    setCargando(true);
    setError('');

    try {
      const data = await aulaService.obtenerTodas();
      setTodasLasAulas(data);
    } catch (err) {
      setError('Error al cargar las aulas');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  // Filtrar datos con .filter() sin modificar el array original
  const aulasFiltradas = todasLasAulas.filter(aula => {
    if (filtros.capacidadMinima && aula.capacidad < parseInt(filtros.capacidadMinima)) {
      return false;
    }
    if (filtros.soloConOrdenadores && !aula.esOrdenadores) {
      return false;
    }
    return true;
  });

  // CRUD: Guardar (crear o actualizar)
  const handleGuardar = async (aulaData) => {
    try {
      if (aulaEditando) {
        await aulaService.actualizar(aulaEditando.id, aulaData);
      } else {
        await aulaService.crear(aulaData);
      }

      await cargarAulas();
      setMostrarFormulario(false);
      setAulaEditando(null);
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

  // CRUD: Editar
  const handleEditar = (aula) => {
    setAulaEditando(aula);
    setMostrarFormulario(true);
  };

  // CRUD: Eliminar
  const handleEliminar = async (id) => {
    try {
      await aulaService.eliminar(id);
      setTodasLasAulas(todasLasAulas.filter(aula => aula.id !== id));
    } catch (err) {
      setError(err.response?.data || 'Error al eliminar');
    }
  };

  const handleCancelar = () => {
    setMostrarFormulario(false);
    setAulaEditando(null);
  };

  const limpiarFiltros = () => {
    setFiltros({ capacidadMinima: '', soloConOrdenadores: false });
  };

  if (cargando) {
    return <div className="p-8">Cargando aulas...</div>;
  }


  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Cabecera con título y botón para nueva aula */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Aulas</h1>

        {isAdmin && (
          <button
            onClick={() => {
              setAulaEditando(null);
              setMostrarFormulario(!mostrarFormulario);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {mostrarFormulario ? 'Cancelar' : 'Nueva Aula'}
          </button>
        )}
      </div>

      {/* Mensajes de error globales */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Formulario de creación/edición de aulas */}
      {mostrarFormulario && (
        <FormularioAula
          aulaEditando={aulaEditando}
          onGuardar={handleGuardar}
          onCancelar={handleCancelar}
        />
      )}

      {/* Panel de filtros */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Filtros</h3>

        <div className="flex gap-4 items-end flex-wrap">
          {/* Filtro por capacidad mínima */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacidad mínima
            </label>
            <input
              type="number"
              value={filtros.capacidadMinima}
              onChange={(e) => setFiltros({ ...filtros, capacidadMinima: e.target.value })}
              placeholder="Ej: 20"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Filtro por aulas con ordenadores */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={filtros.soloConOrdenadores}
              onChange={(e) => setFiltros({ ...filtros, soloConOrdenadores: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label className="ml-2 text-sm text-gray-700">
              Solo con ordenadores
            </label>
          </div>

          {/* Botón para limpiar filtros */}
          <button
            onClick={limpiarFiltros}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Limpiar filtros
          </button>
        </div>

        {/* Contador de resultados */}
        <p className="mt-4 text-sm text-gray-600">
          Mostrando {aulasFiltradas.length} de {todasLasAulas.length} aulas
        </p>
      </div>

      {/* Grid de tarjetas de aulas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aulasFiltradas.map((aula) => (
          <TarjetaAula
            key={aula.id}
            aula={aula}
            onEditar={handleEditar}
            onEliminar={handleEliminar}
            isAdmin={isAdmin}
          />
        ))}
      </div>

      {/* Mensaje cuando no hay resultados */}
      {aulasFiltradas.length === 0 && !cargando && (
        <p className="text-center text-gray-500 mt-8">
          {todasLasAulas.length === 0
            ? 'No hay aulas disponibles'
            : 'No hay aulas que coincidan con los filtros'}
        </p>
      )}
    </div>
  );
}