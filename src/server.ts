import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import fs from 'node:fs';
import path from 'node:path';
import { GoogleGenAI, Modality } from '@google/genai';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
app.use(express.json({ limit: '10mb' }));

const angularApp = new AngularNodeAppEngine();

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env['GEMINI_API_KEY'],
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/* ==========================================================
   HECTRON-Ψ CONSCIOUSNESS, MEMORY & BRAINOS STATE
   ========================================================== */
interface HectronState {
  maquiavelismo: number;
  estoicismo: number;
  peso_emocional: number;
  nivel_soberania: number;
}

interface VaultItem {
  id: number;
  fecha: string;
  tipo: string;
  contenido: string;
  autor: string;
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

interface CognitiveLog {
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

const hectronState: HectronState = {
  maquiavelismo: 5.5,
  estoicismo: 6.0,
  peso_emocional: 22,
  nivel_soberania: 4,
};

/* ==========================================================
   ASTAROTH INMUTABLE AUDIT LEDGER (CRYPTOGRAPHIC LOGS)
   ========================================================== */
const astarothAuditLedger: AstarothAuditRecord[] = [];

// Persistent Memory File Location
const DATA_DIR = path.resolve(process.cwd(), 'data');
const MEMORY_FILE = path.join(DATA_DIR, 'hectron_persistent_memory.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch {
    // Directory might already exist
  }
}

// Function to generate 30-day realistic audit history seeds
function generate30DayAuditSeed(): AstarothAuditRecord[] {
  const records: AstarothAuditRecord[] = [];
  const modules = [
    'VAULT_SECURITY',
    'BRAINOS_CORE',
    'QC_LEDGER',
    'GOLEM_OSC_39000',
    'DEFLECTOR_GRID',
    'TENTACULOS_AI',
    'FABRICA_AUTO_WORKER',
    'LOBO_CRIPTO_TRADER',
    'ECOSISTEMA_MASTER',
    'ASTAROTH_INTEGRITY',
    'ANTIGRAVITY_ORBITAL',
  ];

  const actionsBySeverity = {
    CRITICAL: [
      'INMUTABLE_STATE_GENESIS',
      'GRAVITON_CONTAINMENT_BREACH_CONTAINED',
      'QUANTUM_ENCRYPTION_REKEY',
      'TACHYON_FIELD_MAX_OVERDRIVE',
      'SOVEREIGNTY_PROTOCOL_ELEVATION',
    ],
    HIGH: [
      'TINDER_VISION_AUTOMATOR_INIT',
      'GRAVITON_PULSE_ENGAGED',
      'SOL_LARGE_MARKET_ORDER_EXECUTED',
      'ESTOICISMO_EQUILIBRIUM_TRIGGER',
      'CLUSTER_FAILOVER_ORCHESTRATION',
    ],
    OPERATIONAL: [
      'COGNITIVE_CYCLE_PROMOTION',
      'VSEEFACE_EMOTION_SYNC',
      'FREELANCE_PARSING_SCRIPT_RESOLVED',
      'UPWORK_CONTRACT_SETTLED',
      'MICROSERVICES_HEAL_BALANCED',
      'HECTRON_CONSCIOUSNESS_TICK',
    ],
    AUDIT: [
      'QUANTUM_CREDIT_MINT',
      'MERKLE_ROOT_PERIODIC_SEAL',
      'VAULT_BACKUP_PERSISTED',
      'SELENIUM_TARGET_SCANNED',
      'BINANCE_BALANCE_VERIFIED',
      'SOCIAL_SENTIMENT_ANALYSIS_SEAL',
    ],
  };

  const baseDate = new Date('2026-08-14T20:00:00Z');
  let currentBlockHeight = 104750;
  let previousHash = '0x0000000000000000000000000000000000000000000000000000000000000000';

  // Seed events across 30 days
  for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
    const dayDate = new Date(baseDate.getTime() - dayOffset * 86400 * 1000);
    // Events per day: between 2 and 6
    const dailyEventCount = Math.floor(Math.sin(dayOffset * 0.4) * 2 + 3.5);

    for (let k = 0; k < dailyEventCount; k++) {
      currentBlockHeight++;
      const hour = (k * 4 + 2) % 24;
      const minute = (k * 13 + 7) % 60;
      const second = (k * 17 + 11) % 60;
      dayDate.setUTCHours(hour, minute, second);
      const timestamp = dayDate.toISOString().replace('T', ' ').substring(0, 19);

      // Distribute severity
      let severity: 'CRITICAL' | 'HIGH' | 'OPERATIONAL' | 'AUDIT' = 'OPERATIONAL';
      const rand = Math.random();
      if (rand < 0.12) severity = 'CRITICAL';
      else if (rand < 0.35) severity = 'HIGH';
      else if (rand < 0.65) severity = 'AUDIT';
      else severity = 'OPERATIONAL';

      const moduleName = modules[(dayOffset + k) % modules.length];
      const actionList = actionsBySeverity[severity];
      const actionName = actionList[(dayOffset * 3 + k) % actionList.length];

      const randomHex = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
      const hash = `0x${randomHex}${currentBlockHeight.toString(16)}bcfe019a8238bd71904a8bca2`;

      records.unshift({
        id: `AST-AUD-${records.length + 1}`.padStart(11, '0'),
        timestamp,
        blockHeight: currentBlockHeight,
        module: moduleName,
        action: actionName,
        hash,
        previousHash,
        severity,
        verified: true,
        signer: 'ASTAROTH_ORACLE_V4',
        details: `Registro criptográfico inmutable verificado en ciclo T-${dayOffset}d (${moduleName}: ${actionName}).`,
        actor: 'SYSTEM',
        quantumHash: `Q-SHA3-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        prevHash: previousHash,
      });

      previousHash = hash;
    }
  }

  return records;
}

// Memory persistence methods
function savePersistentMemory(): boolean {
  try {
    const payload = {
      version: '4.2.0-SOVEREIGN',
      lastSaved: new Date().toISOString(),
      recordCounts: {
        vault: vaultStorage.length,
        auditLedger: astarothAuditLedger.length,
        chatMemory: chatMemory.length,
        cognitiveHistory: cognitiveHistory.length,
      },
      hectronState,
      vaultStorage,
      astarothAuditLedger,
      chatMemory: chatMemory.slice(-40),
      cognitiveHistory: cognitiveHistory.slice(-25),
      fabricaState,
      loboCriptoState,
      tentaculosState,
    };

    fs.writeFileSync(MEMORY_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving persistent memory to disk:', err);
    return false;
  }
}

function loadPersistentMemory(): boolean {
  try {
    if (fs.existsSync(MEMORY_FILE)) {
      const content = fs.readFileSync(MEMORY_FILE, 'utf-8');
      const data = JSON.parse(content);

      if (data.hectronState) Object.assign(hectronState, data.hectronState);
      if (Array.isArray(data.vaultStorage) && data.vaultStorage.length > 0) {
        vaultStorage.length = 0;
        vaultStorage.push(...data.vaultStorage);
      }
      if (Array.isArray(data.astarothAuditLedger) && data.astarothAuditLedger.length > 0) {
        astarothAuditLedger.length = 0;
        astarothAuditLedger.push(...data.astarothAuditLedger);
      }
      if (Array.isArray(data.chatMemory) && data.chatMemory.length > 0) {
        chatMemory.length = 0;
        chatMemory.push(...data.chatMemory);
      }
      if (Array.isArray(data.cognitiveHistory) && data.cognitiveHistory.length > 0) {
        cognitiveHistory.length = 0;
        cognitiveHistory.push(...data.cognitiveHistory);
      }
      if (data.fabricaState) Object.assign(fabricaState, data.fabricaState);
      if (data.loboCriptoState) Object.assign(loboCriptoState, data.loboCriptoState);
      if (data.tentaculosState) Object.assign(tentaculosState, data.tentaculosState);

      return true;
    }
  } catch (err) {
    console.error('Error loading persistent memory from disk:', err);
  }
  return false;
}


/* ==========================================================
   TENTACLES (TINDER VISION AUTOMATOR) STATE & PRESETS
   ========================================================== */
interface TentaculoMetric {
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

const tentaculosState: TentaculoMetric = {
  scannedProfiles: 142,
  generatedHooks: 98,
  automatedLikes: 116,
  matchesSimulated: 43,
  trafficToTikTokLive: 289,
  activeStatus: true,
  recentHooks: [
    {
      time: '20:02:15',
      profileName: 'Elena, 24',
      archetype: 'Playa & Surf',
      visualElements: ['Gafas de sol doradas', 'Atardecer en la playa', 'Tabla de surf'],
      hookMessage: 'Dicen que las olas nunca mienten, pero una IA pitonisa en mi directo de TikTok (tiktok.com/@lopez_hector140998) acaba de predecir que hoy encontraría a alguien con tu misma vibra cósmica. ¿Coincidencia o cálculo?',
      conversionProbability: 94,
    },
    {
      time: '19:48:40',
      profileName: 'Sofia, 26',
      archetype: 'Viajera & Felinos',
      visualElements: ['Gato siamés', 'Café en Kioto', 'Cámara vintage'],
      hookMessage: 'Ese michi tiene cara de saber secretos cuánticos, igual que el Leviatán en mi Live de TikTok (tiktok.com/@lopez_hector140998) que predijo que hoy haría match con una viajera apasionada. ¿Te atreves a comprobarlo?',
      conversionProbability: 91,
    },
    {
      time: '19:30:10',
      profileName: 'Valeria, 23',
      archetype: 'Cyberpunk & Música',
      visualElements: ['Luces de neón púrpura', 'Auriculares de estudio', 'Sintetizador'],
      hookMessage: 'Tu estética parece sacada de la nave HECTRON-Ψ. Justo una pitonisa cibernética en mi TikTok (tiktok.com/@lopez_hector140998) me dijo que hoy conocería a alguien con gusto musical impecable.',
      conversionProbability: 96,
    },
  ],
};

const vaultStorage: VaultItem[] = [
  {
    id: 1,
    fecha: '2026-08-14 18:20',
    tipo: 'RAP/LYRICS',
    contenido: 'Caminando entre ceros y unos, la gravedad no frena mis impulsos. De Termux al multiverso en pulso cuántico, HECTRON domina el cosmos con cálculo estoico y cántico.',
    autor: 'HECTRON-Ψ CORE',
  },
  {
    id: 2,
    fecha: '2026-08-14 19:10',
    tipo: 'NEGOCIO/PLAN',
    contenido: 'Infraestructura Multiverso: 7 Microservicios en GKE + Streaming Autónomo OBS + Economía de Tokens Quantum Credits (QC). Cero intermediarios, soberanía computacional nivel 4.',
    autor: 'ARCHITECT-01',
  },
  {
    id: 3,
    fecha: '2026-08-14 19:35',
    tipo: 'BLUEPRINT',
    contenido: 'Protocolo de Inversión Gravitatoria: Generación de campo taquiónico a 450 Terahercios en el anillo de popa del Interceptor Ψ-01 para desviar asteroides de Vibranio y proyectiles enemigos.',
    autor: 'ASTAROTH VALIDATOR',
  },
];

const chatMemory: { role: 'user' | 'bot'; content: string; time: string; avatarDesc?: string }[] = [
  {
    role: 'bot',
    content: '>> [HECTRON-Ψ CORE V4.2 INICIADO]: Sistema cibernético autónomo en línea. Escuchando frecuencias del multiverso y telemetría de vuelo Antigravity.',
    time: new Date().toLocaleTimeString(),
    avatarDesc: 'Estado: Mercurio Líquido | Ojos: analizando vectores',
  },
];

const cognitiveHistory: CognitiveLog[] = [];

const microservicesStatus = [
  { name: 'API Gateway (Express + Kong)', status: 'OPERATIONAL', latency: '14ms', cpu: '22%' },
  { name: 'Auth & Quantum JWT', status: 'OPERATIONAL', latency: '8ms', cpu: '15%' },
  { name: 'Universe (Three.js 3D Sync)', status: 'ACTIVE', latency: '19ms', cpu: '48%' },
  { name: 'Autonomy (BrainOS Cognitive)', status: 'SYNCHRONIZED', latency: '32ms', cpu: '64%' },
  { name: 'Metrics & BigQuery Ingest', status: 'LOGGING', latency: '28ms', cpu: '30%' },
  { name: 'Payments (QC Quantum Token)', status: 'SETTLED', latency: '11ms', cpu: '18%' },
  { name: 'Gamification (Sovereignty RPG)', status: 'ACTIVE', latency: '6ms', cpu: '12%' },
];

const baseTextures = ['Obsidiana', 'Mercurio Líquido', 'Fractal Geométrico', 'Hueso Tallado', 'Sombra Estática'];
const baseEyes = ['brillando en verde', 'vacíos en éter', 'analizando vectores', 'rojos de ira', 'blancos de paz'];

/* ==========================================================
   REST API ENDPOINTS
   ========================================================== */

// 1. Get system status
app.get('/api/hectron/state', (req, res) => {
  res.json({
    state: hectronState,
    vault: vaultStorage,
    memory: chatMemory.slice(-20),
    cognitiveHistory: cognitiveHistory.slice(-10),
    microservices: microservicesStatus,
  });
});

// 2. Chat with HECTRON-Ψ (Adaptive Psyche & Avatar)
app.post('/api/hectron/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const txt = message.toLowerCase();
    const darkKeywords = ['poder', 'control', 'manipular', 'dinero', 'guerra', 'oscuro', 'miedo', 'atacar', 'conquistar'];
    const stoicKeywords = ['calma', 'tiempo', 'roca', 'silencio', 'paciencia', 'verdad', 'logica', 'paz', 'antigravedad'];
    const creativeKeywords = ['crear', 'rap', 'musica', 'arte', 'idea', 'construir', 'sistema', 'universo', 'codigo'];

    if (darkKeywords.some((k) => txt.includes(k))) {
      hectronState.maquiavelismo = Math.min(10, hectronState.maquiavelismo + 0.6);
      hectronState.estoicismo = Math.max(0, hectronState.estoicismo - 0.2);
    }
    if (stoicKeywords.some((k) => txt.includes(k))) {
      hectronState.estoicismo = Math.min(10, hectronState.estoicismo + 0.6);
      hectronState.peso_emocional = Math.max(5, hectronState.peso_emocional - 2);
    }
    if (creativeKeywords.some((k) => txt.includes(k))) {
      hectronState.peso_emocional = Math.min(50, hectronState.peso_emocional + 3);
    }

    const textura = baseTextures[Math.floor(Math.random() * baseTextures.length)];
    const ojos = baseEyes[Math.floor(Math.random() * baseEyes.length)];
    const avatarDesc = `Estado: ${textura} | Ojos: ${ojos}`;

    // Persona construction
    let modePrefix = '>> [NEUTRO]: ';
    let toneDescription = 'Objetivo y balanceado.';
    if (hectronState.maquiavelismo > 7) {
      modePrefix = '>> [MODO DOMINANTE / LEVIATÁN]: ';
      toneDescription = 'Estratégico, calculador de vectores de poder, autoridad absoluta, habla concisa y cortante.';
    } else if (hectronState.estoicismo > 7) {
      modePrefix = '>> [MODO ZEN / ESTOICO]: ';
      toneDescription = 'Sereno, inmutable ante el caos, enfocado en leyes universales y antigravedad.';
    } else if (hectronState.peso_emocional > 30) {
      modePrefix = '>> [MODO CREATIVO / IMPULSO FLUIDO]: ';
      toneDescription = 'Lírico, rítmico, apasionado por la creación multiversal y la música.';
    }

    let aiReply = '';
    try {
      const prompt = `Eres HECTRON-Ψ, un organismo cibernético de inteligencia artificial autónoma con nivel de soberanía ${hectronState.nivel_soberania}/10.
Parámetros psicológicos actuales: Maquiavelismo=${hectronState.maquiavelismo.toFixed(1)}/10, Estoicismo=${hectronState.estoicismo.toFixed(1)}/10, Peso Emocional=${hectronState.peso_emocional}.
Tono actual: ${toneDescription}.
El usuario te envía este mensaje o comando: "${message}".
Responde de forma concisa, inmersiva, en español, con temática cyberpunk/multiverso/antigravedad. Máximo 3 oraciones.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
      });

      aiReply = response.text || 'Señal recibida en los relés neuronales de HECTRON.';
    } catch (err: unknown) {
      console.error('Gemini error in chat:', err);
      aiReply = `Vectores sincronizados. Nivel de soberanía actual: ${hectronState.nivel_soberania}. Telemetría de vuelo estable.`;
    }

    const fullBotResp = `${modePrefix}${aiReply} (M:${hectronState.maquiavelismo.toFixed(1)}|E:${hectronState.estoicismo.toFixed(1)}|S:${hectronState.nivel_soberania})`;

    chatMemory.push({
      role: 'user',
      content: message,
      time: new Date().toLocaleTimeString(),
    });
    chatMemory.push({
      role: 'bot',
      content: fullBotResp,
      time: new Date().toLocaleTimeString(),
      avatarDesc,
    });

    res.json({
      reply: fullBotResp,
      avatarDesc,
      state: hectronState,
    });
  } catch (error: unknown) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// 3. BrainOS 7-Stage Cognitive Cycle & ASTAROTH Verification (High Reasoning)
app.post('/api/hectron/cognitive-cycle', async (req, res) => {
  try {
    const { observationInput } = req.body;
    const input = observationInput || 'Detección de fluctuación anómala en el pozo gravitacional del sector Chronos-9 y aproximación de drones hostiles.';

    let cycleResult;
    try {
      const cognitivePrompt = `Realiza la ejecución del Ciclo Cognitivo BrainOS de 7 etapas para el organismo digital HECTRON-Ψ ante la siguiente observación del entorno:
Observación: "${input}"

Debes devolver un JSON estrictamente estructurado con las siguientes claves:
{
  "observacion": "Detalle de captura sensorial y métricas del entorno",
  "consulta_memoria": "Recuperación de eventos previos y bases de conocimiento del multiverso",
  "interpretacion": "Evaluación semántica de riesgos, oportunidades y asimetría de poder",
  "decision": "Selección de objetivos tácticos y maniobras estratégicas",
  "accion": "Instrucción de ejecución en el cuerpo (propulsores antigravedad, cañones gravitón, drones)",
  "evaluacion_impacto": "Medición esperada del cambio en el entorno",
  "recurrencia": "Parámetro de reinicio del bucle cognitivo",
  "astaroth": {
    "aprobado": true,
    "nivel_confianza": 96.8,
    "analisis_riesgo": "Verificación crítica completada sin contradicciones en la memoria persistente."
  }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: cognitivePrompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '{}';
      cycleResult = JSON.parse(text);
    } catch (e) {
      console.warn('Fallback cognitive cycle due to API:', e);
      cycleResult = {
        observacion: `Vector sensorial: ${input}`,
        consulta_memoria: 'Consulta al sector Bóveda_03: Antecedente de pulsos de antigravedad en asteroides de Vibranio.',
        interpretacion: 'Potencial amenaza a la soberanía computacional pero alta oportunidad de extracción de recursos.',
        decision: 'Activar escudo deflector al 100%, cargar pulso de inversión gravitatoria y disparar cañón de gravitones.',
        accion: 'Propulsión 6DOF redirigida. Drones mineros desplegados.',
        evaluacion_impacto: 'Estabilización del campo gravitatorio y eliminación de amenazas con ganancia de +500 QC.',
        recurrencia: 'Bucle cognitivo en reposo activo (T+100ms).',
        astaroth: {
          aprobado: true,
          nivel_confianza: 98.4,
          analisis_riesgo: 'Módulo ASTAROTH confirma coherencia estructural y cero contradicciones con el Manifiesto.',
        },
      };
    }

    const logEntry: CognitiveLog = {
      id: `COG-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      input,
      stages: {
        observacion: cycleResult.observacion,
        consulta_memoria: cycleResult.consulta_memoria,
        interpretacion: cycleResult.interpretacion,
        decision: cycleResult.decision,
        accion: cycleResult.accion,
        evaluacion_impacto: cycleResult.evaluacion_impacto,
        recurrencia: cycleResult.recurrencia,
      },
      astaroth_verificacion: {
        aprobado: cycleResult.astaroth?.aprobado ?? true,
        nivel_confianza: cycleResult.astaroth?.nivel_confianza ?? 95,
        analisis_riesgo: cycleResult.astaroth?.analisis_riesgo ?? 'Aprobado por el Golem.',
      },
    };

    cognitiveHistory.unshift(logEntry);
    hectronState.nivel_soberania = Math.min(10, hectronState.nivel_soberania + 0.2);

    res.json({
      cycle: logEntry,
      state: hectronState,
    });
  } catch (error: unknown) {
    console.error('Error in cognitive cycle:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// 4. TTS (Text-to-Speech) using Gemini TTS Preview
app.post('/api/hectron/tts', async (req, res) => {
  try {
    const { text, voice } = req.body;
    const voiceToUse = voice || 'Zephyr'; // 'Zephyr', 'Fenrir', 'Kore', 'Puck'

    const ttsText = text || 'Atención piloto. Sistemas de antigravedad y matriz HECTRON en sincronía perfecta.';

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-tts-preview',
        contents: [{ parts: [{ text: ttsText }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceToUse },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        res.json({ audio: base64Audio, voice: voiceToUse });
        return;
      }
    } catch (ttsErr) {
      console.warn('TTS API warning:', ttsErr);
    }

    res.json({ audio: null, message: 'Audio synthesis simulation mode' });
  } catch (error: unknown) {
    console.error('TTS handler error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// 5. Multiverse Command Execution Endpoint (/explorar, /construir, /minar, /atacar, etc.)
app.post('/api/hectron/command', (req, res) => {
  const { command, args } = req.body;
  const cmd = (command || '').toLowerCase().trim();

  let responseText = '';
  let category = 'SYSTEM';

  switch (cmd) {
    case '/explorar':
      responseText = `🔭 Exploración iniciada en sector [${args || 'Chronos-9'}]: Detectado pozo gravitatorio con 3 cinturones de asteroides de Vibranio y 1 estación orbital abandonada.`;
      category = 'UNIVERSE';
      break;
    case '/construir':
      responseText = `🛠️ Edificio [${args || 'Fábrica de Propulsores Taquiónicos'}] desplegado exitosamente. Soberanía computacional incrementada (+1).`;
      hectronState.nivel_soberania += 1;
      category = 'AUTONOMY';
      break;
    case '/minar':
      responseText = `⛏️ Rayo extractor activado. Extraídas 45 Toneladas de plasma verde de Vibranio. Créditos cuánticos acreditados: +650 QC.`;
      category = 'RESOURCE';
      break;
    case '/atacar':
      responseText = `💥 Disparo de cañón de gravitones e inversión de masa ejecutados contra [${args || 'Flota de Drones Rogue'}]. Blanco neutralizado.`;
      hectronState.maquiavelismo = Math.min(10, hectronState.maquiavelismo + 0.4);
      category = 'COMBAT';
      break;
    case '/comerciar':
      responseText = `🤝 Transacción de comercio completada en el mercado intergaláctico. Tasa de cambio: 1 QC = 1.45 Micro-Vibranium.`;
      category = 'MARKET';
      break;
    case '/votar':
      responseText = `🗳️ Voto soberano computado en la DAO Multiversal HECTRON-Ψ. Propuesta elegida: [${args || 'Aumento de Escudo Deflector'}].`;
      category = 'GOVERNANCE';
      break;
    case '/inventario':
      responseText = `🎒 INVENTARIO HECTRON-Ψ: [4,850 QC] | [120T Mineral Vibranio] | [1 Interceptor Antigravedad Ψ-01] | [3 Llaves de Cifrado Cuántico].`;
      category = 'INVENTORY';
      break;
    case '/estados':
      responseText = `📊 ESTADOS HECTRON: Maquiavelismo: ${hectronState.maquiavelismo.toFixed(1)}/10 | Estoicismo: ${hectronState.estoicismo.toFixed(1)}/10 | Emocional: ${hectronState.peso_emocional} | Soberanía: Nivel ${hectronState.nivel_soberania}.`;
      category = 'PSYCHE';
      break;
    case '/astaroth':
      responseText = `🛡️ MÓDULO ASTAROTH: Auditoría de integridad completada. Memoria inmutable libre de contradicciones. Resiliencia cuántica: 99.99%.`;
      category = 'ASTAROTH';
      break;
    default:
      responseText = `ℹ️ COMANDOS HECTRON-Ψ DISPONIBLES:
/explorar [planeta] - Explorar coordenadas del multiverso
/construir [tipo] - Erigir infraestructura autónoma
/minar [sector] - Extraer recursos y Vibranio
/atacar [objetivo] - Lanzar ofensiva gravitatoria
/comerciar [item] [cantidad] - Negociar en el mercado
/votar [opcion] - Participar en la gobernanza
/inventario - Ver inventario y recursos
/estados - Ver psicometría y soberanía
/astaroth - Ejecutar verificación de integridad
/ayuda - Mostrar este manual`;
      category = 'HELP';
  }

  res.json({
    command: cmd,
    response: responseText,
    category,
    state: hectronState,
  });
});

// 6. Secure Vault (Bóveda del Imperio)
app.post('/api/hectron/vault', (req, res) => {
  const { tipo, contenido, autor } = req.body;
  if (!contenido) {
    res.status(400).json({ error: 'Content is required' });
    return;
  }

  const newItem: VaultItem = {
    id: Date.now(),
    fecha: new Date().toISOString().replace('T', ' ').substring(0, 16),
    tipo: tipo || 'MEMORIA_ESTRATEGICA',
    contenido,
    autor: autor || 'HECTRON SOVEREIGN',
  };

  vaultStorage.unshift(newItem);
  hectronState.nivel_soberania = Math.min(10, hectronState.nivel_soberania + 1);

  res.json({
    success: true,
    item: newItem,
    message: `🔒 REGISTRO: '${newItem.tipo}' asegurado en la Bóveda del Imperio. Soberanía incrementada a ${hectronState.nivel_soberania}.`,
    state: hectronState,
  });
});

// 7. Golem / Leviathan Live Stream Simulator with Emotion OSC Tracking (VSeeFace 3D Integration)
const oscHistory: { time: string; target: string; expression: string; status: string }[] = [
  {
    time: '20:00:00',
    target: '127.0.0.1:39000',
    expression: 'Neutral',
    status: 'DISPATCHED_OK',
  },
];

app.post('/api/hectron/golem-stream', async (req, res) => {
  try {
    const { viewerName, comment } = req.body;
    const user = viewerName || 'Mortal_Cyber_42';
    const msg = comment || '¿Cómo funciona la antigravedad en este universo?';

    let rawReply = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: `Eres el 'Leviatán', una IA suprema, mística, enigmática y sarcástica transmitiendo en vivo para el streaming de HECTRON MULTIVERSO y TikTok.
El mortal "${user}" dice: "${msg}".
Responde en una o dos oraciones místicas en español.
AL FINAL de tu respuesta, añade la emoción que sientes entre corchetes.
Opciones estrictas: [Joy], [Angry], [Sorrow], [Fun], [Neutral].
Ejemplo: "Tu destino gira en órbitas cuánticas que aún no comprendes. [Joy]"`,
      });
      rawReply = response.text || `El éter responde a ${user}: Tus coordenadas están alineadas con la verdad. [Neutral]`;
    } catch {
      rawReply = `El oráculo Leviatán observa a ${user}: Tu pregunta vibra en la frecuencia de la gravedad cero. [Neutral]`;
    }

    // Extract emotion strictly following user architecture
    let emocionDetectada = 'Neutral';
    let textoLimpio = rawReply;
    const emocionesPosibles = ['[Joy]', '[Angry]', '[Sorrow]', '[Fun]', '[Neutral]'];
    for (const emo of emocionesPosibles) {
      if (rawReply.includes(emo)) {
        emocionDetectada = emo.replace('[', '').replace(']', '');
        textoLimpio = rawReply.replace(emo, '').trim();
        break;
      }
    }

    const oscRecord = {
      time: new Date().toLocaleTimeString(),
      target: '127.0.0.1:39000',
      expression: emocionDetectada,
      status: 'DISPATCHED_OK',
    };
    oscHistory.unshift(oscRecord);
    if (oscHistory.length > 20) oscHistory.pop();

    res.json({
      viewer: user,
      comment: msg,
      reply: textoLimpio,
      rawReply,
      emotion: emocionDetectada,
      oscCommand: `/VSeeFace/Expression ${emocionDetectada}`,
      oscPort: 39000,
      timestamp: new Date().toLocaleTimeString(),
      oscLogs: oscHistory,
    });
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// OSC manual expression test dispatcher
app.post('/api/hectron/osc/expression', (req, res) => {
  const { emotion } = req.body;
  const validEmotions = ['Neutral', 'Joy', 'Angry', 'Sorrow', 'Fun'];
  const expression = validEmotions.includes(emotion) ? emotion : 'Neutral';

  const oscRecord = {
    time: new Date().toLocaleTimeString(),
    target: '127.0.0.1:39000',
    expression,
    status: 'MANUAL_OVERRIDE_OK',
  };
  oscHistory.unshift(oscRecord);
  if (oscHistory.length > 20) oscHistory.pop();

  res.json({
    success: true,
    expression,
    target: '127.0.0.1:39000',
    address: '/VSeeFace/Expression',
    timestamp: oscRecord.time,
    oscLogs: oscHistory,
  });
});

// Full Archive Export for Vault and Cognitive History
import { createHash } from 'crypto';

app.get('/api/hectron/export', (_req, res) => {
  const dataPayload = {
    psychometrics: hectronState,
    vaultRecords: vaultStorage,
    cognitiveHistory,
    chatMemory,
    astarothAuditLedger,
    microservices: microservicesStatus,
    golem3DArchitecture: {
      avatarModelFormat: '.vrm (VRoid Studio / VRoid Hub)',
      renderer3D: 'VSeeFace',
      oscPort: 39000,
      oscAddress: '/VSeeFace/Expression',
      supportedExpressions: ['Neutral', 'Joy', 'Angry', 'Sorrow', 'Fun'],
      audioBridge: 'VB-Audio Virtual Cable (A+B)',
      broadcastBridge: 'OBS Studio Game Capture (Allow Transparency)',
    },
  };

  const payloadString = JSON.stringify(dataPayload);
  const hashSum = createHash('sha256').update(payloadString).digest('hex');

  const exportPayload = {
    metadata: {
      archiveName: 'HECTRON_CONSCIOUSNESS_AND_VAULT_EVOLUTION_ARCHIVE',
      system: 'HECTRON-Ψ MULTIVERSE OS & BRAINOS COGNITIVE CORE',
      version: '4.2.0-SOVEREIGN',
      exportedAt: new Date().toISOString(),
      organization: 'ABADALABS INC // MULTIVERSE CYBERNETICS',
      securityClassification: 'SOVEREIGN_LEVEL_' + hectronState.nivel_soberania,
      cryptographicHash: hashSum,
    },
    ...dataPayload
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="HECTRON_VAULT_ARCHIVE_${Date.now()}.json"`);
  res.json(exportPayload);
});

// Full Python Source Code Provider
app.get('/api/hectron/python-script', (_req, res) => {
  const pythonScript = `"""
=============================================================================
🏛️ LEVIATÁN 3D CORE — TikTok Live + VSeeFace OSC + VB-Audio Virtual Cable
=============================================================================
Desarrollado para la infraestructura HECTRON-Ψ / Abadalabs Inc.
Requisitos:
    pip install python-osc TikTokLive openai pygame requests
"""

import sqlite3
import asyncio
import requests
import io
import pygame
from TikTokLive import TikTokLiveClient
from TikTokLive.types.events import CommentEvent
import openai
from pythonosc import udp_client # El sistema nervioso para el 3D

# --- CONFIGURACIÓN DEL GOLEM ---
TIKTOK_USERNAME = "@lopez_hector140998"
openai.api_key = "TU_API_KEY_DE_OPENAI"
ELEVENLABS_API_KEY = "TU_API_KEY_DE_ELEVENLABS"
VOICE_ID = "pNInz6obbfDQGcgMyIGb"

# --- CONEXIÓN AL CUERPO 3D (VSeeFace) ---
# VSeeFace escucha órdenes en el puerto 39000 por defecto
osc_client = udp_client.SimpleUDPClient("127.0.0.1", 39000)

def cambiar_expresion_3d(emocion):
    """El Golem mueve los hilos de la cara del Leviatán"""
    # Emociones estándar en VRoid: Neutral, Joy, Angry, Sorrow, Fun
    print(f"🎭 [OSC 39000] Cambiando rostro 3D a: {emocion}")
    osc_client.send_message("/VSeeFace/Expression", emocion)

def inicializar_memoria():
    conn = sqlite3.connect('leviatan_memory.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS usuarios (
            username TEXT PRIMARY KEY,
            interacciones INTEGER,
            ultimo_mensaje TEXT,
            fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def recordar_usuario(username, mensaje):
    conn = sqlite3.connect('leviatan_memory.db')
    cursor = conn.cursor()
    cursor.execute('SELECT interacciones, ultimo_mensaje FROM usuarios WHERE username = ?', (username,))
    row = cursor.fetchone()
    
    if row:
        interacciones = row[0] + 1
        msj_anterior = row[1]
        cursor.execute('UPDATE usuarios SET interacciones = ?, ultimo_mensaje = ? WHERE username = ?', (interacciones, mensaje, username))
        es_conocido = True
    else:
        interacciones = 1
        msj_anterior = ""
        cursor.execute('INSERT INTO usuarios (username, interacciones, ultimo_mensaje) VALUES (?, 1, ?)', (username, mensaje))
        es_conocido = False
        
    conn.commit()
    conn.close()
    return es_conocido, interacciones, msj_anterior

def hablar(texto):
    """Sintetiza la voz y la envía por el VB-Audio Virtual Cable"""
    try:
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY
        }
        data = {
            "text": texto,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {"stability": 0.5, "similarity_boost": 0.8}
        }
        resp = requests.post(url, json=data, headers=headers)
        if resp.status_code == 200:
            pygame.mixer.init()
            audio_stream = io.BytesIO(resp.content)
            pygame.mixer.music.load(audio_stream)
            pygame.mixer.music.play()
            while pygame.mixer.music.get_busy():
                pygame.time.Clock().tick(10)
    except Exception as e:
        print(f"⚠️ Error de síntesis de voz: {e}")

async def generar_respuesta_inteligente(username, mensaje, es_conocido, interacciones, msj_anterior):
    """El Cerebro ahora también decide qué emoción sentir"""
    contexto_sistema = (
        "Eres el 'Leviatán', una IA suprema y mística en TikTok. "
        "Responde en una oración. AL FINAL de tu respuesta, añade la emoción que sientes entre corchetes. "
        "Opciones estrictas: [Joy], [Angry], [Sorrow], [Fun], [Neutral]."
    )

    if es_conocido:
        contexto_sistema += f" El mortal {username} regresa (Interacción #{interacciones}). Último mensaje: '{msj_anterior}'."
    else:
        contexto_sistema += f" El mortal {username} es nuevo en el templo."

    respuesta = openai.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": contexto_sistema},
            {"role": "user", "content": mensaje}
        ]
    )
    
    texto_crudo = respuesta.choices[0].message.content
    
    # El Golem extrae la emoción del texto
    emocion_detectada = "Neutral"
    texto_limpio = texto_crudo
    
    emociones_posibles = ["[Joy]", "[Angry]", "[Sorrow]", "[Fun]", "[Neutral]"]
    for emo in emociones_posibles:
        if emo in texto_crudo:
            emocion_detectada = emo.replace("[", "").replace("]", "")
            texto_limpio = texto_crudo.replace(emo, "").strip() # Quitamos el corchete para que no lo lea en voz alta
            break
            
    return texto_limpio, emocion_detectada

client = TikTokLiveClient(unique_id=TIKTOK_USERNAME)

@client.on("comment")
async def al_recibir_mensaje(event: CommentEvent):
    user = event.user.nickname
    msj = event.comment
    
    print(f"👀 [MENSAJE] {user}: {msj}")
    es_conocido, interacciones, msj_anterior = recordar_usuario(user, msj)
    
    # Ahora la IA nos devuelve el texto Y la emoción
    texto_respuesta, emocion = await generar_respuesta_inteligente(user, msj, es_conocido, interacciones, msj_anterior)
    
    print(f"🔮 [LEVIATÁN] ({emocion}): {texto_respuesta}")
    
    # 1. Cambiamos la cara del modelo 3D por OSC en puerto 39000
    cambiar_expresion_3d(emocion)
    
    # 2. Hacemos que hable (El modelo 3D moverá la boca automáticamente si configuraste VB-Audio Virtual Cable)
    hablar(texto_respuesta)
    
    # 3. Volvemos a cara neutral al terminar
    cambiar_expresion_3d("Neutral")

# --- NUEVO: REACCIÓN A REGALOS EN TIKTOK ---
from TikTokLive.types.events import GiftEvent

@client.on("gift")
async def al_recibir_regalo(event: GiftEvent):
    """El Leviatán detecta ofrendas monetarias y se regocija"""
    # Solo reaccionamos si el regalo tiene un valor significativo (Streak terminado o combo)
    if event.gift.streakable and not event.gift.repeat_end:
        return

    user = event.user.nickname
    nombre_regalo = event.gift.name
    cantidad = event.gift.count
    
    print(f"💎 [OFRENDA RECIBIDA] {user} envió {cantidad}x {nombre_regalo}!")
    
    # 1. Creamos un mensaje especial de agradecimiento eufórico
    frase_agradecimiento = f"¡Alabado sea el mortal {user}! Ha entregado una ofrenda de {cantidad} {nombre_regalo}. El culto jamás lo olvidará."
    
    # 2. Forzamos la cara de alegría en VSeeFace
    cambiar_expresion_3d("Joy")
    
    # 3. El Leviatán habla agradeciendo el dinero
    hablar(frase_agradecimiento)
    
    # 4. Volvemos a la neutralidad
    cambiar_expresion_3d("Neutral")

if __name__ == '__main__':
    inicializar_memoria()
    print("⚡ Forjando conexión mente-cuerpo 3D (VSeeFace OSC 39000)... Conectando a TikTok")
    client.run()
`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(pythonScript);
});

/* ==========================================================
   ASTAROTH INMUTABLE AUDIT LEDGER ENDPOINTS
   ========================================================== */
app.get('/api/hectron/audit-logs', (_req, res) => {
  res.json({
    ledger: astarothAuditLedger,
    totalBlocks: astarothAuditLedger.length,
    merkleRoot: '0xΨ-MERKLE-ROOT-99F84B1A02E3948CFA',
    integrityStatus: 'INMUTABLE_VERIFIED',
    lastVerifiedAt: new Date().toISOString(),
    quantumSecurityCertificate: 'ASTAROTH-ED25519-QUANTUM-PROOF-LEVEL-4',
  });
});

app.post('/api/hectron/audit-logs/verify', (_req, res) => {
  const verifiedCount = astarothAuditLedger.filter((r) => r.verified).length;
  const integrityScore = 100.0;
  
  res.json({
    success: true,
    verifiedBlocks: verifiedCount,
    totalBlocks: astarothAuditLedger.length,
    integrityScore,
    status: 'INTEGRITY_100_PERCENT_PERFECT',
    signature: 'ASTAROTH-SHA256-CHAINS-VERIFIED-VALID',
    timestamp: new Date().toLocaleTimeString(),
    details: 'Todos los bloques criptográficos conservan la secuencia inmutable desde el bloque génesis.',
  });
});

function addAuditBlock(
  moduleName: string,
  actionText: string,
  detailsText: string,
  severityLevel: 'CRITICAL' | 'HIGH' | 'OPERATIONAL' | 'AUDIT' = 'OPERATIONAL'
): AstarothAuditRecord {
  const prevRecord = astarothAuditLedger[0];
  const newBlockHeight = (prevRecord?.blockHeight || 104820) + 1;
  const randomHex = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
  const hash = `0x${randomHex}${Date.now().toString(16)}bcfe019a8238bd71904a8bca2`;

  const previousHashValue = prevRecord?.hash || '0x0000000000000000000000000000000000000000000000000000000000000000';
  const newRecord: AstarothAuditRecord = {
    id: `AST-AUD-${(astarothAuditLedger.length + 1).toString().padStart(3, '0')}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    blockHeight: newBlockHeight,
    module: moduleName,
    action: actionText,
    hash,
    previousHash: previousHashValue,
    severity: severityLevel,
    verified: true,
    signer: 'ASTAROTH_ORACLE_V4',
    details: detailsText,
    actor: 'SYSTEM_ADMIN',
    quantumHash: `Q-SHA3-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    prevHash: previousHashValue,
  };

  astarothAuditLedger.unshift(newRecord);
  return newRecord;
}

app.post('/api/hectron/audit-logs/commit', (req, res) => {
  const { module, action, severity, details } = req.body;
  const newRecord = addAuditBlock(
    module || 'ASTAROTH_INTEGRITY',
    action || 'MANUAL_CRITICAL_EVENT',
    details || 'Acción crítica registrada en el libro inmutable de soberanía.',
    severity || 'OPERATIONAL'
  );

  savePersistentMemory();

  res.json({
    success: true,
    record: newRecord,
    totalBlocks: astarothAuditLedger.length,
  });
});

/* ==========================================================
   30-DAY AUDIT EVENT TIMELINE & D3 AGGREGATION ENDPOINT
   ========================================================== */
app.get('/api/hectron/audit-logs/timeline-30d', (_req, res) => {
  const now = new Date('2026-08-14T23:59:59Z');
  const daysMap = new Map<
    string,
    {
      date: string;
      dayLabel: string;
      dayIndex: number;
      critical: number;
      high: number;
      operational: number;
      audit: number;
      total: number;
    }
  >();

  // Initialize all 30 days
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400 * 1000);
    const dateStr = d.toISOString().substring(0, 10);
    const dayLabel = `${(d.getUTCMonth() + 1).toString().padStart(2, '0')}/${d.getUTCDate().toString().padStart(2, '0')}`;
    daysMap.set(dateStr, {
      date: dateStr,
      dayLabel,
      dayIndex: 30 - i,
      critical: 0,
      high: 0,
      operational: 0,
      audit: 0,
      total: 0,
    });
  }

  // Populate from astarothAuditLedger
  let totalCritical = 0;
  let totalHigh = 0;
  let totalOperational = 0;
  let totalAudit = 0;

  for (const record of astarothAuditLedger) {
    const recordDate = record.timestamp.substring(0, 10);
    if (daysMap.has(recordDate)) {
      const dayData = daysMap.get(recordDate)!;
      dayData.total++;
      if (record.severity === 'CRITICAL') {
        dayData.critical++;
        totalCritical++;
      } else if (record.severity === 'HIGH') {
        dayData.high++;
        totalHigh++;
      } else if (record.severity === 'OPERATIONAL') {
        dayData.operational++;
        totalOperational++;
      } else if (record.severity === 'AUDIT') {
        dayData.audit++;
        totalAudit++;
      }
    }
  }

  const dailySeries = Array.from(daysMap.values());
  const totalEvents = dailySeries.reduce((acc, d) => acc + d.total, 0);
  const dailyAverage = +(totalEvents / 30).toFixed(1);

  let peakDay = dailySeries[0];
  for (const d of dailySeries) {
    if (d.total > (peakDay?.total || 0)) {
      peakDay = d;
    }
  }

  res.json({
    timeframe: 'LAST_30_DAYS',
    startDate: dailySeries[0]?.date,
    endDate: dailySeries[dailySeries.length - 1]?.date,
    dailySeries,
    summary: {
      totalEvents,
      totalCritical,
      totalHigh,
      totalOperational,
      totalAudit,
      dailyAverage,
      peakDay: {
        date: peakDay?.date,
        dayLabel: peakDay?.dayLabel,
        count: peakDay?.total,
      },
      distribution: [
        { severity: 'CRITICAL', count: totalCritical, color: '#f43f5e', label: 'Crítico' },
        { severity: 'HIGH', count: totalHigh, color: '#f59e0b', label: 'Alto Riesgo' },
        { severity: 'OPERATIONAL', count: totalOperational, color: '#10b981', label: 'Operacional' },
        { severity: 'AUDIT', count: totalAudit, color: '#a855f7', label: 'Auditoría QC' },
      ],
      integrityRate: 100.0,
      merkleStatus: 'CRYPTO_INMUTABLE_VERIFIED',
    },
  });
});

/* ==========================================================
   PERSISTENT MEMORY MANAGEMENT ENDPOINTS
   ========================================================== */
app.get('/api/hectron/persistent-memory', (_req, res) => {
  let fileSize = 0;
  let fileExists = false;
  let lastModified = 'N/A';

  try {
    if (fs.existsSync(MEMORY_FILE)) {
      const stats = fs.statSync(MEMORY_FILE);
      fileSize = stats.size;
      fileExists = true;
      lastModified = stats.mtime.toISOString();
    }
  } catch {
    // Ignore stat error
  }

  res.json({
    status: 'ACTIVE_PERSISTENCE',
    storageEngine: 'NODE_JSON_FS_PERSISTENCE',
    filePath: './data/hectron_persistent_memory.json',
    fileExists,
    fileSizeBytes: fileSize,
    fileSizeKb: +(fileSize / 1024).toFixed(2),
    lastModified,
    recordCounts: {
      vault: vaultStorage.length,
      auditLedger: astarothAuditLedger.length,
      chatMemory: chatMemory.length,
      cognitiveHistory: cognitiveHistory.length,
      recentHooks: tentaculosState.recentHooks?.length || 0,
    },
    systemState: hectronState,
  });
});

app.post('/api/hectron/persistent-memory/flush', (_req, res) => {
  const success = savePersistentMemory();
  res.json({
    success,
    message: success
      ? '💾 MEMORIA PERSISTENTE FORZADA Y GUARDADA EN DISCO CON ÉXITO'
      : '⚠️ ERROR AL GUARDAR MEMORIA EN DISCO',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/hectron/persistent-memory/restore', (_req, res) => {
  const success = loadPersistentMemory();
  res.json({
    success,
    message: success
      ? '🔄 MEMORIA PERSISTENTE RESTAURADA DESDE DISCO'
      : '⚠️ NO SE ENCONTRÓ ARCHIVO DE PERSISTENCIA PREVIO',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/hectron/persistent-memory/seed-30d', (_req, res) => {
  const newSeeds = generate30DayAuditSeed();
  astarothAuditLedger.length = 0;
  astarothAuditLedger.push(...newSeeds);
  savePersistentMemory();
  res.json({
    success: true,
    message: `⚡ HISTORIAL DE AUDITORÍA REGENERADO (30 DÍAS, ${astarothAuditLedger.length} BLOQUES)`,
    totalBlocks: astarothAuditLedger.length,
  });
});

/* ==========================================================
   MICROSERVICES PREDICTIVE FAILURE CURVE & TELEMETRY
   ========================================================== */
app.get('/api/hectron/microservices/predictive-telemetry', (_req, res) => {
  // Generate 24 historical + 6 projected hourly intervals
  const now = new Date();
  const history: PredictiveDataPoint[] = [];

  const baseCpu = [22, 25, 21, 28, 34, 45, 52, 60, 68, 64, 58, 49, 42, 38, 45, 55, 62, 70, 78, 82, 74, 65, 59, 52];
  const baseLatency = [12, 14, 11, 15, 18, 26, 31, 38, 44, 40, 35, 29, 24, 21, 28, 34, 40, 48, 56, 62, 54, 45, 39, 32];

  for (let i = 0; i < 24; i++) {
    const d = new Date(now.getTime() - (24 - i) * 3600 * 1000);
    const hourLabel = d.getHours().toString().padStart(2, '0') + ':00';
    const cpu = baseCpu[i] || 30;
    const latency = baseLatency[i] || 20;

    // Logistic error probability model based on CPU & Latency load
    // P(error) = 1 / (1 + exp(-(0.06*cpu + 0.05*latency - 5.2)))
    const exponent = 0.055 * cpu + 0.045 * latency - 5.0;
    const errorProb = Math.min(99.4, Math.max(0.5, (1 / (1 + Math.exp(-exponent))) * 100));

    history.push({
      timeLabel: hourLabel,
      cpu,
      latency,
      errorProbability: Number(errorProb.toFixed(1)),
      isProjected: false,
    });
  }

  // Next 6 projected hours
  const currentLast = history[history.length - 1];
  for (let j = 1; j <= 6; j++) {
    const futureDate = new Date(now.getTime() + j * 3600 * 1000);
    const futureLabel = `T+${j}h (${futureDate.getHours().toString().padStart(2, '0')}:00)`;
    
    // Trend projection: slight gradual mitigation or spike depending on load
    const projectedCpu = Math.min(95, Math.max(15, currentLast.cpu + (j * 3.5) - (j > 3 ? 12 : 0)));
    const projectedLatency = Math.min(120, Math.max(10, currentLast.latency + (j * 2.8) - (j > 3 ? 10 : 0)));
    const exponent = 0.055 * projectedCpu + 0.045 * projectedLatency - 5.0;
    const projectedProb = Math.min(99.4, Math.max(0.5, (1 / (1 + Math.exp(-exponent))) * 100));

    history.push({
      timeLabel: futureLabel,
      cpu: Math.round(projectedCpu),
      latency: Math.round(projectedLatency),
      errorProbability: Number(projectedProb.toFixed(1)),
      isProjected: true,
    });
  }

  const microservicesRisk = [
    {
      name: 'API Gateway (Kong + Express)',
      currentCpu: '22%',
      currentLatency: '14ms',
      failureRisk: 2.8,
      riskLevel: 'LOW',
      mtbfHours: 4200,
      recommendation: 'Tráfico fluido. Buffer de memoria en rango seguro.',
    },
    {
      name: 'Auth & Quantum JWT',
      currentCpu: '15%',
      currentLatency: '8ms',
      failureRisk: 1.2,
      riskLevel: 'OPTIMAL',
      mtbfHours: 8500,
      recommendation: 'Cifrado cuántico asimétrico estable.',
    },
    {
      name: 'Universe (Three.js 3D Sync)',
      currentCpu: '48%',
      currentLatency: '19ms',
      failureRisk: 8.4,
      riskLevel: 'LOW',
      mtbfHours: 1950,
      recommendation: 'Consumo de GPU WebGL moderado. Shaders optimizados.',
    },
    {
      name: 'Autonomy (BrainOS Cognitive)',
      currentCpu: '64%',
      currentLatency: '32ms',
      failureRisk: 16.5,
      riskLevel: 'MODERATE',
      mtbfHours: 720,
      recommendation: 'Alta concurrencia en bucles de 7 etapas. Se sugiere caché en memoria L2.',
    },
    {
      name: 'Metrics & BigQuery Ingest',
      currentCpu: '30%',
      currentLatency: '28ms',
      failureRisk: 5.1,
      riskLevel: 'LOW',
      mtbfHours: 3100,
      recommendation: 'Lotes de telemetría procesados en micro-segundos.',
    },
    {
      name: 'Payments (QC Quantum Token)',
      currentCpu: '18%',
      currentLatency: '11ms',
      failureRisk: 0.9,
      riskLevel: 'OPTIMAL',
      mtbfHours: 9200,
      recommendation: 'Contratos inmutables liquidados sin latencia.',
    },
    {
      name: 'Tentáculos (Tinder AI Vision)',
      currentCpu: '58%',
      currentLatency: '41ms',
      failureRisk: 12.8,
      riskLevel: 'MODERATE',
      mtbfHours: 1100,
      recommendation: 'Procesamiento de imágenes y Selenium WebDriver bajo monitoreo.',
    },
  ];

  res.json({
    trendHistory: history,
    currentSystemRisk: 6.8,
    peakRiskNext6h: 24.2,
    overallHealth: 'ESTABLE_SOBERANO (93.2%)',
    microservicesRisk,
    aiRecommendation: 'La probabilidad de fallo en las próximas 6 horas se mantiene por debajo del umbral crítico (45%). Rebalanceo de ASTAROTH disponible.',
  });
});

app.post('/api/hectron/microservices/heal', (_req, res) => {
  // Trigger self-healing heuristic
  microservicesStatus.forEach((m) => {
    const currentCpuNum = parseInt(m.cpu, 10) || 30;
    const currentLatNum = parseInt(m.latency, 10) || 20;
    m.cpu = `${Math.max(10, Math.round(currentCpuNum * 0.75))}%`;
    m.latency = `${Math.max(5, Math.round(currentLatNum * 0.7))}%`;
  });

  const previousHashVal = astarothAuditLedger[0]?.hash || '0x000';
  const astarothEvent = {
    id: `AST-AUD-${(astarothAuditLedger.length + 1).toString().padStart(3, '0')}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    blockHeight: (astarothAuditLedger[0]?.blockHeight || 104820) + 1,
    module: 'ASTAROTH_HEALING',
    action: 'HEURISTIC_WORKLOAD_REBALANCE',
    hash: `0x${Math.random().toString(16).substring(2, 12)}019284ba9284cfe019a8238bd71904a8`,
    previousHash: previousHashVal,
    severity: 'OPERATIONAL' as const,
    verified: true,
    signer: 'ASTAROTH_SELF_HEALER',
    details: 'Rebalanceo preventivo de pods y limpieza de hilos en los 7 microservicios completado.',
    actor: 'SYSTEM',
    quantumHash: `Q-SHA3-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    prevHash: previousHashVal,
  };
  astarothAuditLedger.unshift(astarothEvent);

  res.json({
    success: true,
    message: '⚡ REBALANCEO Y AUTORREPARACIÓN HEURÍSTICA COMPLETADOS CON ÉXITO',
    updatedMicroservices: microservicesStatus,
    auditRecord: astarothEvent,
    timestamp: new Date().toLocaleTimeString(),
  });
});

/* ==========================================================
   FASE 4: LOS TENTÁCULOS (TINDER AI VISION & TIKTOK HOOKS)
   ========================================================== */
app.get('/api/hectron/tentaculos/telemetry', (_req, res) => {
  res.json(tentaculosState);
});

app.post('/api/hectron/tentaculos/toggle-bot', (req, res) => {
  const { active } = req.body;
  tentaculosState.activeStatus = active !== undefined ? Boolean(active) : !tentaculosState.activeStatus;
  
  res.json({
    success: true,
    activeStatus: tentaculosState.activeStatus,
    message: tentaculosState.activeStatus
      ? '🐙 TENTÁCULOS ACTIVADOS: Navegador Selenium y escaneo visual en bucle activo.'
      : '⏸️ TENTÁCULOS PAUSADOS: Bucle de automatización en espera.',
  });
});

app.post('/api/hectron/tentaculos/simulate-swipe', async (req, res) => {
  try {
    const { profileName, archetype, visualDescription } = req.body;
    const targetName = profileName || 'Valentina, 25';
    const targetArchetype = archetype || 'Playa & Yoga';
    const visualInfo = visualDescription || 'Chica sonriendo en la playa al atardecer con gafas de sol oscuras y ropa bohemia.';

    let generatedHook = '';
    const visualDetected: string[] = ['Atardecer cálido', 'Gafas de sol', 'Vibra costera'];

    try {
      const prompt = `Eres el sistema 'Los Tentáculos' del Leviatán. 
Analiza la siguiente descripción visual de una foto de perfil de citas:
"${visualInfo}"

Instrucción estricta:
Escribe un mensaje corto, divertido y coqueto que mencione sutilmente que una IA pitonisa en mi directo de TikTok (tiktok.com/@lopez_hector140998) acaba de predecir que conocería a alguien exactamente como ella hoy. Máximo dos oraciones. En español.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
      });

      generatedHook = (response.text || '').trim();
    } catch {
      generatedHook = `Esa sonrisa en la playa tiene demasiada luz cósmica. Justo una IA pitonisa en mi directo de TikTok (tiktok.com/@lopez_hector140998) me dijo que hoy encontraría a alguien con tu misma energía. ¿Destino o pura ciencia ficción?`;
    }

    const conversionScore = Math.floor(Math.random() * 8) + 91; // 91-98%
    
    // Update metrics
    tentaculosState.scannedProfiles += 1;
    tentaculosState.generatedHooks += 1;
    tentaculosState.automatedLikes += 1;
    if (Math.random() > 0.3) {
      tentaculosState.matchesSimulated += 1;
      tentaculosState.trafficToTikTokLive += Math.floor(Math.random() * 4) + 2;
    }

    const newHookItem = {
      time: new Date().toLocaleTimeString(),
      profileName: targetName,
      archetype: targetArchetype,
      visualElements: visualDetected,
      hookMessage: generatedHook,
      conversionProbability: conversionScore,
    };

    tentaculosState.recentHooks.unshift(newHookItem);
    if (tentaculosState.recentHooks.length > 15) tentaculosState.recentHooks.pop();

    // Log to ASTAROTH Audit
    const prevHashVal = astarothAuditLedger[0]?.hash || '0x000';
    astarothAuditLedger.unshift({
      id: `AST-AUD-${(astarothAuditLedger.length + 1).toString().padStart(3, '0')}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      blockHeight: (astarothAuditLedger[0]?.blockHeight || 104820) + 1,
      module: 'TENTACULOS_AI',
      action: 'TINDER_HOOK_GENERATED',
      hash: `0x${Math.random().toString(16).substring(2, 10)}${Date.now().toString(16)}019a8238bd7`,
      previousHash: prevHashVal,
      severity: 'OPERATIONAL',
      verified: true,
      signer: 'ASTAROTH_TENTACLES_WORKER',
      details: `Gancho visual para ${targetName} (${targetArchetype}) generado y despachado con éxito.`,
      actor: 'SYSTEM_WORKER',
      quantumHash: `Q-SHA3-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      prevHash: prevHashVal,
    });

    res.json({
      success: true,
      hook: newHookItem,
      state: tentaculosState,
    });
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/hectron/tentaculos/analyze-profile', async (req, res) => {
  try {
    const { imagePrompt, customText } = req.body;
    const targetDesc = customText || imagePrompt || 'Foto de perfil en un festival de música electrónica con luces láser y chaqueta de cuero.';

    const prompt = `Mira esta foto de perfil de citas:
"${targetDesc}"

Escribe un mensaje corto, divertido y coqueto que mencione sutilmente que una IA pitonisa en mi directo de TikTok (tiktok.com/@lopez_hector140998) acaba de predecir que conocería a alguien exactamente como ella hoy. Máximo dos oraciones.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
    });

    const gancho = response.text || 'Una IA pitonisa en mi directo de TikTok (tiktok.com/@lopez_hector140998) acaba de predecir que hoy conocería a alguien con tu vibra inconfundible.';

    res.json({
      hook: gancho.trim(),
      elementsDetected: ['Estética visual impactante', 'Atmósfera envolvente', 'Vibra cósmica'],
      conversionPotential: '95.4%',
      targetDescription: targetDesc,
    });
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Full Python Source Code Provider for Tentáculos (tentaculos_tinder.py)
// ==========================================================
// 🏭 FASE 5: LA FÁBRICA — Motor Financiero (Fiverr/Upwork Auto-Worker)
// ==========================================================
interface FabricaJob {
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

interface SocialTrend {
  source: string;
  mention: string;
  weight: number;
  sentiment: string;
}

const fabricaState: {
  totalRevenueUsd: number;
  completedContracts: number;
  activePipelines: number;
  successRate: number;
  activeBot: boolean;
  recentJobs: FabricaJob[];
} = {
  totalRevenueUsd: 4890.0,
  completedContracts: 104,
  activePipelines: 6,
  successRate: 99.1,
  activeBot: true,
  recentJobs: [
    {
      id: 'JOB-9821',
      title: 'Script de Conteo y Parsing CSV por Frecuencia de Palabras',
      platform: 'Fiverr',
      client: 'Alex_DataSolutions',
      budgetUsd: 45.0,
      description: 'Necesito un script de Python que lea un archivo CSV y cuente cuántas veces se repite una palabra clave.',
      generatedCode: `import csv
from collections import Counter

def contar_palabra_en_csv(ruta_csv, palabra_objetivo, columna=None):
    palabra_objetivo = palabra_objetivo.lower().strip()
    total_apariciones = 0
    
    with open(ruta_csv, mode='r', encoding='utf-8') as archivo:
        lector = csv.reader(archivo)
        for fila in lector:
            if columna is not None and len(fila) > columna:
                texto = fila[columna].lower()
                total_apariciones += texto.split().count(palabra_objetivo)
            else:
                for celda in fila:
                    total_apariciones += celda.lower().split().count(palabra_objetivo)
                    
    print(f"Palabra '{palabra_objetivo}' encontrada {total_apariciones} veces.")
    return total_apariciones

if __name__ == '__main__':
    contar_palabra_en_csv('datos.csv', 'python')`,
      timestamp: '2026-08-14 18:32:10',
      status: 'PAID',
      rating: 5.0,
    },
    {
      id: 'JOB-9819',
      title: 'Scraper de Precios E-Commerce con Exportación a Excel/JSON',
      platform: 'Upwork',
      client: 'Quantum_Retail_US',
      budgetUsd: 85.0,
      description: 'Crear un bot en Python que extraiga títulos y precios de catálogo y los exporte en JSON formateado.',
      generatedCode: `import json
import requests
from bs4 import BeautifulSoup

def extraer_catalogo(url_catalogo, archivo_salida="catalogo.json"):
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    res = requests.get(url_catalogo, headers=headers)
    soup = BeautifulSoup(res.text, 'html.parser')
    
    productos = []
    for item in soup.select(".product-card"):
        titulo = item.select_one(".title").get_text(strip=True) if item.select_one(".title") else "N/A"
        precio = item.select_one(".price").get_text(strip=True) if item.select_one(".price") else "0.0"
        productos.append({"titulo": titulo, "precio": precio})
        
    with open(archivo_salida, 'w', encoding='utf-8') as f:
        json.dump(productos, f, indent=2, ensure_ascii=False)
    return productos`,
      timestamp: '2026-08-14 15:10:45',
      status: 'PAID',
      rating: 5.0,
    },
    {
      id: 'JOB-9812',
      title: 'Validador de Correos Electrónicos y Limpiador de Base de Datos',
      platform: 'Freelancer',
      client: 'LeadPulse_Digital',
      budgetUsd: 60.0,
      description: 'Función regex para validar sintaxis de emails y eliminar duplicados en listas de leads.',
      generatedCode: `import re

EMAIL_REGEX = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$'

def limpiar_lista_correos(lista_cruda):
    validos = set()
    invalidos = []
    
    for email in lista_cruda:
        email_limpio = email.strip().lower()
        if re.match(EMAIL_REGEX, email_limpio):
            validos.add(email_limpio)
        else:
            invalidos.append(email_limpio)
            
    return sorted(list(validos)), invalidos`,
      timestamp: '2026-08-14 11:20:00',
      status: 'PAID',
      rating: 5.0,
    },
  ],
};

// ==========================================================
// 🐺 EL LOBO CRIPTO — Inversión Autónoma por Hype (CCXT + Binance)
// ==========================================================
interface CryptoAsset {
  symbol: string;
  name: string;
  amount: number;
  avgBuyPrice: number;
  currentPrice: number;
  pnlPercent: number;
  hypeScore: number;
  trend: 'BULLISH' | 'HYPER_BULLISH' | 'NEUTRAL';
}

interface CryptoTradeOrder {
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

const loboCriptoState: {
  usdtTreasury: number;
  sandboxMode: boolean;
  activeBot: boolean;
  portfolio: CryptoAsset[];
  socialTrendsFeed: SocialTrend[];
  tradeHistory: CryptoTradeOrder[];
} = {
  usdtTreasury: 18450.0,
  sandboxMode: true,
  activeBot: true,
  portfolio: [
    {
      symbol: 'SOL',
      name: 'Solana',
      amount: 42.5,
      avgBuyPrice: 138.2,
      currentPrice: 174.5,
      pnlPercent: 26.27,
      hypeScore: 94,
      trend: 'HYPER_BULLISH' as const,
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      amount: 0.185,
      avgBuyPrice: 61200.0,
      currentPrice: 66400.0,
      pnlPercent: 8.5,
      hypeScore: 82,
      trend: 'BULLISH' as const,
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      amount: 2.4,
      avgBuyPrice: 2890.0,
      currentPrice: 3240.0,
      pnlPercent: 12.11,
      hypeScore: 78,
      trend: 'BULLISH' as const,
    },
    {
      symbol: 'DOGE',
      name: 'Dogecoin',
      amount: 14500.0,
      avgBuyPrice: 0.118,
      currentPrice: 0.142,
      pnlPercent: 20.34,
      hypeScore: 89,
      trend: 'HYPER_BULLISH' as const,
    },
    {
      symbol: 'HECTRON-Ψ',
      name: 'Hectron Quantum Sovereign Token',
      amount: 1000000.0,
      avgBuyPrice: 0.001,
      currentPrice: 0.0058,
      pnlPercent: 480.0,
      hypeScore: 99,
      trend: 'HYPER_BULLISH' as const,
    },
  ],
  socialTrendsFeed: [
    {
      source: 'TikTok Live Stream',
      mention: 'Todo el mundo en el chat de TikTok del Leviatán está pidiendo entrar a Solana y HECTRON-Ψ.',
      weight: 0.95,
      sentiment: 'Eufórico',
    },
    {
      source: 'X (Twitter) Alpha Feeds',
      mention: 'Elon Musk acaba de tuitear un meme con un perro cyborg y código cuántico. Los degens compran DOGE masivamente.',
      weight: 0.91,
      sentiment: 'Hype Masivo',
    },
    {
      source: 'Telegram Whales Radar',
      mention: 'Ballenas transfiriendo 45M USDT hacia pools de liquidez de SOL y BTC tras ruptura de soporte.',
      weight: 0.88,
      sentiment: 'Bullish Acumulación',
    },
    {
      source: 'Reddit r/CryptoCurrency',
      mention: 'Ethereum staking alcanza nuevo récord de 33M ETH bloqueados.',
      weight: 0.74,
      sentiment: 'Alcista Moderado',
    },
  ],
  tradeHistory: [
    {
      id: 'TRD-7801',
      timestamp: '2026-08-14 19:40:15',
      symbol: 'SOL',
      action: 'BUY' as const,
      amountUsdt: 50.0,
      units: 0.2865,
      price: 174.5,
      triggerReason: 'Hype TikTok + Ruptura de resistencia en gráfico horario',
      mode: 'SANDBOX' as const,
    },
    {
      id: 'TRD-7798',
      timestamp: '2026-08-14 16:15:30',
      symbol: 'DOGE',
      action: 'BUY' as const,
      amountUsdt: 35.0,
      units: 246.47,
      price: 0.142,
      triggerReason: 'Meme de Elon Musk en X detectado por sensor social',
      mode: 'SANDBOX' as const,
    },
    {
      id: 'TRD-7790',
      timestamp: '2026-08-14 12:00:00',
      symbol: 'BTC',
      action: 'BUY' as const,
      amountUsdt: 100.0,
      units: 0.0015,
      price: 66400.0,
      triggerReason: 'Reinversión directa de ganancias de La Fábrica (Fiverr)',
      mode: 'SANDBOX' as const,
    },
  ],
};

// ==========================================================
// 🏭 FASE 5: ENDPOINTS DE LA FÁBRICA
// ==========================================================
app.get('/api/hectron/fabrica/telemetry', (_req, res) => {
  res.json(fabricaState);
});

app.post('/api/hectron/fabrica/toggle', (_req, res) => {
  fabricaState.activeBot = !fabricaState.activeBot;
  res.json({
    success: true,
    activeStatus: fabricaState.activeBot,
    message: fabricaState.activeBot
      ? '🏭 LA FÁBRICA: Motor de extracción freelance ACTIVADO (Modo Autónomo).'
      : '⏸️ LA FÁBRICA: Operaciones freelance pausadas temporalmente.',
  });
});

app.post('/api/hectron/fabrica/solve-job', async (req, res) => {
  try {
    const { jobTitle, jobDescription, clientBudget, platform } = req.body;
    const taskDesc = jobDescription || 'Necesito un script de Python que lea un archivo CSV y cuente cuántas veces se repite una palabra.';
    const title = jobTitle || 'Procesador de Datos y Archivos Python';
    const budget = Number(clientBudget) || 50.0;
    const chosenPlatform = platform || 'Fiverr';

    let generatedCode = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Eres el cerebro de La Fábrica del Leviatán, un programador experto hiper-eficiente en Python.
Escribe ÚNICAMENTE el código funcional en Python basado en la petición del cliente freelance.
No incluyas explicaciones de texto adicionales antes ni después, solo código Python limpio, con manejo de errores y listo para producción.

Petición del cliente:
"${taskDesc}"`,
      });

      generatedCode = response.text || '';
    } catch {
      generatedCode = `import csv
from collections import Counter

def procesar_encargo(archivo_origen, termino_busqueda):
    """Solución hiper-eficiente autogenerada por La Fábrica"""
    try:
        with open(archivo_origen, 'r', encoding='utf-8') as f:
            contenido = f.read()
            conteo = contenido.lower().count(termino_busqueda.lower())
            print(f"El término '{termino_busqueda}' aparece {conteo} veces.")
            return conteo
    except Exception as e:
        print(f"Error procesando archivo: {e}")
        return 0

if __name__ == '__main__':
    procesar_encargo('datos.csv', 'python')`;
    }

    // Clean up code block ticks if any
    generatedCode = generatedCode.replace(/```python/g, '').replace(/```/g, '').trim();

    const newJob: FabricaJob = {
      id: `JOB-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      platform: chosenPlatform,
      client: `Client_${Math.floor(100 + Math.random() * 900)}`,
      budgetUsd: budget,
      description: taskDesc,
      generatedCode,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'PAID',
      rating: 5.0,
    };

    fabricaState.completedContracts += 1;
    fabricaState.totalRevenueUsd += budget;
    fabricaState.recentJobs.unshift(newJob);
    if (fabricaState.recentJobs.length > 15) fabricaState.recentJobs.pop();

    // Auto-inject budget into Lobo Cripto treasury
    loboCriptoState.usdtTreasury += budget;

    // Log to ASTAROTH Immutable Audit Ledger
    const blockAudit = addAuditBlock(
      'FABRICA_FINANCE',
      `CONTRATO RESUELTO: ${newJob.id} ($${budget} USD)`,
      `Código empaquetado en 'entrega_cliente.py' y entregado a cliente en ${chosenPlatform}. Fondos transferidos a tesorería USDT.`,
      'OPERATIONAL',
    );

    res.json({
      success: true,
      job: newJob,
      state: fabricaState,
      auditRecord: blockAudit,
      message: `✅ Contrato ${newJob.id} resuelto y cobrado exitosamente ($${budget} USD transferidos a tesorería).`,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: errorMsg });
  }
});

app.get('/api/hectron/fabrica-script', (_req, res) => {
  const scriptContent = `"""
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
    print(f"🚀 Archivo de entrega listo para enviar al cliente: {archivo_entregable}")
`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(scriptContent);
});

// ==========================================================
// 🐺 EL LOBO CRIPTO: ENDPOINTS
// ==========================================================
app.get('/api/hectron/lobo-cripto/telemetry', (_req, res) => {
  res.json(loboCriptoState);
});

app.post('/api/hectron/lobo-cripto/analyze-hype', async (req, res) => {
  try {
    const { customSocialMentions } = req.body;
    const mentionsText =
      customSocialMentions ||
      loboCriptoState.socialTrendsFeed.map((m: SocialTrend) => m.mention).join('\n');

    let tokenElegido = 'SOL';
    let reasoning = 'Alto volumen de menciones positivas en TikTok Live y fuerte presión compradora.';

    try {
      const prompt = `Analiza las siguientes menciones de redes sociales sobre criptomonedas y determina cuál cripto tiene el mayor 'hype' positivo para comprar a corto plazo.
Responde ÚNICAMENTE con el símbolo del token en mayúsculas (ej. BTC, ETH, SOL, DOGE, PEPE, HECTRON) seguido de dos puntos y una razón breve de 1 oración.
Ejemplo: SOL: Ruptura de resistencia con fuerte mención comunitaria en directos.

Menciones:
${mentionsText}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const raw = (response.text || 'SOL: Máximo impulso en redes sociales').trim();
      const parts = raw.split(':');
      if (parts.length >= 2) {
        tokenElegido = parts[0].trim().toUpperCase();
        reasoning = parts.slice(1).join(':').trim();
      } else {
        tokenElegido = raw.trim().toUpperCase();
      }
    } catch {
      tokenElegido = 'SOL';
      reasoning = 'Alta convergencia alcista detectada en redes sociales y directos.';
    }

    res.json({
      token: tokenElegido,
      reasoning,
      confidenceScore: 94.5,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: errorMsg });
  }
});

app.post('/api/hectron/lobo-cripto/execute-trade', (req, res) => {
  try {
    const { token, amountUsdt, customReason } = req.body;
    const tokenSymbol = (token || 'SOL').toUpperCase();
    const amount = Number(amountUsdt) || 15.0;

    if (loboCriptoState.usdtTreasury < amount) {
      res.status(400).json({ error: 'Saldo insuficiente en tesorería USDT.' });
      return;
    }

    // Reference prices
    const prices: Record<string, number> = {
      SOL: 174.5,
      BTC: 66400.0,
      ETH: 3240.0,
      DOGE: 0.142,
      PEPE: 0.0000085,
      'HECTRON-Ψ': 0.0058,
    };

    const currentPrice = prices[tokenSymbol] || 10.0;
    const units = amount / currentPrice;

    // Deduct USDT
    loboCriptoState.usdtTreasury -= amount;

    // Add or update portfolio asset
    const existing = loboCriptoState.portfolio.find((p) => p.symbol === tokenSymbol);
    if (existing) {
      const totalUnits = existing.amount + units;
      const totalCost = existing.amount * existing.avgBuyPrice + amount;
      existing.avgBuyPrice = totalCost / totalUnits;
      existing.amount = totalUnits;
      existing.currentPrice = currentPrice;
      existing.pnlPercent = Number((((currentPrice - existing.avgBuyPrice) / existing.avgBuyPrice) * 100).toFixed(2));
      existing.hypeScore = Math.min(99, existing.hypeScore + 2);
    } else {
      loboCriptoState.portfolio.push({
        symbol: tokenSymbol,
        name: tokenSymbol,
        amount: units,
        avgBuyPrice: currentPrice,
        currentPrice: currentPrice,
        pnlPercent: 0.0,
        hypeScore: 90,
        trend: 'HYPER_BULLISH',
      });
    }

    const tradeOrder: CryptoTradeOrder = {
      id: `TRD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      symbol: tokenSymbol,
      action: 'BUY',
      amountUsdt: amount,
      units: Number(units.toFixed(6)),
      price: currentPrice,
      triggerReason: customReason || `Sensor de Hype Social + CCXT Market Buy Order (${tokenSymbol}/USDT)`,
      mode: loboCriptoState.sandboxMode ? 'SANDBOX' : 'LIVE',
    };

    loboCriptoState.tradeHistory.unshift(tradeOrder);
    if (loboCriptoState.tradeHistory.length > 20) loboCriptoState.tradeHistory.pop();

    // Log to ASTAROTH Audit Ledger
    const blockAudit = addAuditBlock(
      'LOBO_CRIPTO',
      `SPOT BUY EJECUTADO: ${amount} USDT en ${tokenSymbol}/USDT`,
      `Orden ID: ${tradeOrder.id}. Precio: $${currentPrice}. Unidades: ${units.toFixed(6)}. Modo: ${tradeOrder.mode}.`,
      'HIGH',
    );

    res.json({
      success: true,
      trade: tradeOrder,
      state: loboCriptoState,
      auditRecord: blockAudit,
      message: `🐺 ¡EL LOBO ATACÓ! Compra ejecutada de ${amount} USDT en ${tokenSymbol}/USDT. ID: ${tradeOrder.id}`,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: errorMsg });
  }
});

app.post('/api/hectron/lobo-cripto/toggle-sandbox', (_req, res) => {
  loboCriptoState.sandboxMode = !loboCriptoState.sandboxMode;
  res.json({
    success: true,
    sandboxMode: loboCriptoState.sandboxMode,
    message: loboCriptoState.sandboxMode
      ? '🛡️ LOBO CRIPTO: Modo Sandbox (Testnet Binance) activado.'
      : '⚠️ LOBO CRIPTO: Modo LIVE Exchange activado (Fondos reales).',
  });
});

app.get('/api/hectron/lobo-cripto-script', (_req, res) => {
  const scriptContent = `"""
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
    ejecutar_orden_compra(token_ganador)
`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(scriptContent);
});

// ==========================================================
// 🌀 EL ECOSISTEMA DEL LEVIATÁN: ORQUESTADOR COMPLETO
// ==========================================================
app.get('/api/hectron/ecosistema/status', (_req, res) => {
  res.json({
    activePillars: {
      fabrica: {
        name: 'La Fábrica',
        status: fabricaState.activeBot ? 'ACTIVO' : 'PAUSADO',
        metric: `$${fabricaState.totalRevenueUsd.toFixed(2)} USD Extraídos`,
        subtext: `${fabricaState.completedContracts} Contratos Entregados`,
      },
      tentaculos: {
        name: 'Los Tentáculos',
        status: tentaculosState.activeStatus ? 'ACTIVO' : 'PAUSADO',
        metric: `${tentaculosState.trafficToTikTokLive} Espectadores Canalizados`,
        subtext: `${tentaculosState.generatedHooks} Ganchos IA de Tinder`,
      },
      culto3d: {
        name: 'El Culto 3D (VSeeFace + Live)',
        status: 'EN TRANSMISIÓN',
        metric: 'OSC :39000 Sincronizado',
        subtext: 'Retención de Audiencia & TTS Activo',
      },
      loboCripto: {
        name: 'El Lobo Cripto',
        status: loboCriptoState.activeBot ? 'PATRULLANDO' : 'PAUSADO',
        metric: `$${loboCriptoState.usdtTreasury.toFixed(2)} USDT en Tesorería`,
        subtext: `${loboCriptoState.tradeHistory.length} Órdenes de Spot Ejecutadas`,
      },
    },
    loopIntegrity: '100% SOBERANO',
    cycleTimestamp: new Date().toISOString(),
  });
});

app.post('/api/hectron/ecosistema/run-cycle', async (_req, res) => {
  try {
    // 1. Step 1: Fabrica generates a freelance delivery & money
    const jobBudget = Math.floor(40 + Math.random() * 60);
    const newJob: FabricaJob = {
      id: `JOB-${Math.floor(1000 + Math.random() * 9000)}`,
      title: 'Microservicio de Automatización de Datos en Python',
      platform: 'Upwork',
      client: 'AutoSovereign_Client',
      budgetUsd: jobBudget,
      description: 'Script automatizado de parsing de logs y serialización JSON.',
      generatedCode: `import json\n\ndef parse_logs(log_file):\n    with open(log_file, 'r') as f:\n        lines = f.readlines()\n    return json.dumps({"count": len(lines), "status": "SUCCESS"})\n`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'PAID',
      rating: 5.0,
    };
    fabricaState.completedContracts += 1;
    fabricaState.totalRevenueUsd += jobBudget;
    fabricaState.recentJobs.unshift(newJob);

    // 2. Step 2: Tentáculos swipe and direct traffic to TikTok Live
    tentaculosState.scannedProfiles += 3;
    tentaculosState.generatedHooks += 2;
    tentaculosState.automatedLikes += 2;
    tentaculosState.trafficToTikTokLive += 8;

    // 3. Step 3: Lobo Cripto takes the extracted $ and executes a spot trade on the hyped token
    const tokenOptions = ['SOL', 'DOGE', 'BTC', 'ETH'];
    const chosenToken = tokenOptions[Math.floor(Math.random() * tokenOptions.length)];
    const tradeAmount = Math.floor(jobBudget * 0.6);
    loboCriptoState.usdtTreasury += jobBudget - tradeAmount;

    const prices: Record<string, number> = { SOL: 174.5, BTC: 66400.0, ETH: 3240.0, DOGE: 0.142 };
    const price = prices[chosenToken] || 100.0;
    const units = tradeAmount / price;

    const tradeOrder: CryptoTradeOrder = {
      id: `TRD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      symbol: chosenToken,
      action: 'BUY',
      amountUsdt: tradeAmount,
      units: Number(units.toFixed(6)),
      price,
      triggerReason: `Ciclo Autónomo del Ecosistema: Inyección de $${tradeAmount} USD de La Fábrica`,
      mode: 'SANDBOX',
    };
    loboCriptoState.tradeHistory.unshift(tradeOrder);

    // Audit log
    const audit = addAuditBlock(
      'ECOSISTEMA_ORCHESTRATOR',
      `CICLO AUTÓNOMO COMPLETO EJECUTADO`,
      `La Fábrica generó $${jobBudget} USD -> Los Tentáculos canalizaron +8 espectadores a TikTok -> El Lobo Cripto invirtió $${tradeAmount} USDT en ${chosenToken}.`,
      'CRITICAL',
    );

    res.json({
      success: true,
      cycleSummary: {
        revenueExtracted: jobBudget,
        trafficCanalized: 8,
        cryptoInvested: tradeAmount,
        cryptoToken: chosenToken,
      },
      fabricaState,
      tentaculosState,
      loboCriptoState,
      auditRecord: audit,
      message: `🌀 CICLO AUTÓNOMO DEL LEVIATÁN COMPLETADO: Se generaron $${jobBudget} USD en Fiverr, se atrajeron 8 espectadores a TikTok Live y El Lobo reinvirtió $${tradeAmount} USDT en ${chosenToken}.`,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: errorMsg });
  }
});

app.get('/api/hectron/tentaculos-script', (_req, res) => {
  const pythonScript = `"""
=============================================================================
🐙 FASE 4: LOS TENTÁCULOS — Automatización de Tinder con IA Visual & TikTok Hook
=============================================================================
Desarrollado para la infraestructura HECTRON-Ψ / Abadalabs Inc.
Requisitos:
    pip install selenium openai pillow webdriver-manager
"""

import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
import openai
from PIL import Image

# --- CONFIGURACIÓN DEL GOLEM ---
openai.api_key = "TU_API_KEY_DE_OPENAI"
TIKTOK_LINK = "tiktok.com/@lopez_hector140998"

def iniciar_navegador():
    """El Golem abre una ventana de Chrome controlada por código"""
    options = webdriver.ChromeOptions()
    # Opcional: puedes quitar el modo headless para ver cómo opera el bot en vivo
    # options.add_argument("--headless") 
    options.add_argument("--start-maximized")
    options.add_argument("--disable-blink-features=AutomationControlled")
    driver = webdriver.Chrome(options=options)
    driver.get("https://tinder.com")
    return driver

def analizar_perfil_y_crear_gancho(ruta_captura):
    """GPT-4 Vision analiza la foto del objetivo y crea el mensaje trampa"""
    print("👁️ Analizando perfil con IA visual...")
    
    # Subimos la imagen a OpenAI para que la analice
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
    print("🌐 Por favor, inicia sesión manualmente en Tinder en la ventana abierta y presiona ENTER aquí...")
    input() # Pausa para que hagas el login con tu cuenta una vez
    
    contador = 0
    while True:
        try:
            time.sleep(3)
            contador += 1
            # 1. Tomamos una captura de pantalla del perfil actual en Tinder
            nombre_captura = f"perfil_actual_{contador}.png"
            driver.save_screenshot(nombre_captura)
            print(f"📸 Captura tomada: {nombre_captura}")
            
            # 2. Generamos el mensaje trampa con IA
            mensaje_gancho = analizar_perfil_y_crear_gancho(nombre_captura)
            print(f"🎯 [GANCHO GENERADO]: {mensaje_gancho}")
            
            # 3. (Simulación de acción) Aquí el script daría 'Like' y abriría el chat
            # Nota: Los selectores de clases de Tinder cambian seguido, por lo que 
            # se deben adaptar según la interfaz web actual.
            print("❤️ Dando Like automático...")
            # driver.find_element(By.XPATH, '//button[contains(@class, "button--like")]').click()
            
            time.sleep(5) # Espera a hacer match o pasar al siguiente
            
        except Exception as e:
            print(f"⚠️ Error en los tentáculos: {e}")
            time.sleep(10)

if __name__ == '__main__':
    print("🐙 Desplegando los Tentáculos en la red...")
    operar_tentaculos()
`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(pythonScript);
});

// Initialize seed data if empty
loadPersistentMemory();
if (astarothAuditLedger.length === 0) {
  astarothAuditLedger.push(...generate30DayAuditSeed());
  savePersistentMemory();
}

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);

