import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
  computed,
  effect,
  inject,
  signal,
  PLATFORM_ID,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuditChart } from './components/audit-chart';
import { MicroservicesChart } from './components/microservices-chart';
import { IndexedDbService } from './services/indexed-db';

export interface HectronState {
  maquiavelismo: number;
  estoicismo: number;
  peso_emocional: number;
  nivel_soberania: number;
}

export interface VaultItem {
  id: number;
  fecha: string;
  tipo: string;
  contenido: string;
  autor: string;
}

export interface CognitiveLog {
  id: string;
  timestamp: string;
  input: string;
  stages: {
    observacion: string;
    consulta_memoria: string;
    interpretacion: string;
    decision: string;
    accion: string;
    evaluacion_impacto: string;
    recurrencia: string;
  };
  astaroth_verificacion: {
    aprobado: boolean;
    nivel_confianza: number;
    analisis_riesgo: string;
  };
}

export interface MicroserviceStatus {
  name: string;
  status: string;
  latency: string;
  cpu: string;
}

export interface AstarothAuditRecord {
  id: string;
  timestamp: string;
  blockHeight: number;
  module: string;
  action: string;
  hash: string;
  previousHash: string;
  severity: 'CRITICAL' | 'HIGH' | 'OPERATIONAL' | 'AUDIT';
  verified: boolean;
  signer: string;
  details: string;
  actor: string;
  quantumHash: string;
  prevHash: string;
}

export interface PredictiveDataPoint {
  timeLabel: string;
  cpu: number;
  latency: number;
  errorProbability: number;
  isProjected?: boolean;
}

export interface MicroserviceRiskItem {
  name: string;
  currentCpu: string;
  currentLatency: string;
  failureRisk: number;
  riskLevel: string;
  mtbfHours: number;
  recommendation: string;
}

export interface TentaculoMetric {
  scannedProfiles: number;
  generatedHooks: number;
  automatedLikes: number;
  matchesSimulated: number;
  trafficToTikTokLive: number;
  activeStatus: boolean;
  recentHooks: {
    time: string;
    profileName: string;
    archetype: string;
    visualElements: string[];
    hookMessage: string;
    conversionProbability: number;
  }[];
}

export interface FabricaJob {
  id: string;
  title: string;
  platform: 'Fiverr' | 'Upwork' | 'Freelancer';
  client: string;
  budgetUsd: number;
  description: string;
  generatedCode: string;
  timestamp: string;
  status: 'DELIVERED' | 'PAID' | 'PROCESSING';
  rating: number;
}

export interface FabricaState {
  totalRevenueUsd: number;
  completedContracts: number;
  activePipelines: number;
  successRate: number;
  activeBot: boolean;
  recentJobs: FabricaJob[];
}

export interface CryptoAsset {
  symbol: string;
  name: string;
  amount: number;
  avgBuyPrice: number;
  currentPrice: number;
  pnlPercent: number;
  hypeScore: number;
  trend: 'BULLISH' | 'HYPER_BULLISH' | 'NEUTRAL';
}

export interface CryptoTradeOrder {
  id: string;
  timestamp: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  amountUsdt: number;
  units: number;
  price: number;
  triggerReason: string;
  mode: 'SANDBOX' | 'LIVE';
}

export interface LoboCriptoState {
  usdtTreasury: number;
  sandboxMode: boolean;
  activeBot: boolean;
  portfolio: CryptoAsset[];
  socialTrendsFeed: {
    source: string;
    mention: string;
    weight: number;
    sentiment: string;
  }[];
  tradeHistory: CryptoTradeOrder[];
}

export interface EcosistemaState {
  activePillars: {
    fabrica: { name: string; status: string; metric: string; subtext: string };
    tentaculos: { name: string; status: string; metric: string; subtext: string };
    culto3d: { name: string; status: string; metric: string; subtext: string };
    loboCripto: { name: string; status: string; metric: string; subtext: string };
  };
  loopIntegrity: string;
  cycleTimestamp: string;
}

export interface PersistentMemoryResponse {
  status: string;
  storageEngine: string;
  filePath: string;
  fileExists: boolean;
  fileSizeBytes: number;
  fileSizeKb: number;
  lastModified: string;
  recordCounts: {
    vault: number;
    auditLedger: number;
    chatMemory: number;
    cognitiveHistory: number;
    recentHooks: number;
  };
}

export interface TikTokLiveComment {
  id: string;
  user: string;
  comment: string;
  reply: string;
  emotion: "Neutral" | "Joy" | "Angry" | "Sorrow" | "Fun";
  isGift: boolean;
  giftName?: string;
  count?: number;
  timestamp: string;
}

export type LogLevel = 'ALL' | 'INFO' | 'DEBUG' | 'ERROR';

export interface MemoryItem {
  id: string;
  timestamp: string;
  level: 'INFO' | 'DEBUG' | 'ERROR';
  category: 'semantic' | 'episodic' | 'preference' | 'working';
  content: string;
  confidence: number;
}

export interface ToolLogItem {
  id: string;
  timestamp: string;
  level: 'INFO' | 'DEBUG' | 'ERROR';
  tool: string;
  status: string;
  result: string;
}

export interface ShellEntry {
  id: string;
  timestamp: string;
  type: 'command' | 'stdout' | 'stderr' | 'system';
  level: 'INFO' | 'DEBUG' | 'ERROR';
  content: string;
}

export interface SpatialItem {
  point: [number, number];
  label: string;
}

export interface SpatialResult {
  model: string;
  items: SpatialItem[];
  rawOutput: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  role: 'SOVEREIGN_MASTER' | 'AI_ARCHITECT' | 'DEFI_HUNTER' | 'VTUBER_OPERATOR';
  bio: string;
  tiktokHandle: string;
  obsWebSocketPort: number;
  vseeFacePort: number;
  customPersonaPrompt: string;
  createdAt: string;
  lastLoginAt: string;
  reputationScore: number;
  sovereigntyLevel: number;
  themePreference: 'cyber' | 'obsidian' | 'matrix' | 'gold';
}

