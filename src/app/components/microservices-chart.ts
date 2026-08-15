import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  AfterViewInit,
  OnDestroy,
  effect,
  input,
  ChangeDetectionStrategy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import * as d3 from 'd3';

export interface PredictiveDataPoint {
  timeLabel: string;
  cpu: number;
  latency: number;
  errorProbability: number;
  isProjected?: boolean;
}

@Component({
  selector: 'app-microservices-chart',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative w-full h-[400px] bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
      <div class="px-4 py-3 border-b border-slate-800/60 bg-slate-900 flex justify-between items-center">
        <div>
          <h3 class="text-sm font-['Orbitron'] font-black text-emerald-400">TELEMETRÍA PREDICTIVA - PRÓXIMAS 24H</h3>
          <p class="text-[10px] text-slate-400 font-['Fira_Code']">Tendencias de CPU, Latencia y Riesgo Sistémico</p>
        </div>
        <div class="flex items-center gap-3 text-[10px] font-['Fira_Code']">
          <div class="flex items-center gap-1.5"><div class="w-2 h-2 rounded-full bg-sky-500"></div> CPU</div>
          <div class="flex items-center gap-1.5"><div class="w-2 h-2 rounded-full bg-amber-500"></div> Latencia</div>
          <div class="flex items-center gap-1.5"><div class="w-2 h-2 rounded-full bg-rose-500"></div> Riesgo</div>
        </div>
      </div>
      <div #chartContainer class="flex-1 w-full relative">
        <svg #chartSvg class="w-full h-full"></svg>
      </div>
    </div>
  `,
})
export class MicroservicesChart implements OnInit, AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  
  data = input<PredictiveDataPoint[]>([]);
  
  @ViewChild('chartContainer') containerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('chartSvg') svgRef!: ElementRef<SVGSVGElement>;

  private resizeObserver!: ResizeObserver;

  constructor() {
    effect(() => {
      const data = this.data();
      if (data && data.length > 0) {
        if (isPlatformBrowser(this.platformId)) {
          // Wrap in requestAnimationFrame to ensure container is rendered
          requestAnimationFrame(() => this.drawChart());
        }
      }
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => this.drawChart());
      });
    }
  }

  ngAfterViewInit() {
    if (this.resizeObserver && this.containerRef) {
      this.resizeObserver.observe(this.containerRef.nativeElement);
    }
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private drawChart() {
    if (!this.svgRef || !this.containerRef) return;
    
    const svgEl = this.svgRef.nativeElement;
    const containerEl = this.containerRef.nativeElement;
    const width = containerEl.clientWidth;
    const height = containerEl.clientHeight;

    if (width === 0 || height === 0) return;

    const data = this.data();
    if (!data || data.length === 0) return;

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove(); // Clear previous

    const root = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add defs for gradients and patterns
    const defs = svg.append('defs');
    
    // Pattern for projected area
    defs.append('pattern')
      .attr('id', 'projected-pattern')
      .attr('width', 8)
      .attr('height', 8)
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('patternTransform', 'rotate(45)')
      .append('rect')
      .attr('width', 2)
      .attr('height', 8)
      .attr('fill', 'rgba(255, 255, 255, 0.05)');

    // Parse scales
    const xScale = d3.scalePoint()
      .domain(data.map(d => d.timeLabel))
      .range([0, innerWidth])
      .padding(0.5);

    // Three separate Y scales
    const maxCpu = d3.max(data, d => d.cpu) || 100;
    const maxLatency = d3.max(data, d => d.latency) || 500;
    const maxRisk = d3.max(data, d => d.errorProbability) || 100;

    const yScaleCpu = d3.scaleLinear().domain([0, Math.max(100, maxCpu)]).range([innerHeight, 0]);
    const yScaleLatency = d3.scaleLinear().domain([0, Math.max(500, maxLatency * 1.2)]).range([innerHeight, 0]);
    const yScaleRisk = d3.scaleLinear().domain([0, Math.max(100, maxRisk)]).range([innerHeight, 0]);

    // Gridlines
    const yAxisGrid = d3.axisLeft(yScaleCpu).tickSize(-innerWidth).tickFormat(() => '').ticks(5);
    root.append('g')
      .attr('class', 'grid-lines')
      .call(yAxisGrid)
      .selectAll('line')
      .attr('stroke', 'rgba(255,255,255,0.05)')
      .attr('stroke-dasharray', '4,4');
    root.selectAll('.domain').remove();

    // Projected Background Zone
    const projectedStartIndex = data.findIndex(d => d.isProjected);
    if (projectedStartIndex !== -1) {
      const startX = xScale(data[projectedStartIndex].timeLabel) || 0;
      root.append('rect')
        .attr('x', startX)
        .attr('y', 0)
        .attr('width', innerWidth - startX)
        .attr('height', innerHeight)
        .attr('fill', 'url(#projected-pattern)');
        
      root.append('line')
        .attr('x1', startX)
        .attr('x2', startX)
        .attr('y1', 0)
        .attr('y2', innerHeight)
        .attr('stroke', 'rgba(255,255,255,0.2)')
        .attr('stroke-dasharray', '4,4');
        
      root.append('text')
        .attr('x', startX + 10)
        .attr('y', 20)
        .attr('fill', 'rgba(255,255,255,0.4)')
        .style('font-family', 'Orbitron')
        .style('font-size', '10px')
        .text('PROYECCIÓN FUTURA');
    }

    // Line generators
    const lineCpu = d3.line<PredictiveDataPoint>()
      .x(d => xScale(d.timeLabel) || 0)
      .y(d => yScaleCpu(d.cpu))
      .curve(d3.curveMonotoneX);

    const lineLatency = d3.line<PredictiveDataPoint>()
      .x(d => xScale(d.timeLabel) || 0)
      .y(d => yScaleLatency(d.latency))
      .curve(d3.curveMonotoneX);

    const lineRisk = d3.line<PredictiveDataPoint>()
      .x(d => xScale(d.timeLabel) || 0)
      .y(d => yScaleRisk(d.errorProbability))
      .curve(d3.curveMonotoneX);

    // Draw Paths
    root.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#0ea5e9') // sky-500
      .attr('stroke-width', 2)
      .attr('d', lineCpu);

    root.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#f59e0b') // amber-500
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4,4')
      .attr('d', lineLatency);

    // Risk Area + Line
    const areaRisk = d3.area<PredictiveDataPoint>()
      .x(d => xScale(d.timeLabel) || 0)
      .y0(innerHeight)
      .y1(d => yScaleRisk(d.errorProbability))
      .curve(d3.curveMonotoneX);

    defs.append('linearGradient')
      .attr('id', 'risk-grad')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%')
      .selectAll('stop')
      .data([
        { offset: '0%', color: 'rgba(244, 63, 94, 0.4)' }, // rose-500
        { offset: '100%', color: 'rgba(244, 63, 94, 0.0)' }
      ])
      .enter().append('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color);

    root.append('path')
      .datum(data)
      .attr('fill', 'url(#risk-grad)')
      .attr('d', areaRisk);

    root.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#f43f5e') // rose-500
      .attr('stroke-width', 2)
      .attr('d', lineRisk);

    // X Axis
    const xAxis = d3.axisBottom(xScale).tickSize(5);
    const xAxisGroup = root.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);
      
    xAxisGroup.selectAll('path, line').attr('stroke', '#334155');
    xAxisGroup.selectAll('text')
      .attr('fill', '#94a3b8')
      .style('font-family', 'Fira Code')
      .style('font-size', '10px');
  }
}
