import { Zap, Shield, FileOutput, MousePointerClick, Table2, FileImage, FileVideo, FileType } from 'lucide-react';

export const HowItWorks = () => {
    const steps = [
        {
            icon: <MousePointerClick className="w-5 h-5 text-violet-400" />,
            title: "1. Select Files",
            desc: "Drag & drop or click to select your files."
        },
        {
            icon: <Zap className="w-5 h-5 text-yellow-400" />,
            title: "2. Process Locally",
            desc: "Your browser processes everything locally."
        },
        {
            icon: <FileOutput className="w-5 h-5 text-emerald-400" />,
            title: "3. Download",
            desc: "Save your converted files instantly."
        }
    ];

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-violet-500/20 rounded-lg">
                    <Zap className="w-5 h-5 text-violet-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-200">How it Works</h3>
            </div>

            <div className="space-y-6 relative">
                {/* Connector Line */}
                <div className="absolute left-[19px] top-8 bottom-8 w-0.5 bg-white/5" />

                {steps.map((step, idx) => (
                    <div key={idx} className="relative flex gap-4">
                        <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center">
                            {step.icon}
                        </div>
                        <div className="pt-1">
                            <h4 className="text-sm font-semibold text-gray-200">{step.title}</h4>
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                {step.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Shield className="w-4 h-4 text-emerald-400/80" />
                    <span>No data leaves your device.</span>
                </div>
            </div>
        </div>
    );
};

export const SupportedFormats = () => {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Table2 className="w-5 h-5 text-blue-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-200">Formats</h3>
            </div>

            <div className="space-y-4">
                {/* Images */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-400/80 uppercase tracking-wider">
                        <FileImage className="w-3.5 h-3.5" />
                        Images
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-black/20 rounded px-2 py-1.5 text-xs text-gray-400 border border-white/5 text-center">PNG / JPG</div>
                        <div className="bg-black/20 rounded px-2 py-1.5 text-xs text-gray-400 border border-white/5 text-center">WebP</div>
                    </div>
                </div>

                {/* Video */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-purple-400/80 uppercase tracking-wider">
                        <FileVideo className="w-3.5 h-3.5" />
                        Video
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-black/20 rounded px-2 py-1.5 text-xs text-gray-400 border border-white/5 text-center">MP4 / MKV</div>
                        <div className="bg-black/20 rounded px-2 py-1.5 text-xs text-gray-400 border border-white/5 text-center">GIF / WebM</div>
                    </div>
                </div>

                {/* Docs */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400/80 uppercase tracking-wider">
                        <FileType className="w-3.5 h-3.5" />
                        Documents
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        <div className="bg-black/20 rounded px-2 py-1.5 text-xs text-gray-400 border border-white/5 text-center">
                            TXT → PDF
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
