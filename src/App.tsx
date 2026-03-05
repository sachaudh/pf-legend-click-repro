import {
  Chart,
  ChartAxis,
  ChartBar,
  ChartLegend,
  ChartContainer,
  ChartThemeColor,
  getInteractiveLegendEvents,
  getInteractiveLegendItemStyles
} from '@patternfly/react-charts/victory';
import { useState } from 'react';

export function App() {
  const [hiddenSeries, setHiddenSeries] = useState(new Set<number>());
  const [clickLog, setClickLog] = useState<string[]>([]);

  const series = [
    {
      datapoints: [
        { x: 'Q1', y: 10 },
        { x: 'Q2', y: 20 },
        { x: 'Q3', y: 15 },
      ],
      legendItem: { name: 'Cats' },
    },
    {
      datapoints: [
        { x: 'Q1', y: 25 },
        { x: 'Q2', y: 12 },
        { x: 'Q3', y: 30 },
      ],
      legendItem: { name: 'Dogs' },
    },
    {
      datapoints: [
        { x: 'Q1', y: 8 },
        { x: 'Q2', y: 18 },
        { x: 'Q3', y: 22 },
      ],
      legendItem: { name: 'Birds' },
    },
  ];

  const getChartNames = () => series.map((_, index) => [`bar-${index}`]);

  const handleLegendClick = (props: any) => {
    const msg = `onLegendClick fired! index=${props.index}`;
    console.log(msg);
    setClickLog((prev) => [...prev, msg]);

    setHiddenSeries((prev) => {
      const newHidden = new Set(prev);
      if (!newHidden.delete(props.index)) {
        newHidden.add(props.index);
      }
      return newHidden;
    });
  };

  const getLegendData = () =>
    series.map((s, index) => ({
      childName: `bar-${index}`,
      ...s.legendItem,
      ...getInteractiveLegendItemStyles(hiddenSeries.has(index)),
    }));

  const isHidden = (index: number) => hiddenSeries.has(index);

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>getInteractiveLegendEvents + ChartBar bug</h1>
      <p>
        <code>onLegendClick</code> is never called when <code>ChartBar</code> is
        used with <code>ChartAxis</code>. Replace <code>ChartBar</code> with{' '}
        <code>ChartArea</code> and it works.
      </p>

      <div style={{ height: 350, width: 600 }}>
        <Chart
          ariaTitle="Legend click repro"
          containerComponent={<ChartContainer />}
          events={getInteractiveLegendEvents({
            chartNames: getChartNames() as any,
            isHidden,
            legendName: 'legend',
            onLegendClick: handleLegendClick,
          })}
          legendComponent={<ChartLegend name="legend" data={getLegendData()} />}
          legendPosition="bottom"
          height={300}
          width={600}
          padding={{ bottom: 75, left: 50, right: 50, top: 20 }}
          themeColor={ChartThemeColor.multiUnordered}
        >
          <ChartAxis />
          <ChartAxis dependentAxis />
          {series.map((s, index) => (
            <ChartBar
              key={`bar-${index}`}
              name={`bar-${index}`}
              data={
                isHidden(index)
                  ? s.datapoints.map((d) => ({ ...d, y: 0 }))
                  : s.datapoints
              }
              barWidth={15}
            />
          ))}
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
