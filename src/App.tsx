import {
  Chart,
  ChartArea,
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
import { useEffect, useRef, useState } from 'react';

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
  const [hiddenSeries, setHiddenSeries] = useState(new Set<number>());

  const chartNames = seriesData.map((_, i) => [`${prefix}-${i}`]);

  const isHidden = (index: number) => hiddenSeries.has(index);

  const handleLegendClick = (props: any) => {
    setHiddenSeries((prev) => {
      const next = new Set(prev);
      if (next.has(props.index)) {
        next.delete(props.index);
      } else {
        // Don't allow hiding all series
        if (next.size < seriesData.length - 1) {
          next.add(props.index);
        }
      }
      return next;
    });
    setClickLog((prev) => [...prev, `onLegendClick fired! index=${props.index}`]);
  };

  const legendData = seriesData.map((s, i) => ({
    childName: `${prefix}-${i}`,
    ...s.legendItem,
    ...getInteractiveLegendItemStyles(isHidden(i)),
  }));

  const events = getInteractiveLegendEvents({
    chartNames: chartNames as any,
    isHidden,
    legendName: `legend-${prefix}`,
    onLegendClick: handleLegendClick,
  });

  return { clickLog, legendData, events, legendName: `legend-${prefix}`, isHidden };
}

function ClickLog({ log }: { log: string[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [log]);

  return (
    <div ref={ref} style={{
      border: '1px solid #eee',
      borderRadius: 4,
      padding: 8,
      fontSize: 12,
      overflowY: 'auto',
      background: '#f9f9f9',
      height: 100,
      flexShrink: 0,
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

const cardStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  borderRadius: 8,
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const chartWrapperStyle: React.CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
};

function StackBug() {
  const { clickLog, legendData, events, legendName, isHidden } = useInteractiveLegend('stack');

  return (
    <div style={cardStyle}>
      <h3 style={{ margin: '0 0 8px', fontSize: 14 }}>
        ChartBar + ChartStack + ChartAxis
        <span style={{ marginLeft: 8, padding: '2px 8px', borderRadius: 4, fontSize: 12, background: '#fce4e4', color: '#a33' }}>BUG</span>
      </h3>
      <div style={chartWrapperStyle}>
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
              <ChartBar key={`stack-${i}`} name={`stack-${i}`} data={isHidden(i) ? [{ y: null }] : s.datapoints} barWidth={15} />
            ))}
          </ChartStack>
        </Chart>
      </div>
      <ClickLog log={clickLog} />
    </div>
  );
}

function GroupBug() {
  const { clickLog, legendData, events, legendName, isHidden } = useInteractiveLegend('group');

  return (
    <div style={cardStyle}>
      <h3 style={{ margin: '0 0 8px', fontSize: 14 }}>
        ChartBar + ChartGroup + ChartAxis
        <span style={{ marginLeft: 8, padding: '2px 8px', borderRadius: 4, fontSize: 12, background: '#fce4e4', color: '#a33' }}>BUG</span>
      </h3>
      <div style={chartWrapperStyle}>
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
              <ChartBar key={`group-${i}`} name={`group-${i}`} data={isHidden(i) ? [{ y: null }] : s.datapoints} barWidth={15} />
            ))}
          </ChartGroup>
        </Chart>
      </div>
      <ClickLog log={clickLog} />
    </div>
  );
}

function AreaWorking() {
  const { clickLog, legendData, events, legendName, isHidden } = useInteractiveLegend('area');

  return (
    <div style={cardStyle}>
      <h3 style={{ margin: '0 0 8px', fontSize: 14 }}>
        ChartArea + ChartStack + ChartAxis
        <span style={{ marginLeft: 8, padding: '2px 8px', borderRadius: 4, fontSize: 12, background: '#e4fce4', color: '#3a3' }}>WORKS</span>
      </h3>
      <div style={chartWrapperStyle}>
        <Chart
          ariaTitle="ChartArea + ChartStack + ChartAxis"
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
              <ChartArea key={`area-${i}`} name={`area-${i}`} data={isHidden(i) ? [{ y: null }] : s.datapoints} />
            ))}
          </ChartStack>
        </Chart>
      </div>
      <ClickLog log={clickLog} />
    </div>
  );
}

function StackNoAxisWorking() {
  const { clickLog, legendData, events, legendName, isHidden } = useInteractiveLegend('stacknoaxis');

  return (
    <div style={cardStyle}>
      <h3 style={{ margin: '0 0 8px', fontSize: 14 }}>
        ChartBar + ChartStack (no ChartAxis)
        <span style={{ marginLeft: 8, padding: '2px 8px', borderRadius: 4, fontSize: 12, background: '#e4fce4', color: '#3a3' }}>WORKS</span>
      </h3>
      <div style={chartWrapperStyle}>
        <Chart
          ariaTitle="ChartBar + ChartStack (no ChartAxis)"
          containerComponent={<ChartContainer />}
          events={events}
          legendComponent={<ChartLegend name={legendName} data={legendData} />}
          legendPosition="bottom"
          height={220}
          width={500}
          padding={{ bottom: 65, left: 50, right: 20, top: 20 }}
          themeColor={ChartThemeColor.multiUnordered}
        >
          <ChartStack>
            {seriesData.map((s, i) => (
              <ChartBar key={`stacknoaxis-${i}`} name={`stacknoaxis-${i}`} data={isHidden(i) ? [{ y: null }] : s.datapoints} barWidth={15} />
            ))}
          </ChartStack>
        </Chart>
      </div>
      <ClickLog log={clickLog} />
    </div>
  );
}

function AreaGroupWorking() {
  const { clickLog, legendData, events, legendName, isHidden } = useInteractiveLegend('areagroup');

  return (
    <div style={cardStyle}>
      <h3 style={{ margin: '0 0 8px', fontSize: 14 }}>
        ChartArea + ChartGroup + ChartAxis
        <span style={{ marginLeft: 8, padding: '2px 8px', borderRadius: 4, fontSize: 12, background: '#e4fce4', color: '#3a3' }}>WORKS</span>
      </h3>
      <div style={chartWrapperStyle}>
        <Chart
          ariaTitle="ChartArea + ChartGroup + ChartAxis"
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
              <ChartArea key={`areagroup-${i}`} name={`areagroup-${i}`} data={isHidden(i) ? [{ y: null }] : s.datapoints} />
            ))}
          </ChartGroup>
        </Chart>
      </div>
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
        <AreaWorking />
        <AreaGroupWorking />
        <StackNoAxisWorking />
      </div>
    </div>
  );
}
