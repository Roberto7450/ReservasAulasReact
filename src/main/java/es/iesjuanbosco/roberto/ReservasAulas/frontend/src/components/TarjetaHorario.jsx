// COMPONENTE: Tarjeta de información reutilizable
const DIA_LABELS = {
  LUNES: 'Lunes',
  MARTES: 'Martes',
  MIERCOLES: 'Miércoles',
  JUEVES: 'Jueves',
  VIERNES: 'Viernes',
  SABADO: 'Sábado',
  DOMINGO: 'Domingo',
};

export default function TarjetaHorario({ horario, onEditar, onEliminar, isAdmin }) {
  const handleEliminar = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este horario?')) {
      onEliminar(horario.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {DIA_LABELS[horario.diaSemana] || horario.diaSemana}
      </h3>

      <div className="space-y-2 text-gray-600 mb-4">
        <p className="text-lg">
          {horario.horaInicio} - {horario.horaFin}
        </p>
      </div>

      {isAdmin && (
        <div className="flex gap-2">
          <button
            onClick={() => onEditar(horario)}
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