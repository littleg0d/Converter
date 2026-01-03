import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFound = () => {
  return (

    <div className="h-screen w-screen overflow-hidden flex flex-col items-center justify-center bg-[#020617] relative p-4">
      {/* Efecto de resplandor de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-violet-600/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-2xl">
        {/* Arte 404 -  */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <img 
            src="404-art.png" 
            alt="Página no encontrada" 
            className="relative w-64 md:w-80 rounded-2xl shadow-2xl"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
            404
          </h1>
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white">¿Te has perdido?</h2>
            <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto">
              La página que buscas no existe o ha sido movida a otra ubicación en el convertidor.
            </p>
          </div>
        </div>

        <Link
          to="/"
          className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        >
          <Home className="w-5 h-5" />
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};
