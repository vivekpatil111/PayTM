import React, { useState, useEffect, useRef } from 'react';
import { Merchant, UnderwritingData, KnowledgeGraphData, TelemetryLog, SaarthiStep } from '../../types';
import { TraceEvent } from '../../lib/demoEngine';
import { MultiAgentTrace } from '../agent/MultiAgentTrace';
import { BrainCircuit, Activity, ShieldCheck, Landmark } from 'lucide-react';

interface WebUnderwriterPortalProps {
  merchant: Merchant;
  underwriting: UnderwritingData;
  knowledgeGraph: KnowledgeGraphData;
  telemetryLogs: TelemetryLog[];
  activeStep: SaarthiStep;
  traceEvents: TraceEvent[];
}

export const WebUnderwriterPortal: React.FC<WebUnderwriterPortalProps> = ({
  merchant,
  traceEvents
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom as new events arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [traceEvents]);

  return (
    <div className="flex-1 flex flex-col glass-panel overflow-hidden bg-[#0b1329]/95 text-slate-100 h-full font-mono text-sm relative">
      
      {/* Top Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-paytm-cyan/10 border border-paytm-cyan/30 flex items-center justify-center text-paytm-cyan">
            <BrainCircuit className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h2 className="font-bold text-white tracking-wider flex items-center gap-2">
              Saarthi Agent Live Trace
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-widest">
                LIVE
              </span>
            </h2>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Target Entity</p>
          <p className="text-xs text-paytm-cyan font-bold">{merchant?.businessName || 'Loading...'}</p>
        </div>
      </div>

      {/* Main Trace Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1.5 relative custom-scrollbar" ref={containerRef}>
        
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {traceEvents.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3 relative z-10">
            <Activity className="w-8 h-8 opacity-20" />
            <p className="text-xs uppercase tracking-widest opacity-60">Awaiting Agent Activation...</p>
          </div>
        ) : (
          <div className="relative z-10 pb-8">
            {traceEvents.map((event, index) => {
              
              // Formatting based on type
              if (event.type === 'header') {
                return (
                  <div key={event.id} className="mt-4 first:mt-0 animate-fadeIn">
                    <div className="flex items-center gap-2 text-white font-bold bg-slate-800/40 p-2 rounded border border-slate-700/50">
                      <span className="w-6 text-center">{event.icon}</span>
                      <span className="text-[10px] text-slate-400 w-12 shrink-0">[{event.timeOffset.toString().padStart(2, '0')}:00]</span>
                      <span>{event.message}</span>
                    </div>
                  </div>
                );
              }

              if (event.type === 'progress') {
                return (
                  <div key={event.id} className="flex flex-col ml-8 border-l-2 border-slate-800 pl-3 py-1.5 animate-fadeIn">
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="w-5 text-center">{event.icon}</span>
                      <span className="text-[10px] text-slate-500 w-12 shrink-0">[{event.timeOffset.toString().padStart(2, '0')}:00]</span>
                      <span className="flex-1">{event.message}</span>
                      <span className="text-emerald-400 font-bold w-10 text-right">{event.progress}%</span>
                    </div>
                    {event.progress !== undefined && (
                      <div className="mt-1.5 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden ml-[88px] max-w-[200px]">
                        <div 
                          className="h-full bg-gradient-to-r from-paytm-navy to-paytm-cyan rounded-full transition-all duration-1000"
                          style={{ width: `${event.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              }

              if (event.type === 'agent_trace') {
                return (
                  <div key={event.id} className="flex flex-col ml-8 border-l-2 border-slate-800 pl-3 py-1 animate-fadeIn">
                    <div className="flex items-start gap-2 text-blue-400">
                      <span className="w-5 text-center mt-0.5">{event.icon}</span>
                      <span className="text-[10px] text-slate-500 w-12 shrink-0 mt-0.5">[{event.timeOffset.toString().padStart(2, '0')}:00]</span>
                      <div className="flex-1">
                        <p>{event.message}</p>
                        <div className="mt-2">
                          <MultiAgentTrace traceIntent={event.traceIntent || null} isVisible={true} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              let colorClass = 'text-slate-300';
              if (event.type === 'success') colorClass = 'text-emerald-400';
              if (event.type === 'warning') colorClass = 'text-amber-400';
              
              return (
                <div key={event.id} className="flex flex-col ml-8 border-l-2 border-slate-800 pl-3 py-1 animate-fadeIn">
                  <div className={`flex items-start gap-2 ${colorClass}`}>
                    <span className="w-5 text-center mt-0.5">{event.icon}</span>
                    <span className="text-[10px] text-slate-500 w-12 shrink-0 mt-0.5">[{event.timeOffset.toString().padStart(2, '0')}:00]</span>
                    <div>
                      <p>{event.message}</p>
                      {event.detail && (
                        <p className="text-[10px] text-slate-500 mt-0.5">{event.detail}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Show total time and stats only if last event is fired */}
            {traceEvents.length > 0 && traceEvents[traceEvents.length - 1].timeOffset >= 25 && (
              <div className="mt-6 border-t border-slate-800 pt-4 animate-fadeIn">
                <div className="bg-slate-900 border border-slate-700/80 p-3 rounded flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span>⏱️</span>
                    <span className="text-slate-400 w-40">Total time:</span>
                    <span className="text-white font-bold">~60 seconds (simulated)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>👤</span>
                    <span className="text-slate-400 w-40">Human intervention:</span>
                    <span className="text-emerald-400 font-bold">Zero</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
