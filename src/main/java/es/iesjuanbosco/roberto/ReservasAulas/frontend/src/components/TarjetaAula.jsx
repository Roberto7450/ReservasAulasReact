// COMPONENTE: Tarjeta de información reutilizable
export default function TarjetaAula({ aula, onEditar, onEliminar, isAdmin }) {

  const handleEliminar = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta aula?')) {
      onEliminar(aula.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
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

      {isAdmin && (
        <div className="flex gap-2">
          <button
            onClick={() => onEditar(aula)}
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