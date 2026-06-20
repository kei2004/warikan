'use client';

import { useStore } from '../store/useStore';
import { exportPaymentsToCSV } from '../lib/csv';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { History, Download, Trash2, Image as ImageIcon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

export function PaymentHistory() {
  const { payments, members, removePayment } = useStore();

  const handleExportCSV = () => {
    exportPaymentsToCSV(payments, members);
  };

  const getMemberName = (id: string) => {
    return members.find((m) => m.id === id)?.name || '不明';
  };

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            支払い履歴
          </CardTitle>
          <CardDescription>
            現在登録されている支払いの一覧です。合計金額: {totalAmount.toLocaleString()}円
          </CardDescription>
        </div>
        {payments.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-2" />
            CSV出力
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {payments.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>日付</TableHead>
                  <TableHead>支払者</TableHead>
                  <TableHead>目的</TableHead>
                  <TableHead className="text-right">金額</TableHead>
                  <TableHead className="text-center">画像</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      {getMemberName(payment.payerId)}
                    </TableCell>
                    <TableCell>{payment.purpose}</TableCell>
                    <TableCell className="text-right font-semibold">
                      ¥{payment.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      {payment.receiptImageUrl ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600">
                              <ImageIcon className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>領収書プレビュー</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 flex justify-center">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={payment.receiptImageUrl}
                                alt="Receipt"
                                className="max-w-full max-h-[70vh] object-contain rounded-md border"
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removePayment(payment.id)}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/10">
            支払いの履歴はありません
          </div>
        )}
      </CardContent>
    </Card>
  );
}
