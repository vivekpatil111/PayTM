/**
 * Saarthi Knowledge Graph Provider Interface + Local Adapter
 *
 * Architecture: All knowledge-graph operations go through KnowledgeGraphProvider.
 * Current impl: LocalCogneeAdapter (DeepSeek-powered in-memory graph).
 * Future swap: Replace LocalCogneeAdapter with CogneeCloudAdapter (same interface).
 *
 * NOTE: Cognee cloud SDK (@cognee/cognee-ts) is intentionally disabled in this demo
 * to avoid cold-start latency and cloud dependency during live presentation.
 * The local adapter follows the EXACT same interface for a zero-friction swap.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. Typed Domain Objects
// ─────────────────────────────────────────────────────────────────────────────

export interface GraphNode {
  id: string;
  label: string;
  type: 'Merchant' | 'BusinessEntity' | 'FinancialDataSource' | 'CreditBureau' | 'IntelligenceEngine' | 'ConsentFramework' | 'NBFC_Partner' | 'ActiveLoan' | string;
  status: string;
  metadata?: Record<string, unknown>;
}

export interface GraphEdge {
  source: string;
  target: string;
  relation: 'OWNS' | 'STREAM_DATA' | 'BUREAU_LOOKUP' | 'FEEDS_ALTERNATIVE_METRICS' | 'TRIGGERS_AA_VERIFICATION' | 'ROUTES_UNDERWRITTEN_OFFER' | 'BORROWED' | string;
}

export interface GraphInsight {
  text: string;
  confidence?: number;
  source?: string;
}

export interface MerchantMemoryEvent {
  merchantId: string;
  text: string;
  eventType?: 'LOAN_REPAID' | 'LOAN_DEFAULTED' | 'LIMIT_UPGRADED' | 'KYC_VERIFIED' | 'POLICY_ISSUED' | string;
  timestamp?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. KnowledgeGraphProvider Interface  (the contract for any adapter)
// ─────────────────────────────────────────────────────────────────────────────

export interface KnowledgeGraphProvider {
  /** Persist a merchant event into the graph */
  remember(event: MerchantMemoryEvent): Promise<{ success: boolean; error?: string }>;

  /** Retrieve contextual insight for a merchant query */
  recall(merchantId: string, query: string): Promise<{ success: boolean; data?: string; error?: string }>;

  /** Add a graph node */
  addNode(node: GraphNode): void;

  /** Add a graph edge */
  addEdge(edge: GraphEdge): void;

  /** Get full graph snapshot */
  getGraph(): { nodes: GraphNode[]; edges: GraphEdge[]; insights: string[] };

  /** Provider name for telemetry/logging */
  readonly providerName: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. LocalCogneeAdapter — implements KnowledgeGraphProvider (current default)
// ─────────────────────────────────────────────────────────────────────────────

const DEMO_FALLBACKS: Record<string, string> = {
  'MERCH_JAIPUR_0821':
    'Ramesh previously repaid a ₹20,000 loan on time. Trust score upgraded to TIER_1. He is eligible for limit enhancement to ₹1,00,000 after 2 successful EMIs.',
  'MERCH_PUNE_0411':
    'First-time borrower. No previous credit history in the knowledge graph.',
  'MERCH_DELHI_1104':
    'Arjun had 1 missed EMI on a previous ₹15,000 loan but settled within 5 days. Risk flagged; current tier maintained at TIER_2.',
  'MERCH_MUMBAI_0512':
    'Priya is a first-time borrower with excellent GMV growth (+22%). High-trust candidate for Tier-1 fast-track offer.',
  'MERCH_HYDERABAD_0903':
    'Venkat has zero past loans. Strong transaction history qualifies him for unsecured limit up to ₹1,50,000 pending full KYC.',
  'MERCH_KOLKATA_0707':
    'Fatima has seasonal revenue spikes. Previous micro-loan of ₹8,000 partially settled. Monitor closely before new disbursement.',
};

export class LocalCogneeAdapter implements KnowledgeGraphProvider {
  readonly providerName = 'local-cognee-adapter';

  private memoryStore: Record<string, Array<{ text: string; timestamp: string; eventType?: string }>> = {};
  private nodes: GraphNode[] = [];
  private edges: GraphEdge[] = [];
  private insights: string[] = [];

  addNode(node: GraphNode): void {
    const exists = this.nodes.find(n => n.id === node.id);
    if (!exists) this.nodes.push(node);
    else Object.assign(exists, node);
  }

  addEdge(edge: GraphEdge): void {
    const exists = this.edges.find(e => e.source === edge.source && e.target === edge.target);
    if (!exists) this.edges.push(edge);
  }

  getGraph() {
    return { nodes: this.nodes, edges: this.edges, insights: this.insights };
  }

