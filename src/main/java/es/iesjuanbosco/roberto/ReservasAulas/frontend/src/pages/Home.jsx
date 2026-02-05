import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Sistema de Reservas de Aulas
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Administra fácilmente las reservas de aulas educativas
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/login"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Panel de Control
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/aulas"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aulas</h3>
            <p className="text-gray-600">
              Visualiza, crea y administra las aulas disponibles
            </p>
          </Link>

          <Link
            to="/horarios"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Horarios</h3>
            <p className="text-gray-600">
              Gestiona los horarios disponibles para reservas
            </p>
          </Link>

          <Link
            to="/reservas"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Reservas</h3>
            <p className="text-gray-600">
              Crea y administra las reservas de aulas
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
