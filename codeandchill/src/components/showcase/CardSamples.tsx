import React from "react";
import { Code, Zap, Star, ArrowRight } from "lucide-react";

export function CardSamples() {
  const sampleData = {
    title: "Take Courses",
    description: "Learn new technologies with structured content",
    icon: Code,
    category: "Learn"
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Card Design Samples</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Sample 1: Minimal Dark */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">1. Minimal Dark</h3>
            <div className="bg-black border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-all duration-300 cursor-pointer min-h-[240px]">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-gray-900 border border-gray-700 rounded-full text-xs text-gray-300">
                    {sampleData.category}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-500 hover:text-gray-300 transition-colors" />
                </div>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gray-900 border border-gray-700 flex items-center justify-center">
                    <sampleData.icon className="w-8 h-8 text-blue-300" />
                  </div>
                </div>
                <div className="text-center space-y-3 flex-grow">
                  <h4 className="font-bold text-lg text-white">{sampleData.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{sampleData.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sample 2: Gradient Border */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">2. Gradient Border</h3>
            <div className="relative bg-black rounded-lg p-6 cursor-pointer min-h-[240px] group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-[1px] bg-black rounded-lg"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-full text-xs text-blue-300">
                    {sampleData.category}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-300 transition-colors" />
                </div>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 flex items-center justify-center">
                    <sampleData.icon className="w-8 h-8 text-blue-300" />
                  </div>
                </div>
                <div className="text-center space-y-3 flex-grow">
                  <h4 className="font-bold text-lg bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">{sampleData.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{sampleData.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sample 3: Subtle Glow */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">3. Subtle Glow</h3>
            <div className="bg-black border border-gray-800 rounded-lg p-6 hover:border-gray-600 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer min-h-[240px] group">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-gray-900 rounded-full text-xs text-gray-300 group-hover:text-blue-300 transition-colors">
                    {sampleData.category}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-300 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gray-900 border border-gray-700 flex items-center justify-center group-hover:border-blue-500/50 group-hover:shadow-md group-hover:shadow-blue-500/20 transition-all duration-300">
                    <sampleData.icon className="w-8 h-8 text-blue-300 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <div className="text-center space-y-3 flex-grow">
                  <h4 className="font-bold text-lg text-white group-hover:text-blue-100 transition-colors">{sampleData.title}</h4>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 leading-relaxed transition-colors">{sampleData.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sample 4: Glass Morphism */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">4. Glass Morphism</h3>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer min-h-[240px] group">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-gray-200">
                    {sampleData.category}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </div>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <sampleData.icon className="w-8 h-8 text-blue-300" />
                  </div>
                </div>
                <div className="text-center space-y-3 flex-grow">
                  <h4 className="font-bold text-lg text-white">{sampleData.title}</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{sampleData.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sample 5: Solid Dark with Accent */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">5. Solid Dark + Accent</h3>
            <div className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-all duration-300 cursor-pointer min-h-[240px] group border-l-4 border-blue-500">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                    {sampleData.category}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-300 transition-colors" />
                </div>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                    <sampleData.icon className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                <div className="text-center space-y-3 flex-grow">
                  <h4 className="font-bold text-lg text-white">{sampleData.title}</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{sampleData.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sample 6: Minimalist Flat */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">6. Minimalist Flat</h3>
            <div className="bg-gray-950 rounded-lg p-6 hover:bg-gray-900 transition-all duration-300 cursor-pointer min-h-[240px] group">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                    {sampleData.category}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                </div>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                    <sampleData.icon className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                <div className="text-center space-y-3 flex-grow">
                  <h4 className="font-bold text-lg text-white">{sampleData.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{sampleData.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sample 7: Outlined Style */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">7. Outlined Style</h3>
            <div className="bg-transparent border-2 border-gray-700 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-500/5 transition-all duration-300 cursor-pointer min-h-[240px] group">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 border border-gray-600 rounded-full text-xs text-gray-300 group-hover:border-blue-500 group-hover:text-blue-300 transition-all">
                    {sampleData.category}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                </div>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-xl border-2 border-gray-600 flex items-center justify-center group-hover:border-blue-500 transition-colors">
                    <sampleData.icon className="w-8 h-8 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                </div>
                <div className="text-center space-y-3 flex-grow">
                  <h4 className="font-bold text-lg text-white">{sampleData.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{sampleData.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sample 8: Elevated Shadow */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">8. Elevated Shadow</h3>
            <div className="bg-black rounded-lg p-6 shadow-xl shadow-black/50 hover:shadow-2xl hover:shadow-black/70 hover:-translate-y-2 transition-all duration-300 cursor-pointer min-h-[240px] group">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">
                    {sampleData.category}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                </div>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gray-800 flex items-center justify-center shadow-lg shadow-black/30">
                    <sampleData.icon className="w-8 h-8 text-blue-300" />
                  </div>
                </div>
                <div className="text-center space-y-3 flex-grow">
                  <h4 className="font-bold text-lg text-white">{sampleData.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{sampleData.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sample 9: Gradient Background */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">9. Gradient Background</h3>
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-gray-800 rounded-lg p-6 hover:from-gray-800 hover:via-gray-900 hover:to-gray-800 transition-all duration-300 cursor-pointer min-h-[240px] group">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-black/50 backdrop-blur-sm border border-gray-700 rounded-full text-xs text-gray-300">
                    {sampleData.category}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
                </div>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-xl bg-black/30 backdrop-blur-sm border border-gray-700 flex items-center justify-center">
                    <sampleData.icon className="w-8 h-8 text-blue-300" />
                  </div>
                </div>
                <div className="text-center space-y-3 flex-grow">
                  <h4 className="font-bold text-lg text-white">{sampleData.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{sampleData.description}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Second Row - More Samples */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">

          {/* Sample 10: Neumorphism Dark */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">10. Neumorphism Dark</h3>
            <div className="bg-gray-900 rounded-2xl p-6 cursor-pointer min-h-[240px] group" style={{
              boxShadow: 'inset 8px 8px 16px #0a0a0a, inset -8px -8px 16px #1a1a1a'
            }}>
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300" style={{
                    boxShadow: '4px 4px 8px #0a0a0a, -4px -4px 8px #1a1a1a'
                  }}>
                    {sampleData.category}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
                </div>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center" style={{
                    boxShadow: '6px 6px 12px #0a0a0a, -6px -6px 12px #1a1a1a'
                  }}>
                    <sampleData.icon className="w-8 h-8 text-blue-300" />
                  </div>
                </div>
                <div className="text-center space-y-3 flex-grow">
                  <h4 className="font-bold text-lg text-white">{sampleData.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{sampleData.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sample 11: Neon Outline */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">11. Neon Outline</h3>
            <div className="bg-black border-2 border-cyan-500/30 rounded-lg p-6 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 cursor-pointer min-h-[240px] group">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 border border-cyan-500/50 text-cyan-300 rounded-full text-xs font-medium">
                    {sampleData.category}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-300 transition-colors" />
                </div>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-xl border-2 border-cyan-500/50 flex items-center justify-center group-hover:border-cyan-400 group-hover:shadow-md group-hover:shadow-cyan-500/30 transition-all">
                    <sampleData.icon className="w-8 h-8 text-cyan-300" />
                  </div>
                </div>
                <div className="text-center space-y-3 flex-grow">
                  <h4 className="font-bold text-lg text-cyan-100">{sampleData.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{sampleData.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sample 12: Layered Depth */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">12. Layered Depth</h3>
            <div className="relative cursor-pointer min-h-[240px] group">
              <div className="absolute inset-0 bg-gray-800 rounded-lg transform translate-x-2 translate-y-2"></div>
              <div className="absolute inset-0 bg-gray-700 rounded-lg transform translate-x-1 translate-y-1"></div>
              <div className="relative bg-black border border-gray-600 rounded-lg p-6 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">
                      {sampleData.category}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-xl bg-gray-800 border border-gray-600 flex items-center justify-center">
                      <sampleData.icon className="w-8 h-8 text-blue-300" />
                    </div>
                  </div>
                  <div className="text-center space-y-3 flex-grow">
                    <h4 className="font-bold text-lg text-white">{sampleData.title}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{sampleData.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sample 13: Holographic */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">13. Holographic</h3>
            <div className="relative bg-black rounded-lg p-6 cursor-pointer min-h-[240px] group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-45deg from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-full text-xs text-purple-300">
                    {sampleData.category}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-purple-300 transition-colors" />
                </div>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/30 flex items-center justify-center">
                    <sampleData.icon className="w-8 h-8 text-purple-300" />
                  </div>
                </div>
                <div className="text-center space-y-3 flex-grow">
                  <h4 className="font-bold text-lg bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">{sampleData.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{sampleData.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sample 14: Retro Terminal */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">14. Retro Terminal</h3>
            <div className="bg-black border-2 border-green-500/50 rounded-none p-6 hover:border-green-400 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 cursor-pointer min-h-[240px] group font-mono">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs font-mono border border-green-500/50">
                    [{sampleData.category.toUpperCase()}]
                  </span>
                  <span className="text-green-400 text-xs">&gt;</span>
                </div>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 border-2 border-green-500/50 flex items-center justify-center bg-green-500/5">
                    <sampleData.icon className="w-8 h-8 text-green-400" />
                  </div>
                </div>
                <div className="text-center space-y-3 flex-grow">
                  <h4 className="font-bold text-lg text-green-300 font-mono">{sampleData.title}</h4>
                  <p className="text-sm text-green-400/80 leading-relaxed font-mono">{sampleData.description}</p>
                </div>
                <div className="mt-4 text-center">
                  <span className="text-green-500 text-xs font-mono animate-pulse">_</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sample 15: Brutalist */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">15. Brutalist</h3>
            <div className="bg-white text-black p-6 cursor-pointer min-h-[240px] group hover:bg-gray-100 transition-colors duration-300 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-black text-white text-xs font-bold uppercase">
                    {sampleData.category}
                  </span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </div>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-black flex items-center justify-center">
                    <sampleData.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-center space-y-3 flex-grow">
                  <h4 className="font-black text-xl uppercase">{sampleData.title}</h4>
                  <p className="text-sm font-bold leading-tight">{sampleData.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sample 16: Soft Rounded */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">16. Soft Rounded</h3>
            <div className="bg-gray-900 rounded-3xl p-6 hover:bg-gray-800 transition-all duration-300 cursor-pointer min-h-[240px] group shadow-2xl">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                    {sampleData.category}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-300 transition-colors" />
                </div>
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-blue-500/10 border-2 border-blue-500/30 flex items-center justify-center">
                    <sampleData.icon className="w-10 h-10 text-blue-300" />
                  </div>
                </div>
                <div className="text-center space-y-3 flex-grow">
                  <h4 className="font-bold text-xl text-white">{sampleData.title}</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{sampleData.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sample 17: Matrix Style */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">17. Matrix Style</h3>
            <div className="bg-black border border-green-400/30 rounded-lg p-6 hover:border-green-400 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 cursor-pointer min-h-[240px] group relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="text-green-400 text-xs font-mono leading-none">
                  01001000 01100101 01101100 01101100 01101111<br />
                  01010111 01101111 01110010 01101100 01100100<br />
                  01000011 01101111 01100100 01100101 01000011<br />
                </div>
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-green-500/20 border border-green-400/50 text-green-300 rounded text-xs font-mono">
                    {sampleData.category}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-green-300 transition-colors" />
                </div>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded bg-green-500/10 border border-green-400/50 flex items-center justify-center">
                    <sampleData.icon className="w-8 h-8 text-green-300" />
                  </div>
                </div>
                <div className="text-center space-y-3 flex-grow">
                  <h4 className="font-bold text-lg text-green-300 font-mono">{sampleData.title}</h4>
                  <p className="text-sm text-green-400/80 leading-relaxed">{sampleData.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sample 18: Cyberpunk */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">18. Cyberpunk</h3>
            <div className="relative bg-black rounded-lg p-6 cursor-pointer min-h-[240px] group overflow-hidden border border-pink-500/30">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-cyan-500/5"></div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-pink-500/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-cyan-500/20 to-transparent"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-pink-500/20 to-cyan-500/20 border border-pink-500/50 text-pink-300 rounded text-xs font-bold uppercase tracking-wider">
                    {sampleData.category}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-pink-300 transition-colors" />
                </div>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded bg-gradient-to-br from-pink-500/10 to-cyan-500/10 border border-pink-500/50 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-cyan-500/20 rounded animate-pulse"></div>
                    <sampleData.icon className="w-8 h-8 text-pink-300 relative z-10" />
                  </div>
                </div>
                <div className="text-center space-y-3 flex-grow">
                  <h4 className="font-bold text-lg bg-gradient-to-r from-pink-300 to-cyan-300 bg-clip-text text-transparent uppercase tracking-wide">{sampleData.title}</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{sampleData.description}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 text-lg">Choose your preferred card style (1-18) and I'll implement it across the project!</p>
        </div>
      </div>
    </div>
  );
}