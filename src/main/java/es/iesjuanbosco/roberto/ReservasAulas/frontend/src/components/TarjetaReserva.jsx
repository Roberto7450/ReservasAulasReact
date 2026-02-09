// Componente de tarjeta para mostrar información de una reserva

export default function TarjetaReserva({ reserva, onEditar, onEliminar, isAdmin, userEmail }) {
  const handleEliminar = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
      onEliminar(reserva.id);
    }
  };

  // Formatear fecha desde formato dd/MM/yyyy
  const formatearFecha = (fechaString) => {
    if (!fechaString) return 'Sin fecha';

    const parts = fechaString.split('/');
    if (parts.length === 3) {
      const [dia, mes, anio] = parts;
      const fecha = new Date(anio, mes - 1, dia);
      return fecha.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    return fechaString;
  };

  const fechaFormateada = formatearFecha(reserva.fecha);

  // Verificar permisos de edición
  const puedeModificar = isAdmin || reserva.usuarioEmail === userEmail;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        {reserva.aulaNombre || 'Sin aula'}
      </h3>

      <div className="space-y-2 text-gray-600 mb-4">
        <p>
          <span className="font-medium">Fecha:</span> {fechaFormateada}
        </p>
        <p>
          <span className="font-medium">Horario:</span> {reserva.horarioHoraInicio || 'Sin horario'} - {reserva.horarioHoraFin || ''}
        </p>
        <p>
          <span className="font-medium">Asistentes:</span> {reserva.asistentes}
        </p>
        <p>
          <span className="font-medium">Usuario:</span> {reserva.usuarioEmail || 'Sin usuario'}
        </p>
        {reserva.motivo && (
          <p>
            <span className="font-medium">Motivo:</span> {reserva.motivo}
          </p>
        )}
      </div>

      {puedeModificar && (
        <div className="flex gap-2">
          <button
            onClick={() => onEditar(reserva)}
            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Editar
          </button>
          <button
            onClick={handleEliminar}
            className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}

