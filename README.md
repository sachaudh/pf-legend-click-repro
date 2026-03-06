# PatternFly `getInteractiveLegendEvents` onLegendClick Bug

Minimal reproduction for [patternfly/patternfly-react#12263](https://github.com/patternfly/patternfly-react/issues/12263).

## The Bug

`getInteractiveLegendEvents`' `onLegendClick` callback is never invoked when `ChartBar` is wrapped in `ChartStack` or `ChartGroup` alongside `ChartAxis`.

| Setup | onLegendClick fires? |
|-------|---------------------|
| **ChartBar + ChartStack + ChartAxis** | **No** |
| **ChartBar + ChartGroup + ChartAxis** | **No** |
| ChartArea + ChartStack + ChartAxis | Yes |
| ChartArea + ChartGroup + ChartAxis | Yes |
| ChartBar + ChartStack (no ChartAxis) | Yes |

## Running the repro

```bash
npm install
npm run dev
```

The app shows five charts: two bug cases and three working cases. Click a legend item (Cats, Dogs, or Birds) in each chart -- the bug cases' click logs will stay empty, confirming `onLegendClick` is never called. The working cases toggle series visibility on click.

https://github.com/user-attachments/assets/12ccaa96-3153-46d9-873b-3e85802d0b90

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
