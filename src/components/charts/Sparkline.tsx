interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fillColor?: string;
  showArea?: boolean;
  className?: string;
}

export function Sparkline({
  data,
  width = 100,
  height = 30,
  color = '#3b82f6',
  fillColor = 'rgba(59, 130, 246, 0.1)',
  showArea = true,
  className = '',
}: SparklineProps) {
  if (!data || data.length === 0) {
    return null;
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  // Create SVG path
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return { x, y };
  });

  // Line path
  const linePath = points
    .map((point, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${command} ${point.x},${point.y}`;
    })
    .join(' ');

  // Area path (for fill)
  const areaPath = showArea
    ? `${linePath} L ${width},${height} L 0,${height} Z`
    : '';

  return (
    <svg
      width={width}
      height={height}
      className={className}
      style={{ display: 'block' }}
    >
      {showArea && (
        <path
          d={areaPath}
          fill={fillColor}
          stroke="none"
        />
      )}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
