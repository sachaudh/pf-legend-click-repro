# PatternFly `getInteractiveLegendEvents` onLegendClick Bug

Minimal reproduction for [patternfly/patternfly-react#12263](https://github.com/patternfly/patternfly-react/issues/12263).

## The Bug

`getInteractiveLegendEvents`' `onLegendClick` callback is never invoked when `ChartBar` is wrapped in `ChartStack` or `ChartGroup` alongside `ChartAxis`.

| Setup | onLegendClick fires? |
|-------|---------------------|
| ChartArea + ChartStack + ChartAxis | Yes |
| ChartBar + ChartAxis (no wrapper) | Yes |
| ChartBar + ChartStack (no ChartAxis) | Yes |
| **ChartBar + ChartStack + ChartAxis** | **No** |
| **ChartBar + ChartGroup + ChartAxis** | **No** |

## Running the repro

```bash
npm install
npm run dev
```

The app shows both bug cases side by side. Click a legend item (Cats, Dogs, or Birds) in either chart -- the click log will stay empty, confirming `onLegendClick` is never called.

<img width="1171" height="665" alt="Screenshot 2026-03-05 at 3 47 44 PM" src="https://github.com/user-attachments/assets/4d3efc0a-efed-40e6-ba49-80807d47d3e3" />


## Workaround

Apply click events directly to `ChartLegend`'s `events` prop instead of relying on Chart-level event dispatch:

```tsx
const legendClickEvents = [
    { target: 'data', eventHandlers: { onClick: handleClick } },
    { target: 'labels', eventHandlers: { onClick: handleClick } },
];

<ChartLegend name="legend" data={legendData} events={legendClickEvents} />
```

## Versions

- `@patternfly/react-charts` v8.4.1
- `victory` v37.3.6
- `react` v18.2.0
