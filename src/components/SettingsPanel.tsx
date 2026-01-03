import { Settings, X, Image as ImageIcon, Film, FileType } from 'lucide-react';
import { useState } from 'react';
import { useConversionStore } from '../store/conversionStore';
import { motion, AnimatePresence } from 'framer-motion';

export const SettingsPanel = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { settings, updateSettings } = useConversionStore();

    const supportedFormats = [
        {
            icon: <ImageIcon className="w-4 h-4 text-blue-400" />,
            category: 'Images',
            input: 'JPG, PNG, WebP',
            output: 'WebP, PNG, JPG',
        },
        {
            icon: <Film className="w-4 h-4 text-purple-400" />,
            category: 'Video',
            input: 'MP4, MOV, WebM',
            output: 'GIF, WebM, MP4',
        },
        {
            icon: <FileType className="w-4 h-4 text-red-400" />,
            category: 'Documents',
            input: 'Images, TXT',
            output: 'PDF',
        },
    ];

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-6 right-6 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full backdrop-blur-md transition-all shadow-lg z-50 text-gray-300 hover:text-white"
                title="Settings & Info"
            >
                <Settings className="w-5 h-5" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full max-w-sm bg-slate-950 border-l border-white/10 shadow-2xl z-50 p-6 overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold text-white">Settings</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            {/* Preferences */}
                            <div className="space-y-6 mb-10">
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Preferences</h3>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-sm text-gray-300">Image Quality</label>
                                            <span className="text-xs text-violet-400">{Math.round(settings.imageQuality * 100)}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="10"
                                            max="100"
                                            value={settings.imageQuality * 100}
                                            onChange={(e) => updateSettings({ imageQuality: parseInt(e.target.value) / 100 })}
                                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-sm text-gray-300">GIF FPS</label>
                                            <span className="text-xs text-violet-400">{settings.videoFps} FPS</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="5"
                                            max="30"
                                            value={settings.videoFps}
                                            onChange={(e) => updateSettings({ videoFps: parseInt(e.target.value) })}
                                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Supported Conversions Grid */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Supported Conversions</h3>
                                <div className="grid gap-3">
                                    {supportedFormats.map((format, i) => (
                                        <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                {format.icon}
                                                <span className="font-medium text-sm">{format.category}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                                                <span>{format.input}</span>
                                                <span className="text-violet-500">→</span>
                                                <span className="text-gray-300">{format.output}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10 text-center">
                                <p className="text-xs text-gray-500">
                                    Processing happens locally on your device. No data is sent to any server.
                                </p>
                            </div>

                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
