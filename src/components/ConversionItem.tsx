import { useState } from 'react';
import type { FileItem } from '../types';
import { NumberControl } from './ui/NumberControl';
import { FileVideo, FileImage, FileType, AlertCircle, Loader2, Download, Trash2, Play, Settings2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConversionItemProps {
    item: FileItem;
    onRemove: (id: string) => void;
    onConvert: (id: string) => void;
    onFormatChange: (id: string, format: FileItem['outputFormat']) => void;
    onUpdateSettings: (id: string, settings: Partial<NonNullable<FileItem['conversionSettings']>>) => void;
}

export const ConversionItem = ({ item, onRemove, onConvert, onFormatChange, onUpdateSettings }: ConversionItemProps) => {
    const [showSettings, setShowSettings] = useState(false);
    const getIcon = () => {
        if (item.file.type.startsWith('image/')) return <FileImage className="w-5 h-5 text-blue-400" />;
        if (item.file.type.startsWith('video/')) return <FileVideo className="w-5 h-5 text-purple-400" />;
        return <FileType className="w-5 h-5 text-gray-400" />;
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="group bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl md:rounded-lg p-2 flex flex-col gap-2 hover:bg-white/5 hover:border-white/10 transition-all duration-300 shadow-sm"
        >
            <div className="flex items-center gap-3 w-full">
                <div className="p-1.5 bg-white/5 rounded-md border border-white/5 group-hover:border-white/10 transition-colors">
                    {getIcon()}
                </div>

                <div className="flex-1 min-w-0 py-1">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold truncate text-white/90 text-sm tracking-wide" title={item.file.name}>
                            {item.file.name}
                        </h4>
                        <span className="text-xs font-mono text-gray-500 ml-3">{formatSize(item.file.size)}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-gray-500 mb-1.5">
                        <span>{item.status === 'completed' ? 'Converted' : item.status === 'converting' ? 'Processing' : item.status === 'error' ? 'Error' : 'Ready'}</span>
                        {item.status === 'converting' && <span className="text-violet-400">{Math.round(item.progress * 100)}%</span>}
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            className={`h-full ${item.status === 'error' ? 'bg-red-500' : 'bg-gradient-to-r from-violet-600 to-indigo-500'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.round(item.progress * 100)}%` }}
                            transition={{ type: 'spring', stiffness: 50 }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                    {item.status === 'pending' && (
                        <>
                            {/* Format Selector */}
                            <div className="flex items-center gap-2 md:gap-3">
                                <button
                                    onClick={() => setShowSettings(!showSettings)}
                                    className={`p-2 rounded-lg transition-colors hidden md:block ${showSettings ? 'bg-violet-500/20 text-violet-400' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                                    title="Settings"
                                >
                                    <Settings2 className="w-4 h-4" />
                                </button>

                                <select
                                    value={item.outputFormat}
                                    onChange={(e) => onFormatChange(item.id, e.target.value as any)}
                                    className="bg-black/40 border border-white/10 text-xs rounded-lg px-2 py-2 text-gray-300 focus:outline-none focus:border-violet-500/50 focus:bg-white/5 transition-all cursor-pointer font-medium hover:text-white [&>option]:bg-slate-950 [&>option]:text-gray-300 lg:w-20 w-16"
                                >
                                    {item.file.type.startsWith('image/') ? (
                                        <>
                                            <option value="webp">WebP</option>
                                            <option value="png">PNG</option>
                                            <option value="jpg">JPG</option>
                                        </>
                                    ) : item.file.type.startsWith('video/') ? (
                                        <>
                                            <option value="gif">GIF</option>
                                            <option value="webm">WebM</option>
                                            <option value="mp4">MP4</option>
                                        </>
                                    ) : (
                                        <option value="pdf">PDF</option>
                                    )}
                                </select>

                                {/* Mobile Settings Button */}
                                <button
                                    onClick={() => setShowSettings(!showSettings)}
                                    className={`p-2 rounded-lg transition-colors md:hidden ${showSettings ? 'bg-violet-500/20 text-violet-400' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                                >
                                    <Settings2 className="w-4 h-4" />
                                </button>

                                {item.status === 'pending' && item.file.type.startsWith('image/') && item.outputFormat === 'png' && (
                                    <button
                                        onClick={() => onUpdateSettings(item.id, { removeBackground: !item.conversionSettings?.removeBackground })}
                                        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border transition-all text-[10px] font-bold tracking-wider ${item.conversionSettings?.removeBackground
                                            ? 'bg-violet-500/20 border-violet-500/50 text-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.2)]'
                                            : 'bg-black/20 border-white/5 text-gray-500 hover:text-gray-300 hover:border-white/10'
                                            }`}
                                        title="Remove Background (AI)"
                                    >
                                        <Sparkles className={`w-3 h-3 ${item.conversionSettings?.removeBackground ? 'animate-pulse' : ''}`} />
                                        <span className="hidden sm:inline">BG REMOVAL</span>
                                    </button>
                                )}

                                <button
                                    onClick={() => onConvert(item.id)}
                                    disabled={(() => {
                                        const s = item.conversionSettings;
                                        if (s?.targetSize && s.targetSize > 0) {
                                            const unit = s.targetSizeUnit === 'KB' ? 1024 : 1024 * 1024;
                                            const bytes = s.targetSize * unit;
                                            if (bytes < 5120) return true; // Block < 5KB
                                            if (item.file.size > 0 && bytes < item.file.size * 0.005) return true; // Block < 0.5%
                                        }
                                        return false;
                                    })()}
                                    className={`p-2 rounded-lg transition-all shadow-lg ${(() => {
                                        const s = item.conversionSettings;
                                        if (s?.targetSize && s.targetSize > 0) {
                                            const u = s.targetSizeUnit === 'KB' ? 1024 : 1024 * 1024;
                                            const b = s.targetSize * u;
                                            if (b < 5120) return true;
                                            if (item.file.size > 0 && b < item.file.size * 0.005) return true;
                                        }
                                        return false;
                                    })()
                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                        : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-900/20 hover:shadow-violet-600/30 active:scale-95'
                                        }`}
                                    title="Start Conversion"
                                >
                                    <Play className="w-4 h-4 fill-current" />
                                </button>
                            </div>
                        </>
                    )}

                    {item.status === 'converting' && (
                        <div className="p-2">
                            <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
                        </div>
                    )}

                    {item.status === 'completed' && item.outputUrl && (
                        <a
                            href={item.outputUrl}
                            download={`converted-${item.id}.${item.outputFormat}`}
                            className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 hover:border-green-500/30 rounded-lg transition-all"
                            title="Download"
                        >
                            <Download className="w-4 h-4" />
                        </a>
                    )}

                    {item.status === 'error' && (
                        <div className="p-2 text-red-400 bg-red-500/10 rounded-lg border border-red-500/20" title={item.error}>
                            <AlertCircle className="w-5 h-5" />
                        </div>
                    )}

                    {item.status !== 'converting' && (
                        <button
                            onClick={() => onRemove(item.id)}
                            className="p-2 hover:bg-white/5 text-gray-600 hover:text-red-400 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Expanded Settings */}
            <AnimatePresence>
                {showSettings && item.status === 'pending' && item.conversionSettings && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="w-full overflow-hidden border-t border-white/5 pt-3 mt-1"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2 px-1">
                            {/* Resolution */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>Resolution (px)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1">
                                        <NumberControl
                                            value={item.conversionSettings.width}
                                            onChange={(val) => onUpdateSettings(item.id, { width: val || undefined })}
                                            min={10}
                                            max={10000}
                                            placeholder="W"
                                        />
                                    </div>
                                    <span className="text-gray-600 text-xs text-center w-4">x</span>
                                    <div className="flex-1">
                                        <NumberControl
                                            value={item.conversionSettings.height}
                                            onChange={(val) => onUpdateSettings(item.id, { height: val || undefined })}
                                            min={10}
                                            max={10000}
                                            placeholder="H"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Target Size */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span title="Target output size">Max Size</span>
                                </div>
                                <div className="relative flex items-center gap-2">
                                    <div className="flex-1">
                                        <NumberControl
                                            value={item.conversionSettings.targetSize}
                                            onChange={(val) => onUpdateSettings(item.id, { targetSize: val || 0 })}
                                            min={0.1}
                                            step={0.1}
                                            placeholder="Auto"
                                            endElement={
                                                <button
                                                    type="button"
                                                    onClick={() => onUpdateSettings(item.id, {
                                                        targetSizeUnit: item.conversionSettings?.targetSizeUnit === 'KB' ? 'MB' : 'KB'
                                                    })}
                                                    className="px-1.5 py-0.5 text-[10px] font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded border border-white/5 transition-colors tracking-wide"
                                                >
                                                    {item.conversionSettings.targetSizeUnit || 'MB'}
                                                </button>
                                            }
                                        />
                                    </div>
                                </div>
                                {item.conversionSettings.targetSize ? (
                                    <p className="text-[10px] text-violet-400/80">Quality will be auto-adjusted</p>
                                ) : null}
                            </div>

                            {/* Quality Slider - Only for Image */}
                            {(item.file.type.startsWith('image/')) && !item.conversionSettings.targetSize && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-gray-400">
                                        <span>Quality</span>
                                        <span className="text-violet-300 font-mono">{Math.round(item.conversionSettings.quality * 100)}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="1"
                                        step="0.1"
                                        value={item.conversionSettings.quality}
                                        onChange={(e) => onUpdateSettings(item.id, { quality: parseFloat(e.target.value) })}
                                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-violet-500 [&::-webkit-slider-thumb]:rounded-full"
                                    />
                                </div>
                            )}

                            {/* FPS Slider - Only for Video */}
                            {item.file.type.startsWith('video/') && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-gray-400">
                                        <span>FPS</span>
                                        <span className="text-violet-300 font-mono">{item.conversionSettings.fps}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="10"
                                        max="60"
                                        step="5"
                                        value={item.conversionSettings.fps || 30}
                                        onChange={(e) => onUpdateSettings(item.id, { fps: parseInt(e.target.value) })}
                                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-violet-500 [&::-webkit-slider-thumb]:rounded-full"
                                    />
                                </div>
                            )}


                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Validation Error Message */}
            {(() => {
                const s = item.conversionSettings;
                if (!s?.targetSize) return null;

                const unit = s.targetSizeUnit === 'KB' ? 1024 : 1024 * 1024;
                const targetBytes = s.targetSize * unit;
                const minBytes = 5120; // 5KB

                if (targetBytes < minBytes) {
                    return <div className="text-[11px] text-red-400 text-center pb-2 font-medium bg-red-500/10 py-1 rounded mx-2 mb-2 border border-red-500/20">Minimum size is 5KB</div>
                }

                // Extreme compression check (< 0.5% of original)
                if (item.file.size > 0 && targetBytes < item.file.size * 0.005) {
                    return <div className="text-[11px] text-amber-400 text-center pb-2 font-medium bg-amber-500/10 py-1 rounded mx-2 mb-2 border border-amber-500/20">Target size is extremely small ({Math.round((targetBytes / item.file.size) * 1000) / 10}%)</div>
                }

                return null;
            })()}


        </motion.div>
    );
};
