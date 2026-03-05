import {
  Chart,
  ChartArea,
  ChartAxis,
  ChartBar,
  ChartGroup,
  ChartLegend,
  ChartContainer,
  ChartStack,
  ChartThemeColor,
  getInteractiveLegendEvents,
  getInteractiveLegendItemStyles,
} from '@patternfly/react-charts/victory';
import { useState } from 'react';

type ChartType = 'ChartBar' | 'ChartArea';
type WrapperType = 'none' | 'ChartStack' | 'ChartGroup';

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

const buttonStyle = (active: boolean) => ({
  padding: '6px 14px',
  fontSize: 13,
  border: '1px solid #ccc',
  borderRadius: 4,
  cursor: 'pointer',
  background: active ? '#0066cc' : '#fff',
  color: active ? '#fff' : '#333',
});

export function App() {
  const [showAxes, setShowAxes] = useState(true);
  const [chartType, setChartType] = useState<ChartType>('ChartBar');
  const [wrapper, setWrapper] = useState<WrapperType>('ChartStack');
  const [hiddenSeries, setHiddenSeries] = useState(new Set<number>());
  const [clickLog, setClickLog] = useState<string[]>([]);

  const prefix = chartType === 'ChartBar' ? 'bar' : 'area';
  const getChartNames = () => series.map((_, index) => [`${prefix}-${index}`]);

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
      childName: `${prefix}-${index}`,
      ...s.legendItem,
      ...getInteractiveLegendItemStyles(hiddenSeries.has(index)),
    }));

  const isHidden = (index: number) => hiddenSeries.has(index);

  function resetState() {
    setHiddenSeries(new Set());
    setClickLog([]);
  }

  const children = series.map((s, index) => {
    const data = isHidden(index)
      ? s.datapoints.map((d) => ({ ...d, y: 0 }))
      : s.datapoints;

    if (chartType === 'ChartArea') {
      return (
        <ChartArea
          key={`area-${index}`}
          name={`area-${index}`}
          data={data}
          interpolation="monotoneX"
        />
      );
    }
    return (
      <ChartBar
        key={`bar-${index}`}
        name={`bar-${index}`}
        data={data}
        barWidth={15}
      />
    );
  });

  function wrapChildren() {
    if (wrapper === 'ChartStack') return <ChartStack>{children}</ChartStack>;
    if (wrapper === 'ChartGroup') return <ChartGroup>{children}</ChartGroup>;
    return children;
  }

  const isBuggy =
    chartType === 'ChartBar' && showAxes && wrapper !== 'none';

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 700 }}>
      <h1>getInteractiveLegendEvents onLegendClick bug</h1>
      <p>
        Toggle the options below and click a legend item to test each
        combination. The click log shows whether <code>onLegendClick</code>{' '}
        fires.
      </p>

      <div style={{ display: 'flex', gap: 24, marginBottom: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Chart type</div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button style={buttonStyle(chartType === 'ChartBar')} onClick={() => { setChartType('ChartBar'); resetState(); }}>ChartBar</button>
            <button style={buttonStyle(chartType === 'ChartArea')} onClick={() => { setChartType('ChartArea'); resetState(); }}>ChartArea</button>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Wrapper</div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button style={buttonStyle(wrapper === 'ChartStack')} onClick={() => { setWrapper('ChartStack'); resetState(); }}>ChartStack</button>
            <button style={buttonStyle(wrapper === 'ChartGroup')} onClick={() => { setWrapper('ChartGroup'); resetState(); }}>ChartGroup</button>
            <button style={buttonStyle(wrapper === 'none')} onClick={() => { setWrapper('none'); resetState(); }}>None</button>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>ChartAxis</div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button style={buttonStyle(showAxes)} onClick={() => { setShowAxes(true); resetState(); }}>On</button>
            <button style={buttonStyle(!showAxes)} onClick={() => { setShowAxes(false); resetState(); }}>Off</button>
          </div>
        </div>
      </div>

      <div style={{
        padding: '8px 12px',
        marginBottom: 16,
        borderRadius: 4,
        fontSize: 14,
        background: isBuggy ? '#fce4e4' : '#e4fce4',
        border: `1px solid ${isBuggy ? '#d88' : '#8d8'}`,
      }}>
        {isBuggy
          ? 'Bug: onLegendClick will NOT fire with this combination'
          : 'OK: onLegendClick should fire with this combination'}
      </div>

      <div style={{ height: 350, width: 600 }}>
        <Chart
          key={`${chartType}-${wrapper}-${showAxes}`}
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
          {showAxes && <ChartAxis />}
          {showAxes && <ChartAxis dependentAxis />}
          {wrapChildren()}
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
