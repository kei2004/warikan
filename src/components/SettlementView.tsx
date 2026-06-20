'use client';

import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { calculateBalances, calculateMinimumTransactions, calculateAdjustments } from '../lib/calculations';
import { exportSettlementsToCSV } from '../lib/csv';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { ArrowRight, Calculator, Download, CheckCircle2 } from 'lucide-react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

export function SettlementView() {
  const { members, payments, roundUp, setRoundUp, settledRoutes, toggleSettledRoute } = useStore();

  const { transactions, adjustments } = useMemo(() => {
    if (members.length === 0 || payments.length === 0) return { transactions: [], adjustments: [] };
    const balances = calculateBalances(members, payments);
    const originalBalances = balances.map(b => ({ ...b }));
    const txs = calculateMinimumTransactions(balances, roundUp);
    const adjs = calculateAdjustments(originalBalances, txs);
    return { transactions: txs, adjustments: adjs };
  }, [members, payments, roundUp]);

  const handleExportCSV = () => {
    exportSettlementsToCSV(transactions, members, settledRoutes);
  };

  const getMemberName = (id: string) => {
    return members.find((m) => m.id === id)?.name || '不明';
  };

  if (members.length === 0 || payments.length === 0) {
    return null;
  }

  return (
    <Card className="w-full border-primary/20 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-500" />
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Calculator className="w-6 h-6" />
            最終清算ルート
          </CardTitle>
          <CardDescription>
            最も少ない送金回数で清算が完了するルートです。
          </CardDescription>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="round-up"
              checked={roundUp}
              onCheckedChange={setRoundUp}
            />
            <Label htmlFor="round-up" className="cursor-pointer text-sm font-medium">
              100円単位で切り上げ
            </Label>
          </div>
          {transactions.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-2" />
              CSV出力
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <div className="space-y-6">
            <div className="space-y-4">
              {transactions.map((t, i) => {
                const isSettled = settledRoutes.some(
                  r => r.from === t.from && r.to === t.to && r.amount === t.amount
                );

                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-4 bg-muted/30 rounded-lg border transition-colors ${
                      isSettled ? 'opacity-50 grayscale' : 'hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-primary cursor-pointer mr-4"
                          checked={isSettled}
                          onChange={(e) => toggleSettledRoute(t, e.target.checked)}
                          title="精算完了としてマークする"
                        />
                      </div>
                      <div className={`font-semibold text-lg min-w-[80px] ${isSettled ? 'line-through' : ''}`}>
                        {getMemberName(t.from)}
                      </div>
                      <div className="flex flex-col items-center text-muted-foreground px-4">
                        <span className={`text-xs font-medium mb-1 text-primary bg-primary/10 px-2 py-0.5 rounded-full ${isSettled ? 'line-through' : ''}`}>
                          ¥{t.amount.toLocaleString()}
                        </span>
                        <ArrowRight className={`w-5 h-5 text-primary ${isSettled ? '' : 'animate-pulse'}`} />
                      </div>
                      <div className={`font-semibold text-lg min-w-[80px] ${isSettled ? 'line-through' : ''}`}>
                        {getMemberName(t.to)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {roundUp && adjustments.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground">端数調整による損益</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {adjustments.map((adj) => {
                    if (Math.abs(adj.diff) < 1) return null;
                    const isGain = adj.diff > 0;
                    return (
                      <div key={adj.memberId} className="flex justify-between items-center p-3 rounded-md bg-muted/20 border">
                        <span className="font-medium text-sm">{getMemberName(adj.memberId)}</span>
                        <span className={`text-sm font-bold px-2 py-1 rounded-full ${isGain ? 'text-green-700 bg-green-100 dark:bg-green-900/30' : 'text-red-700 bg-red-100 dark:bg-red-900/30'}`}>
                          {isGain ? '+' : ''}{Math.round(adj.diff).toLocaleString()}円 ({isGain ? '得' : '損'})
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground border-2 border-dashed rounded-lg bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
            <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
            <p className="text-lg font-medium text-green-700 dark:text-green-400">
              清算は完了しています！（全員の収支がぴったりです）
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
