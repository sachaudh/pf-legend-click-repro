import {
  Chart,
  ChartAxis,
  ChartBar,
  ChartContainer,
  ChartGroup,
  ChartLegend,
  ChartStack,
  ChartThemeColor,
  getInteractiveLegendEvents,
  getInteractiveLegendItemStyles,
} from '@patternfly/react-charts/victory';
import { useState } from 'react';

const seriesData = [
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

function useInteractiveLegend(prefix: string) {
  const [clickLog, setClickLog] = useState<string[]>([]);

  const chartNames = seriesData.map((_, i) => [`${prefix}-${i}`]);

  const handleLegendClick = (props: any) => {
    setClickLog((prev) => [...prev, `onLegendClick fired! index=${props.index}`]);
  };

  const legendData = seriesData.map((s, i) => ({
    childName: `${prefix}-${i}`,
    ...s.legendItem,
    ...getInteractiveLegendItemStyles(false),
  }));

  const events = getInteractiveLegendEvents({
    chartNames: chartNames as any,
    isHidden: () => false,
    legendName: `legend-${prefix}`,
    onLegendClick: handleLegendClick,
  });

  return { clickLog, legendData, events, legendName: `legend-${prefix}` };
}

function ClickLog({ log }: { log: string[] }) {
  return (
    <div style={{
      border: '1px solid #eee',
      borderRadius: 4,
      padding: 8,
      fontSize: 12,
      overflow: 'auto',
      background: '#f9f9f9',
      minHeight: 60,
      maxHeight: 150,
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Click log</div>
      {log.length === 0 ? (
        <em style={{ color: '#999' }}>Click a legend item...</em>
      ) : (
        log.map((entry, i) => <div key={i}>{entry}</div>)
      )}
    </div>
  );
}

function StackBug() {
  const { clickLog, legendData, events, legendName } = useInteractiveLegend('stack');

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16 }}>
      <h3 style={{ margin: '0 0 8px', fontSize: 14 }}>
        ChartBar + ChartStack + ChartAxis
        <span style={{ marginLeft: 8, padding: '2px 8px', borderRadius: 4, fontSize: 12, background: '#fce4e4', color: '#a33' }}>BUG</span>
      </h3>
      <Chart
        ariaTitle="ChartBar + ChartStack + ChartAxis"
        containerComponent={<ChartContainer />}
        events={events}
        legendComponent={<ChartLegend name={legendName} data={legendData} />}
        legendPosition="bottom"
        height={220}
        width={500}
        padding={{ bottom: 65, left: 50, right: 20, top: 20 }}
        themeColor={ChartThemeColor.multiUnordered}
      >
        <ChartAxis />
        <ChartAxis dependentAxis />
        <ChartStack>
          {seriesData.map((s, i) => (
            <ChartBar key={`stack-${i}`} name={`stack-${i}`} data={s.datapoints} barWidth={15} />
          ))}
        </ChartStack>
      </Chart>
      <ClickLog log={clickLog} />
    </div>
  );
}

function GroupBug() {
  const { clickLog, legendData, events, legendName } = useInteractiveLegend('group');

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16 }}>
      <h3 style={{ margin: '0 0 8px', fontSize: 14 }}>
        ChartBar + ChartGroup + ChartAxis
        <span style={{ marginLeft: 8, padding: '2px 8px', borderRadius: 4, fontSize: 12, background: '#fce4e4', color: '#a33' }}>BUG</span>
      </h3>
      <Chart
        ariaTitle="ChartBar + ChartGroup + ChartAxis"
        containerComponent={<ChartContainer />}
        events={events}
        legendComponent={<ChartLegend name={legendName} data={legendData} />}
        legendPosition="bottom"
        height={220}
        width={500}
        padding={{ bottom: 65, left: 50, right: 20, top: 20 }}
        themeColor={ChartThemeColor.multiUnordered}
      >
        <ChartAxis />
        <ChartAxis dependentAxis />
        <ChartGroup>
          {seriesData.map((s, i) => (
            <ChartBar key={`group-${i}`} name={`group-${i}`} data={s.datapoints} barWidth={15} />
          ))}
        </ChartGroup>
      </Chart>
      <ClickLog log={clickLog} />
    </div>
  );
}

export function App() {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 1100 }}>
      <h1>getInteractiveLegendEvents onLegendClick bug</h1>
      <p>
        <code>onLegendClick</code> is never called when <code>ChartBar</code>{' '}
        is wrapped in <code>ChartStack</code> or <code>ChartGroup</code>{' '}
        alongside <code>ChartAxis</code>. Click a legend item in each chart
        below -- the click log will stay empty.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <StackBug />
        <GroupBug />
      </div>
    </div>
  );
}
