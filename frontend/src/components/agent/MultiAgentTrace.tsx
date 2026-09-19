import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, ArrowRight, BrainCircuit, FileSearch, Banknote, History, Zap } from 'lucide-react';

interface MultiAgentTraceProps {
  traceIntent: string | null;
  isVisible: boolean;
}

export const MultiAgentTrace: React.FC<MultiAgentTraceProps> = ({ traceIntent, isVisible }) => {
  if (!isVisible) return null;

  const agentIcons: Record<string, React.ReactNode> = {
    'FORM_ASSISTANCE': <FileSearch className="w-4 h-4 text-blue-400" />,
    'UNDERWRITING': <Banknote className="w-4 h-4 text-green-400" />,
    'MEMORY': <History className="w-4 h-4 text-purple-400" />,
    'GENERAL': <Zap className="w-4 h-4 text-yellow-400" />,
    'FALLBACK': <Zap className="w-4 h-4 text-red-400" />
  };

  const agentDesc: Record<string, string> = {
    'FORM_ASSISTANCE': 'Form Assistant (Resolving UI/Mismatches)',
    'UNDERWRITING': 'Underwriting Expert (Calculating Eligibility & EMI)',
    'MEMORY': 'Memory Agent (Querying Cognee KG)',
    'GENERAL': 'General Assistant (Routing/Greeting)',
    'FALLBACK': 'Deterministic Fallback Engine (API limits reached)'
  };

  const intent = traceIntent?.replace('mas-langgraph-', '') || 'FALLBACK';
  
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mt-2 text-xs font-mono bg-black/60 backdrop-blur-md text-gray-300 p-3 rounded-lg border border-white/10"
      >
        <div className="flex items-center gap-2 mb-2 text-white font-semibold">
          <BrainCircuit className="w-4 h-4 text-blue-500" />
          Saarthi Multi-Agent System (LangGraph)
        </div>
        
        <div className="flex flex-col gap-1.5 pl-2 border-l border-white/20 ml-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">├─</span>
            <Network className="w-3 h-3 text-pink-400" />
            <span className="text-pink-300">ROUTER AGENT:</span>
            <span>Detecting Intent...</span>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2"
          >
            <span className="text-gray-500">├─</span>
            <ArrowRight className="w-3 h-3" />
            <span>Routed to:</span>
            <span className="font-bold text-white flex items-center gap-1">
              {agentIcons[intent] || agentIcons['GENERAL']}
              {intent}
            </span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="flex items-center gap-2"
          >
            <span className="text-gray-500">├─</span>
            {agentIcons[intent] || agentIcons['GENERAL']}
            <span className="text-gray-300">{agentDesc[intent] || agentDesc['GENERAL']}</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5 }}
            className="flex items-center gap-2"
          >
            <span className="text-gray-500">└─</span>
            <span className="text-green-400">✅</span>
            <span>Final Reply Generated</span>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
