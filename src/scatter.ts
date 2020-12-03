import { Declare, Widget, OnChange } from 'ptnl-constructor-sdk';
import { DefaultDataOptionKey } from 'ptnl-constructor-sdk/constants';
import { EBlockKey, EViewOption } from './enum';

const ctx = document.getElementById('root') as HTMLCanvasElement;
const CHART_CONFIG: Chart.ChartConfiguration = {
    type: 'scatter',
    data: {
        labels: [],
        datasets: [],
    },
    options: {},
};

const CHART = new window.Chart(ctx.getContext('2d'), CHART_CONFIG);
const COLORS = [
    '#00AFD7',
    '#C724B1',
    '#10069F',
    '#FF9900',
    '#1857F0',
    '#FEDB00',
    '#78D64B',
    '#0C83E4',
    '#8A1F7A',
    '#E45D2B',
    '#F5C7D1',
    '#0E0F7D',
    '#ED6881',
    '#70B5EC',
    '#D76BC8',
    '#6F6CC3',
];

window.addEventListener('resize', function () {
    CHART.resize();
});

@Declare()
export class Scatter extends Widget implements OnChange {
    color_indicator = 0;

    get columns() {
        return this.dataSettings[DefaultDataOptionKey].columnsByBlock;
    }

    onChange(): void {
        this.color_indicator = 0;

        if (!this.columns[EBlockKey.Y].length) {
            CHART.update();
            this.ready();
            return;
        }

        CHART_CONFIG.data.datasets = this.getRows();
        Object.assign(CHART_CONFIG.options, this.getConfigOptions());

        CHART.update();
        this.ready();
    }

    private getConfigOptions(): Chart.ChartOptions {
        return {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: 10,
            },
            plugins: {
                datalabels: {
                    display: this.viewSettings[EViewOption.DataLabels],
                    align: 'top',
                    formatter: (value, context) => {
                        return `${value.x} x ${value.y}`;
                    },
                },
            },
            legend: {
                // display: this.viewSettings[EViewOption.Legend],
            },
            elements: {
                point: {
                    pointStyle: this.viewSettings[EViewOption.PointerStyle],
                },
            },
            scales: {
                xAxes: [
                    {
                        type: 'linear',
                        position: 'bottom',
                        ticks: {
                            display: this.viewSettings[EViewOption.TickX],
                        },
                        gridLines: {
                            display: this.viewSettings[EViewOption.GridX],
                        },
                    },
                ],
                yAxes: [
                    {
                        ticks: {
                            display: this.viewSettings[EViewOption.TickY],
                        },
                        gridLines: {
                            display: this.viewSettings[EViewOption.GridY],
                        },
                    },
                ],
            },
        };
    }

    private getRows() {
        const rows = [];
        this.columns[EBlockKey.X].forEach((xColumn) => {
            this.columns[EBlockKey.Y].forEach((yColumn) => {
                rows.push(
                    this.createDataset(
                        `${xColumn.name} (${yColumn.name}`,
                        this.data[DefaultDataOptionKey].map((item) => {
                            return {
                                x: item[xColumn.path],
                                y: item[yColumn.path],
                            };
                        }),
                    ),
                );
            });
        });
        return rows;
    }

    private createDataset(label, data, yID = 1) {
        this.color_indicator += 1;
        return {
            label,
            data,
            backgroundColor: this.getBackgroundColor(
                COLORS[this.color_indicator % COLORS.length],
            ),
            borderColor: COLORS[this.color_indicator % COLORS.length],
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: COLORS[this.color_indicator % COLORS.length],
        };
    }

    private getBackgroundColor(hex) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) {
            return hex;
        }
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`;
    }

    private hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16),
              }
            : null;
    }
}
