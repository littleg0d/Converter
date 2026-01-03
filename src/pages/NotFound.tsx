import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { motion } from 'framer-motion';

export const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
            {/* Background Ambience */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-900/20 blur-[80px] rounded-full" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-900/10 blur-[80px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 flex flex-col items-center max-w-xl"
            >
                <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-violet-500 blur-[50px] opacity-20" />
                    <img
                        src="/404-art.png"
                        alt="404 Illustration"
                        className="relative w-full max-w-xs rounded-xl shadow-2xl border border-white/5"
                    />
                </div>

                <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-white/80 to-white/20 mb-4">
                    404
                </h1>

                <p className="text-lg md:text-xl text-gray-400 font-light mb-8 max-w-md">
                    Oops! The file or page you are looking for seems to have drifted into digital space.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/')}
                        className="cursor-pointer group flex items-center gap-2 px-5 py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all shadow-lg hover:shadow-violet-500/20"
                    >
                        <Home className="w-4 h-4" />
                        <span>Go Home</span>
                    </button>
                </div>
            </motion.div>

            {/* Footer removed per user request */}
        </div>
    );
};