  async remember(event: MerchantMemoryEvent): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.memoryStore[event.merchantId]) {
        this.memoryStore[event.merchantId] = [];
      }
      this.memoryStore[event.merchantId].push({
        text: event.text,
        timestamp: event.timestamp || new Date().toISOString(),
        eventType: event.eventType,
      });
      console.log(`[LocalCogneeAdapter] Stored memory for ${event.merchantId}`);
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  }

  async recall(merchantId: string, _query: string): Promise<{ success: boolean; data?: string; error?: string }> {
    const entries = this.memoryStore[merchantId] || [];
    const data =
      entries.length > 0
        ? entries.map(e => e.text).join(' | ')
        : (DEMO_FALLBACKS[merchantId] ?? 'No prior history found for this merchant.');
    return { success: true, data };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SarvamAICogneeAdapter — REAL API implementation using Sarvam AI
// ─────────────────────────────────────────────────────────────────────────────

export class SarvamAICogneeAdapter implements KnowledgeGraphProvider {
  readonly providerName = 'sarvam-cognee-adapter';

  private memoryStore: Record<string, Array<{ text: string; timestamp: string; eventType?: string }>> = {};
  private nodes: GraphNode[] = [];
  private edges: GraphEdge[] = [];
  private insights: string[] = [];

  constructor(private sarvamApiKey: string) {}

  addNode(node: GraphNode): void {
    const exists = this.nodes.find(n => n.id === node.id);
    if (!exists) this.nodes.push(node);
    else Object.assign(exists, node);
  }

  addEdge(edge: GraphEdge): void {
    const exists = this.edges.find(e => e.source === edge.source && e.target === edge.target);
    if (!exists) this.edges.push(edge);
  }

  getGraph() {
    return { nodes: this.nodes, edges: this.edges, insights: this.insights };
  }

  async remember(event: MerchantMemoryEvent): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.memoryStore[event.merchantId]) this.memoryStore[event.merchantId] = [];
      this.memoryStore[event.merchantId].push({ text: event.text, timestamp: new Date().toISOString() });
      
      // Simulate Cognee Extraction by calling Sarvam AI API
      const prompt = `Extract knowledge graph nodes and edges from this event text: "${event.text}".
      Return ONLY a JSON object with this schema: 
      { "nodes": [ { "id": "...", "label": "...", "type": "Merchant|ActiveLoan|etc" } ], 
        "edges": [ { "source": "...", "target": "...", "relation": "..." } ] }`;

      const res = await fetch("https://api.sarvam.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.sarvamApiKey}`
        },
        body: JSON.stringify({
          model: "sarvam-instruct", 
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" }
        })
      });

      if (!res.ok) throw new Error("API call failed");
      const data = await res.json();
      const content = JSON.parse(data.choices[0].message.content);

      if (content.nodes) content.nodes.forEach((n: any) => this.addNode(n));
      if (content.edges) content.edges.forEach((e: any) => this.addEdge(e));

      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: String(err) };
    }
  }

  async recall(merchantId: string, query: string): Promise<{ success: boolean; data?: string; error?: string }> {
    const entries = this.memoryStore[merchantId] || [];
    return { success: true, data: entries.length > 0 ? entries.map(e => e.text).join(' | ') : DEMO_FALLBACKS[merchantId] };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CogneeCloudAdapter — OFFICIAL integration sending data to Cognee Cloud Dashboard
// ─────────────────────────────────────────────────────────────────────────────

export class CogneeCloudAdapter implements KnowledgeGraphProvider {
  readonly providerName = 'cognee-cloud-adapter';
  
  // We keep local state so the UI graph still renders immediately without waiting for long polling
  private memoryStore: Record<string, Array<{ text: string; timestamp: string; eventType?: string }>> = {};
  private nodes: GraphNode[] = [];
  private edges: GraphEdge[] = [];
  private insights: string[] = [];

  constructor(private baseUrl: string, private apiKey: string) {}

  addNode(node: GraphNode): void {
    const exists = this.nodes.find(n => n.id === node.id);
    if (!exists) this.nodes.push(node);
    else Object.assign(exists, node);
  }

  addEdge(edge: GraphEdge): void {
    const exists = this.edges.find(e => e.source === edge.source && e.target === edge.target);
    if (!exists) this.edges.push(edge);
  }

  getGraph() {
    return { nodes: this.nodes, edges: this.edges, insights: this.insights };
  }

  async remember(event: MerchantMemoryEvent): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.memoryStore[event.merchantId]) this.memoryStore[event.merchantId] = [];
      this.memoryStore[event.merchantId].push({ text: event.text, timestamp: new Date().toISOString() });
      
      // FIRE AND FORGET to Cognee Cloud API
      const sessionId = `saarthi_${event.merchantId}`;
      const payload = {
        entry: {
          type: "qa",
          question: `What action occurred on Merchant Account ${event.merchantId}?`,
          answer: `Event Category: [${(event.eventType || "System Action").toUpperCase()}]. Detail: ${event.text}`
        },
        dataset_name: "default_dataset",
        session_id: sessionId
      };

      await fetch(`${this.baseUrl}/api/v1/remember/entry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": this.apiKey
        },
        body: JSON.stringify(payload)
      });
      
      console.log(`[CogneeCloudAdapter] Pushed event to Cognee Cloud for session: ${sessionId}`);
      return { success: true };
    } catch (err: unknown) {
      console.error("[CogneeCloudAdapter] API Error:", err);
      return { success: false, error: String(err) };
    }
  }

  async recall(merchantId: string, query: string): Promise<{ success: boolean; data?: string; error?: string }> {
    // For demo speed, we still recall from local mock to prevent UI freezing
    const entries = this.memoryStore[merchantId] || [];
    return { success: true, data: entries.length > 0 ? entries.map(e => e.text).join(' | ') : DEMO_FALLBACKS[merchantId] };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Singleton export 
// ─────────────────────────────────────────────────────────────────────────────

// Defaulting to the REAL Cognee Cloud Adapter for your live demo!
const COGNEE_URL = import.meta.env.VITE_COGNEE_BASE_URL || "https://tenant-99db83b7-f6e8-4d7c-8b64-6090e00af512.aws.cognee.ai";
const COGNEE_KEY = import.meta.env.VITE_COGNEE_API_KEY || "e19d0b2f4108a59b44a08febef92f43d82438a291a4559fa80d9415790b5f37d";

export const knowledgeGraph: KnowledgeGraphProvider = new CogneeCloudAdapter(COGNEE_URL, COGNEE_KEY);

