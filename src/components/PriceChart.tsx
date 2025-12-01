'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface PriceChartProps {
  data: Array<{
    date: string;
    price: number;
    index: number;
  }>;
  priceDiff: number;
}

/**
 * 価格推移グラフコンポーネント（クライアントコンポーネント）
 * 全幅表示、詳細なツールチップ対応
 */
export default function PriceChart({ data, priceDiff }: PriceChartProps) {
  return (
    <div className="w-full h-80 md:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            fontSize={12}
            tick={{ fill: '#6b7280' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tick={{ fill: '#6b7280' }}
            tickFormatter={(value) => `¥${value.toLocaleString()}`}
            width={80}
          />
          <Tooltip
            formatter={(value: number) => [`¥${value.toLocaleString()}`, '価格']}
            labelFormatter={(label) => `日付: ${label}`}
            labelStyle={{ 
              color: '#374151',
              fontWeight: 'bold',
              marginBottom: '4px',
            }}
            contentStyle={{ 
              backgroundColor: '#fff',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              padding: '12px',
            }}
            cursor={{ stroke: priceDiff < 0 ? "#ef4444" : priceDiff > 0 ? "#3b82f6" : "#6b7280", strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={priceDiff < 0 ? "#ef4444" : priceDiff > 0 ? "#3b82f6" : "#6b7280"}
            strokeWidth={3}
            dot={{ fill: priceDiff < 0 ? "#ef4444" : priceDiff > 0 ? "#3b82f6" : "#6b7280", r: 5 }}
            activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

