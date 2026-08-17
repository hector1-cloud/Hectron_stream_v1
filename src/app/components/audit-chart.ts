/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  effect,
  inject,
  input,
  signal,
  computed,
  ChangeDetectionStrategy,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import * as d3 from 'd3';

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

export interface AuditTimelinePoint {
  date: string;
  dayLabel: string;
  dayIndex: number;
  critical: number;
  high: number;
  operational: number;
  audit: number;
  total: number;
}

export interface TimelineSummary {
  totalEvents: number;
  totalCritical: number;
  totalHigh: number;
  totalOperational: number;
  totalAudit: number;
  dailyAverage: number;
  peakDay: {
    date?: string;
    dayLabel?: string;
    count?: number;
  };
  distribution: {
    severity: string;
    count: number;
    color: string;
    label: string;
  }[];
}

@Component({
  selector: 'app-audit-chart',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div id="d3-audit-visualizer" class="p-6 rounded-2xl bg-slate-950/95 border border-purple-500/50 shadow-[0_0_35px_rgba(168,85,247,0.2)] flex flex-col gap-6">
      
      <!-- Chart Header with Live D3 Badge & Controls -->
      <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl bg-purple-500/20 border border-purple-500/50 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <mat-icon>insert_chart</mat-icon>
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="font-['Orbitron'] text-base font-bold text-white tracking-wide">
                FRECUENCIA Y SEVERIDAD DE AUDITORÍA (30 DÍAS)
              </h3>
              <span class="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-['Fira_Code'] font-bold flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                D3.JS VECTOR ENGINE
              </span>
            </div>
            <p class="text-xs text-slate-400 font-['Fira_Code'] mt-0.5">
              Visualización multi-nivel de densidad de eventos, curvas de severidad y distribución cuántica ASTAROTH
            </p>
          </div>
        </div>

        <!-- Controls: Timeframe & Chart Type -->
        <div class="flex items-center gap-2 flex-wrap w-full lg:w-auto justify-end">
          <!-- Timeframe selector -->
          <div class="flex items-center bg-slate-900/90 rounded-lg p-1 border border-slate-800 text-[11px] font-['Fira_Code']">
            <button
              (click)="setTimeframe(30)"
              [class]="timeframeDays() === 30 ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'"
              class="px-2.5 py-1 rounded transition-all">
              30 DÍAS
            </button>
            <button
              (click)="setTimeframe(14)"
              [class]="timeframeDays() === 14 ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'"
              class="px-2.5 py-1 rounded transition-all">
              14 DÍAS
            </button>
            <button
              (click)="setTimeframe(7)"
              [class]="timeframeDays() === 7 ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'"
              class="px-2.5 py-1 rounded transition-all">
              7 DÍAS
            </button>
          </div>

          <!-- Chart Mode Selector -->
          <div class="flex items-center bg-slate-900/90 rounded-lg p-1 border border-slate-800 text-[11px] font-['Fira_Code']">
            <button
              (click)="setChartMode('stacked')"
              [class]="chartMode() === 'stacked' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'"
              class="px-2.5 py-1 rounded transition-all flex items-center gap-1">
              <mat-icon class="text-xs">bar_chart</mat-icon>
              <span>APILADO</span>
            </button>
            <button
              (click)="setChartMode('area')"
              [class]="chartMode() === 'area' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'"
              class="px-2.5 py-1 rounded transition-all flex items-center gap-1">
              <mat-icon class="text-xs">show_chart</mat-icon>
              <span>CURVA</span>
            </button>
          </div>

          <!-- Refresh Button -->
          <button
            (click)="fetchTimelineData()"
            title="Recalcular escalas D3"
            class="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-purple-500 text-slate-300 hover:text-purple-300 transition-all">
            <mat-icon class="text-sm">refresh</mat-icon>
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards Strip -->
      <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        <!-- Total Events -->
        <div class="p-3.5 rounded-xl bg-slate-900/70 border border-purple-500/30 flex flex-col justify-between">
          <span class="text-[10px] font-['Fira_Code'] text-slate-400 uppercase tracking-wider">EVENTOS ({{ timeframeDays() }}D)</span>
          <div class="flex items-baseline gap-1.5 mt-1">
            <span class="font-['Orbitron'] text-xl font-black text-purple-300">{{ activeSummary().totalEvents }}</span>
            <span class="text-[10px] text-purple-400 font-['Fira_Code']">bloques</span>
          </div>
          <span class="text-[10px] text-slate-500 font-['Fira_Code'] mt-1">Promedio: {{ activeSummary().dailyAverage }}/día</span>
        </div>

        <!-- Critical Events -->
        <div class="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-['Fira_Code'] text-rose-400 uppercase tracking-wider">CRÍTICO</span>
            <span class="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]"></span>
          </div>
          <div class="flex items-baseline gap-1.5 mt-1">
            <span class="font-['Orbitron'] text-xl font-black text-rose-300">{{ activeSummary().totalCritical }}</span>
            <span class="text-[10px] text-rose-400/80 font-['Fira_Code']">
              ({{ getPercent(activeSummary().totalCritical, activeSummary().totalEvents) }}%)
            </span>
          </div>
          <span class="text-[10px] text-rose-400/60 font-['Fira_Code'] mt-1">Soberanía e Incidencias</span>
        </div>

        <!-- High Risk Events -->
        <div class="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-['Fira_Code'] text-amber-400 uppercase tracking-wider">ALTO RIESGO</span>
            <span class="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]"></span>
          </div>
          <div class="flex items-baseline gap-1.5 mt-1">
            <span class="font-['Orbitron'] text-xl font-black text-amber-300">{{ activeSummary().totalHigh }}</span>
            <span class="text-[10px] text-amber-400/80 font-['Fira_Code']">
              ({{ getPercent(activeSummary().totalHigh, activeSummary().totalEvents) }}%)
            </span>
          </div>
          <span class="text-[10px] text-amber-400/60 font-['Fira_Code'] mt-1">IA Hooks y Mercado</span>
        </div>

        <!-- Operational Events -->
        <div class="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-['Fira_Code'] text-emerald-400 uppercase tracking-wider">OPERACIONAL</span>
            <span class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
          </div>
          <div class="flex items-baseline gap-1.5 mt-1">
            <span class="font-['Orbitron'] text-xl font-black text-emerald-300">{{ activeSummary().totalOperational }}</span>
            <span class="text-[10px] text-emerald-400/80 font-['Fira_Code']">
              ({{ getPercent(activeSummary().totalOperational, activeSummary().totalEvents) }}%)
            </span>
          </div>
          <span class="text-[10px] text-emerald-400/60 font-['Fira_Code'] mt-1">Ciclos Cognitivos & OSC</span>
        </div>

        <!-- Audit QC Events -->
        <div class="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex flex-col justify-between col-span-2 sm:col-span-1">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-['Fira_Code'] text-indigo-400 uppercase tracking-wider">AUDITORÍA QC</span>
            <span class="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#a855f7]"></span>
          </div>
          <div class="flex items-baseline gap-1.5 mt-1">
            <span class="font-['Orbitron'] text-xl font-black text-indigo-300">{{ activeSummary().totalAudit }}</span>
            <span class="text-[10px] text-indigo-400/80 font-['Fira_Code']">
              ({{ getPercent(activeSummary().totalAudit, activeSummary().totalEvents) }}%)
            </span>
          </div>
          <span class="text-[10px] text-indigo-400/60 font-['Fira_Code'] mt-1">Sellos Merkle y QC</span>
        </div>
      </div>

      <!-- Main Visualizer Grid (D3 Stacked/Area Chart on Left, D3 Donut Distribution on Right) -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <!-- Left: Main D3 Vector Stage (3 Cols) -->
        <div class="lg:col-span-3 flex flex-col gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 relative">
          <div class="flex items-center justify-between text-xs font-['Fira_Code'] text-slate-400 border-b border-slate-800/60 pb-2">
            <div class="flex items-center gap-2">
              <mat-icon class="text-xs text-purple-400">timeline</mat-icon>
              <span class="text-slate-200 font-semibold">DISTRIBUCIÓN CRONOLÓGICA DIARIA</span>
            </div>
            
            <!-- Severity Legend Pill Indicators -->
            <div class="flex items-center gap-3 text-[10px]">
              <span class="flex items-center gap-1 text-rose-400">
                <span class="w-2 h-2 rounded-sm bg-rose-500"></span> Crítico
              </span>
              <span class="flex items-center gap-1 text-amber-400">
                <span class="w-2 h-2 rounded-sm bg-amber-500"></span> Alto Riesgo
              </span>
              <span class="flex items-center gap-1 text-emerald-400">
                <span class="w-2 h-2 rounded-sm bg-emerald-500"></span> Operacional
              </span>
              <span class="flex items-center gap-1 text-indigo-400">
                <span class="w-2 h-2 rounded-sm bg-indigo-500"></span> Auditoría
              </span>
            </div>
          </div>

          <!-- SVG Container for D3 -->
          <div #mainChartContainer class="w-full h-72 relative flex items-center justify-center">
            <svg #mainSvg class="w-full h-full overflow-visible"></svg>
          </div>

          <!-- Interactive Hover Tooltip Box -->
          @if (hoveredDay()) {
            <div 
              class="p-3 rounded-lg bg-slate-950/95 border border-purple-500/50 shadow-2xl flex flex-col gap-1.5 text-xs font-['Fira_Code'] animate-fadeIn">
              <div class="flex items-center justify-between border-b border-slate-800 pb-1">
                <span class="text-purple-300 font-bold">FECHA: {{ hoveredDay()?.date }}</span>
                <span class="px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 text-[10px] font-bold">
                  TOTAL: {{ hoveredDay()?.total }} EVENTOS
                </span>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div class="flex items-center gap-1.5 text-rose-300">
                  <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>CRÍTICO: <strong>{{ hoveredDay()?.critical }}</strong></span>
                </div>
                <div class="flex items-center gap-1.5 text-amber-300">
                  <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>ALTO: <strong>{{ hoveredDay()?.high }}</strong></span>
                </div>
                <div class="flex items-center gap-1.5 text-emerald-300">
                  <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>OPERACIONAL: <strong>{{ hoveredDay()?.operational }}</strong></span>
                </div>
                <div class="flex items-center gap-1.5 text-indigo-300">
                  <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span>AUDITORÍA: <strong>{{ hoveredDay()?.audit }}</strong></span>
                </div>
              </div>
            </div>
          } @else {
            <div class="text-[11px] font-['Fira_Code'] text-slate-500 text-center py-1">
              * Pasa el cursor o pulsa sobre cualquier barra para inspeccionar la métrica atómica del día
            </div>
          }
        </div>

        <!-- Right: D3 Donut Pie Breakdown (1 Col) -->
        <div class="lg:col-span-1 flex flex-col gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div class="flex items-center justify-between text-xs font-['Fira_Code'] text-slate-400 border-b border-slate-800/60 pb-2">
            <span class="text-slate-200 font-semibold">PESO POR SEVERIDAD</span>
            <mat-icon class="text-xs text-indigo-400">pie_chart</mat-icon>
          </div>

          <!-- D3 Donut SVG Container -->
          <div #donutContainer class="w-full h-44 relative flex items-center justify-center">
            <svg #donutSvg class="w-full h-full overflow-visible"></svg>
          </div>

          <!-- Breakdown Legend List -->
          <div class="flex flex-col gap-2 border-t border-slate-800/80 pt-3 text-[11px] font-['Fira_Code']">
            <div class="flex items-center justify-between">
              <span class="flex items-center gap-1.5 text-rose-400">
                <span class="w-2 h-2 rounded-full bg-rose-500"></span> Crítico
              </span>
              <span class="text-slate-300 font-bold">{{ activeSummary().totalCritical }} ({{ getPercent(activeSummary().totalCritical, activeSummary().totalEvents) }}%)</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="flex items-center gap-1.5 text-amber-400">
                <span class="w-2 h-2 rounded-full bg-amber-500"></span> Alto Riesgo
              </span>
              <span class="text-slate-300 font-bold">{{ activeSummary().totalHigh }} ({{ getPercent(activeSummary().totalHigh, activeSummary().totalEvents) }}%)</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="flex items-center gap-1.5 text-emerald-400">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Operacional
              </span>
              <span class="text-slate-300 font-bold">{{ activeSummary().totalOperational }} ({{ getPercent(activeSummary().totalOperational, activeSummary().totalEvents) }}%)</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="flex items-center gap-1.5 text-indigo-400">
                <span class="w-2 h-2 rounded-full bg-indigo-500"></span> Auditoría QC
              </span>
              <span class="text-slate-300 font-bold">{{ activeSummary().totalAudit }} ({{ getPercent(activeSummary().totalAudit, activeSummary().totalEvents) }}%)</span>
            </div>
          </div>
        </div>

      </div>

      <!-- 30-Day Activity Heatmap Strip -->
      <div class="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex flex-col gap-2">
        <div class="flex items-center justify-between text-xs font-['Fira_Code'] text-slate-400">
          <span class="text-slate-300 font-bold flex items-center gap-1.5">
            <mat-icon class="text-xs text-purple-400">grid_on</mat-icon>
            MAPA DE CALOR Y DENSIDAD CRIPTOGRÁFICA (T-30d a HOY)
          </span>
          <div class="flex items-center gap-2 text-[10px]">
            <span>Menor</span>
            <span class="w-2.5 h-2.5 rounded bg-slate-800"></span>
            <span class="w-2.5 h-2.5 rounded bg-purple-900/60"></span>
            <span class="w-2.5 h-2.5 rounded bg-purple-700"></span>
            <span class="w-2.5 h-2.5 rounded bg-purple-500"></span>
            <span class="w-2.5 h-2.5 rounded bg-purple-300"></span>
            <span>Mayor</span>
          </div>
        </div>

        <div class="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-30 gap-1.5 pt-2">
          @for (d of dailyTimeline(); track d.date) {
            <div
              tabindex="0"
              role="button"
              (mouseenter)="setHoveredDay(d)"
              (mouseleave)="setHoveredDay(null)"
              (click)="setHoveredDay(d)"
              (keydown.enter)="setHoveredDay(d)"
              (keydown.space)="setHoveredDay(d)"
              [title]="d.date + ': ' + d.total + ' eventos (Crítico: ' + d.critical + ', Alto: ' + d.high + ')'"
              [style.background-color]="getHeatColor(d.total)"
              class="h-8 rounded flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-110 hover:ring-2 hover:ring-purple-400 border border-slate-800/60 focus:outline-none focus:ring-2 focus:ring-purple-400">
              <span class="text-[9px] font-['Fira_Code'] font-bold text-white drop-shadow">{{ d.total }}</span>
            </div>
          }
        </div>
      </div>

    </div>
  `,
})
export class AuditChart implements OnInit {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  @ViewChild('mainSvg') mainSvgRef!: ElementRef<SVGSVGElement>;
  @ViewChild('mainChartContainer') mainContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('donutSvg') donutSvgRef!: ElementRef<SVGSVGElement>;
  @ViewChild('donutContainer') donutContainerRef!: ElementRef<HTMLDivElement>;

  // Input from parent if provided
  auditLedger = input<AstarothAuditRecord[]>([]);

  // Signals
  dailyTimeline = signal<AuditTimelinePoint[]>([]);
  timeframeDays = signal<number>(30);
  chartMode = signal<'stacked' | 'area'>('stacked');
  hoveredDay = signal<AuditTimelinePoint | null>(null);

  // Active filtered summary
  activeFilteredTimeline = computed(() => {
    const list = this.dailyTimeline();
    const days = this.timeframeDays();
    if (list.length <= days) return list;
    return list.slice(list.length - days);
  });

  activeSummary = computed<TimelineSummary>(() => {
    const list = this.activeFilteredTimeline();
    const totalEvents = list.reduce((acc, d) => acc + d.total, 0);
    const totalCritical = list.reduce((acc, d) => acc + d.critical, 0);
    const totalHigh = list.reduce((acc, d) => acc + d.high, 0);
    const totalOperational = list.reduce((acc, d) => acc + d.operational, 0);
    const totalAudit = list.reduce((acc, d) => acc + d.audit, 0);
    const days = list.length || 1;
    const dailyAverage = +(totalEvents / days).toFixed(1);

    let peak = list[0];
    for (const d of list) {
      if (d.total > (peak?.total || 0)) peak = d;
    }

    return {
      totalEvents,
      totalCritical,
      totalHigh,
      totalOperational,
      totalAudit,
      dailyAverage,
      peakDay: {
        date: peak?.date,
        dayLabel: peak?.dayLabel,
        count: peak?.total,
      },
      distribution: [
        { severity: 'CRITICAL', count: totalCritical, color: '#f43f5e', label: 'Crítico' },
        { severity: 'HIGH', count: totalHigh, color: '#f59e0b', label: 'Alto Riesgo' },
        { severity: 'OPERATIONAL', count: totalOperational, color: '#10b981', label: 'Operacional' },
        { severity: 'AUDIT', count: totalAudit, color: '#a855f7', label: 'Auditoría QC' },
      ],
    };
  });

  constructor() {
    // Effect to render D3 charts when data or settings change
    effect(() => {
      const data = this.activeFilteredTimeline();
      const mode = this.chartMode();
      if (isPlatformBrowser(this.platformId) && data.length > 0) {
        setTimeout(() => {
          this.renderMainD3Chart(data, mode);
          this.renderDonutD3Chart(this.activeSummary());
        }, 50);
      }
    });

    // Also re-render if audit ledger changes
    effect(() => {
      const ledger = this.auditLedger();
      if (ledger.length > 0) {
        this.fetchTimelineData();
      }
    });
  }

  ngOnInit() {
    this.fetchTimelineData();
  }

  fetchTimelineData() {
    this.http.get<{ dailySeries: AuditTimelinePoint[] }>('/api/hectron/audit-logs/timeline-30d').subscribe({
      next: (res) => {
        if (res && res.dailySeries) {
          this.dailyTimeline.set(res.dailySeries);
        }
      },
      error: (err) => console.error('Failed to load 30d audit timeline:', err),
    });
  }

  setTimeframe(days: number) {
    this.timeframeDays.set(days);
  }

  setChartMode(mode: 'stacked' | 'area') {
    this.chartMode.set(mode);
  }

  setHoveredDay(day: AuditTimelinePoint | null) {
    this.hoveredDay.set(day);
  }

  getPercent(count: number, total: number): number {
    if (!total || total === 0) return 0;
    return Math.round((count / total) * 100);
  }

  getHeatColor(count: number): string {
    if (count === 0) return '#0f172a';
    if (count === 1) return '#3b0764';
    if (count === 2) return '#581c87';
    if (count === 3) return '#7e22ce';
    if (count === 4) return '#a855f7';
    if (count >= 5) return '#c084fc';
    return '#7e22ce';
  }

  /* ==========================================================
     D3.JS RENDERING METHODS
     ========================================================== */
  private renderMainD3Chart(data: AuditTimelinePoint[], mode: 'stacked' | 'area') {
    if (!this.mainSvgRef || !this.mainContainerRef) return;
    const svgEl = this.mainSvgRef.nativeElement;
    const container = this.mainContainerRef.nativeElement;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 280;
    const margin = { top: 20, right: 20, bottom: 35, left: 35 };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // X scale
    const x = d3
      .scaleBand()
      .domain(data.map((d: AuditTimelinePoint) => d.dayLabel))
      .range([0, innerWidth])
      .padding(0.25);

    // Y scale
    const maxVal = d3.max(data, (d: AuditTimelinePoint) => d.total) || 6;
    const y = d3
      .scaleLinear()
      .domain([0, Math.max(maxVal + 1, 5)])
      .nice()
      .range([innerHeight, 0]);

    // Background Grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      )
      .selectAll('line')
      .attr('stroke', 'rgba(148, 163, 184, 0.08)')
      .attr('stroke-dasharray', '3,3');

    // Severity Colors
    const colorMap: Record<string, string> = {
      critical: '#f43f5e',
      high: '#f59e0b',
      operational: '#10b981',
      audit: '#a855f7',
    };

    if (mode === 'stacked') {
      // D3 Stack generator
      const keys = ['critical', 'high', 'operational', 'audit'] as const;
      const stack = d3.stack<AuditTimelinePoint>().keys(keys);
      const stackedData = stack(data);

      // Render Stacked Bars
      stackedData.forEach((layer: any) => {
        const key = layer.key;
        const color = colorMap[key] || '#94a3b8';

        g.selectAll(`.bar-${key}`)
          .data(layer)
          .enter()
          .append('rect')
          .attr('class', `bar-${key}`)
          .attr('x', (d: any) => x(d.data.dayLabel) || 0)
          .attr('y', (d: any) => y(d[1]))
          .attr('height', (d: any) => Math.max(0, y(d[0]) - y(d[1])))
          .attr('width', x.bandwidth())
          .attr('fill', color)
          .attr('rx', 2)
          .attr('opacity', 0.88)
          .style('cursor', 'pointer')
          .on('mouseenter', (_event: any, d: any) => {
            this.setHoveredDay(d.data);
          })
          .on('mouseleave', () => {
            // Keep hovered or reset
          });
      });

      // Total Event Points on top of bars
      g.selectAll('.total-dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'total-dot')
        .attr('cx', (d: AuditTimelinePoint) => (x(d.dayLabel) || 0) + x.bandwidth() / 2)
        .attr('cy', (d: AuditTimelinePoint) => y(d.total))
        .attr('r', 3)
        .attr('fill', '#ffffff')
        .attr('stroke', '#a855f7')
        .attr('stroke-width', 1.5)
        .style('cursor', 'pointer')
        .on('mouseenter', (_event: any, d: AuditTimelinePoint) => this.setHoveredDay(d));
    } else {
      // Continuous Area & Spline Mode
      const area = d3
        .area<AuditTimelinePoint>()
        .x((d: AuditTimelinePoint) => (x(d.dayLabel) || 0) + x.bandwidth() / 2)
        .y0(innerHeight)
        .y1((d: AuditTimelinePoint) => y(d.total))
        .curve(d3.curveMonotoneX);

      const line = d3
         .line<AuditTimelinePoint>()
         .x((d: AuditTimelinePoint) => (x(d.dayLabel) || 0) + x.bandwidth() / 2)
         .y((d: AuditTimelinePoint) => y(d.total))
         .curve(d3.curveMonotoneX);

      // Define gradient for Area
      const defs = svg.append('defs');
      const gradient = defs
        .append('linearGradient')
        .attr('id', 'area-gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

      gradient.append('stop').attr('offset', '0%').attr('stop-color', '#a855f7').attr('stop-opacity', 0.6);
      gradient.append('stop').attr('offset', '100%').attr('stop-color', '#a855f7').attr('stop-opacity', 0.0);

      // Append Area
      g.append('path').datum(data).attr('fill', 'url(#area-gradient)').attr('d', area);

      // Append Stroke Line
      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#a855f7')
        .attr('stroke-width', 2.5)
        .attr('d', line);

      // Append Glowing Data Nodes
      g.selectAll('.area-dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'area-dot')
        .attr('cx', (d: AuditTimelinePoint) => (x(d.dayLabel) || 0) + x.bandwidth() / 2)
        .attr('cy', (d: AuditTimelinePoint) => y(d.total))
        .attr('r', 4)
        .attr('fill', '#ffffff')
        .attr('stroke', '#a855f7')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mouseenter', (_event: any, d: AuditTimelinePoint) => this.setHoveredDay(d));
    }

    // X Axis
    const xAxis = d3
      .axisBottom(x)
      .tickValues(
        x
          .domain()
          .filter((_d: string, i: number) =>
            data.length > 20 ? i % 3 === 0 : data.length > 10 ? i % 2 === 0 : true
          )
      );

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .attr('color', '#64748b')
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('font-family', 'Fira Code');

    // Y Axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .attr('color', '#64748b')
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('font-family', 'Fira Code');
  }

  private renderDonutD3Chart(summary: TimelineSummary) {
    if (!this.donutSvgRef || !this.donutContainerRef) return;
    const svgEl = this.donutSvgRef.nativeElement;
    const container = this.donutContainerRef.nativeElement;

    const width = container.clientWidth || 200;
    const height = container.clientHeight || 170;
    const radius = Math.min(width, height) / 2 - 10;

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

    const pieData = summary.distribution.filter((d) => d.count > 0);
    if (pieData.length === 0) {
      pieData.push({ severity: 'NONE', count: 1, color: '#334155', label: 'Sin Datos' });
    }

    const pie = d3
      .pie<{ severity: string; count: number; color: string; label: string }>()
      .value((d: any) => d.count)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<{ severity: string; count: number; color: string; label: string }>>()
      .innerRadius(radius * 0.58)
      .outerRadius(radius * 0.95)
      .cornerRadius(4)
      .padAngle(0.04);

    // Render slices
    g.selectAll('path')
      .data(pie(pieData))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d: any) => d.data.color)
      .attr('stroke', '#020617')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.9)
      .style('cursor', 'pointer');

    // Center Text
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.1em')
      .attr('fill', '#ffffff')
      .attr('font-size', '18px')
      .attr('font-family', 'Orbitron')
      .attr('font-weight', 'bold')
      .text(summary.totalEvents);

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.3em')
      .attr('fill', '#94a3b8')
      .attr('font-size', '9px')
      .attr('font-family', 'Fira Code')
      .text('EVENTOS');
  }
}
