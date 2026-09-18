import React, { useState } from 'react';
import { Navbar } from '../common/Navbar';
import { WebUnderwriterPortal } from '../web/WebUnderwriterPortal';
import { TraceEvent } from '../../lib/demoEngine';
import { Merchant, UnderwritingProfile, KnowledgeGraph } from '../../types';
import { ComparisonSlide } from './ComparisonSlide';
import { SaarthiFormAgent } from '../form/SaarthiFormAgent';
import { FormAuditReport } from '../form/FormAuditReport';

// Mock Data for the initial view before the demo starts
const RAMESH_MERCHANT: Merchant = {
  merchantId: 'MERCH_JAIPUR_0821',
  name: 'Ramesh Kumar',
  businessName: 'Ramesh Kirana Store',
  category: 'Grocery',
  address: 'Shop 4, Main Market, Jaipur, Rajasthan',
  upiId: 'ramesh.kirana@paytm',
  walletBalance: 12450,
  joinedDate: '2021-08-14',
  cibilScore: 745,
  cibilStatus: 'GOOD',
  bankAccount: {
    bankName: 'State Bank of India',
    accountMasked: 'XXXX XXXX 3491',
    ifsc: 'SBIN0001234',
    verified: true
  },
  qrMetrics: {
    totalTransactions180d: 18450,
    avgMonthlyGmv: 420000,
    growthMoM: 12.4,
    uniquePayerRatio: 68,
    dailySettlements: 142,
    bouncedSettlements: 0,
    peakHours: '18:00 - 21:00',
    avgTicketSize: 340
  },
  activeLoan: null
};

const MOCK_UNDERWRITING: UnderwritingProfile = {
  merchantId: '',
  saarthiScore: 0,
  riskCategory: 'LOW',
  recommendedLimit: 0,
  maxLimit: 0,
  factors: []
};

const MOCK_GRAPH: KnowledgeGraph = {
  merchantId: '',
  nodes: [],
  edges: []
};

export const DemoPage: React.FC = () => {
  const [traceEvents, setTraceEvents] = useState<TraceEvent[]>([]);
  const [demoState, setDemoState] = useState<'FORM' | 'AUDIT'>('FORM');

  const handleEvent = (event: TraceEvent) => {
    setTraceEvents(prev => [...prev, event]);
  };

  const handleAuditComplete = () => {
    setDemoState('AUDIT');
  };

  const handleDisburse = async () => {
    // Call the real backend API to trigger N8N
    try {
      handleEvent({
        id: 'disburse_start',
        timeOffset: traceEvents.length,
        icon: 'zap',
        message: 'Triggering Disbursal Webhook...',
        type: 'header'
      });
      
      const response = await fetch('/api/disburse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantId: RAMESH_MERCHANT.merchantId, amount: 50000 })
      });
      
      if (response.ok) {
        handleEvent({
          id: 'disburse_success',
          timeOffset: traceEvents.length + 1,
          icon: 'check',
          message: 'Disbursal Webhook triggered successfully!',
          type: 'success'
        });
      } else {
        throw new Error('Disbursal API failed');
      }
    } catch (e) {
      handleEvent({
        id: 'disburse_error',
        timeOffset: traceEvents.length + 1,
        icon: 'x',
        message: 'Disbursal failed or webhook not configured.',
        type: 'warning'
      });
    }
  };

  const handleReset = () => {
    setTraceEvents([]);
    setDemoState('FORM');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Mini Navbar for Demo */}
      <nav className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-white font-black text-xl">Paytm Saarthi</span>
            <span className="bg-blue-600 text-[10px] font-bold text-white px-2 py-0.5 rounded ml-2 uppercase tracking-wider">
              AI Overlay Demo
            </span>
          </div>
          <button
            onClick={handleReset}
            className="text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg px-4 py-2 text-sm font-bold transition-all"
          >
            ↻ Reset Demo
          </button>
        </div>
      </nav>

      <div className="flex-1 max-w-7xl mx-auto w-full p-6">
        {/* The Pain vs Solution Slide */}
        <ComparisonSlide />

        <div className="flex gap-8 items-start justify-center h-full">
          {/* Left Side: Form / Audit */}
          <div className="w-[450px] shrink-0">
            {demoState === 'FORM' ? (
              <SaarthiFormAgent onEvent={handleEvent} onAuditComplete={handleAuditComplete} />
            ) : (
              <FormAuditReport onDisburse={handleDisburse} />
            )}
          </div>

          {/* Right Side: Live Trace Panel */}
          <div className="flex-1 min-w-0 h-[700px] rounded-2xl overflow-hidden border border-gray-700 bg-gray-900 shadow-2xl flex flex-col">
            <WebUnderwriterPortal
              merchant={RAMESH_MERCHANT}
              underwriting={MOCK_UNDERWRITING}
              knowledgeGraph={MOCK_GRAPH}
              telemetryLogs={[]} 
              activeStep="IDLE" // Keep idle to just show the trace log
              traceEvents={traceEvents}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