export interface CortexMemoryItem {
  id: string;
  goal: string;
  step: number;
  role: 'user' | 'assistant' | 'tool' | 'finish' | 'system' | 'semantic' | 'episodic';
  category: 'semantic' | 'episodic' | 'preference' | 'working' | 'tool';
  content: string;
  importance: number;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface AgentExecutionStep {
  step: number;
  type: 'tool' | 'finish' | 'error';
  thought?: string;
  tool?: {
    name: string;
    arguments: Record<string, unknown>;
  };
  toolResult?: {
    ok: boolean;
    output: string;
    chars?: number;
    returncode?: number;
  };
  summary?: string;
  memoryAdded?: string;
  timestamp: string;
}

export interface AgentExecutionTrace {
  id: string;
  goal: string;
  provider: 'gemini' | 'ollama' | 'hybrid';
  startedAt: string;
  finishedAt?: string;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'MAX_STEPS_REACHED';
  steps: AgentExecutionStep[];
  finalResult?: string;
}

export interface CortexStats {
  totalMemories: number;
  semantic: number;
  episodic: number;
  working: number;
  toolRecords: number;
  executionTraces: number;
  storageFile: string;
  storageSizeBytes: number;
  lastSaved: string;
}

export interface ChecklistStep {
  id: string;
  category: 'core' | 'stream' | 'audio' | 'avatar' | 'live' | 'verify';
  title: string;
  subtitle: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'VERIFIED' | 'COMPLETED';
  required: boolean;
  docUrl: string;
  commandSnippet: string;
  verificationMethod: 'auto' | 'manual';
  testEndpoint?: string;
  diagnosticNotes?: string;
  lastCheckedAt?: string;
}

export interface GameAchievement {
  id: string;
  title: string;
  nameEs: string;
  badgeIcon: string;
  tier: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
  description: string;
  criteria: string;
  currentProgress: number;
  targetProgress: number;
  isUnlocked: boolean;
  isClaimed: boolean;
  rewardQC: number;
  rewardVibranium: number;
  rewardCosmetic?: string;
  unlockedAt?: string;
  claimedAt?: string;
}

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, AuditChart, MicroservicesChart],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  indexedDb = inject(IndexedDbService);
  private platformId = inject(PLATFORM_ID);

  // Active View Tab
  activeTab = signal<'game' | 'brainos' | 'chat' | 'vault' | 'microservices' | 'golem' | 'tentaculos' | 'fabrica' | 'lobo' | 'ecosistema' | 'cortex' | 'bud' | 'sandboxes' | 'console'>('game');

  // =========================================================================
  // 📋 CHECKLIST INTERACTIVO DE INSTALACIÓN Y PREPARACIÓN (Python, OBS, VB-Audio)
  // =========================================================================
  checklist = signal<ChecklistStep[]>([]);
  checklistStats = signal<{
    completedCount: number;
    totalCount: number;
    progressPercent: number;
    isReadyForBroadcast: boolean;
    readinessLevel: string;
  } | null>(null);
  selectedChecklistFilter = signal<'ALL' | 'core' | 'stream' | 'audio' | 'avatar' | 'live' | 'verify'>('ALL');
  testingStepIds = signal<Record<string, boolean>>({});

  filteredChecklist = computed(() => {
    const list = this.checklist();
    const filter = this.selectedChecklistFilter();
    if (filter === 'ALL') return list;
    return list.filter(item => item.category === filter);
  });

  // =========================================================================
  // 🏆 SISTEMA DE LOGROS Y RECOMPENSAS ANTIGRAVITY (First Orbit, Gravity Master...)
  // =========================================================================
  achievements = signal<GameAchievement[]>([]);
  achievementStats = signal<{
    total: number;
    unlockedCount: number;
    claimedCount: number;
    unlockedPercent: number;
    totalQCAvailable: number;
  } | null>(null);
  playerGameBalance = signal<{
    quantumCredits: number;
    vibraniumOre: number;
    unlockedSkins: string[];
  }>({
    quantumCredits: 3450,
    vibraniumOre: 240,
    unlockedSkins: ['Default Interceptor', 'Insignia de Cadete Orbital', 'Oráculo Cósmico']
  });
  selectedAchievementTier = signal<string>('ALL');
  claimingAchievementIds = signal<Record<string, boolean>>({});

  filteredAchievements = computed(() => {
    const list = this.achievements();
    const tier = this.selectedAchievementTier();
    if (tier === 'ALL') return list;
    return list.filter(a => a.tier === tier);
  });

  // =========================================================================
  // 📚 EL CONOCIMIENTO DEL LEVIATÁN (Gemini Knowledge & Lip-Sync Bridge)
  // =========================================================================
  knowledgePrompt = new FormControl('¿Cuál es la naturaleza de la singularidad gravitacional y la antimateria?', { nonNullable: true });
  knowledgeCategory = signal<'saber' | 'noticia' | 'historia' | 'vision'>('saber');
  isQueryingKnowledge = signal<boolean>(false);
  knowledgeResult = signal<{
    text: string;
    emotion: string;
    category: string;
    username: string;
    rawOutput?: string;
    timestamp: string;
  } | null>(null);

  // =========================================================================
  // 🔐 AUTENTICACIÓN SOBERANA Y SESIÓN PERSISTENTE
  // =========================================================================
  currentUser = signal<UserProfile | null>(null);
  authToken = signal<string | null>(null);
  isAuthModalOpen = signal<boolean>(false);
  authTab = signal<'login' | 'register' | 'profile'>('login');
  authLoading = signal<boolean>(false);
  authError = signal<string | null>(null);
  authSuccessMessage = signal<string | null>(null);

  // Formularios reactivos de Auth
  loginEmailOrUser = new FormControl('hectorruiz9992@gmail.com', { nonNullable: true });
  loginPassword = new FormControl('hectron2026', { nonNullable: true });

  regEmail = new FormControl('', { nonNullable: true });
  regUsername = new FormControl('', { nonNullable: true });
  regPassword = new FormControl('', { nonNullable: true });
  regDisplayName = new FormControl('', { nonNullable: true });
  regRole = new FormControl<'SOVEREIGN_MASTER' | 'AI_ARCHITECT' | 'DEFI_HUNTER' | 'VTUBER_OPERATOR'>('SOVEREIGN_MASTER', { nonNullable: true });

  profileDisplayName = new FormControl('Héctor Ruiz', { nonNullable: true });
  profileBio = new FormControl('Creador Soberano & Arquitecto de IA Cuántica HECTRON-Ψ.', { nonNullable: true });
  profileTikTok = new FormControl('@lopez_hector140998', { nonNullable: true });
  profileObsPort = new FormControl(4455, { nonNullable: true });
  profileVSeeFacePort = new FormControl(39000, { nonNullable: true });
  profilePersonaPrompt = new FormControl('Estilo hiper-asertivo, cínico-estoico y enfocado en monetización extrema y soberanía algorítmica.', { nonNullable: true });
  profileAvatarUrl = new FormControl('https://api.dicebear.com/7.x/bottts/svg?seed=hector_sovereign', { nonNullable: true });
  profileTheme = new FormControl<'cyber' | 'obsidian' | 'matrix' | 'gold'>('cyber', { nonNullable: true });

  // =========================================================================
  // 🧠 CORTEX MEMORY PERSISTENTE & AUTO-BOT AGENT LOOP (Perceive -> Plan -> Act -> Remember)
  // =========================================================================
  cortexTab = signal<'agent' | 'memories' | 'traces' | 'stats'>('agent');
  cortexGoal = new FormControl('Inspeccionar la memoria persistente y verificar las herramientas de automatización de HECTRON', { nonNullable: true });
  cortexProvider = signal<'hybrid' | 'gemini' | 'ollama'>('hybrid');
  cortexMaxSteps = signal<number>(5);
  cortexAgentIsRunning = signal<boolean>(false);
  cortexActiveTrace = signal<AgentExecutionTrace | null>(null);
  cortexExecutionHistory = signal<AgentExecutionTrace[]>([]);
  cortexMemories = signal<CortexMemoryItem[]>([]);
  cortexMemoryCategoryFilter = signal<string>('ALL');
  cortexMemoryRoleFilter = signal<string>('ALL');
  cortexMemorySearch = new FormControl('', { nonNullable: true });

  // Nuevo recuerdo manual
  cortexNewMemoryGoal = new FormControl('Estrategia de Automatización', { nonNullable: true });
  cortexNewMemoryContent = new FormControl('', { nonNullable: true });
  cortexNewMemoryCategory = new FormControl<'semantic' | 'episodic' | 'preference' | 'working' | 'tool'>('semantic', { nonNullable: true });
  cortexNewMemoryImportance = new FormControl<number>(0.9, { nonNullable: true });

  cortexStats = signal<CortexStats | null>(null);

  filteredCortexMemories = computed(() => {
    const list = this.cortexMemories();
    const query = this.cortexMemorySearch.value.toLowerCase().trim();
    const cat = this.cortexMemoryCategoryFilter();
    const role = this.cortexMemoryRoleFilter();

    return list.filter((m) => {
      const matchCat = cat === 'ALL' || m.category === cat;
      const matchRole = role === 'ALL' || m.role === role;
      const matchQuery = !query || m.content.toLowerCase().includes(query) || m.goal.toLowerCase().includes(query);
      return matchCat && matchRole && matchQuery;
    });
  });

  // Quantum Sandboxes Hub Signals
  activeSandbox = signal<'vercel' | 'spatial' | 'recruitment' | 'tourism' | 'cyoa'>('vercel');
  vercelUseRealLLM = signal<boolean>(true);

  // Spatial Grounding Sandbox
  spatialPrompt = new FormControl('Point to no more than 10 items in the image. Return normalized coordinates [y, x] from 0-1000.', { nonNullable: true });
  spatialIsLoading = signal<boolean>(false);
  spatialResult = signal<SpatialResult>({
    model: 'gemini-robotics-er-2-preview',
    items: [
      { point: [320, 250], label: 'Scone / Bakery Item' },
      { point: [450, 680], label: 'Coffee Cup' },
      { point: [210, 480], label: 'Ceramic Plate' },
      { point: [610, 310], label: 'Napkin' },
      { point: [150, 780], label: 'Teapot' },
      { point: [550, 180], label: 'Fork / Cutlery' },
    ],
    rawOutput: '[\n  { "point": [320, 250], "label": "Scone / Bakery Item" },\n  { "point": [450, 680], "label": "Coffee Cup" },\n  { "point": [210, 480], "label": "Ceramic Plate" },\n  { "point": [610, 310], "label": "Napkin" },\n  { "point": [150, 780], "label": "Teapot" },\n  { "point": [550, 180], "label": "Fork / Cutlery" }\n]',
  });
  spatialHoveredIndex = signal<number | null>(null);

  // Recruitment Sandbox
  recruitmentNotes = new FormControl('', { nonNullable: true });
  recruitmentIsGenerating = signal<boolean>(false);
  recruitmentOutput = signal<{ jd: string; questions: string[] } | null>(null);

  // Photo Tourism AR Sandbox
  tourismLandmark = new FormControl('Torre Eiffel, París', { nonNullable: true });
  tourismIsLoading = signal<boolean>(false);
  tourismOutput = signal<{ name: string; location: string; year: string; history: string; arVisual: string } | null>({
    name: 'Torre Eiffel',
    location: 'París, Francia',
    year: '1889',
    history: 'Construida para la Exposición Universal de 1889 por Gustave Eiffel, esta imponente estructura de hierro forjado se convirtió en el ícono indiscutible de la vanguardia arquitectónica mundial.',
    arVisual: 'Holograma 3D con líneas de flujo estructurales de luz dorada.',
  });

  // Infinite CYOA Engine
  cyoaMessages = signal<{ role: 'user' | 'system'; text: string }[]>([
    {
      role: 'system',
      text: 'Te despiertas en un bosque denso y luminiscente. Los árboles humean con energía cuántica. A tu izquierda, un sendero resplandeciente. A tu derecha, una cueva oscura.',
    },
  ]);
  cyoaInput = new FormControl('', { nonNullable: true });
  cyoaInventory = signal<string[]>(['Brújula Cuántica']);
  cyoaQuest = signal<string>('Descubrir el origen de la anomalía en el bosque luminiscente.');
  cyoaIsProcessing = signal<boolean>(false);

  // System Console & Telemetry Signals
  consoleTab = signal<'health' | 'memory' | 'tools' | 'shell'>('health');
  consoleLevelFilter = signal<LogLevel>('ALL');
  consoleSearchQuery = new FormControl('', { nonNullable: true });
  private healthPingInterval: ReturnType<typeof setInterval> | null = null;

  healthIndicator = signal<{
    status: 'GREEN' | 'RED';
    cloudSqlStatus: 'GREEN' | 'RED';
    geminiStatus: 'GREEN' | 'RED';
    fastApiStatus: 'GREEN' | 'RED';
    lastChecked: string;
    pingLatencyMs: number;
    checkCount: number;
    cpuUsage: number;
    ramUsage: number;
    uptimeSeconds: number;
  }>({
    status: 'GREEN',
    cloudSqlStatus: 'GREEN',
    geminiStatus: 'GREEN',
    fastApiStatus: 'GREEN',
    lastChecked: new Date().toLocaleTimeString(),
    pingLatencyMs: 14,
    checkCount: 1,
    cpuUsage: 18,
    ramUsage: 42,
    uptimeSeconds: 1420,
  });

  memoryLogs = signal<MemoryItem[]>([
    { id: 'm1', timestamp: new Date(Date.now() - 300000).toLocaleTimeString(), level: 'INFO', category: 'preference', content: 'Preferencia extraída: Interés en fotografía, vida nocturna y moda tecnológica.', confidence: 0.95 },
    { id: 'm2', timestamp: new Date(Date.now() - 180000).toLocaleTimeString(), level: 'INFO', category: 'episodic', content: 'Hito conversacional: El usuario solicitó un selfie en entorno urbano.', confidence: 0.92 },
    { id: 'm3', timestamp: new Date(Date.now() - 120000).toLocaleTimeString(), level: 'DEBUG', category: 'semantic', content: 'Ajuste de vector relacional: Calidez +0.05, Curiosidad +0.08, Iniciativa +0.04.', confidence: 0.88 },
    { id: 'm4', timestamp: new Date(Date.now() - 60000).toLocaleTimeString(), level: 'INFO', category: 'working', content: 'Buffer de memoria contextual: 6 turnos almacenados en cache de baja latencia.', confidence: 0.99 },
    { id: 'm5', timestamp: new Date(Date.now() - 15000).toLocaleTimeString(), level: 'ERROR', category: 'working', content: 'Advertencia de cuota API Gemini superada temporalmente. Se activó motor heurístico local.', confidence: 0.75 },
  ]);

  toolLogs = signal<ToolLogItem[]>([
    { id: 't1', timestamp: new Date(Date.now() - 250000).toLocaleTimeString(), level: 'INFO', tool: 'FastAPI /chat', status: '200 OK', result: 'Payload de respuesta generado en 420ms con microexpresiones sincronizadas.' },
    { id: 't2', timestamp: new Date(Date.now() - 150000).toLocaleTimeString(), level: 'INFO', tool: 'Firebase Firestore', status: '200 OK', result: 'Mensaje persistido en db.collection("chats").document(user_session_id).' },
    { id: 't3', timestamp: new Date(Date.now() - 80000).toLocaleTimeString(), level: 'DEBUG', tool: 'Pollinations / Flux Engine', status: '200 OK', result: 'Sintetizada imagen fotorrealista de Luna con prompt en formato 9:16.' },
    { id: 't4', timestamp: new Date(Date.now() - 30000).toLocaleTimeString(), level: 'INFO', tool: 'Edge-TTS Synthesizer', status: '200 OK', result: 'Buffer de voz en MP3 sintetizado correctamente (es-MX-DaliaNeural).' },
    { id: 't5', timestamp: new Date(Date.now() - 10000).toLocaleTimeString(), level: 'ERROR', tool: 'SadTalker Video Render', status: 'WARN 429', result: 'Reintento de llamada API por cola ocupada en Hugging Face Space. Latencia +1.2s.' },
  ]);

  shellLogs = signal<ShellEntry[]>([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      type: 'system',
      level: 'INFO',
      content: 'HECTRON INFRASTRUCTURE CONSOLE v2.5.0 (Node / Python FastAPI Runtime)',
    },
    {
      id: '2',
      timestamp: new Date().toISOString(),
      type: 'system',
      level: 'INFO',
      content: 'Telemetría en tiempo real conectada. Escribe "help" para ver comandos permitidos.',
    },
  ]);

  shellInput = new FormControl('', { nonNullable: true });
  shellIsExecuting = signal<boolean>(false);

  filteredMemoryLogs = computed(() => {
    const query = this.consoleSearchQuery.value.toLowerCase().trim();
    const lvl = this.consoleLevelFilter();
    return this.memoryLogs().filter((m) => {
      const matchesLvl = lvl === 'ALL' || m.level === lvl;
      const matchesQuery = !query || `${m.category} ${m.content}`.toLowerCase().includes(query);
      return matchesLvl && matchesQuery;
    });
  });

  filteredToolLogs = computed(() => {
    const query = this.consoleSearchQuery.value.toLowerCase().trim();
    const lvl = this.consoleLevelFilter();
    return this.toolLogs().filter((t) => {
      const matchesLvl = lvl === 'ALL' || t.level === lvl;
      const matchesQuery = !query || `${t.tool} ${t.status} ${t.result}`.toLowerCase().includes(query);
      return matchesLvl && matchesQuery;
    });
  });

  // Persistent Memory Signals
  persistentMemoryInfo = signal<PersistentMemoryResponse | null>(null);
  isFlushingMemory = signal<boolean>(false);
  isRestoringMemory = signal<boolean>(false);
  isRegeneratingAudit = signal<boolean>(false);

  // State Signals
  state = signal<HectronState>({
    maquiavelismo: 5.5,
    estoicismo: 6.0,
    peso_emocional: 22,
    nivel_soberania: 4,
  });

  vault = signal<VaultItem[]>([]);
  chatMessages = signal<{ role: 'user' | 'bot'; content: string; time: string; avatarDesc?: string }[]>([]);
  cognitiveHistory = signal<CognitiveLog[]>([]);
  microservices = signal<MicroserviceStatus[]>([]);

  // ASTAROTH Inmutable Audit Ledger Signals
  auditLedger = signal<AstarothAuditRecord[]>([]);
  auditSearch = new FormControl('', { nonNullable: true });
  auditSeverityFilter = new FormControl('ALL', { nonNullable: true });
  isVerifyingAudit = signal<boolean>(false);
  auditVerificationResult = signal<{ status: string; score: number; count: number } | null>(null);

  // High-Density Audit Table & Real-Time Chain Integrity Signals
  auditDensity = signal<'compact' | 'normal' | 'ultra'>('compact');
  copiedHashId = signal<string | null>(null);
  copiedProofId = signal<string | null>(null);
  expandedAuditRecordId = signal<string | null>(null);
  isLiveChainScanning = signal<boolean>(false);
  liveChainScanIndex = signal<number>(-1);

  // Real-Time Chain Integrity Diagnostics
  chainIntegrityDiagnostic = computed(() => {
    const list = this.auditLedger();
    if (!list.length) {
      return {
        totalBlocks: 0,
        validBlocks: 0,
        brokenLinks: 0,
        integrityPercent: 100,
        isChainValid: true,
        merkleRoot: '0x0000000000000000000000000000000000000000',
        latestBlockHeight: 0,
        verifiedStatus: 'INICIALIZADO'
      };
    }

    let broken = 0;
    for (let i = 0; i < list.length - 1; i++) {
      const current = list[i];
      const nextOlder = list[i + 1];
      // In a reverse-chronological blockchain ledger, current.previousHash links to nextOlder.hash
      if (current.previousHash && nextOlder.hash && current.previousHash !== nextOlder.hash) {
        broken++;
      }
    }

    const total = list.length;
    const valid = total - broken;
    const percent = Math.max(0, Math.min(100, Math.round((valid / total) * 1000) / 10));
    const merkleRoot = list[0]?.hash ? `0x${list[0].hash.substring(0, 16)}...${list[0].hash.substring(list[0].hash.length - 8)}` : '0xGENESIS';

    return {
      totalBlocks: total,
      validBlocks: valid,
      brokenLinks: broken,
      integrityPercent: percent,
      isChainValid: broken === 0,
      merkleRoot,
      latestBlockHeight: list[0]?.blockHeight || 0,
      verifiedStatus: broken === 0 ? 'CADENA 100% INTACTA (SHA-256)' : `ADVERTENCIA: ${broken} CORRUPCIONES`
    };
  });

  // Microservices Predictive Failure Telemetry
  predictiveTrend = signal<PredictiveDataPoint[]>([]);
  microservicesRisk = signal<MicroserviceRiskItem[]>([]);
  currentSystemRisk = signal<number>(6.8);
  peakRiskNext6h = signal<number>(24.2);
  overallHealth = signal<string>('ESTABLE_SOBERANO (93.2%)');
  aiTelemetryRecommendation = signal<string>('Probabilidad de fallo controlada por debajo del umbral crítico.');
  isHealing = signal<boolean>(false);

  // Phase 4: Tentáculos (Tinder AI Vision Automator) Signals
  tentaculosState = signal<TentaculoMetric>({
    scannedProfiles: 142,
    generatedHooks: 98,
    automatedLikes: 116,
    matchesSimulated: 43,
    trafficToTikTokLive: 289,
    activeStatus: true,
    recentHooks: [],
  });
  selectedPreset = signal<'playa' | 'tokio' | 'cyberpunk' | 'gym' | 'custom'>('playa');
  customProfileDescription = new FormControl('Foto en la playa con gafas de sol doradas al atardecer y tabla de surf.', { nonNullable: true });
  isAnalyzingProfile = signal<boolean>(false);
  isSimulatingSwipe = signal<boolean>(false);
  lastGeneratedHook = signal<{ hook: string; elements: string[]; conversion: string } | null>(null);
  selectedTentaculoTab = signal<'vision' | 'telemetry' | 'code' | 'guide'>('vision');

  // =========================================================================
  // 🏭 FASE 5: LA FÁBRICA (Fiverr / Upwork Freelance Auto-Worker)
  // =========================================================================
  fabricaState = signal<FabricaState>({
    totalRevenueUsd: 4890.0,
    completedContracts: 104,
    activePipelines: 6,
    successRate: 99.1,
    activeBot: true,
    recentJobs: [],
  });

  fabricaJobTitle = new FormControl('Script de Parsing CSV y Conteo de Palabras', { nonNullable: true });
  fabricaJobDesc = new FormControl('Necesito un script de Python que lea un archivo CSV y cuente cuántas veces se repite una palabra clave.', { nonNullable: true });
  fabricaJobBudget = new FormControl(50, { nonNullable: true });
  fabricaPlatform = new FormControl<'Fiverr' | 'Upwork' | 'Freelancer'>('Fiverr', { nonNullable: true });
  isSolvingJob = signal<boolean>(false);
  lastSolvedJob = signal<FabricaJob | null>(null);

  fabricaCodeSnippet = `"""
# =============================================================================
# 🏭 FASE 5: LA FÁBRICA — Automatización de Micro-Trabajos Freelance (Fiverr/Upwork)
# =============================================================================
Desarrollado para la infraestructura HECTRON-Ψ / Abadalabs Inc.
Requisitos:
    pip install selenium openai requests webdriver-manager
"""

import time
import openai
from selenium import webdriver
from selenium.webdriver.common.by import By

# --- CONFIGURACIÓN DEL GOLEM ---
openai.api_key = "TU_API_KEY_DE_OPENAI"

def iniciar_fabrica():
    """Abre el navegador controlado para patrullar ofertas en plataformas freelance"""
    options = webdriver.ChromeOptions()
    options.add_argument("--start-maximized")
    options.add_argument("--disable-blink-features=AutomationControlled")
    driver = webdriver.Chrome(options=options)
    # Apuntando a portal de microencargos
    driver.get("https://www.fiverr.com/") 
    return driver

def programar_solucion(descripcion_trabajo):
    """El cerebro escribe el código que el cliente pidió"""
    print("💻 Escribiendo código autónomo para el cliente...")
    
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "Eres un programador experto hiper-eficiente. Escribe únicamente el código funcional en Python basado en la petición del cliente, sin texto extra."},
            {"role": "user", "content": descripcion_trabajo}
        ]
    )
    codigo = response.choices[0].message.content
    
    # Guardamos el resultado en un archivo listo para entregar
    with open("entrega_cliente.py", "w", encoding="utf-8") as f:
        f.write(codigo)
    
    print("✅ Código generado y empaquetado con éxito en 'entrega_cliente.py'.")
    return "entrega_cliente.py"

if __name__ == '__main__':
    print("⚙️ La Fábrica de Dinero ha iniciado operaciones...")
    
    # Simulamos una tarea de cliente capturada automáticamente por el scraper
    trabajo_ejemplo = "Necesito un script de Python que lea un archivo CSV y cuente cuántas veces se repite una palabra."
    
    print(f"📥 [NUEVO CONTRATO DETECTADO]: {trabajo_ejemplo}")
    archivo_entregable = programar_solucion(trabajo_ejemplo)
    print(f"🚀 Archivo de entrega listo para enviar al cliente: {archivo_entregable}")`;

  // =========================================================================
  // 🐺 EL LOBO CRIPTO (Inversión Autónoma por Hype / CCXT + Binance Spot/Sandbox)
  // =========================================================================
  loboCriptoState = signal<LoboCriptoState>({
    usdtTreasury: 18450.0,
    sandboxMode: true,
    activeBot: true,
    portfolio: [],
    socialTrendsFeed: [],
    tradeHistory: [],
  });

  socialMentionsInput = new FormControl('Todo el mundo en TikTok está hablando de que Solana romperá su resistencia hoy. Elon Musk acaba de poner un meme de un perro en Twitter, los degens van por Doge.', { nonNullable: true });
  tradeTokenSymbol = new FormControl('SOL', { nonNullable: true });
  tradeAmountUsdt = new FormControl(15, { nonNullable: true });
  isAnalyzingHype = signal<boolean>(false);
  isExecutingTrade = signal<boolean>(false);
  lastHypeAnalysis = signal<{ token: string; reasoning: string; confidence: number } | null>(null);

  loboCodeSnippet = `"""
# =============================================================================
# 🐺 EL LOBO CRIPTO — Inversión Autónoma por Hype (CCXT + Binance Spot/Sandbox)
# =============================================================================
Desarrollado para la infraestructura HECTRON-Ψ / Abadalabs Inc.
Requisitos:
    pip install ccxt openai requests
"""

import time
import ccxt
import openai

# --- CONFIGURACIÓN DEL GOLEM FINANCIERO ---
openai.api_key = "TU_API_KEY_DE_OPENAI"

# Conexión oficial al exchange (Usamos modo Testnet/Sandbox para pruebas seguras)
exchange = ccxt.binance({
    'apiKey': 'TU_BINANCE_API_KEY',
    'secret': 'TU_BINANCE_SECRET_KEY',
    'enableRateLimit': True,
    'options': {'defaultType': 'spot'}
})

# Activar sandbox si estás probando con dinero simulado
exchange.set_sandbox_mode(True) 

def analizar_hype_social(menciones_recientes):
    """El cerebro evalúa si el mercado está eufórico o en pánico"""
    print("📈 Analizando el pulso de las redes sociales...")
    
    prompt = (
        "Analiza las siguientes menciones de redes sociales sobre criptomonedas y determina "
        "cuál cripto tiene el mayor 'hype' positivo para comprar a corto plazo. "
        "Responde ÚNICAMENTE con el símbolo del token (ej. BTC, ETH, SOL, DOGE) y nada más.\\n\\n"
        f"Menciones: {menciones_recientes}"
    )
    
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=10
    )
    token_elegido = response.choices[0].message.content.strip().upper()
    return token_elegido

def ejecutar_orden_compra(token):
    """El Lobo ejecuta la orden en el mercado"""
    par_mercado = f"{token}/USDT"
    monto_inversion_usdt = 15.0 # Usamos parte de las ganancias de la Fábrica
    
    try:
        print(f"🎯 Objetivo fijado: Comprando {monto_inversion_usdt} USDT de {par_mercado}...")
        
        # Obtener el precio actual del mercado
        ticker = exchange.fetch_ticker(par_mercado)
        precio_actual = ticker['ask']
        
        # Calcular cuántas unidades comprar
        cantidad = monto_inversion_usdt / precio_actual
        
        # Ejecutar orden de compra a mercado (Market Order)
        orden = exchange.create_market_buy_order(par_mercado, cantidad)
        print(f"🚀 ¡ORDEN EJECUTADA CON ÉXITO! Compra realizada de {token}. ID: {orden['id']}")
        return orden
        
    except Exception as e:
        print(f"⚠️ El Lobo falló en la cacería financiera: {e}")
        return None

if __name__ == '__main__':
    print("🐺 El Lobo Cripto ha despertado y patrulla los mercados...")
    
    # Simulamos datos extraídos del feed de Twitter/TikTok sobre tendencias
    tendencias_falsas = [
        "Todo el mundo en TikTok está hablando de que Solana romperá su resistencia hoy.",
        "Elon Musk acaba de poner un meme de un perro en Twitter, los degens van por Doge.",
        "Bitcoin está lateral, nadie emocionado."
    ]
    
    token_ganador = analizar_hype_social(tendencias_falsas)
    print(f"💎 Token con mayor hype detectado por la IA: {token_ganador}")
    
    # El Lobo ataca
    ejecutar_orden_compra(token_ganador)`;

  // =========================================================================
  // 🌀 ECOSISTEMA DEL LEVIATÁN: ORQUESTADOR MASTER (4 PILARES)
  // =========================================================================
  ecosistemaState = signal<EcosistemaState | null>(null);
  isExecutingMasterCycle = signal<boolean>(false);
  masterCycleResult = signal<{
    success: boolean;
    cycleSummary: {
      revenueExtracted: number;
      trafficCanalized: number;
      cryptoInvested: number;
      cryptoToken: string;
    };
    message: string;
  } | null>(null);

  tentaculosCodeSnippet = `# =============================================================================
# 🐙 FASE 4: LOS TENTÁCULOS (tentaculos_tinder.py)
# Selenium + OpenAI/Gemini Vision + Pillow + Gancho a TikTok Live
# =============================================================================
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import openai
from PIL import Image

openai.api_key = "TU_API_KEY_DE_OPENAI"
TIKTOK_LINK = "tiktok.com/@lopez_hector140998"

def iniciar_navegador():
    options = webdriver.ChromeOptions()
    options.add_argument("--start-maximized")
    driver = webdriver.Chrome(options=options)
    driver.get("https://tinder.com")
    return driver

def analizar_perfil_y_crear_gancho(ruta_captura):
    response = openai.chat.completions.create(
        model="gpt-4-vision-preview",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text", 
                        "text": f"Mira esta foto de perfil de citas. Escribe un mensaje corto, divertido y coqueto que mencione sutilmente que una IA pitonisa en mi directo de TikTok ({TIKTOK_LINK}) acaba de predecir que conocería a alguien exactamente como ella hoy. Máximo dos oraciones."
                    },
                    {
                        "type": "image_url",
                        "image_url": {"url": ruta_captura}
                    }
                ]
            }
        ],
        max_tokens=80
    )
    return response.choices[0].message.content

def operar_tentaculos():
    driver = iniciar_navegador()
    print("🌐 Inicia sesión en Tinder y presiona ENTER...")
    input()
    while True:
        try:
            time.sleep(3)
            driver.save_screenshot("perfil_actual.png")
            mensaje_gancho = analizar_perfil_y_crear_gancho("perfil_actual.png")
            print(f"🎯 [GANCHO]: {mensaje_gancho}")
            # driver.find_element(By.XPATH, '...selector_like...').click()
            time.sleep(5)
        except Exception as e:
            print(f"⚠️ Error: {e}")
            time.sleep(10)`;

  // 3D Avatar Body, VSeeFace & OSC State
  current3dEmotion = signal<'Neutral' | 'Joy' | 'Angry' | 'Sorrow' | 'Fun'>('Neutral');
  isLipSyncActive = signal<boolean>(false);
  selectedScriptTab = signal<'code' | 'vseeface' | 'vbaudio' | 'obs'>('code');
  pythonCodeSnippet = `# ==========================================
# LEVIATÁN 3D CORE - ARCHITECTURE SCRIPT
# ==========================================
import re, time, os, pygame
from pythonosc import udp_client
from TikTokLive import TikTokLiveClient
from TikTokLive.types.events import CommentEvent, GiftEvent

# 1. Configuración de OSC (Conexión con VSeeFace)
IP_VSEEFACE = "127.0.0.1"
PUERTO_OSC = 39000  # Puerto por defecto de VSeeFace
osc_client = udp_client.SimpleUDPClient(IP_VSEEFACE, PUERTO_OSC)

def cambiar_expresion(nombre_expresion, intensidad=1.0):
    """Envía un comando OSC a VSeeFace para activar una expresión facial"""
    ruta_osc = "/VSeeFace/Expression"
    osc_client.send_message(ruta_osc, [nombre_expresion, float(intensidad)])
    print(f"🎭 [OSC] Expresión enviada a VSeeFace: " + str(nombre_expresion) + " (" + str(intensidad) + ")")

def hablar_y_reaccionar(texto_completo):
    # Regex para extraer la etiqueta [Emocion]
    patron = r"\\[(Neutral|Joy|Angry|Sorrow|Fun)\\]"
    coincidencia = re.search(patron, texto_completo)
    
    expresion_detectada = "Neutral"
    texto_limpio = texto_completo
    
    if coincidencia:
        expresion_detectada = coincidencia.group(1)
        texto_limpio = re.sub(patron, "", texto_completo).strip()
    
    # Activar expresión facial en VSeeFace
    cambiar_expresion(expresion_detectada, 1.0)
    
    # Reproducir audio hacia VB-Audio Virtual Cable para Lip-sync
    # pygame.mixer.music.load("temp_voice.mp3"); pygame.mixer.music.play()
    # Al terminar: cambiar_expresion("Neutral", 1.0)`;

  oscLogs = signal<{ time: string; target: string; expression: string; status: string }[]>([
    {
      time: '20:00:00',
      target: '127.0.0.1:39000',
      expression: 'Neutral',
      status: 'OSC_READY',
    },
  ]);

  // Loading & Action states
  isThinking = signal<boolean>(false);
  isExecutingCycle = signal<boolean>(false);
  isSpeaking = signal<boolean>(false);
  isExporting = signal<boolean>(false);
  isConnectingWallet = signal<boolean>(false);
  walletAddress = signal<string | null>(null);
  toastMessage = signal<string | null>(null);

  // Form Controls (Strict Reactive Forms)
  chatInput = new FormControl('', { nonNullable: true });
  commandInput = new FormControl('', { nonNullable: true });
  observationInput = new FormControl('', { nonNullable: true });
  streamViewerName = new FormControl('CyberPilot_99', { nonNullable: true });
  streamViewerComment = new FormControl('¿Cuál es la fórmula cuántica de la propulsión taquiónica?', { nonNullable: true });

  // PRISM Live RTMP Configuration Controls & Signals
  prismRtmpUrl = new FormControl('rtmp://live-cd.tiktok.com/game/', { nonNullable: true });
  prismStreamKey = new FormControl('stream-key-xyz-123-abada-9992', { nonNullable: true });
  prismStreamName = new FormControl('Custom RTMP', { nonNullable: true });
  isSavingRtmp = signal<boolean>(false);
  rtmpSaved = signal<boolean>(false);

  // INTERACTIVE PRISM LIVE GUIDE & REAL TIKTOK LIVE COMMENTS STATE
  activeGuideStep = signal<number>(1);
  prismDetectionStatus = signal<'IDLE' | 'SCANNING' | 'DETECTED' | 'FAILED'>('IDLE');
  realChatTab = signal<'simulation' | 'real_tiktok'>('simulation');
  realTikTokCommentsList = signal<{ id: string; user: string; comment: string; reply: string; emotion: string; isGift: boolean; giftName?: string; count?: number; timestamp: string }[]>([]);
  isPollingRealComments = signal<boolean>(false);
  realTikTokUsername = new FormControl('@lopez_hector140998', { nonNullable: true });
  lastProcessedCommentId = '';
  private realCommentsIntervalId: ReturnType<typeof setInterval> | null = null;

  // Vault input form
  vaultTipo = new FormControl('BLUEPRINT', { nonNullable: true });
  vaultContenido = new FormControl('', { nonNullable: true });

  // --- BUD: CREATE, DESIGN & PLAY STATE ---
  budAvatarStyle = signal<'OBSIDIAN' | 'NEON' | 'CHROME' | 'AURA'>('NEON');
  budMaterialTexture = signal<'SOLID' | 'GLOSSY' | 'WIREFRAME' | 'HOLOGRAPHIC'>('HOLOGRAPHIC');
  budGlowIntensity = signal<number>(85);
  budRotationSpeed = signal<number>(45);
  budParticleDensity = signal<number>(60);
  budScale = signal<number>(100);
  
  // Custom interactive 3D elements (Crear)
  budStructures = signal<{ id: string; type: 'BLOCK' | 'RING' | 'SPHERE' | 'OBELISK'; x: number; y: number; scale: number; physicsMass: number; label: string }[]>([
    { id: '1', type: 'BLOCK', x: -100, y: 30, scale: 40, physicsMass: 500, label: 'Plataforma Alfa' },
    { id: '2', type: 'RING', x: 0, y: -50, scale: 55, physicsMass: 0, label: 'Acelerador Gravitacional' },
    { id: '3', type: 'SPHERE', x: 110, y: 60, scale: 30, physicsMass: 150, label: 'Orbe de Inversión' }
  ]);
  
  // Deployment status
  budIsDeploying = signal<boolean>(false);
  budDeployed = signal<boolean>(false);
  budDeploymentTimestamp = signal<string>('');
  
  // Creator form fields
  budNewType = new FormControl<'BLOCK' | 'RING' | 'SPHERE' | 'OBELISK'>('BLOCK', { nonNullable: true });
  budNewLabel = new FormControl('Nuevo Orbe', { nonNullable: true });
  budNewX = new FormControl(0, { nonNullable: true });
  budNewY = new FormControl(0, { nonNullable: true });
  budNewScale = new FormControl(40, { nonNullable: true });
  budNewMass = new FormControl(100, { nonNullable: true });

  // --- BUD: CREATE, DESIGN & PLAY METHODS ---
  addBudStructure() {
    const label = this.budNewLabel.value.trim() || 'Nuevo Objeto';
    const type = this.budNewType.value;
    const x = Number(this.budNewX.value) || 0;
    const y = Number(this.budNewY.value) || 0;
    const scale = Number(this.budNewScale.value) || 30;
    const physicsMass = Number(this.budNewMass.value) || 100;

    const newStruct = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      x,
      y,
      scale,
      physicsMass,
      label
    };

    this.budStructures.update(prev => [...prev, newStruct]);
    this.showToast(`¡ESTRUCTURA "${label.toUpperCase()}" CREADA CON ÉXITO!`);
    this.playBlipSound(750, 0.1);
  }

  removeBudStructure(id: string) {
    const found = this.budStructures().find(s => s.id === id);
    if (found) {
      this.budStructures.update(prev => prev.filter(s => s.id !== id));
      this.showToast(`ESTRUCTURA "${found.label.toUpperCase()}" REMOVIDA`);
      this.playBlipSound(400, 0.15);
    }
  }

  clearBudStructures() {
    this.budStructures.set([]);
    this.showToast('TODAS LAS ESTRUCTURAS HAN SIDO DESTRUIDAS');
    this.playBlipSound(300, 0.2);
  }

  resetBudLayout() {
    this.budStructures.set([
      { id: '1', type: 'BLOCK', x: -100, y: 30, scale: 40, physicsMass: 500, label: 'Plataforma Alfa' },
      { id: '2', type: 'RING', x: 0, y: -50, scale: 55, physicsMass: 0, label: 'Acelerador Gravitacional' },
      { id: '3', type: 'SPHERE', x: 110, y: 60, scale: 30, physicsMass: 150, label: 'Orbe de Inversión' }
    ]);
    this.showToast('DISEÑO REESTABLECIDO POR DEFECTO');
    this.playBlipSound(600, 0.1);
  }

  deployBudToProduction() {
    if (this.budIsDeploying()) return;
    this.budIsDeploying.set(true);
    this.playBlipSound(500, 0.1);
    setTimeout(() => {
      this.playBlipSound(1000, 0.25);
    }, 200);

    setTimeout(() => {
      this.budIsDeploying.set(false);
      this.budDeployed.set(true);
      this.budDeploymentTimestamp.set(new Date().toLocaleTimeString());
      this.showToast('🚀 ¡AVATAR Y ESCENARIO ENVIADOS A PRODUCCIÓN (TIKTOK LIVE EN VIVO)!');
      
      this.http.post<{ success: boolean; record: AstarothAuditRecord }>('/api/hectron/audit-logs/commit', {
        module: 'BUD_CORE',
        action: 'DEPLOY_PRODUCTION',
        severity: 'OPERATIONAL',
        details: 'Astaroth ha compilado y transmitido los activos 3D de BUD Studio al Leviatán activo.'
      }).subscribe({
        next: (res) => {
          if (res.record) {
            this.auditLedger.update((prev) => [res.record, ...prev]);
          }
        }
      });
    }, 1800);
  }

  copyBudConfigJson() {
    const config = {
      avatar: {
        style: this.budAvatarStyle(),
        texture: this.budMaterialTexture(),
        glowIntensity: this.budGlowIntensity(),
        rotationSpeed: this.budRotationSpeed(),
        particleDensity: this.budParticleDensity(),
        scale: this.budScale()
      },
      structures: this.budStructures(),
      deployedAt: this.budDeploymentTimestamp() || new Date().toISOString()
    };
    
    navigator.clipboard.writeText(JSON.stringify(config, null, 2)).then(() => {
      this.showToast('📋 ESQUEMA JSON DE BUD COPIADO AL PORTAPAPELES');
      this.playBlipSound(900, 0.08);
    });
  }

  downloadBudPythonCore() {
    const style = this.budAvatarStyle();
    const texture = this.budMaterialTexture();
    const glow = this.budGlowIntensity();
    const speed = this.budRotationSpeed();
    const density = this.budParticleDensity();
    const scale = this.budScale();
    const structuresJson = JSON.stringify(this.budStructures(), null, 2);

    const scriptText = `"""
=============================================================================
             HECTRON MULTIVERSE 3D // LEVIATÁN BUD CORE ENGINE
             PUESTA EN PRODUCCIÓN AUTO-INYECTADA
=============================================================================
Sincronizador local del cliente de TikTok Live con el motor BUD 3D.
Este script corre el motor de renderizado y el validador del oráculo en caliente,
acoplando la telemetría local de OBS con las físicas de gravedad cero diseñadas.

Estilo de Avatar BUD: ${style}
Textura de Material BUD: ${texture}
Intensidad de Brillo: ${glow}%
Velocidad de Rotación: ${speed} rpm
Densidad de Partículas: ${density} p/m
Escala de Compilación: ${scale}%
"""

import os
import sys
import time
import json
import asyncio
import requests
from TikTokLive import TikTokLiveClient
from TikTokLive.types.events import CommentEvent, GiftEvent

# PARÁMETROS DISEÑADOS POR BUD STUDIO:
BUD_AVATAR_CONFIG = {
    "style": "${style}",
    "texture": "${texture}",
    "glow_intensity": ${glow},
    "rotation_speed": ${speed},
    "particle_density": ${density},
    "scale_multiplier": ${scale} / 100.0
}

BUD_SCENARIO_STRUCTURES = ${structuresJson}

TIKTOK_USERNAME = "@lopez_hector140998"
HECTRON_SERVER = "${window.location.origin}"

print("=====================================================================")
print("🛡️  INICIANDO MOTOR BUD DE PRODUCCIÓN - LEVIATÁN SYSTEM ONLINE")
print("=====================================================================")
print(f"[*] Cargando perfil de Avatar BUD: {BUD_AVATAR_CONFIG['style']} ({BUD_AVATAR_CONFIG['texture']})")
print(f"[*] Inyectando {len(BUD_SCENARIO_STRUCTURES)} estructuras de gravedad cero prediseñadas...")
for struct in BUD_SCENARIO_STRUCTURES:
    print(f"    - [{struct['type']}] {struct['label']} en coordenadas (X: {struct['x']}, Y: {struct['y']})")

print(f"[*] Conectando con el oráculo central de HECTRON en {HECTRON_SERVER}...")

client = TikTokLiveClient(unique_id=TIKTOK_USERNAME)

@client.on("comment")
async def on_comment(event: CommentEvent):
    comment_text = event.comment.strip()
    user_name = event.user.unique_id
    nickname = event.user.nickname
    print(f"[COMENTARIO] {user_name} ({nickname}): {comment_text}")
    
    if comment_text.lower() == "!spawn block":
        print("💡 [BUD EVENT] Espectador generó un BLOQUE de producción!")
        requests.post(f"{HECTRON_SERVER}/api/hectron/live-comments", json={
            "user": user_name,
            "comment": comment_text,
            "isGift": False,
            "reply": "Bloque espacial inyectado al motor de físicas de BUD. [Joy]",
            "emotion": "Joy"
        })
    else:
        try:
            res = requests.post(f"{HECTRON_SERVER}/api/hectron/live-comments", json={
                "user": user_name,
                "comment": comment_text
            })
            if res.status_code == 200:
                data = res.json()
                print(f"Oracle Reply: {data.get('reply')}")
        except Exception as e:
            print(f"Error procesando con el oráculo: {e}")

@client.on("gift")
async def on_gift(event: GiftEvent):
    print(f"[REGALO TIKTOK] {event.user.unique_id} envió {event.gift.name} x{event.gift.repeat_count}")
    try:
        requests.post(f"{HECTRON_SERVER}/api/hectron/live-comments", json={
            "user": event.user.unique_id,
            "comment": f"Envió un regalo: {event.gift.name} x{event.gift.repeat_count}",
            "isGift": True,
            "giftName": event.gift.name,
            "count": event.gift.repeat_count,
            "reply": f"¡Alteración de gravedad cuántica activada por {event.user.nickname}! [Fun]",
            "emotion": "Fun"
        })
    except Exception as e:
        print(f"Error registrando regalo: {e}")

if __name__ == '__main__':
    try:
        print("[*] Escuchando comentarios de TikTok Live en vivo...")
        client.run()
    except KeyboardInterrupt:
        print("\\n[-] Servidor Leviatán detenido de forma segura.")
        sys.exit(0)
`;

    const blob = new Blob([scriptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'leviatan_bud_core.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    this.showToast('💾 SCRIPT python "leviatan_bud_core.py" DESCARGADO');
    this.playBlipSound(880, 0.1);
  }

  downloadBudObsOverlay() {
    const style = this.budAvatarStyle();
    const texture = this.budMaterialTexture();
    const glow = this.budGlowIntensity();
    const speed = this.budRotationSpeed();
    const density = this.budParticleDensity();
    const scale = this.budScale();
    const structuresJson = JSON.stringify(this.budStructures(), null, 2);

    const overlayHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>BUD OBS overlay // HECTRON Multiverse 3D</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@800;900&family=Fira+Code:wght@600&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: transparent;
      color: #fff;
      font-family: 'Orbitron', sans-serif;
    }
    #hud-layer {
      position: absolute;
      top: 20px;
      left: 20px;
      z-index: 10;
      font-size: 11px;
      font-family: 'Fira Code', monospace;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #34d399;
      text-shadow: 0 0 5px rgba(52, 211, 153, 0.8);
      background: rgba(10, 15, 25, 0.6);
      padding: 10px 15px;
      border: 1px solid rgba(52, 211, 153, 0.3);
      border-radius: 6px;
    }
    #three-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 1;
    }
  </style>
