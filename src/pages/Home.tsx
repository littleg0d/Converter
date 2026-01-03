import { Dropzone } from '../components/Dropzone';
import { ConversionList } from '../components/ConversionList';
import { SettingsPanel } from '../components/SettingsPanel';
import { HowItWorks, SupportedFormats } from '../components/SidebarInfo';

export const Home = () => {
    return (
        <div className="min-h-screen p-6 md:p-8 flex flex-col items-center">
            <SettingsPanel />

            <div className="w-full max-w-[1400px] flex-1 flex flex-col">
                {/* Header */}
                <header className="mb-10 text-center space-y-2">
                    <div className="relative inline-flex items-center justify-center p-1">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-violet-600 blur-[40px] opacity-40 rounded-full" />
                        <img
                            src="/logo.png"
                            alt="Universal Converter Logo"
                            className="relative w-16 h-16 rounded-xl shadow-2xl border border-white/10"
                        />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-white via-violet-200 to-indigo-400 tracking-tight">
                            Universal Local Converter
                        </h1>
                    </div>
                </header>

                {/* Grid Content */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Sidebar */}
                    <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-8 space-y-8 opacity-0 lg:opacity-100 animate-[fadeIn_0.5s_ease-out_0.2s_forwards]">
                        <HowItWorks />
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-6 space-y-12">
                        <Dropzone />
                        <ConversionList />
                    </main>

                    {/* Right Sidebar */}
                    <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-8 space-y-8 opacity-0 lg:opacity-100 animate-[fadeIn_0.5s_ease-out_0.4s_forwards]">
                        <SupportedFormats />
                    </aside>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-20 text-center space-y-2">
                <p className="text-xs text-gray-700 font-medium">© 2026 Federico Rojas. All rights reserved.</p>
            </footer>
        </div>
    );
};
