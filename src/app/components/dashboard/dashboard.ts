import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject, signal } from '@angular/core';
import Chart from 'chart.js/auto';
import { DatoEstadistica } from '../../modelos/estadistica.model';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard implements AfterViewInit, OnDestroy {
  @ViewChild('publicacionesCanvas') publicacionesCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('comentariosDiaCanvas') comentariosDiaCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('comentariosPublicacionCanvas') comentariosPublicacionCanvas!: ElementRef<HTMLCanvasElement>;

  private dashboardService = inject(DashboardService);
  private charts: Chart[] = [];
  desde = signal(this.fechaInput(new Date(Date.now() - 29 * 24 * 60 * 60 * 1000)));
  hasta = signal(this.fechaInput(new Date()));
  cargando = signal(false);
  error = signal('');
  cargado = signal(false);

  ngAfterViewInit() {
    void this.cargarEstadisticas();
  }

  ngOnDestroy() {
    this.destruirGraficos();
  }

  actualizarFecha(tipo: 'desde' | 'hasta', evento: Event) {
    const valor = (evento.target as HTMLInputElement).value;
    if (tipo === 'desde') this.desde.set(valor);
    else this.hasta.set(valor);
  }

  async cargarEstadisticas() {
    this.error.set('');
    this.cargado.set(false);
    if (!this.desde() || !this.hasta() || this.desde() > this.hasta()) {
      this.error.set('Elegí un rango de fechas válido.');
      return;
    }

    this.cargando.set(true);
    try {
      const [publicaciones, comentariosDia, comentariosPublicacion] = await Promise.all([
        this.dashboardService.publicacionesPorUsuario(this.desde(), this.hasta()),
        this.dashboardService.comentariosPorDia(this.desde(), this.hasta()),
        this.dashboardService.comentariosPorPublicacion(this.desde(), this.hasta()),
      ]);

      this.destruirGraficos();
      this.crearGraficoBarras(publicaciones);
      this.crearGraficoLinea(comentariosDia);
      this.crearGraficoTorta(comentariosPublicacion);
      this.cargado.set(true);
    } catch (error) {
      console.error('No se pudieron cargar las estadísticas.', error);
      this.error.set('No se pudieron cargar las estadísticas. Revisá tu sesión e intentá nuevamente.');
    } finally {
      this.cargando.set(false);
    }
  }

  private crearGraficoBarras(datos: DatoEstadistica[]) {
    this.charts.push(
      new Chart(this.publicacionesCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: datos.map((dato) => dato.etiqueta),
          datasets: [{
            label: 'Publicaciones',
            data: datos.map((dato) => dato.cantidad),
            backgroundColor: '#89b6a5',
            borderRadius: 7,
          }],
        },
        options: { responsive: true, maintainAspectRatio: false },
      }),
    );
  }

  private crearGraficoLinea(datos: DatoEstadistica[]) {
    this.charts.push(
      new Chart(this.comentariosDiaCanvas.nativeElement, {
        type: 'line',
        data: {
          labels: datos.map((dato) => dato.etiqueta),
          datasets: [{
            label: 'Comentarios por día',
            data: datos.map((dato) => dato.cantidad),
            borderColor: '#4c3b4d',
            backgroundColor: '#c9eddc',
            pointBackgroundColor: '#4c3b4d',
            tension: 0.25,
          }],
        },
        options: { responsive: true, maintainAspectRatio: false },
      }),
    );
  }

  private crearGraficoTorta(datos: DatoEstadistica[]) {
    const paleta = ['#89b6a5', '#4c3b4d', '#c9eddc', '#82968c', '#6a706e'];
    this.charts.push(
      new Chart(this.comentariosPublicacionCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: datos.map((dato) => dato.etiqueta),
          datasets: [{
            label: 'Comentarios',
            data: datos.map((dato) => dato.cantidad),
            backgroundColor: datos.map((_, indice) => paleta[indice % paleta.length]),
          }],
        },
        options: { responsive: true, maintainAspectRatio: false },
      }),
    );
  }

  private destruirGraficos() {
    this.charts.forEach((chart) => chart.destroy());
    this.charts = [];
  }

  private fechaInput(fecha: Date): string {
    const local = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60_000);
    return local.toISOString().slice(0, 10);
  }
}
