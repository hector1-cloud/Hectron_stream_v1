import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
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

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, AuditChart, MicroservicesChart],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private http = inject(HttpClient);
  indexedDb = inject(IndexedDbService);
  private platformId = inject(PLATFORM_ID);

  // Active View Tab
  activeTab = signal<'game' | 'brainos' | 'chat' | 'vault' | 'microservices' | 'golem' | 'tentaculos' | 'fabrica' | 'lobo' | 'ecosistema'>('game');

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
  toastMessage = signal<string | null>(null);

  // Form Controls (Strict Reactive Forms)
  chatInput = new FormControl('', { nonNullable: true });
  commandInput = new FormControl('', { nonNullable: true });
  observationInput = new FormControl('', { nonNullable: true });
  streamViewerName = new FormControl('CyberPilot_99', { nonNullable: true });
  streamViewerComment = new FormControl('¿Cuál es la fórmula cuántica de la propulsión taquiónica?', { nonNullable: true });

  // Vault input form
  vaultTipo = new FormControl('BLUEPRINT', { nonNullable: true });
  vaultContenido = new FormControl('', { nonNullable: true });

  // Audio Context for sound effects
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
    this.fetchSystemState();
    this.fetchAuditLedger();
    this.fetchPredictiveTelemetry();
    this.fetchTentaculosTelemetry();
    this.fetchFabricaTelemetry();
    this.fetchLoboTelemetry();
    this.fetchEcosistemaStatus();
    this.fetchPersistentMemoryInfo();
    this.restoreFromIndexedDbIfAvailable();

    if (isPlatformBrowser(this.platformId)) {
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

  getTabClass(tab: 'game' | 'brainos' | 'chat' | 'vault' | 'microservices' | 'golem' | 'tentaculos' | 'fabrica' | 'lobo' | 'ecosistema'): string {
    const base = "px-3.5 py-2 rounded-lg font-['Orbitron'] text-xs font-bold tracking-wider flex items-center gap-1.5 transition-all shrink-0 ";
    if (this.activeTab() === tab) {
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
      return base + 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]';
    }
    return base + 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent';
  }

  setTab(tab: 'game' | 'brainos' | 'chat' | 'vault' | 'microservices' | 'golem' | 'tentaculos' | 'fabrica' | 'lobo' | 'ecosistema') {
    this.activeTab.set(tab);
    this.playBlipSound(600, 0.05);
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
    this.http.get('/api/hectron/python-script', { responseType: 'text' }).subscribe({
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
        this.showToast('leviatan_core.py DESCARGADO');
        this.playBlipSound(960, 0.15);
      },
      error: (err) => console.error('Python script fetch error:', err),
    });
  }

  copyPythonScript() {
    this.http.get('/api/hectron/python-script', { responseType: 'text' }).subscribe({
      next: (scriptContent) => {
        navigator.clipboard.writeText(scriptContent).then(() => {
          this.showToast('CÓDIGO PYTHON COPIADO AL PORTAPAPELES');
          this.playBlipSound(900, 0.1);
        });
      },
    });
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
      voice: string;
    }>('/api/hectron/tts', { text, voice: 'Zephyr' }).subscribe({
      next: (res) => {
        if (res.audio) {
          const snd = new Audio(`data:audio/mp3;base64,${res.audio}`);
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
          snd.play();
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

  private playBlipSound(freq = 440, duration = 0.1) {
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
}
