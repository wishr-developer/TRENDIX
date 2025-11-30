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
 */
export default function PriceChart({ data, priceDiff }: PriceChartProps) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(value) => `¥${value.toLocaleString()}`}
          />
          <Tooltip
            formatter={(value: number) => `¥${value.toLocaleString()}`}
            labelStyle={{ color: '#374151' }}
            contentStyle={{ 
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={priceDiff < 0 ? "#ef4444" : priceDiff > 0 ? "#3b82f6" : "#6b7280"}
            strokeWidth={2}
            dot={{ fill: priceDiff < 0 ? "#ef4444" : priceDiff > 0 ? "#3b82f6" : "#6b7280", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

