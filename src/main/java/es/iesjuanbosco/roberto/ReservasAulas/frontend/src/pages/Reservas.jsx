import { useState, useEffect } from 'react';
import { reservaService } from '../services/reservaService';
import { aulaService } from '../services/aulaService';
import { horarioService } from '../services/horarioService';
import { useAuth } from '../context/AuthContext';
import FormularioReserva from '../components/FormularioReserva';
import TarjetaReserva from '../components/TarjetaReserva';

export default function Reservas() {
  const { isAdmin, user } = useAuth();

  // Estados principales
  const [todasLasReservas, setTodasLasReservas] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  // Estados para controlar el formulario
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [reservaEditando, setReservaEditando] = useState(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos();
  }, []);

  // Función para cargar todos los datos necesarios
  const cargarDatos = async () => {
    setCargando(true);
    setError('');

    try {
      const [reservasData, aulasData, horariosData] = await Promise.all([
        reservaService.obtenerTodas(),
        aulaService.obtenerTodas(),
        horarioService.obtenerTodos()
      ]);

      setTodasLasReservas(reservasData);
      setAulas(aulasData);
      setHorarios(horariosData);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  // Filtrar reservas: profesores solo ven las suyas, admin ve todas
  const reservasFiltradas = isAdmin
    ? todasLasReservas
    : todasLasReservas.filter(r => r.usuarioEmail === user?.email);

  // Guardar reserva (crear o actualizar)
  const handleGuardar = async (reservaData) => {
    try {
      if (reservaEditando) {
        await reservaService.actualizar(reservaEditando.id, reservaData);
      } else {
        await reservaService.crear(reservaData);
      }

      await cargarDatos();
      setMostrarFormulario(false);
      setReservaEditando(null);
    } catch (err) {
      // Extraer y propagar el mensaje de error correctamente
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

  // Editar reserva existente
  const handleEditar = (reserva) => {
    setReservaEditando(reserva);
    setMostrarFormulario(true);
  };

  // Eliminar reserva
  const handleEliminar = async (id) => {
    try {
      await reservaService.eliminar(id);
      setTodasLasReservas(todasLasReservas.filter(reserva => reserva.id !== id));
    } catch (err) {
      setError(err.response?.data || 'Error al eliminar');
    }
  };

  // Cancelar edición o creación
  const handleCancelar = () => {
    setMostrarFormulario(false);
    setReservaEditando(null);
  };

  if (cargando) {
    return <div className="p-8">Cargando reservas...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Cabecera con título y botón para nueva reserva */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reservas</h1>

        <button
          onClick={() => {
            setReservaEditando(null);
            setMostrarFormulario(!mostrarFormulario);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {mostrarFormulario ? 'Cancelar' : 'Nueva Reserva'}
        </button>
      </div>

      {/* Mensajes de error globales */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Formulario de creación/edición de reservas */}
      {mostrarFormulario && (
        <FormularioReserva
          reservaEditando={reservaEditando}
          onGuardar={handleGuardar}
          onCancelar={handleCancelar}
          aulas={aulas}
          horarios={horarios}
        />
      )}

      {/* Grid de tarjetas de reservas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reservasFiltradas.map((reserva) => (
          <TarjetaReserva
            key={reserva.id}
            reserva={reserva}
            onEditar={handleEditar}
            onEliminar={handleEliminar}
            isAdmin={isAdmin}
            userEmail={user?.email}
          />
        ))}
      </div>

      {/* Mensaje cuando no hay resultados */}
      {reservasFiltradas.length === 0 && !cargando && (
        <p className="text-center text-gray-500 mt-8">
          No hay reservas disponibles
        </p>
      )}
    </div>
  );
}

