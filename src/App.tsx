import { useState } from 'react';
import {
    Chart,
    ChartAxis,
    ChartBar,
    ChartContainer,
    ChartLegend,
    ChartStack,
    getInteractiveLegendEvents,
    getInteractiveLegendItemStyles,
} from '@patternfly/react-charts/victory';

const seriesNames = ['Cats', 'Dogs', 'Birds'];

const chartData = [
    [
        { x: 'Q1', y: 10 },
        { x: 'Q2', y: 20 },
        { x: 'Q3', y: 15 },
    ],
    [
        { x: 'Q1', y: 25 },
        { x: 'Q2', y: 12 },
        { x: 'Q3', y: 30 },
    ],
    [
        { x: 'Q1', y: 8 },
        { x: 'Q2', y: 18 },
        { x: 'Q3', y: 22 },
    ],
];

export function App() {
    const [showAxes, setShowAxes] = useState(true);
    const [hiddenSeries, setHiddenSeries] = useState(new Set<number>());
    const [clickLog, setClickLog] = useState<string[]>([]);

    function onLegendClick(props: any) {
        const msg = `onLegendClick fired! index=${props.index}`;
        console.log('onLegendClick props:', props);
        setClickLog((prev) => [...prev, msg]);

        setHiddenSeries((prev) => {
            const next = new Set(prev);
            if (next.has(props.index)) {
                next.delete(props.index);
            } else {
                next.add(props.index);
            }
            return next;
        });
    }

    function getLegendData() {
        return seriesNames.map((name, index) => ({
            name,
            ...getInteractiveLegendItemStyles(hiddenSeries.has(index)),
        }));
    }

    const chartEvents = getInteractiveLegendEvents({
        chartNames: seriesNames as unknown as [string],
        isHidden: (index: number) => hiddenSeries.has(index),
        legendName: 'legend',
        onLegendClick,
    });

    return (
        <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
            <h1>getInteractiveLegendEvents bug</h1>
            <p>
                Click a legend item below. When <code>ChartAxis</code> is
                enabled with <code>ChartStack</code>,{' '}
                <code>onLegendClick</code> is never called. Disable axes and
                it works.
            </p>

            <div style={{ marginBottom: 16 }}>
                <button
                    onClick={() => {
                        setShowAxes((v) => !v);
                        setHiddenSeries(new Set());
                        setClickLog([]);
                    }}
                    style={{ padding: '8px 16px', fontSize: 14 }}
                >
                    ChartAxis: {showAxes ? 'ON (bug present)' : 'OFF (works)'}
                </button>
            </div>

            <div style={{ height: 350, width: 600 }}>
                <Chart
                    ariaTitle="Legend click repro chart"
                    containerComponent={<ChartContainer />}
                    events={chartEvents}
                    legendComponent={<ChartLegend name="legend" data={getLegendData()} />}
                    legendPosition="bottom"
                    height={300}
                    width={600}
                    padding={{ bottom: 75, left: 50, right: 50, top: 20 }}
                >
                    {showAxes && <ChartAxis />}
                    {showAxes && <ChartAxis dependentAxis />}
                    <ChartStack horizontal>
                        {seriesNames.map((name, i) => (
                            <ChartBar
                                key={name}
                                name={name}
                                data={
                                    hiddenSeries.has(i)
                                        ? chartData[i].map((d) => ({ ...d, y: 0 }))
                                        : chartData[i]
                                }
                                barWidth={15}
                            />
                        ))}
                    </ChartStack>
                </Chart>
            </div>

            <h2>Click log</h2>
            <div
                style={{
                    border: '1px solid #ccc',
                    padding: 12,
                    minHeight: 60,
                    maxHeight: 200,
                    overflow: 'auto',
                    background: '#f9f9f9',
                }}
            >
                {clickLog.length === 0 ? (
                    <em>No clicks detected yet. Try clicking a legend item.</em>
                ) : (
                    clickLog.map((entry, i) => <div key={i}>{entry}</div>)
                )}
            </div>
        </div>
    );
}