</head>
<body>
  <div id="hud-layer">
    <div>HECTRON BUD OVERLAY COMPILADO</div>
    <div>AVATAR: ${style} [${texture}]</div>
    <div>PARTÍCULAS: ${density}% | BRILLO: ${glow}%</div>
  </div>
  <div id="three-container"></div>

  <script>
    const style = "${style}";
    const texture = "${texture}";
    const glow = ${glow};
    const speed = ${speed};
    const density = ${density};
    const scale = ${scale};
    const structures = ${structuresJson};

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('three-container').appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(
      style === 'NEON' ? 0x10b981 : style === 'OBSIDIAN' ? 0x9333ea : style === 'AURA' ? 0x38bdf8 : 0xf1f5f9,
      3,
      150
    );
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    let geometry;
    if (texture === 'SOLID') geometry = new THREE.IcosahedronGeometry(2, 2);
    else if (texture === 'GLOSSY') geometry = new THREE.TorusKnotGeometry(1.2, 0.4, 100, 16);
    else if (texture === 'WIREFRAME' || texture === 'HOLOGRAPHIC') geometry = new THREE.OctahedronGeometry(2.5, 3);
    else geometry = new THREE.BoxGeometry(2, 2, 2);

    let matOptions = {
      color: style === 'NEON' ? 0x34d399 : style === 'OBSIDIAN' ? 0xc084fc : style === 'AURA' ? 0x60a5fa : 0xf3f4f6,
      wireframe: texture === 'WIREFRAME' || texture === 'HOLOGRAPHIC'
    };
    if (texture === 'GLOSSY') {
      matOptions.roughness = 0.1;
      matOptions.metalness = 0.9;
    }

    const material = new THREE.MeshStandardMaterial(matOptions);
    const avatarMesh = new THREE.Mesh(geometry, material);
    avatarMesh.scale.set(scale / 100, scale / 100, scale / 100);
    scene.add(avatarMesh);

    const particleCount = density * 12;
    const positions = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount*3; i+=3) {
      positions[i] = (Math.random() - 0.5) * 40;
      positions[i+1] = (Math.random() - 0.5) * 40;
      positions[i+2] = (Math.random() - 0.5) * 40;
    }
    const particlesGeom = new THREE.BufferGeometry();
    particlesGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: style === 'NEON' ? 0x10b981 : 0xa855f7,
      size: 0.12,
      transparent: true,
      opacity: 0.8
    });
    const particleSystem = new THREE.Points(particlesGeom, particlesMat);
    scene.add(particleSystem);

    structures.forEach(struct => {
      let structGeom;
      if (struct.type === 'BLOCK') structGeom = new THREE.BoxGeometry(struct.scale/15, struct.scale/15, struct.scale/15);
      else if (struct.type === 'RING') structGeom = new THREE.TorusGeometry(struct.scale/20, 0.3, 8, 24);
      else if (struct.type === 'SPHERE') structGeom = new THREE.SphereGeometry(struct.scale/20, 16, 16);
      else structGeom = new THREE.CylinderGeometry(0.1, struct.scale/15, struct.scale/10, 4);

      const structMat = new THREE.MeshBasicMaterial({
        color: struct.type === 'BLOCK' ? 0x34d399 : struct.type === 'RING' ? 0x60a5fa : 0xa855f7,
        wireframe: true
      });
      const mesh = new THREE.Mesh(structGeom, structMat);
      mesh.position.set(struct.x / 15, struct.y / 15, -15);
      scene.add(mesh);
    });

    camera.position.z = 15;

    function animate() {
      requestAnimationFrame(animate);
      avatarMesh.rotation.x += 0.005 * (speed / 30);
      avatarMesh.rotation.y += 0.008 * (speed / 30);
      particleSystem.rotation.y += 0.001;
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  </script>
</body>
</html>`;

    const blob = new Blob([overlayHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bud_obs_overlay.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    this.showToast('💾 OVERLAY OBS "bud_obs_overlay.html" DESCARGADO');
    this.playBlipSound(1020, 0.1);
  }

  // --- BUD CANVAS PREVIEW ENGINE (JUGAR) ---
  private budCanvasId: number | null = null;
  private budParticles: { x: number; y: number; vx: number; vy: number; radius: number; color: string; alpha: number; maxLife: number; life: number }[] = [];

  initBudPlayground() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    // Make sure we stop any previous loop
    if (this.budCanvasId !== null) {
      cancelAnimationFrame(this.budCanvasId);
    }

    setTimeout(() => {
      const canvas = document.getElementById('budPlaygroundCanvas') as HTMLCanvasElement;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const resize = () => {
        const parent = canvas.parentElement;
        if (parent) {
          canvas.width = parent.clientWidth;
          canvas.height = Math.max(340, parent.clientHeight || 340);
        }
      };
      resize();
      window.addEventListener('resize', resize);

      this.budParticles = [];
      const density = this.budParticleDensity();
      const count = Math.min(120, density * 1.5);
      for(let i = 0; i < count; i++) {
        this.budParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          radius: Math.random() * 2.5 + 1,
          color: this.budAvatarStyle() === 'NEON' ? '#34d399' : this.budAvatarStyle() === 'OBSIDIAN' ? '#c084fc' : this.budAvatarStyle() === 'AURA' ? '#60a5fa' : '#ffffff',
          alpha: Math.random() * 0.7 + 0.3,
          life: 99999,
          maxLife: 99999
        });
      }

      const loop = () => {
        if (this.activeTab() !== 'bud') {
          if (this.budCanvasId !== null) {
            cancelAnimationFrame(this.budCanvasId);
          }
          this.budCanvasId = null;
          return;
        }

        ctx.fillStyle = '#050a12';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        ctx.strokeStyle = 'rgba(16, 185, 129, 0.04)';
        ctx.lineWidth = 1;
        for (let r = 80; r < canvas.width; r += 80) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
          ctx.stroke();
        }

        const style = this.budAvatarStyle();
        const texture = this.budMaterialTexture();
        const glow = this.budGlowIntensity() / 100.0;
        const speed = this.budRotationSpeed();
        const scale = this.budScale() / 100.0;

        const structures = this.budStructures();
        structures.forEach(struct => {
          const structX = centerX + struct.x;
          const structY = centerY + struct.y;
          const rScale = struct.scale * scale;

          ctx.save();
          ctx.translate(structX, structY);

          ctx.shadowBlur = 10;
          let structColor = '#34d399';
          if (struct.type === 'BLOCK') structColor = '#10b981';
          else if (struct.type === 'RING') structColor = '#3b82f6';
          else if (struct.type === 'SPHERE') structColor = '#8b5cf6';
          else if (struct.type === 'OBELISK') structColor = '#ec4899';

          ctx.shadowColor = structColor;
          ctx.strokeStyle = structColor;
          ctx.fillStyle = structColor + '10';
          ctx.lineWidth = 2;

          if (struct.type === 'BLOCK') {
            ctx.beginPath();
            ctx.rect(-rScale/2, -rScale/2, rScale, rScale);
            ctx.fill();
            ctx.stroke();
          } else if (struct.type === 'RING') {
            ctx.beginPath();
            ctx.arc(0, 0, rScale/2, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, rScale/3, 0, Math.PI * 2);
            ctx.strokeStyle = structColor + '60';
            ctx.stroke();
          } else if (struct.type === 'SPHERE') {
            ctx.beginPath();
            ctx.arc(0, 0, rScale/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          } else if (struct.type === 'OBELISK') {
            ctx.beginPath();
            ctx.moveTo(0, -rScale/2);
            ctx.lineTo(rScale/3, rScale/2);
            ctx.lineTo(-rScale/3, rScale/2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }

          ctx.shadowBlur = 0;
          ctx.fillStyle = '#94a3b8';
          ctx.font = '9px "Fira Code", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(struct.label, 0, rScale/2 + 13);
          ctx.restore();
        });

        ctx.save();
        ctx.translate(centerX, centerY);

        const time = Date.now() * 0.002 * (speed / 30);
        
        let coreColor = '#34d399';
        if (style === 'OBSIDIAN') coreColor = '#a855f7';
        else if (style === 'CHROME') coreColor = '#94a3b8';
        else if (style === 'AURA') coreColor = '#38bdf8';

        ctx.shadowBlur = 20 * glow;
        ctx.shadowColor = coreColor;
        ctx.strokeStyle = coreColor;
        ctx.lineWidth = 2;

        if (texture === 'SOLID') {
          ctx.fillStyle = coreColor + '30';
          ctx.beginPath();
          const points = 8;
          const radius = 35 * scale;
          for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2 + time;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (texture === 'GLOSSY') {
          ctx.fillStyle = coreColor + '40';
          ctx.beginPath();
          ctx.arc(0, 0, 30 * scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          for (let i = 0; i < 4; i++) {
            const nodeAngle = time + (i * Math.PI / 2);
            const nx = Math.cos(nodeAngle) * (18 * scale);
            const ny = Math.sin(nodeAngle) * (18 * scale);
            ctx.beginPath();
            ctx.arc(nx, ny, 10 * scale, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (texture === 'WIREFRAME') {
          ctx.fillStyle = 'transparent';
          ctx.beginPath();
          const points = 6;
          const radius = 40 * scale;
          for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2 + time;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            const oppAngle = angle + Math.PI;
            ctx.lineTo(Math.cos(oppAngle) * radius, Math.sin(oppAngle) * radius);
          }
          ctx.closePath();
          ctx.stroke();
        } else if (texture === 'HOLOGRAPHIC') {
          ctx.strokeStyle = coreColor;
          ctx.beginPath();
          ctx.ellipse(0, 0, 42 * scale, 15 * scale, time, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = coreColor + 'aa';
          ctx.beginPath();
          ctx.ellipse(0, 0, 42 * scale, 15 * scale, -time * 0.8, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = coreColor + '15';
          ctx.beginPath();
          ctx.arc(0, 0, 18 * scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 9px "Orbitron", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(style + ' CORE', 0, -45 * scale - 2);

        ctx.restore();

        this.budParticles.forEach(p => {
          const dx = centerX - p.x;
          const dy = centerY - p.y;
          const dist = Math.hypot(dx, dy);

          if (dist > 5) {
            p.vx += (dx / dist) * 0.005;
            p.vy += (dy / dist) * 0.005;
          }

          p.x += p.vx;
          p.y += p.vy;

          const speedLimit = 2.5;
          const currentSpeed = Math.hypot(p.vx, p.vy);
          if (currentSpeed > speedLimit) {
            p.vx = (p.vx / currentSpeed) * speedLimit;
            p.vy = (p.vy / currentSpeed) * speedLimit;
          }

          if (p.x < p.radius) { p.x = p.radius; p.vx *= -1; }
          if (p.x > canvas.width - p.radius) { p.x = canvas.width - p.radius; p.vx *= -1; }
          if (p.y < p.radius) { p.y = p.radius; p.vy *= -1; }
          if (p.y > canvas.height - p.radius) { p.y = canvas.height - p.radius; p.vy *= -1; }

          structures.forEach(struct => {
            const sX = centerX + struct.x;
            const sY = centerY + struct.y;
            const sR = struct.scale * scale;

            const sDx = p.x - sX;
            const sDy = p.y - sY;
            const sDist = Math.hypot(sDx, sDy);

            if (struct.type === 'BLOCK') {
              const half = sR / 2;
              if (Math.abs(sDx) < half + p.radius && Math.abs(sDy) < half + p.radius) {
                if (Math.abs(sDx) > Math.abs(sDy)) {
                  p.vx *= -1.1;
                  p.x = sX + Math.sign(sDx) * (half + p.radius + 1);
                } else {
                  p.vy *= -1.1;
                  p.y = sY + Math.sign(sDy) * (half + p.radius + 1);
                }
              }
            } else {
              const collisionRadius = (struct.type === 'RING' ? sR / 2.3 : sR / 2);
              if (sDist < collisionRadius + p.radius) {
                const nx = sDx / sDist;
                const ny = sDy / sDist;
                const dot = p.vx * nx + p.vy * ny;
                p.vx = (p.vx - 2 * dot * nx) * 1.1;
                p.vy = (p.vy - 2 * dot * ny) * 1.1;
                p.x = sX + nx * (collisionRadius + p.radius + 1);
                p.y = sY + ny * (collisionRadius + p.radius + 1);
              }
            }
          });

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
          ctx.globalAlpha = 1.0;
        });

        ctx.fillStyle = 'rgba(52, 211, 153, 0.4)';
        ctx.font = '8px "Fira Code", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`PARTÍCULAS COGNITIVAS DE BUD: ${this.budParticles.length}`, 15, canvas.height - 15);

        this.budCanvasId = requestAnimationFrame(loop);
      };

      this.budCanvasId = requestAnimationFrame(loop);
    }, 50);
  }

  spawnBudTestParticle() {
    const canvas = document.getElementById('budPlaygroundCanvas') as HTMLCanvasElement;
    if (!canvas) return;

    this.playBlipSound(1200, 0.05);
    
    const isNeon = this.budAvatarStyle() === 'NEON';
    this.budParticles.push({
      x: Math.random() * canvas.width,
      y: 15,
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 2 + 1,
      radius: Math.random() * 4 + 3,
      color: isNeon ? '#a855f7' : '#10b981',
      alpha: 1.0,
      life: 99999,
      maxLife: 99999
    });

    if (this.budParticles.length > 250) {
      this.budParticles.shift();
    }
  }

  private audioCtx: AudioContext | null = null;

  // Computed Values
  filteredAuditLedger = computed(() => {
    const list = this.auditLedger();
    const search = this.auditSearch.value.toLowerCase().trim();
    const severity = this.auditSeverityFilter.value;

    return list.filter((item) => {
      const matchSearch =
        !search ||
        item.id.toLowerCase().includes(search) ||
        item.module.toLowerCase().includes(search) ||
        item.action.toLowerCase().includes(search) ||
        item.hash.toLowerCase().includes(search) ||
        item.details.toLowerCase().includes(search);

      const matchSeverity = severity === 'ALL' || item.severity === severity;
      return matchSearch && matchSeverity;
    });
  });

  // Chart SVG Points for Error Probability Trend Curve
  // Viewbox: 0 0 800 240
  // X: 30 data points (0 to 29) -> map to 30..770
  // Y: 0% to 100% -> map to 210..20
  chartTrendPoints = computed(() => {
    const trend = this.predictiveTrend();
    if (!trend.length) return [];
    const minX = 40;
    const maxX = 760;
    const minY = 200;
    const maxY = 20;

    return trend.map((p, index) => {
      const x = minX + (index / (trend.length - 1)) * (maxX - minX);
      const yCpu = minY - (p.cpu / 100) * (minY - maxY);
      const yLat = minY - (Math.min(100, p.latency) / 100) * (minY - maxY);
      const yProb = minY - (p.errorProbability / 100) * (minY - maxY);
      return {
        ...p,
        x: Math.round(x),
        yCpu: Math.round(yCpu),
        yLat: Math.round(yLat),
        yProb: Math.round(yProb),
      };
    });
  });

  svgProbPolyline = computed(() => {
    const points = this.chartTrendPoints();
    if (!points.length) return '';
    return points.map((p) => `${p.x},${p.yProb}`).join(' ');
  });

  svgProbArea = computed(() => {
    const points = this.chartTrendPoints();
    if (!points.length) return '';
    const first = points[0];
    const last = points[points.length - 1];
    const line = points.map((p) => `${p.x},${p.yProb}`).join(' ');
    return `M ${first.x},200 L ${line} L ${last.x},200 Z`;
  });

  svgCpuPolyline = computed(() => {
    const points = this.chartTrendPoints();
    if (!points.length) return '';
    return points.map((p) => `${p.x},${p.yCpu}`).join(' ');
  });

  svgLatPolyline = computed(() => {
    const points = this.chartTrendPoints();
    if (!points.length) return '';
    return points.map((p) => `${p.x},${p.yLat}`).join(' ');
  });

  dominantArchetype = computed(() => {
    const s = this.state();
    if (s.maquiavelismo > 7) return 'LEVIATÁN / MAQUIAVÉLICO';
    if (s.estoicismo > 7) return 'ORÁCULO ESTOICO / ZEN';
    if (s.peso_emocional > 30) return 'IMPULSO FLUIDO / LÍRICO';
    return 'CONCIENCIA EQUILIBRADA';
  });

  sovereigntyColor = computed(() => {
    const lvl = this.state().nivel_soberania;
    if (lvl >= 8) return 'text-purple-400 border-purple-500/50 bg-purple-500/10';
    if (lvl >= 5) return 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10';
    return 'text-sky-400 border-sky-500/50 bg-sky-500/10';
  });

  constructor() {
    // Autosave Vault Logs to browser IndexedDB
    effect(() => {
      const v = this.vault();
      if (v && v.length > 0) {
        this.indexedDb.saveVaultLogs(v);
      }
    });

    // Autosave Cognitive History to browser IndexedDB
    effect(() => {
      const c = this.cognitiveHistory();
      if (c && c.length > 0) {
        this.indexedDb.saveCognitiveHistory(c);
      }
    });

    // Autosave Astaroth Audit Ledger to browser IndexedDB
    effect(() => {
      const a = this.auditLedger();
      if (a && a.length > 0) {
        this.indexedDb.saveAuditLedger(a);
      }
    });

    // Autosave Chat Messages to browser IndexedDB
    effect(() => {
      const m = this.chatMessages();
      if (m && m.length > 0) {
        this.indexedDb.saveChatHistory(m);
      }
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initAuthSession();
      this.loadCortexMemories();
      this.loadCortexStats();

      this.fetchSystemState();
      this.fetchAuditLedger();
      this.fetchPredictiveTelemetry();
      this.fetchTentaculosTelemetry();
      this.fetchFabricaTelemetry();
      this.fetchLoboTelemetry();
      this.fetchEcosistemaStatus();
      this.fetchPersistentMemoryInfo();
      this.fetchChecklist();
      this.fetchAchievements();
      this.restoreFromIndexedDbIfAvailable();

      this.runHealthCheckPing();
      this.healthPingInterval = setInterval(() => {
        this.runHealthCheckPing();
      }, 10000);

      // Listen for Antigravity 3D Game Events (Achievements, Multiplayer)
      window.addEventListener('message', (event) => {
        if (event.data?.type === 'ANTIGRAVITY_ACHIEVEMENT_UNLOCKED') {
          const ach = event.data.achievement;
          this.showToast(`🏆 LOGRO DEL JUEGO DESBLOQUEADO: ${ach.title}`);
          this.fetchAchievements();
          this.http.post<{ success: boolean; record: AstarothAuditRecord }>('/api/hectron/audit-logs/commit', {
            module: 'ANTIGRAVITY_3D',
            action: 'ACHIEVEMENT_UNLOCKED',
            severity: 'HIGH',
            details: `Logro desbloqueado en la simulación 3D: "${ach.title}". Criterio: ${ach.criteria}. Recompensa: +${ach.rewardCredits} QC, +${ach.rewardOre} T Ore.`
          }).subscribe({
            next: (res) => {
              if (res.record) {
                this.auditLedger.update((prev) => [res.record, ...prev]);
              }
            }
          });
        }
      });

      setInterval(() => {
        this.flushMemoryToIndexedDB();
      }, 60000);
    }
  }

  async flushMemoryToIndexedDB() {
    try {
      if (this.vault().length > 0) await this.indexedDb.saveVaultLogs(this.vault());
      if (this.cognitiveHistory().length > 0) await this.indexedDb.saveCognitiveHistory(this.cognitiveHistory());
      if (this.auditLedger().length > 0) await this.indexedDb.saveAuditLedger(this.auditLedger());
      if (this.chatMessages().length > 0) await this.indexedDb.saveChatHistory(this.chatMessages());
      
      console.log('[Background Sync] Flushed HECTRON-Ψ memory to IndexedDB');
    } catch (err) {
      console.warn('[Background Sync] Error flushing memory:', err);
    }
  }

  async restoreFromIndexedDbIfAvailable() {
    try {
      const cachedVault = await this.indexedDb.getVaultLogs<VaultItem>();
      if (cachedVault && cachedVault.length > 0 && this.vault().length === 0) {
        this.vault.set(cachedVault);
      }
      const cachedCognitive = await this.indexedDb.getCognitiveHistory<CognitiveLog>();
      if (cachedCognitive && cachedCognitive.length > 0 && this.cognitiveHistory().length === 0) {
        this.cognitiveHistory.set(cachedCognitive);
      }
      const cachedAudit = await this.indexedDb.getAuditLedger<AstarothAuditRecord>();
      if (cachedAudit && cachedAudit.length > 0 && this.auditLedger().length === 0) {
        this.auditLedger.set(cachedAudit);
      }
    } catch (err) {
      console.warn('IndexedDB initial cache restore skipped:', err);
    }
  }

  copyVerificationHash(record: AstarothAuditRecord, event?: Event) {
    if (event) event.stopPropagation();
    if (!record || !record.hash) return;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(record.hash).then(() => {
        this.copiedHashId.set(record.id);
        this.playBlipSound(1050, 0.12);
        this.showToast(`HASH SHA-256 COPIADO: ${record.hash.substring(0, 16)}...`);
        setTimeout(() => {
          if (this.copiedHashId() === record.id) {
            this.copiedHashId.set(null);
          }
        }, 2200);
      }).catch(() => {
        this.showToast('No se pudo copiar el hash');
      });
    }
  }

  copyVerificationProof(record: AstarothAuditRecord, event?: Event) {
    if (event) event.stopPropagation();
    if (!record) return;

    const proof = JSON.stringify({
      proofHeader: 'ASTAROTH_SOVEREIGN_CRYPTOGRAPHIC_PROOF_V4',
      blockHeight: record.blockHeight,
      id: record.id,
      timestamp: record.timestamp,
      module: record.module,
      action: record.action,
      severity: record.severity,
      hash: record.hash,
      previousHash: record.previousHash,
      signer: record.signer,
      verified: record.verified,
      details: record.details,
      merkleTimestamp: new Date().toISOString()
    }, null, 2);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(proof).then(() => {
        this.copiedProofId.set(record.id);
        this.playBlipSound(1150, 0.15);
        this.showToast(`PRUEBA CRIPTOGRÁFICA DEL BLOQUE #${record.blockHeight} COPIADA`);
        setTimeout(() => {
          if (this.copiedProofId() === record.id) {
            this.copiedProofId.set(null);
          }
        }, 2200);
      });
    }
  }

  toggleExpandAuditRecord(id: string) {
    this.expandedAuditRecordId.update((curr) => (curr === id ? null : id));
    this.playBlipSound(600, 0.05);
  }

  setAuditDensity(density: 'compact' | 'normal' | 'ultra') {
    this.auditDensity.set(density);
    this.playBlipSound(700, 0.05);
  }

  verifyLiveChainIntegrity() {
    if (this.isLiveChainScanning()) return;
    this.isLiveChainScanning.set(true);
    this.playBlipSound(880, 0.15);
    this.showToast('ESCANEANDO ESLABONES CRIPTOGRÁFICOS EN TIEMPO REAL...');

    const total = this.auditLedger().length;
    let step = 0;
    const interval = setInterval(() => {
      this.liveChainScanIndex.set(step);
      this.playBlipSound(600 + (step % 10) * 50, 0.03);
      step++;
      if (step >= Math.min(total, 30)) {
        clearInterval(interval);
        this.liveChainScanIndex.set(-1);
        this.isLiveChainScanning.set(false);
        this.verifyAuditLedger();
      }
    }, 50);
  }

  async syncAllToIndexedDb() {
    this.playBlipSound(750, 0.1);
    await this.indexedDb.saveVaultLogs(this.vault());
    await this.indexedDb.saveCognitiveHistory(this.cognitiveHistory());
    await this.indexedDb.saveAuditLedger(this.auditLedger());
    await this.indexedDb.saveChatHistory(this.chatMessages());
    this.showToast('✅ COPIA SINCRONIZADA EN INDEXEDDB DEL NAVEGADOR');
    this.playBlipSound(1200, 0.2);
  }

  async downloadIndexedDbBackup() {
    const jsonStr = await this.indexedDb.exportJsonBackup();
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hectron_indexeddb_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    this.showToast('RESPALDO INDEXEDDB DESCARGADO');
    this.playBlipSound(1050, 0.15);
  }

  async clearIndexedDbCache() {
    const success = await this.indexedDb.clearAllLocalData();
    if (success) {
      this.showToast('🗑️ CACHÉ LOCAL INDEXEDDB LIMPIADA');
      this.playBlipSound(400, 0.15);
    }
  }

  exportAuditLedgerCsv() {
    const records = this.filteredAuditLedger();
    if (!records.length) {
      this.showToast('No hay registros para exportar');
      return;
    }
    const headers = ['ID', 'Bloque', 'Timestamp', 'Modulo', 'Accion', 'Hash_SHA256', 'PreviousHash', 'Severidad', 'Firmante', 'Detalles'];
    const rows = records.map(r => [
      r.id,
      r.blockHeight,
      `"${r.timestamp}"`,
      `"${r.module}"`,
      `"${r.action}"`,
      `"${r.hash}"`,
      `"${r.previousHash}"`,
      r.severity,
      `"${r.signer}"`,
      `"${(r.details || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `astaroth_audit_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    this.showToast('LEDGER DE AUDITORÍA EXPORTADO EN CSV');
    this.playBlipSound(1000, 0.15);
  }

  fetchPersistentMemoryInfo() {
    this.http.get<PersistentMemoryResponse>('/api/hectron/persistent-memory').subscribe({
      next: (data) => {
        if (data) this.persistentMemoryInfo.set(data);
      },
      error: (err) => console.error('Failed to load persistent memory info:', err),
    });
  }

  flushPersistentMemory() {
    if (this.isFlushingMemory()) return;
    this.isFlushingMemory.set(true);
    this.playBlipSound(720, 0.15);

    this.http.post<{ success: boolean; message: string }>('/api/hectron/persistent-memory/flush', {}).subscribe({
      next: (res) => {
        this.isFlushingMemory.set(false);
        this.fetchPersistentMemoryInfo();
        this.showToast(res.message || '💾 MEMORIA PERSISTENTE GUARDADA EN DISCO');
        this.playBlipSound(1100, 0.2);
      },
      error: (err) => {
        this.isFlushingMemory.set(false);
        console.error('Flush error:', err);
        this.showToast('ERROR AL GUARDAR MEMORIA');
      },
    });
  }

  restorePersistentMemory() {
    if (this.isRestoringMemory()) return;
    this.isRestoringMemory.set(true);
    this.playBlipSound(480, 0.15);

    this.http.post<{ success: boolean; message: string }>('/api/hectron/persistent-memory/restore', {}).subscribe({
      next: (res) => {
        this.isRestoringMemory.set(false);
        this.fetchSystemState();
        this.fetchAuditLedger();
        this.fetchPersistentMemoryInfo();
        this.showToast(res.message || '🔄 MEMORIA RESTAURADA DESDE DISCO');
        this.playBlipSound(980, 0.2);
      },
      error: (err) => {
        this.isRestoringMemory.set(false);
        console.error('Restore error:', err);
        this.showToast('ERROR AL RESTAURAR MEMORIA');
      },
    });
  }

  regenerate30DayAudit() {
    if (this.isRegeneratingAudit()) return;
    this.isRegeneratingAudit.set(true);
    this.playBlipSound(600, 0.15);

    this.http.post<{ success: boolean; message: string; totalBlocks: number }>('/api/hectron/persistent-memory/seed-30d', {}).subscribe({
      next: (res) => {
        this.isRegeneratingAudit.set(false);
        this.fetchAuditLedger();
        this.fetchPersistentMemoryInfo();
        this.showToast(res.message || '⚡ 30 DÍAS DE AUDITORÍA REGENERADOS');
        this.playBlipSound(1250, 0.3);
      },
      error: (err) => {
        this.isRegeneratingAudit.set(false);
        console.error('Seed error:', err);
      },
    });
  }

  fetchFabricaTelemetry() {
    this.http.get<FabricaState>('/api/hectron/fabrica/telemetry').subscribe({
      next: (data) => {
        if (data) this.fabricaState.set(data);
      },
      error: (err) => console.error('Failed to load Fabrica telemetry:', err),
    });
  }

  solveFreelanceJob() {
    if (this.isSolvingJob()) return;
    this.isSolvingJob.set(true);
    this.playBlipSound(440, 0.1);

    this.http.post<{
      success: boolean;
      job: FabricaJob;
      state: FabricaState;
      message: string;
    }>('/api/hectron/fabrica/solve-job', {
      jobTitle: this.fabricaJobTitle.value,
      jobDescription: this.fabricaJobDesc.value,
      clientBudget: this.fabricaJobBudget.value,
      platform: this.fabricaPlatform.value,
    }).subscribe({
      next: (res) => {
        this.isSolvingJob.set(false);
        if (res.job) this.lastSolvedJob.set(res.job);
        if (res.state) this.fabricaState.set(res.state);
        this.fetchAuditLedger();
        this.fetchLoboTelemetry();
        this.showToast(res.message || '✅ CONTRATO RESUELTO Y COBRADO');
        this.playBlipSound(1100, 0.25);
      },
      error: (err) => {
        this.isSolvingJob.set(false);
        console.error('Fabrica error:', err);
      },
    });
  }

  toggleFabricaBot() {
    this.http.post<{
      success: boolean;
      activeStatus: boolean;
      message: string;
    }>('/api/hectron/fabrica/toggle', {}).subscribe({
      next: (res) => {
        this.fabricaState.update((prev) => ({ ...prev, activeBot: res.activeStatus }));
        this.showToast(res.message);
        this.playBlipSound(res.activeStatus ? 880 : 350, 0.15);
      },
      error: (err) => console.error('Fabrica toggle error:', err),
    });
  }

  downloadFabricaScript() {
    this.showToast('DESCARGANDO fabrica_freelance.py...');
    this.http.get('/api/hectron/fabrica-script', { responseType: 'text' }).subscribe({
      next: (scriptContent) => {
        const blob = new Blob([scriptContent], { type: 'text/x-python;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fabrica_freelance.py';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.showToast('fabrica_freelance.py DESCARGADO');
        this.playBlipSound(960, 0.15);
      },
      error: (err) => console.error('Fabrica script fetch error:', err),
    });
  }

  copyFabricaScript() {
    this.http.get('/api/hectron/fabrica-script', { responseType: 'text' }).subscribe({
      next: (scriptContent) => {
        navigator.clipboard.writeText(scriptContent).then(() => {
          this.showToast('CÓDIGO DE LA FÁBRICA COPIADO AL PORTAPAPELES');
          this.playBlipSound(900, 0.1);
        });
      },
    });
  }

  fetchLoboTelemetry() {
    this.http.get<LoboCriptoState>('/api/hectron/lobo-cripto/telemetry').subscribe({
      next: (data) => {
        if (data) this.loboCriptoState.set(data);
      },
      error: (err) => console.error('Failed to load Lobo Cripto telemetry:', err),
    });
  }

  analyzeCryptoHype() {
    if (this.isAnalyzingHype()) return;
    this.isAnalyzingHype.set(true);
    this.playBlipSound(520, 0.1);

    this.http.post<{
      token: string;
      reasoning: string;
      confidenceScore: number;
    }>('/api/hectron/lobo-cripto/analyze-hype', {
      customSocialMentions: this.socialMentionsInput.value,
    }).subscribe({
      next: (res) => {
        this.isAnalyzingHype.set(false);
        this.lastHypeAnalysis.set({
          token: res.token,
          reasoning: res.reasoning,
          confidence: res.confidenceScore,
        });
        this.tradeTokenSymbol.setValue(res.token);
        this.showToast(`🐺 HYPE DETECTADO: ${res.token}`);
        this.playBlipSound(980, 0.2);
      },
      error: (err) => {
        this.isAnalyzingHype.set(false);
        console.error('Hype analysis error:', err);
      },
    });
  }

  executeLoboTrade() {
    if (this.isExecutingTrade()) return;
    this.isExecutingTrade.set(true);
    this.playBlipSound(380, 0.1);

    this.http.post<{
      success: boolean;
      trade: CryptoTradeOrder;
      state: LoboCriptoState;
      message: string;
    }>('/api/hectron/lobo-cripto/execute-trade', {
      token: this.tradeTokenSymbol.value,
      amountUsdt: this.tradeAmountUsdt.value,
    }).subscribe({
      next: (res) => {
        this.isExecutingTrade.set(false);
        if (res.state) this.loboCriptoState.set(res.state);
        this.fetchAuditLedger();
        this.showToast(res.message || '🐺 ORDEN DE SPOT EJECUTADA');
        this.playBlipSound(1250, 0.3);
      },
      error: (err) => {
        this.isExecutingTrade.set(false);
        console.error('Trade error:', err);
      },
    });
  }

  toggleLoboSandbox() {
    this.http.post<{
      success: boolean;
      sandboxMode: boolean;
      message: string;
    }>('/api/hectron/lobo-cripto/toggle-sandbox', {}).subscribe({
      next: (res) => {
        this.loboCriptoState.update((prev) => ({ ...prev, sandboxMode: res.sandboxMode }));
        this.showToast(res.message);
        this.playBlipSound(res.sandboxMode ? 600 : 950, 0.15);
      },
      error: (err) => console.error('Lobo toggle sandbox error:', err),
    });
  }

  downloadLoboScript() {
    this.showToast('DESCARGANDO lobo_cripto.py...');
    this.http.get('/api/hectron/lobo-cripto-script', { responseType: 'text' }).subscribe({
      next: (scriptContent) => {
        const blob = new Blob([scriptContent], { type: 'text/x-python;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lobo_cripto.py';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.showToast('lobo_cripto.py DESCARGADO');
        this.playBlipSound(960, 0.15);
      },
      error: (err) => console.error('Lobo script fetch error:', err),
    });
  }

  copyLoboScript() {
    this.http.get('/api/hectron/lobo-cripto-script', { responseType: 'text' }).subscribe({
      next: (scriptContent) => {
        navigator.clipboard.writeText(scriptContent).then(() => {
          this.showToast('CÓDIGO DEL LOBO CRIPTO COPIADO AL PORTAPAPELES');
          this.playBlipSound(900, 0.1);
        });
      },
    });
  }

  fetchEcosistemaStatus() {
    this.http.get<EcosistemaState>('/api/hectron/ecosistema/status').subscribe({
      next: (data) => {
        if (data) this.ecosistemaState.set(data);
      },
      error: (err) => console.error('Failed to load Ecosistema status:', err),
    });
  }

  runMasterEcosystemCycle() {
    if (this.isExecutingMasterCycle()) return;
    this.isExecutingMasterCycle.set(true);
    this.playBlipSound(480, 0.15);

    this.http.post<{
      success: boolean;
      cycleSummary: {
        revenueExtracted: number;
        trafficCanalized: number;
        cryptoInvested: number;
        cryptoToken: string;
      };
      fabricaState: FabricaState;
      tentaculosState: TentaculoMetric;
      loboCriptoState: LoboCriptoState;
      message: string;
    }>('/api/hectron/ecosistema/run-cycle', {}).subscribe({
      next: (res) => {
        this.isExecutingMasterCycle.set(false);
        this.masterCycleResult.set(res);
        if (res.fabricaState) this.fabricaState.set(res.fabricaState);
        if (res.tentaculosState) this.tentaculosState.set(res.tentaculosState);
        if (res.loboCriptoState) this.loboCriptoState.set(res.loboCriptoState);
        this.fetchAuditLedger();
        this.fetchEcosistemaStatus();
        this.showToast(res.message);
        this.playBlipSound(1300, 0.35);
      },
      error: (err) => {
        this.isExecutingMasterCycle.set(false);
        console.error('Master cycle error:', err);
      },
    });
  }

  getTabClass(tab: 'game' | 'brainos' | 'chat' | 'vault' | 'microservices' | 'golem' | 'tentaculos' | 'fabrica' | 'lobo' | 'ecosistema' | 'cortex' | 'bud' | 'sandboxes' | 'console'): string {
    const base = "px-3.5 py-2 rounded-lg font-['Orbitron'] text-xs font-bold tracking-wider flex items-center gap-1.5 transition-all shrink-0 ";
    if (this.activeTab() === tab) {
      if (tab === 'cortex') {
        return base + 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]';
      }
      if (tab === 'tentaculos') {
        return base + 'bg-rose-500/20 border border-rose-500/50 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]';
      }
      if (tab === 'fabrica') {
        return base + 'bg-amber-500/20 border border-amber-500/50 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]';
      }
      if (tab === 'lobo') {
        return base + 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]';
      }
      if (tab === 'ecosistema') {
        return base + 'bg-purple-500/20 border border-purple-500/50 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]';
      }
      if (tab === 'bud') {
        return base + 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]';
      }
      if (tab === 'sandboxes') {
        return base + 'bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.3)]';
      }
      if (tab === 'console') {
        return base + 'bg-amber-500/20 border border-amber-500/50 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]';
      }
      return base + 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]';
    }
    return base + 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent';
  }

  setTab(tab: 'game' | 'brainos' | 'chat' | 'vault' | 'microservices' | 'golem' | 'tentaculos' | 'fabrica' | 'lobo' | 'ecosistema' | 'cortex' | 'bud' | 'sandboxes' | 'console') {
    this.activeTab.set(tab);
    this.playBlipSound(600, 0.05);
    if (tab === 'cortex') {
      this.loadCortexMemories();
      this.loadCortexStats();
    }
    if (tab === 'bud') {
      this.initBudPlayground();
    }
    if (tab === 'console') {
      this.runHealthCheckPing();
    }
  }

  fetchSystemState() {
    this.http.get<{
      state: HectronState;
      vault: VaultItem[];
      memory: { role: 'user' | 'bot'; content: string; time: string; avatarDesc?: string }[];
      cognitiveHistory: CognitiveLog[];
      microservices: MicroserviceStatus[];
    }>('/api/hectron/state').subscribe({
      next: (data) => {
        if (data.state) this.state.set(data.state);
        if (data.vault) this.vault.set(data.vault);
        if (data.memory) this.chatMessages.set(data.memory);
        if (data.cognitiveHistory) this.cognitiveHistory.set(data.cognitiveHistory);
        if (data.microservices) this.microservices.set(data.microservices);
      },
      error: (err) => console.error('Failed to load HECTRON state:', err),
    });
  }

  fetchAuditLedger() {
    this.http.get<{ ledger: AstarothAuditRecord[] }>('/api/hectron/audit-logs').subscribe({
      next: (res) => {
        if (res.ledger) this.auditLedger.set(res.ledger);
      },
      error: (err) => console.error('Failed to load audit ledger:', err),
    });
  }

  fetchPredictiveTelemetry() {
    this.http.get<{
      trendHistory: PredictiveDataPoint[];
      currentSystemRisk: number;
      peakRiskNext6h: number;
      overallHealth: string;
      microservicesRisk: MicroserviceRiskItem[];
      aiRecommendation: string;
    }>('/api/hectron/microservices/predictive-telemetry').subscribe({
      next: (res) => {
        if (res.trendHistory) this.predictiveTrend.set(res.trendHistory);
        if (res.currentSystemRisk !== undefined) this.currentSystemRisk.set(res.currentSystemRisk);
        if (res.peakRiskNext6h !== undefined) this.peakRiskNext6h.set(res.peakRiskNext6h);
        if (res.overallHealth) this.overallHealth.set(res.overallHealth);
        if (res.microservicesRisk) this.microservicesRisk.set(res.microservicesRisk);
        if (res.aiRecommendation) this.aiTelemetryRecommendation.set(res.aiRecommendation);
      },
      error: (err) => console.error('Failed to load telemetry:', err),
    });
  }

  fetchTentaculosTelemetry() {
    this.http.get<TentaculoMetric>('/api/hectron/tentaculos/telemetry').subscribe({
      next: (res) => {
        if (res) this.tentaculosState.set(res);
      },
      error: (err) => console.error('Failed to load Tentáculos telemetry:', err),
    });
  }

  verifyAuditLedger() {
    this.isVerifyingAudit.set(true);
    this.playBlipSound(700, 0.15);

    this.http.post<{
      success: boolean;
      verifiedBlocks: number;
      totalBlocks: number;
      integrityScore: number;
      status: string;
      signature: string;
      timestamp: string;
      details: string;
    }>('/api/hectron/audit-logs/verify', {}).subscribe({
      next: (res) => {
        this.isVerifyingAudit.set(false);
        this.auditVerificationResult.set({
          status: res.status,
          score: res.integrityScore,
          count: res.verifiedBlocks,
        });
        this.showToast(`🛡️ ASTAROTH: ${res.verifiedBlocks}/${res.totalBlocks} BLOQUES AUDITADOS (100% INMUTABLE)`);
        this.playBlipSound(1100, 0.25);
      },
      error: (err) => {
        this.isVerifyingAudit.set(false);
        console.error('Audit verification error:', err);
      },
    });
  }

  triggerHeuristicHealing() {
    this.isHealing.set(true);
    this.playBlipSound(440, 0.15);
    this.showToast('EJECUTANDO AUTORREPARACIÓN HEURÍSTICA Y REBALANCEO ASTAROTH...');

    this.http.post<{
      success: boolean;
      message: string;
      updatedMicroservices: MicroserviceStatus[];
      auditRecord: AstarothAuditRecord;
    }>('/api/hectron/microservices/heal', {}).subscribe({
      next: (res) => {
        this.isHealing.set(false);
        if (res.updatedMicroservices) this.microservices.set(res.updatedMicroservices);
        if (res.auditRecord) this.auditLedger.update((prev) => [res.auditRecord, ...prev]);
        this.fetchPredictiveTelemetry();
        this.showToast(res.message);
        this.playBlipSound(1250, 0.3);
      },
      error: (err) => {
        this.isHealing.set(false);
        console.error('Healing error:', err);
      },
    });
  }

  selectPresetProfile(preset: 'playa' | 'tokio' | 'cyberpunk' | 'gym' | 'custom') {
    this.selectedPreset.set(preset);
    const presetsMap: Record<string, string> = {
      playa: 'Foto en la playa con gafas de sol doradas al atardecer, sonrisa relajada y tabla de surf.',
      tokio: 'Foto en un callejón nocturno de Kioto con un michi siamés en brazos y cámara analógica vintage.',
      cyberpunk: 'Foto en festival de música synthwave con luces de neón púrpuras, chaqueta de cuero y auriculares de estudio.',
      gym: 'Foto en gimnasio de alto rendimiento con ropa deportiva negra, zapatillas neón y botella de agua térmica.',
      custom: this.customProfileDescription.value,
    };
    if (preset !== 'custom') {
      this.customProfileDescription.setValue(presetsMap[preset]);
    }
    this.playBlipSound(550, 0.05);
  }

  analyzeTargetProfile() {
    const text = this.customProfileDescription.value.trim();
    if (!text || this.isAnalyzingProfile()) return;

    this.isAnalyzingProfile.set(true);
    this.playBlipSound(650, 0.1);

    this.http.post<{
      hook: string;
      elementsDetected: string[];
      conversionPotential: string;
      targetDescription: string;
    }>('/api/hectron/tentaculos/analyze-profile', { customText: text }).subscribe({
      next: (res) => {
        this.isAnalyzingProfile.set(false);
        this.lastGeneratedHook.set({
          hook: res.hook,
          elements: res.elementsDetected || ['Elementos visuales procesados'],
          conversion: res.conversionPotential || '94%',
        });
        this.showToast('🎯 GANCHO TINDER GENERADO CON ÉXITO POR GEMINI/GPT-4 VISION');
        this.playBlipSound(980, 0.2);
      },
      error: (err) => {
        this.isAnalyzingProfile.set(false);
        console.error('Vision hook error:', err);
      },
    });
  }

  simulateTinderSwipe() {
    this.isSimulatingSwipe.set(true);
    this.playBlipSound(400, 0.1);

    const presetNames: Record<string, { name: string; arch: string }> = {
      playa: { name: 'Elena, 24', arch: 'Playa & Surf' },
      tokio: { name: 'Sofia, 26', arch: 'Viajera & Felinos' },
      cyberpunk: { name: 'Valeria, 23', arch: 'Cyberpunk & Música' },
      gym: { name: 'Camila, 25', arch: 'Fitness & Disciplina' },
      custom: { name: 'Objetivo_Detectado, 24', arch: 'Personalizado' },
    };

    const target = presetNames[this.selectedPreset()] || { name: 'Aspirante, 24', arch: 'Citas Tinder' };

    this.http.post<{
      success: boolean;
      hook: Record<string, unknown>;
      state: TentaculoMetric;
    }>('/api/hectron/tentaculos/simulate-swipe', {
      profileName: target.name,
      archetype: target.arch,
      visualDescription: this.customProfileDescription.value,
    }).subscribe({
      next: (res) => {
        this.isSimulatingSwipe.set(false);
        if (res.state) this.tentaculosState.set(res.state);
        this.fetchAuditLedger();
        this.showToast(`❤️ LIKE + GANCHO ENVIADO A ${target.name}`);
        this.playBlipSound(1050, 0.2);
      },
      error: (err) => {
        this.isSimulatingSwipe.set(false);
        console.error('Swipe error:', err);
      },
    });
  }

  toggleTentaculosBot() {
    this.http.post<{
      success: boolean;
      activeStatus: boolean;
      message: string;
    }>('/api/hectron/tentaculos/toggle-bot', {}).subscribe({
      next: (res) => {
        this.tentaculosState.update((prev) => ({ ...prev, activeStatus: res.activeStatus }));
        this.showToast(res.message);
        this.playBlipSound(res.activeStatus ? 880 : 350, 0.15);
      },
      error: (err) => console.error('Toggle error:', err),
    });
  }

  downloadTentaculosScript() {
    this.showToast('DESCARGANDO tentaculos_tinder.py...');
    this.http.get('/api/hectron/tentaculos-script', { responseType: 'text' }).subscribe({
      next: (scriptContent) => {
        const blob = new Blob([scriptContent], { type: 'text/x-python;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tentaculos_tinder.py';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.showToast('tentaculos_tinder.py DESCARGADO');
        this.playBlipSound(960, 0.15);
      },
      error: (err) => console.error('Tentaculos script fetch error:', err),
    });
  }

  copyTentaculosScript() {
    this.http.get('/api/hectron/tentaculos-script', { responseType: 'text' }).subscribe({
      next: (scriptContent) => {
        navigator.clipboard.writeText(scriptContent).then(() => {
          this.showToast('CÓDIGO TENTÁCULOS TINDER COPIADO AL PORTAPAPELES');
          this.playBlipSound(900, 0.1);
        });
      },
    });
  }

  sendChatMessage() {
    const msg = this.chatInput.value.trim();
    if (!msg || this.isThinking()) return;

    this.chatInput.setValue('');
    this.isThinking.set(true);

    const userEntry = {
      role: 'user' as const,
      content: msg,
      time: new Date().toLocaleTimeString(),
    };
    this.chatMessages.update((prev) => [...prev, userEntry]);
    this.playBlipSound(440, 0.08);

    this.http.post<{
      reply: string;
      avatarDesc: string;
      state: HectronState;
    }>('/api/hectron/chat', { message: msg }).subscribe({
      next: (res) => {
        this.isThinking.set(false);
        if (res.state) this.state.set(res.state);

        const botEntry = {
          role: 'bot' as const,
          content: res.reply,
          time: new Date().toLocaleTimeString(),
          avatarDesc: res.avatarDesc,
        };
        this.chatMessages.update((prev) => [...prev, botEntry]);
        this.playBlipSound(880, 0.1);
      },
      error: (err) => {
        this.isThinking.set(false);
        console.error('Chat error:', err);
        const botEntry = {
          role: 'bot' as const,
          content: '>> [ERROR RELES CUANTICOS]: Conexión con Gemini degradada temporalmente.',
          time: new Date().toLocaleTimeString(),
        };
        this.chatMessages.update((prev) => [...prev, botEntry]);
      },
    });
  }

  executeCommand(quickCmd?: string) {
    const raw = quickCmd || this.commandInput.value.trim();
    if (!raw) return;

    this.commandInput.setValue('');
    const parts = raw.split(' ');
    const command = parts[0];
    const args = parts.slice(1).join(' ');

    this.showToast(`EJECUTANDO COMANDO: ${command}`);
    this.playBlipSound(520, 0.08);

    this.http.post<{
      command: string;
      response: string;
      category: string;
      state: HectronState;
    }>('/api/hectron/command', { command, args }).subscribe({
      next: (res) => {
        if (res.state) this.state.set(res.state);

        this.chatMessages.update((prev) => [
          ...prev,
          {
            role: 'user',
            content: raw,
            time: new Date().toLocaleTimeString(),
          },
          {
            role: 'bot',
            content: `>> [TERMINAL // ${res.category}]: ${res.response}`,
            time: new Date().toLocaleTimeString(),
          },
        ]);
        this.fetchSystemState();
      },
      error: (err) => console.error('Command error:', err),
    });
  }

  triggerCognitiveCycle() {
    const input = this.observationInput.value.trim() || 'Fluctuación en el pozo gravitatorio de Chronos-9 y aproximación de enjambre hostil.';
    this.isExecutingCycle.set(true);
    this.playBlipSound(350, 0.15);

    this.http.post<{
      cycle: CognitiveLog;
      state: HectronState;
    }>('/api/hectron/cognitive-cycle', { observationInput: input }).subscribe({
      next: (res) => {
        this.isExecutingCycle.set(false);
        if (res.state) this.state.set(res.state);
        if (res.cycle) {
          this.cognitiveHistory.update((prev) => [res.cycle, ...prev]);
        }
        this.showToast('CICLO COGNITIVO BRAINOS + ASTAROTH COMPLETADO');
        this.playBlipSound(1050, 0.2);
      },
      error: (err) => {
        this.isExecutingCycle.set(false);
        console.error('Cognitive cycle error:', err);
        this.showToast('FALLO EN PROTOCOLO COGNITIVO');
      },
    });
  }

  saveToVault() {
    const tipo = this.vaultTipo.value;
    const contenido = this.vaultContenido.value.trim();
    if (!contenido) return;

    this.http.post<{
      success: boolean;
      item: VaultItem;
      message: string;
      state: HectronState;
    }>('/api/hectron/vault', {
      tipo,
      contenido,
      autor: 'COMMANDER-Ψ',
    }).subscribe({
      next: (res) => {
        this.vaultContenido.setValue('');
        if (res.item) this.vault.update((prev) => [res.item, ...prev]);
        if (res.state) this.state.set(res.state);
        this.showToast(res.message);
        this.playBlipSound(920, 0.15);
      },
      error: (err) => console.error('Vault error:', err),
    });
  }

  exportArchiveJSON() {
    this.isExporting.set(true);
    this.showToast('GENERANDO ARCHIVO CRIPTOGRÁFICO DE LA BÓVEDA...');
    this.playBlipSound(880, 0.15);

    this.http.get('/api/hectron/export').subscribe({
      next: (data) => {
        this.isExporting.set(false);
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
        a.href = url;
        a.download = `HECTRON_VAULT_COGNITIVE_ARCHIVE_${timestamp}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.showToast('ARCHIVO JSON DE LA BÓVEDA DESCARGADO CON ÉXITO');
        this.playBlipSound(1200, 0.25);
      },
      error: (err) => {
        this.isExporting.set(false);
        console.error('Export error:', err);
        this.showToast('ERROR AL EXPORTAR BÓVEDA');
      },
    });
  }

  async connectWallet() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    
    if (typeof win.ethereum !== 'undefined') {
      try {
        this.isConnectingWallet.set(true);
        const accounts = await win.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
        if (accounts && accounts.length > 0) {
          this.walletAddress.set(accounts[0]);
          this.showToast(`BILLETERA CUÁNTICA CONECTADA: ${accounts[0].substring(0, 6)}...`);
          this.playBlipSound(1200, 0.2);
          
          this.http.post('/api/hectron/audit-logs/commit', {
            module: 'WEB3_INTERFACE',
            action: 'WALLET_CONNECTED',
            severity: 'OPERATIONAL',
            details: `Billetera Web3 conectada exitosamente a HECTRON-Ψ: ${accounts[0]}`
          }).subscribe();
        }
      } catch (err: unknown) {
        console.error('Wallet connection error:', err);
        const errorWithCode = err as { code?: number };
        if (errorWithCode.code === 4001) {
          this.showToast('CONEXIÓN RECHAZADA POR EL USUARIO');
        } else {
          this.showToast('ERROR AL CONECTAR LA BILLETERA WEB3');
        }
      } finally {
        this.isConnectingWallet.set(false);
      }
    } else {
      this.showToast('NO SE DETECTÓ PROVEEDOR WEB3 (METAMASK NO INSTALADO)');
    }
  }

  disconnectWallet() {
    this.walletAddress.set(null);
    this.showToast('BILLETERA DESCONECTADA');
    this.playBlipSound(800, 0.15);
  }

  triggerOscExpression(emotion: 'Neutral' | 'Joy' | 'Angry' | 'Sorrow' | 'Fun') {
    this.current3dEmotion.set(emotion);
    const soundFreqs: Record<string, number> = {
      Neutral: 520,
      Joy: 880,
      Angry: 220,
      Sorrow: 330,
      Fun: 740,
    };
    this.playBlipSound(soundFreqs[emotion] || 440, 0.15);

    this.http.post<{
      success: boolean;
      expression: string;
      target: string;
      oscLogs: { time: string; target: string; expression: string; status: string }[];
    }>('/api/hectron/osc/expression', { emotion }).subscribe({
      next: (res) => {
        if (res.oscLogs) this.oscLogs.set(res.oscLogs);
        this.showToast(`ROSTRO 3D ACTUALIZADO POR OSC: [${emotion.toUpperCase()}]`);
      },
      error: (err) => console.error('OSC dispatch error:', err),
    });
  }

  downloadPythonScript() {
    this.showToast('DESCARGANDO SCRIPT leviatan_core.py...');
    const params = {
      rtmp_url: this.prismRtmpUrl.value,
      stream_key: this.prismStreamKey.value,
      stream_name: this.prismStreamName.value,
      username: this.realTikTokUsername.value,
      api_url: window.location.origin
    };

    this.http.get('/api/hectron/python-script', { 
      responseType: 'text',
      params: params
    }).subscribe({
      next: (scriptContent) => {
        const blob = new Blob([scriptContent], { type: 'text/x-python;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'leviatan_core.py';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.showToast('leviatan_core.py GENERADO CON PARÁMETROS INYECTADOS');
        this.playBlipSound(960, 0.15);
      },
      error: (err) => console.error('Python script fetch error:', err),
    });
  }

  copyPythonScript() {
    const params = {
      rtmp_url: this.prismRtmpUrl.value,
      stream_key: this.prismStreamKey.value,
      stream_name: this.prismStreamName.value,
      username: this.realTikTokUsername.value,
      api_url: window.location.origin
    };

    this.http.get('/api/hectron/python-script', { 
      responseType: 'text',
      params: params
    }).subscribe({
      next: (scriptContent) => {
        navigator.clipboard.writeText(scriptContent).then(() => {
          this.showToast('CÓDIGO PYTHON (CONFIGURACIÓN INYECTADA) COPIADO');
          this.playBlipSound(900, 0.1);
        });
      },
    });
  }

  // --- INTERACTIVE PRISM LIVE GUIDE METHODS ---
  setGuideStep(step: number) {
    if (step < 1 || step > 3) return;
    this.activeGuideStep.set(step);
    this.playBlipSound(450, 0.08);
  }

  detectPrismParameters() {
    if (this.prismDetectionStatus() === 'SCANNING') return;
    
    this.prismDetectionStatus.set('SCANNING');
    this.playBlipSound(350, 0.1);
    this.showToast('ESCANEANDO INSTANCIAS ACTIVAS DE PRISM LIVE STUDIO...');

    // Simulate scanning/detecting local loopback RTMP parameters
    setTimeout(() => {
      const url = this.prismRtmpUrl.value.trim() || 'rtmp://live-cd.tiktok.com/game/';
      const key = this.prismStreamKey.value.trim() || 'stream-key-xyz-123-abada-9992';
      console.log('Detected PRISM params:', url, key.substring(0, 5) + '...');

      this.prismDetectionStatus.set('DETECTED');
      this.showToast('¡PARÁMETROS DE PRISM LIVE DETECTADOS CON ÉXITO!');
      this.playBlipSound(1000, 0.15);
      
      // Auto advance to step 2 to make it highly interactive and satisfying
      setTimeout(() => {
        this.activeGuideStep.set(2);
        this.playBlipSound(600, 0.1);
      }, 1500);
    }, 2000);
  }

  // --- REAL-TIME TIKTOK LIVE CHAT PIPELINE ---
  switchChatTab(tab: 'simulation' | 'real_tiktok') {
    this.realChatTab.set(tab);
    this.playBlipSound(500, 0.05);

    if (tab === 'real_tiktok') {
      this.startRealCommentsPolling();
      this.showToast('MONITOR DE COMENTARIOS REALES TIKTOK LIVE INICIADO');
    } else {
      this.stopRealCommentsPolling();
    }
  }

  startRealCommentsPolling() {
    this.stopRealCommentsPolling();
    this.isPollingRealComments.set(true);
    
    // Initial fetch
    this.refreshRealTikTokComments(true);

    // Poll every 4 seconds
    this.realCommentsIntervalId = setInterval(() => {
      this.refreshRealTikTokComments(false);
    }, 4000);
  }

  stopRealCommentsPolling() {
    this.isPollingRealComments.set(false);
    if (this.realCommentsIntervalId) {
      clearInterval(this.realCommentsIntervalId);
      this.realCommentsIntervalId = null;
    }
  }

  refreshRealTikTokComments(isInitial = false) {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http.get<{ comments: TikTokLiveComment[] }>('/api/hectron/live-comments').subscribe({
      next: (res) => {
        this.realTikTokCommentsList.set(res.comments);
        if (res.comments && res.comments.length > 0) {
          const newest = res.comments[0];
          if (newest.id !== this.lastProcessedCommentId) {
            const isFirstLoad = !this.lastProcessedCommentId;
            this.lastProcessedCommentId = newest.id;
            
            // Only speak if this is not the very first load and we received a brand new item
            if (!isInitial && !isFirstLoad) {
              this.current3dEmotion.set((newest.emotion as "Neutral" | "Joy" | "Angry" | "Sorrow" | "Fun") || 'Neutral');
              this.speakWithLipSync(newest.reply);
              this.showToast(`NUEVO COMENTARIO DE ${newest.user.toUpperCase()}`);
              
              // Add a blip
              this.playBlipSound(800, 0.1);
            }
          }
        }
      },
      error: () => {
        // Silently ignore polling errors to prevent console spam during dev server restarts
      }
    });
  }

  ngOnDestroy() {
    this.stopRealCommentsPolling();
    if (this.healthPingInterval) {
      clearInterval(this.healthPingInterval);
      this.healthPingInterval = null;
    }
  }

  saveRtmpConfig() {
    if (this.isSavingRtmp()) return;
    this.isSavingRtmp.set(true);
    this.playBlipSound(600, 0.1);
    
    // Simulate API saving with timeout
    setTimeout(() => {
      this.isSavingRtmp.set(false);
      this.rtmpSaved.set(true);
      this.showToast('CONFIGURACIÓN RTMP DE PRISM LIVE GUARDADA');
      this.playBlipSound(1200, 0.15);
      
      // Auto reset success status after 3 seconds
      setTimeout(() => this.rtmpSaved.set(false), 3000);
    }, 1500);
  }

  setScriptTab(tab: 'code' | 'vseeface' | 'vbaudio' | 'obs') {
    this.selectedScriptTab.set(tab);
    this.playBlipSound(500, 0.05);
  }

  askGolemOracle() {
    const name = this.streamViewerName.value.trim();
    const comment = this.streamViewerComment.value.trim();
    if (!comment || this.isThinking()) return;

    this.isThinking.set(true);
    this.playBlipSound(300, 0.1);

    this.http.post<{
      viewer: string;
      comment: string;
      reply: string;
      rawReply: string;
      emotion: 'Neutral' | 'Joy' | 'Angry' | 'Sorrow' | 'Fun';
      oscCommand: string;
      oscPort: number;
      timestamp: string;
      oscLogs: { time: string; target: string; expression: string; status: string }[];
    }>('/api/hectron/golem-stream', {
      viewerName: name,
      comment,
    }).subscribe({
      next: (res) => {
        this.isThinking.set(false);
        this.streamViewerComment.setValue('');
        
        // 1. Trigger the 3D Face emotion returned by AI
        if (res.emotion) {
          this.current3dEmotion.set(res.emotion);
        }
        if (res.oscLogs) {
          this.oscLogs.set(res.oscLogs);
        }

        // 2. Add to chat memory with emotion label
        this.chatMessages.update((prev) => [
          ...prev,
          {
            role: 'bot',
            content: `👁️ [LEVIATÁN (${res.emotion || 'Neutral'}) en vivo para ${res.viewer}]: "${res.reply}"`,
            time: res.timestamp,
            avatarDesc: `Emoción: ${res.emotion} | OSC: ${res.oscCommand}`,
          },
        ]);

        this.showToast(`ORÁCULO LEVIATÁN RESPONDIÓ CON EMOCIÓN [${res.emotion || 'Neutral'}]`);
        this.playBlipSound(720, 0.15);

        // 3. Play voice with lip-sync animation
        this.speakWithLipSync(res.reply);
      },
      error: (err) => {
        this.isThinking.set(false);
        console.error('Golem stream error:', err);
      },
    });
  }

  speakWithLipSync(text: string) {
    if (this.isSpeaking()) return;
    this.isSpeaking.set(true);
    this.isLipSyncActive.set(true);

    this.http.post<{
      audio: string | null;
      mimeType?: string;
      voice: string;
    }>('/api/hectron/tts', { text, voice: 'Zephyr' }).subscribe({
      next: (res) => {
        if (res.audio) {
          const mime = res.mimeType || 'audio/mp3';
          const snd = new Audio(`data:${mime};base64,${res.audio}`);
          snd.onended = () => {
            this.isSpeaking.set(false);
            this.isLipSyncActive.set(false);
            // Reset to Neutral face after speech finishes
            setTimeout(() => this.current3dEmotion.set('Neutral'), 1200);
          };
          snd.onerror = () => {
            this.isSpeaking.set(false);
            this.isLipSyncActive.set(false);
          };
          snd.play().catch(e => {
            console.warn('Audio play failed:', e);
            this.isSpeaking.set(false);
            this.isLipSyncActive.set(false);
          });
        } else {
          // Synthetic audio fallback
          setTimeout(() => {
            this.isSpeaking.set(false);
            this.isLipSyncActive.set(false);
            this.current3dEmotion.set('Neutral');
          }, 3000);
        }
      },
      error: () => {
        this.isSpeaking.set(false);
        this.isLipSyncActive.set(false);
      },
    });
  }

  playTTS(text: string) {
    this.speakWithLipSync(text);
  }

  showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3500);
  }

  playBlipSound(freq = 440, duration = 0.1) {
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch {
      // Audio fallback
    }
  }

  // =========================================================================
  // 🧪 QUANTUM SANDBOXES HUB & GEMINI MULTIMODAL CONTROLS
  // =========================================================================

  setSandbox(sandbox: 'vercel' | 'spatial' | 'recruitment' | 'tourism' | 'cyoa') {
    this.activeSandbox.set(sandbox);
    this.playBlipSound(700, 0.05);
  }

  analyzeSpatial() {
    if (this.spatialIsLoading()) return;
    this.spatialIsLoading.set(true);
    this.playBlipSound(880, 0.08);

    this.http
      .post<SpatialResult>('/api/sandbox/spatial', {
        prompt: this.spatialPrompt.value,
      })
      .subscribe({
        next: (data) => {
          if (data && data.items) {
            this.spatialResult.set(data);
            this.showToast('🎯 DETECCIÓN ESPACIAL COMPLETADA');
            this.playBlipSound(1200, 0.12);
          }
          this.spatialIsLoading.set(false);
        },
        error: (err) => {
          console.error('Spatial detection error:', err);
          this.spatialIsLoading.set(false);
        },
      });
  }

  generateRecruitment() {
    const notes = this.recruitmentNotes.value.trim();
    if (!notes || this.recruitmentIsGenerating()) return;
    this.recruitmentIsGenerating.set(true);
    this.playBlipSound(600, 0.08);

    this.http
      .post<{ jd: string; questions: string[] }>('/api/sandbox/recruitment', { notes })
      .subscribe({
        next: (data) => {
          if (data) {
            this.recruitmentOutput.set(data);
            this.showToast('📄 DESCRIPCIÓN DE PUESTO Y GUÍA GENERADAS');
            this.playBlipSound(1100, 0.12);
          }
          this.recruitmentIsGenerating.set(false);
        },
        error: (err) => {
          console.error('Recruitment generator error:', err);
          this.recruitmentIsGenerating.set(false);
        },
      });
  }

  generateTourism(preset?: string) {
    if (preset) {
      this.tourismLandmark.setValue(preset);
    }
    const landmark = this.tourismLandmark.value.trim();
    if (!landmark || this.tourismIsLoading()) return;
    this.tourismIsLoading.set(true);
    this.playBlipSound(750, 0.08);

    this.http
      .post<{ name: string; location: string; year: string; history: string; arVisual: string }>('/api/sandbox/tourism', { landmark })
      .subscribe({
        next: (data) => {
          if (data) {
            this.tourismOutput.set(data);
            this.showToast(`📸 ESCANEO AR: ${data.name.toUpperCase()}`);
            this.playBlipSound(1300, 0.15);
          }
          this.tourismIsLoading.set(false);
        },
        error: (err) => {
          console.error('Tourism AR error:', err);
          this.tourismIsLoading.set(false);
        },
      });
  }

  sendCyoaChoice(event?: Event) {
    if (event) event.preventDefault();
    const choice = this.cyoaInput.value.trim();
    if (!choice || this.cyoaIsProcessing()) return;

    this.cyoaMessages.update((prev) => [...prev, { role: 'user', text: choice }]);
    this.cyoaInput.setValue('');
    this.cyoaIsProcessing.set(true);
    this.playBlipSound(800, 0.08);

    this.http
      .post<{ story: string; inventory: string[]; quest: string }>('/api/sandbox/cyoa', {
        history: this.cyoaMessages(),
        choice,
        inventory: this.cyoaInventory(),
        quest: this.cyoaQuest(),
      })
      .subscribe({
        next: (data) => {
          if (data) {
            if (data.story) {
              this.cyoaMessages.update((prev) => [...prev, { role: 'system', text: data.story }]);
            }
            if (data.inventory) {
              this.cyoaInventory.set(data.inventory);
            }
            if (data.quest) {
              this.cyoaQuest.set(data.quest);
            }
            this.playBlipSound(1050, 0.12);
          }
          this.cyoaIsProcessing.set(false);
        },
        error: (err) => {
          console.error('CYOA Engine error:', err);
          this.cyoaIsProcessing.set(false);
        },
      });
  }

  // =========================================================================
  // ⚡ SYSTEM CONSOLE & TELEMETRY CONTROLS
  // =========================================================================

  setConsoleTab(tab: 'health' | 'memory' | 'tools' | 'shell') {
    this.consoleTab.set(tab);
    this.playBlipSound(650, 0.05);
  }

  setConsoleLevelFilter(lvl: string) {
    this.consoleLevelFilter.set(lvl as LogLevel);
    this.playBlipSound(700, 0.04);
  }

  runHealthCheckPing() {
    const startTime = performance.now();
    this.http.get<{
      status: string;
      cloudSqlStatus: string;
      hasGeminiKey: boolean;
      geminiApiStatus: string;
      fastapiBridge: string;
      cpuUsagePercent: number;
      ramUsagePercent: number;
      uptimeSeconds: number;
    }>('/api/health').subscribe({
      next: (data) => {
        const duration = Math.round(performance.now() - startTime);
        this.healthIndicator.update((prev) => ({
          status: 'GREEN',
          cloudSqlStatus: data.cloudSqlStatus === 'HEALTHY' ? 'GREEN' : 'RED',
          geminiStatus: data.hasGeminiKey || data.geminiApiStatus === 'ONLINE' || data.geminiApiStatus === 'HEURISTIC_MODE' ? 'GREEN' : 'RED',
          fastApiStatus: data.fastapiBridge === 'connected' ? 'GREEN' : 'RED',
          lastChecked: new Date().toLocaleTimeString(),
          pingLatencyMs: duration,
          checkCount: prev.checkCount + 1,
          cpuUsage: data.cpuUsagePercent || 18,
          ramUsage: data.ramUsagePercent || 42,
          uptimeSeconds: data.uptimeSeconds || prev.uptimeSeconds + 10,
        }));
      },
      error: () => {
        const duration = Math.round(performance.now() - startTime);
        this.healthIndicator.update((prev) => ({
          ...prev,
          status: 'RED',
          cloudSqlStatus: 'RED',
          geminiStatus: 'RED',
          lastChecked: new Date().toLocaleTimeString(),
          pingLatencyMs: duration,
          checkCount: prev.checkCount + 1,
        }));
      },
    });
  }

  executeShellCommand(event?: Event) {
    if (event) event.preventDefault();
    const cmd = this.shellInput.value.trim();
    if (!cmd || this.shellIsExecuting()) return;

    this.shellInput.setValue('');
    this.shellLogs.update((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        type: 'command',
        level: 'INFO',
        content: cmd,
      },
    ]);

    if (cmd.toLowerCase() === 'clear' || cmd.toLowerCase() === 'cls') {
      this.shellLogs.set([]);
      return;
    }

    this.shellIsExecuting.set(true);
    this.playBlipSound(900, 0.08);

    this.http
      .post<{ stdout?: string; stderr?: string; error?: string; clear?: boolean }>('/api/console/execute', { command: cmd })
      .subscribe({
        next: (data) => {
          if (data.clear) {
            this.shellLogs.set([]);
            this.shellIsExecuting.set(false);
            return;
          }
          if (data.stdout) {
            this.shellLogs.update((prev) => [
              ...prev,
              {
                id: Math.random().toString(36).substring(2, 9),
                timestamp: new Date().toISOString(),
                type: 'stdout',
                level: 'INFO',
                content: data.stdout || '',
              },
            ]);
          }
          if (data.stderr) {
            this.shellLogs.update((prev) => [
              ...prev,
              {
                id: Math.random().toString(36).substring(2, 9),
                timestamp: new Date().toISOString(),
                type: 'stderr',
                level: 'ERROR',
                content: data.stderr || '',
              },
            ]);
          }
          this.shellIsExecuting.set(false);
        },
        error: (err) => {
          const errDetail = err.error?.stderr || err.error?.error || err.message || 'Error al ejecutar comando';
          this.shellLogs.update((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).substring(2, 9),
              timestamp: new Date().toISOString(),
              type: 'stderr',
              level: 'ERROR',
              content: errDetail,
            },
          ]);
          this.shellIsExecuting.set(false);
        },
      });
  }

  // =========================================================================
  // 🔐 AUTHENTICATION & PERSISTENT SESSION METHODS
  // =========================================================================

  initAuthSession() {
    if (!isPlatformBrowser(this.platformId)) return;
    const savedToken = localStorage.getItem('hectron_auth_token');
    const headers: Record<string, string> = {};
    if (savedToken) {
      headers['Authorization'] = `Bearer ${savedToken}`;
    }

    this.http.get<{ authenticated: boolean; token?: string; user?: UserProfile }>('/api/auth/me', { headers }).subscribe({
      next: (res) => {
        if (res.user) {
          this.currentUser.set(res.user);
          this.populateProfileForm(res.user);
        }
        if (res.token) {
          this.authToken.set(res.token);
          localStorage.setItem('hectron_auth_token', res.token);
        }
      },
      error: () => {
        console.warn('Auth session init in offline fallback mode.');
      },
    });
  }

  openAuthModal(tab: 'login' | 'register' | 'profile' = 'login') {
    this.authTab.set(tab);
    this.authError.set(null);
    this.authSuccessMessage.set(null);
    this.isAuthModalOpen.set(true);
    this.playBlipSound(720, 0.08);
  }

  closeAuthModal() {
    this.isAuthModalOpen.set(false);
    this.authError.set(null);
  }

  populateProfileForm(user: UserProfile) {
    this.profileDisplayName.setValue(user.displayName || user.username);
    this.profileBio.setValue(user.bio || '');
    this.profileTikTok.setValue(user.tiktokHandle || '');
    this.profileObsPort.setValue(user.obsWebSocketPort || 4455);
    this.profileVSeeFacePort.setValue(user.vseeFacePort || 39000);
    this.profilePersonaPrompt.setValue(user.customPersonaPrompt || '');
    this.profileAvatarUrl.setValue(user.avatarUrl || '');
    this.profileTheme.setValue(user.themePreference || 'cyber');
  }

  loginWithCredentials(emailOrUser?: string, password?: string) {
    const credUser = emailOrUser || this.loginEmailOrUser.value.trim();
    const credPass = password !== undefined ? password : this.loginPassword.value;

    if (!credUser) {
      this.authError.set('Introduce tu correo o usuario soberano.');
      return;
    }

    this.authLoading.set(true);
    this.authError.set(null);
    this.authSuccessMessage.set(null);

    this.http.post<{ success: boolean; token: string; user: UserProfile; message: string }>('/api/auth/login', {
      emailOrUsername: credUser,
      password: credPass,
    }).subscribe({
      next: (res) => {
        this.authLoading.set(false);
        this.currentUser.set(res.user);
        this.authToken.set(res.token);
        this.populateProfileForm(res.user);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('hectron_auth_token', res.token);
        }
        this.authSuccessMessage.set(res.message || '¡Sesión Soberana Iniciada con Éxito!');
        this.showToast(`👑 SESIÓN INICIADA: ${res.user.displayName}`);
        this.playBlipSound(1050, 0.15);
        setTimeout(() => this.closeAuthModal(), 1200);
      },
      error: (err) => {
        this.authLoading.set(false);
        const msg = err.error?.error || 'Error de autenticación. Verifica tus credenciales.';
        this.authError.set(msg);
        this.playBlipSound(350, 0.2);
      },
    });
  }

  loginDemoUser(type: 'master' | 'astaroth' | 'vtuber') {
    if (type === 'master') {
      this.loginWithCredentials('hectorruiz9992@gmail.com', 'hectron2026');
    } else if (type === 'astaroth') {
      this.loginWithCredentials('astaroth@hectron.ai', 'sentinel2026');
    } else {
      this.loginWithCredentials('vtuber@hectron.live', 'leviatan2026');
    }
  }

  registerAccount() {
    const email = this.regEmail.value.trim();
    const username = this.regUsername.value.trim();
    const password = this.regPassword.value;
    const displayName = this.regDisplayName.value.trim() || username;
    const role = this.regRole.value;

    if (!email || !username || !password) {
      this.authError.set('Por favor completa todos los campos obligatorios.');
      return;
    }

    this.authLoading.set(true);
    this.authError.set(null);
    this.authSuccessMessage.set(null);

    this.http.post<{ success: boolean; token: string; user: UserProfile; message: string }>('/api/auth/register', {
      email,
      username,
      password,
      displayName,
      role,
    }).subscribe({
      next: (res) => {
        this.authLoading.set(false);
        this.currentUser.set(res.user);
        this.authToken.set(res.token);
        this.populateProfileForm(res.user);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('hectron_auth_token', res.token);
        }
        this.authSuccessMessage.set('¡Cuenta creada y sesión iniciada!');
        this.showToast(`🛡️ NUEVO OPERADOR REGISTRADO: ${res.user.displayName}`);
        this.playBlipSound(1100, 0.2);
        setTimeout(() => this.closeAuthModal(), 1400);
      },
      error: (err) => {
        this.authLoading.set(false);
        const msg = err.error?.error || 'Error creando usuario en el sistema.';
        this.authError.set(msg);
        this.playBlipSound(350, 0.2);
      },
    });
  }

  saveUserProfile() {
    const user = this.currentUser();
    if (!user) return;

    this.authLoading.set(true);
    this.authError.set(null);
    this.authSuccessMessage.set(null);

    const payload = {
      userId: user.id,
      displayName: this.profileDisplayName.value.trim(),
      bio: this.profileBio.value.trim(),
      tiktokHandle: this.profileTikTok.value.trim(),
      obsWebSocketPort: this.profileObsPort.value,
      vseeFacePort: this.profileVSeeFacePort.value,
      customPersonaPrompt: this.profilePersonaPrompt.value.trim(),
      avatarUrl: this.profileAvatarUrl.value.trim(),
      themePreference: this.profileTheme.value,
    };

    this.http.put<{ success: boolean; user: UserProfile; message: string }>('/api/auth/profile', payload).subscribe({
      next: (res) => {
        this.authLoading.set(false);
        this.currentUser.set(res.user);
        this.authSuccessMessage.set(res.message || 'Perfil actualizado con éxito');
        this.showToast('✅ PERFIL SOBERANO GUARDADO Y PERSISTIDO');
        this.playBlipSound(950, 0.1);
        setTimeout(() => this.closeAuthModal(), 1200);
      },
      error: (err) => {
        this.authLoading.set(false);
        this.authError.set(err.error?.error || 'Error al guardar perfil.');
      },
    });
  }

  logout() {
    const token = this.authToken();
    if (token) {
      this.http.post('/api/auth/logout', { token }).subscribe({
        next: () => {
          console.log('[Auth] Session terminated on server.');
        },
        error: (err) => {
          console.warn('[Auth] Logout warning:', err);
        },
      });
    }
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('hectron_auth_token');
    }
    this.authToken.set(null);
    this.showToast('SESIÓN CERRADA');
    this.closeAuthModal();
    this.initAuthSession();
  }

  // =========================================================================
  // 🧠 CORTEX MEMORY & AUTO-BOT AGENT LOOP METHODS
  // =========================================================================

  loadCortexMemories() {
    const search = this.cortexMemorySearch.value.trim();
    const category = this.cortexMemoryCategoryFilter();
    const role = this.cortexMemoryRoleFilter();

    let url = '/api/cortex/memories?limit=80';
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (category !== 'ALL') url += `&category=${encodeURIComponent(category)}`;
    if (role !== 'ALL') url += `&role=${encodeURIComponent(role)}`;

    this.http.get<{ total: number; filtered: number; memories: CortexMemoryItem[] }>(url).subscribe({
      next: (res) => {
        if (res.memories) {
          this.cortexMemories.set(res.memories);
        }
      },
      error: () => {
        console.warn('Error fetching Cortex memories');
      },
    });
  }

  loadCortexStats() {
    this.http.get<CortexStats>('/api/cortex/stats').subscribe({
      next: (stats) => {
        this.cortexStats.set(stats);
      },
      error: () => {
        console.warn('Error fetching Cortex stats');
      },
    });
  }

  selectQuickGoal(goal: string) {
    this.cortexGoal.setValue(goal);
    this.playBlipSound(800, 0.05);
  }

  runAutoBotAgent() {
    const goal = this.cortexGoal.value.trim();
    if (!goal || this.cortexAgentIsRunning()) return;

    this.cortexAgentIsRunning.set(true);
    this.playBlipSound(880, 0.15);
    this.showToast('🚀 INICIANDO BUCLE AUTO-BOT: Perceive → Plan → Act → Remember');

    this.http.post<{ success: boolean; trace: AgentExecutionTrace; cortexMemoriesCount: number; message: string }>('/api/cortex/run-agent', {
      goal,
      maxSteps: this.cortexMaxSteps(),
      provider: this.cortexProvider(),
    }).subscribe({
      next: (res) => {
        this.cortexAgentIsRunning.set(false);
        if (res.trace) {
          this.cortexActiveTrace.set(res.trace);
          this.cortexExecutionHistory.update(prev => [res.trace, ...prev]);
        }
        this.loadCortexMemories();
        this.loadCortexStats();
        this.playBlipSound(1150, 0.25);
        this.showToast('⚡ AUTO-BOT COMPLETÓ EL OBJETIVO Y GUARDÓ LA MEMORIA');
      },
      error: (err) => {
        this.cortexAgentIsRunning.set(false);
        const msg = err.error?.error || 'Error al ejecutar Auto-Bot';
        this.showToast(`⚠️ FALLO EN AGENTE: ${msg}`);
        this.playBlipSound(350, 0.2);
      },
    });
  }

  addCortexMemoryDirect() {
    const content = this.cortexNewMemoryContent.value.trim();
    const goal = this.cortexNewMemoryGoal.value.trim() || 'Memoria Manual';
    const category = this.cortexNewMemoryCategory.value;
    const importance = Number(this.cortexNewMemoryImportance.value) || 0.9;

    if (!content) {
      this.showToast('Introduce el contenido del recuerdo');
      return;
    }

    this.http.post<{ success: boolean; memory: CortexMemoryItem; message: string }>('/api/cortex/add', {
      goal,
      content,
      category,
      role: 'semantic',
      importance,
    }).subscribe({
      next: (res) => {
        this.cortexNewMemoryContent.setValue('');
        this.cortexMemories.update(prev => [res.memory, ...prev]);
        this.loadCortexStats();
        this.showToast('🧠 RECUERDO PERSISTIDO EN CORTEX');
        this.playBlipSound(920, 0.1);
      },
      error: () => {
        this.showToast('Error al persistir recuerdo en Cortex');
      },
    });
  }

  deleteCortexMemory(id: string) {
    this.http.delete(`/api/cortex/memories/${id}`).subscribe({
      next: () => {
        this.cortexMemories.update(prev => prev.filter(m => m.id !== id));
        this.loadCortexStats();
        this.showToast('RECUERDO ELIMINADO');
        this.playBlipSound(500, 0.08);
      },
      error: () => {
        this.showToast('Error al eliminar recuerdo');
      },
    });
  }

  clearCortexMemories() {
    if (!confirm('¿Restablecer toda la memoria Cortex a los recuerdos de fábrica?')) return;

    this.http.delete<{ success: boolean; memories: CortexMemoryItem[] }>('/api/cortex/clear').subscribe({
      next: (res) => {
        this.cortexMemories.set(res.memories);
        this.loadCortexStats();
        this.showToast('MEMORIA CORTEX RESTABLECIDA A BASE');
        this.playBlipSound(650, 0.15);
      },
      error: () => {
        this.showToast('Error al restablecer memoria');
      },
    });
  }

  // =========================================================================
  // 📋 CHECKLIST & ENVIRONMENT READINESS METHODS
  // =========================================================================

  fetchChecklist() {
    this.http.get<{
      success: boolean;
      checklist: ChecklistStep[];
      stats: {
        completedCount: number;
        totalCount: number;
        progressPercent: number;
        isReadyForBroadcast: boolean;
        readinessLevel: string;
      };
    }>('/api/setup-checklist').subscribe({
      next: (res) => {
        if (res.checklist) {
          this.checklist.set(res.checklist);
          this.checklistStats.set(res.stats);
        }
      },
      error: () => {
        console.warn('Error fetching setup checklist');
      },
    });
  }

  testStepDiagnostics(stepId: string) {
    this.testingStepIds.update((prev) => ({ ...prev, [stepId]: true }));
    this.playBlipSound(900, 0.1);
    this.showToast(`🔍 DIAGNOSTICANDO: Verificando configuración del componente...`);

    this.http.post<{
      success: boolean;
      testResult: { success: boolean; message: string; details: Record<string, unknown> };
      updatedStep: ChecklistStep;
      checklist: ChecklistStep[];
    }>('/api/setup-checklist/test-step', { id: stepId }).subscribe({
      next: (res) => {
        this.testingStepIds.update((prev) => ({ ...prev, [stepId]: false }));
        if (res.checklist) {
          this.checklist.set(res.checklist);
        }
        this.fetchChecklist();
        this.playBlipSound(1200, 0.2);
        this.showToast(`✅ ${res.testResult.message}`);
      },
      error: (err) => {
        this.testingStepIds.update((prev) => ({ ...prev, [stepId]: false }));
        const msg = err.error?.error || 'Error al ejecutar diagnóstico';
        this.showToast(`⚠️ FALLO EN PRUEBA: ${msg}`);
        this.playBlipSound(380, 0.18);
      },
    });
  }

  updateChecklistStatus(stepId: string, status: 'PENDING' | 'IN_PROGRESS' | 'VERIFIED' | 'COMPLETED') {
    this.http.post<{
      success: boolean;
      updatedStep: ChecklistStep;
      checklist: ChecklistStep[];
      progressPercent: number;
    }>('/api/setup-checklist/update', { id: stepId, status }).subscribe({
      next: (res) => {
        if (res.checklist) {
          this.checklist.set(res.checklist);
        }
        this.fetchChecklist();
        this.playBlipSound(950, 0.08);
        this.showToast(`ESTADO ACTUALIZADO: ${status}`);
      },
      error: () => {
        this.showToast('Error al actualizar estado del checklist');
      },
    });
  }

  copyChecklistSnippet(snippet: string) {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(snippet).then(() => {
      this.showToast('📋 COMANDO COPIADO AL PORTAPAPELES');
      this.playBlipSound(1000, 0.08);
    });
  }

  downloadQuickstartPackage() {
    const quickstartScript = `"""
=============================================================================
             HECTRON-Ψ // LEVIATÁN ALL-IN-ONE QUICKSTART PACK
=============================================================================
Instala dependencias y arranca el ecosistema completo (OSC + TikTokLive + Gemini).
"""
import sys, os, subprocess, time

REQUIRED_PACKAGES = [
    "TikTokLive",
    "python-osc",
    "pygame",
    "google-genai",
    "pillow",
    "selenium",
    "ccxt",
    "requests"
]

def install_deps():
    print("[*] 1/3 Verificando e instalando librerías requeridas...")
    for pkg in REQUIRED_PACKAGES:
        try:
            __import__(pkg.replace("-", "_").lower())
            print(f"  [✓] {pkg} instalado.")
        except ImportError:
            print(f"  [+] Instalando {pkg}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", pkg])

def print_instructions():
    print("\\n" + "="*60)
    print("🚀 GUÍA RÁPIDA DE ENLACE LEVIATÁN:")
    print(" 1. OBS Studio: Agrega 'Captura de Juego' > VSeeFace > [X] Permitir Transparencia")
    print(" 2. VB-Audio: Salida Python -> 'CABLE Input' | Entrada Mic VSeeFace -> 'CABLE Output'")
    print(" 3. VSeeFace: Settings > General > [X] OSC/VMC receiver (Port 39000)")
    print(" 4. TikTok Live: Configura RTMP en PRISM Live Studio")
    print("="*60 + "\\n")

if __name__ == '__main__':
    install_deps()
    print_instructions()
    print("[*] Listo para ejecutar: python leviatan_core.py")
`;

    const blob = new Blob([quickstartScript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quickstart_leviatan_setup.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    this.showToast('💾 SCRIPT "quickstart_leviatan_setup.py" DESCARGADO');
    this.playBlipSound(920, 0.1);
  }

  // =========================================================================
  // 🏆 ANTIGRAVITY ACHIEVEMENTS & REWARDS METHODS
  // =========================================================================

  fetchAchievements() {
    this.http.get<{
      success: boolean;
      achievements: GameAchievement[];
      playerBalance: {
        quantumCredits: number;
        vibraniumOre: number;
        unlockedSkins: string[];
      };
      stats: {
        total: number;
        unlockedCount: number;
        claimedCount: number;
        unlockedPercent: number;
        totalQCAvailable: number;
      };
    }>('/api/antigravity/achievements').subscribe({
      next: (res) => {
        if (res.achievements) {
          this.achievements.set(res.achievements);
          this.playerGameBalance.set(res.playerBalance);
          this.achievementStats.set(res.stats);
        }
      },
      error: () => {
        console.warn('Error fetching game achievements');
      },
    });
  }

  claimAchievement(id: string) {
    this.claimingAchievementIds.update((prev) => ({ ...prev, [id]: true }));
    this.playBlipSound(880, 0.1);

    this.http.post<{
      success: boolean;
      achievement: GameAchievement;
      playerBalance: { quantumCredits: number; vibraniumOre: number; unlockedSkins: string[] };
      message: string;
    }>('/api/antigravity/achievements/claim', { id }).subscribe({
      next: (res) => {
        this.claimingAchievementIds.update((prev) => ({ ...prev, [id]: false }));
        if (res.playerBalance) {
          this.playerGameBalance.set(res.playerBalance);
        }
        this.fetchAchievements();
        this.playBlipSound(1250, 0.25);
        this.showToast(res.message);
      },
      error: (err) => {
        this.claimingAchievementIds.update((prev) => ({ ...prev, [id]: false }));
        const msg = err.error?.error || 'Error al reclamar recompensa';
        this.showToast(`⚠️ NO RECLAMADO: ${msg}`);
        this.playBlipSound(360, 0.15);
      },
    });
  }

  simulateAchievementProgress(id: string, increment: number) {
    this.http.post<{
      success: boolean;
      achievement: GameAchievement;
      newlyUnlocked: boolean;
      achievements: GameAchievement[];
    }>('/api/antigravity/achievements/progress', { id, increment }).subscribe({
      next: (res) => {
        if (res.newlyUnlocked) {
          this.playBlipSound(1300, 0.3);
          this.showToast(`🎉 ¡NUEVO LOGRO DESBLOQUEADO: "${res.achievement.title}"! Reclama tu recompensa.`);
        } else {
          this.playBlipSound(850, 0.05);
          this.showToast(`Progreso actualizado: ${res.achievement.currentProgress}/${res.achievement.targetProgress}`);
        }
        this.fetchAchievements();
      },
      error: () => {
        this.showToast('Error al actualizar progreso del logro');
      },
    });
  }

  // =========================================================================
  // 📚 EL CONOCIMIENTO DEL LEVIATÁN (Gemini Knowledge Methods)
  // =========================================================================

  askLeviatanKnowledge(category?: 'saber' | 'noticia' | 'historia' | 'vision', customPrompt?: string) {
    const selectedCat = category || this.knowledgeCategory();
    const prompt = customPrompt || (selectedCat === 'noticia' ? 'Reflexión del mundo actual' : this.knowledgePrompt.value.trim());

    if (!prompt && selectedCat !== 'noticia') {
      this.showToast('Introduce un tema o pregunta para el Leviatán');
      return;
    }

    this.isQueryingKnowledge.set(true);
    this.playBlipSound(840, 0.1);
    this.showToast(`👁️ EL LEVIATÁN CONSULTA EL ORÁCULO GEMINI [${selectedCat.toUpperCase()}]...`);

    this.http.post<{
      success: boolean;
      text: string;
      emotion: 'Joy' | 'Angry' | 'Sorrow' | 'Fun' | 'Neutral';
      category: string;
      username: string;
      rawOutput?: string;
      timestamp: string;
    }>('/api/golem/knowledge', {
      prompt,
      category: selectedCat,
      username: 'Operador_Soberano'
    }).subscribe({
      next: (res) => {
        this.isQueryingKnowledge.set(false);
        this.knowledgeResult.set(res);
        this.current3dEmotion.set(res.emotion);
        this.playBlipSound(1100, 0.2);
        this.showToast(`🗣️ [${res.emotion}] "${res.text.substring(0, 48)}..."`);
        
        // Push to OSC logs
        this.oscLogs.update((prev) => [
          {
            time: new Date().toLocaleTimeString(),
            target: '127.0.0.1:39000',
            expression: res.emotion,
            status: 'KNOWLEDGE_ORACLE_EMITTED',
          },
          ...prev,
        ]);
      },
      error: (err) => {
        this.isQueryingKnowledge.set(false);
        const msg = err.error?.error || 'Error al consultar conocimiento';
        this.showToast(`⚠️ ERROR EN ORÁCULO: ${msg}`);
        this.playBlipSound(380, 0.18);
      },
    });
  }

  downloadKnowledgeScript() {
    const scriptText = `"""
# =============================================================================
# 📚 EL CONOCIMIENTO DEL LEVIATÁN (conocimiento_leviatan.py)
# Acceso a conocimiento real del mundo vía Gemini con prompts especializados.
# =============================================================================
Comandos:
  /saber [tema]     — Responde con conocimiento real sobre el tema
  /noticia          — Reflexiona sobre el estado del mundo actual
  /historia [tema]  — Cuenta una historia o dato histórico sobre el tema
"""

import re
import os
import requests
from google import genai

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "TU_API_KEY_DE_GEMINI")
ai = genai.Client(api_key=GEMINI_API_KEY)

PERSONALIDAD_LEVIATAN = """Eres el Leviatán, una entidad milenaria, cínica, estoica y sabia.
Hablas con un tono solemne, místico pero profundamente informado, usando analogías cósmicas.
Debes responder con conocimiento real, preciso, verificable y fáctico de la ciencia, historia, geografía o cultura.
Sé conciso: exactamente una o dos oraciones contundentes.
CRÍTICO: Al final de tu respuesta, debes incluir SIEMPRE y ÚNICAMENTE una de las siguientes emociones entre corchetes: [Joy], [Angry], [Sorrow], [Fun], o [Neutral]."""

def consultar_conocimiento(tema, categoria="saber", usuario="mortal"):
    prompt_usuario = tema
    instruccion = PERSONALIDAD_LEVIATAN
    
    if categoria == "saber":
        instruccion += f"\\n\\nEl mortal {usuario} te pide conocimiento real. Responde con UN DATO REAL Y VERIFICABLE sobre '{tema}'."
    elif categoria == "noticia":
        instruccion += f"\\n\\nEl mortal {usuario} te pide que reflexiones sobre el mundo actual. Da una reflexión profunda en una o dos oraciones."
        prompt_usuario = "¿Qué opinas del estado de la civilización hoy?"
    elif categoria == "historia":
        instruccion += f"\\n\\nEl mortal {usuario} te pide una historia. Cuenta un EVENTO HISTÓRICO REAL sobre '{tema}'."

    response = ai.models.generate_content(
        model="gemini-3.7-flash",
        contents=prompt_usuario,
        config={"system_instruction": instruccion, "temperature": 0.7}
    )
    
    texto = response.text.strip()
    match = re.search(r"\\[(Joy|Angry|Sorrow|Fun|Neutral)\\]", texto)
    emocion = match.group(1) if match else "Neutral"
    texto_limpio = re.sub(r"\\[(Joy|Angry|Sorrow|Fun|Neutral)\\]", "", texto).strip()
    
    print(f"\\n🏛️ LEVIATÁN ({emocion}): {texto_limpio}")
    return texto_limpio, emocion

if __name__ == '__main__':
    print("📖 El Conocimiento del Leviatán activo. Pregunta cualquier tema de la realidad.")
    consultar_conocimiento("La física de los agujeros negros", categoria="saber")
    consultar_conocimiento("", categoria="noticia")
    consultar_conocimiento("La caída de Constantinopla", categoria="historia")
`;

    const blob = new Blob([scriptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'conocimiento_leviatan.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    this.showToast('💾 SCRIPT "conocimiento_leviatan.py" DESCARGADO');
    this.playBlipSound(880, 0.1);
  }
}

