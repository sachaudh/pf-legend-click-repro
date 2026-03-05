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
                Click a legend item. With <code>ChartAxis</code> +{' '}
                <code>ChartStack</code> together, <code>onLegendClick</code>{' '}
                is never called. Remove the axes and it works.
            </p>

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
                    {/* Remove these two ChartAxis lines and onLegendClick works */}
                    <ChartAxis />
                    <ChartAxis dependentAxis />
                    <ChartStack horizontal>
                        <ChartBar name="Cats" data={chartData[0]} />
                        <ChartBar name="Dogs" data={chartData[1]} />
                        <ChartBar name="Birds" data={chartData[2]} />
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
