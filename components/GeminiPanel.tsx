import React, { useState } from 'react';
import { Brain, Sparkles, Loader2 } from 'lucide-react';
import { generateDataInsight } from '../services/geminiService';

interface GeminiPanelProps {
  context: string;
  data: any;
}

export const GeminiPanel: React.FC<GeminiPanelProps> = ({ context, data }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await generateDataInsight({ context, dataSample: data });
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="bg-slate-900/50 border border-indigo-500/30 rounded-xl p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-indigo-400">
          <Brain size={20} />
          <span className="font-semibold">LISTIC AI Insights</span>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white rounded-lg transition-colors"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {loading ? 'Analyzing...' : 'Generate Report'}
        </button>
      </div>
      
      <div className="min-h-[60px] text-sm text-slate-300 leading-relaxed">
        {insight ? (
          <p className="animate-fadeIn">{insight}</p>
        ) : (
          <p className="text-slate-500 italic">Click "Generate Report" to analyze the current dataset using Gemini 2.5 Flash...</p>
        )}
      </div>
    </div>
  );
};