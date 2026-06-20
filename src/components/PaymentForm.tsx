'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useStore } from '../store/useStore';
import { Payment } from '../lib/calculations';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Receipt, Upload, Plus } from 'lucide-react';

const paymentSchema = z.object({
  payerId: z.string().min(1, '支払者を選択してください'),
  purpose: z.string().min(1, '目的を入力してください'),
  amount: z.number().min(1, '1以上の金額を入力してください'),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export function PaymentForm() {
  const { members, addPayment } = useStore();
  const [receiptImageBase64, setReceiptImageBase64] = useState<string | null>(null);
  const [forWhomType, setForWhomType] = useState<'all' | 'specific'>('all');
  const [forWhomIds, setForWhomIds] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      payerId: '',
      purpose: '',
      amount: undefined,
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('画像サイズは2MB以下にしてください。');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: PaymentFormValues) => {
    if (forWhomType === 'specific' && forWhomIds.length === 0) {
      alert('対象者を1人以上選択してください。');
      return;
    }

    const newPayment: Payment = {
      id: crypto.randomUUID(),
      payerId: data.payerId,
      purpose: data.purpose,
      amount: data.amount,
      receiptImageUrl: receiptImageBase64 || undefined,
      createdAt: new Date(),
      forWhom: forWhomType === 'specific' ? forWhomIds : [],
    };

    addPayment(newPayment);
    reset();
    setReceiptImageBase64(null);
    setForWhomType('all');
    setForWhomIds([]);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-primary" />
          支払いの登録
        </CardTitle>
        <CardDescription>立て替えた支払い情報を登録します。</CardDescription>
      </CardHeader>
      <CardContent>
        {members.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/20">
            まずはメンバーを登録してください
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payerId">支払った人</Label>
              <select
                id="payerId"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register('payerId')}
              >
                <option value="">選択してください</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              {errors.payerId && (
                <p className="text-sm text-destructive">{errors.payerId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">目的（何代？）</Label>
              <Input
                id="purpose"
                placeholder="例: 夕食代、タクシー代"
                {...register('purpose')}
                className="bg-background"
              />
              {errors.purpose && (
                <p className="text-sm text-destructive">{errors.purpose.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">金額 (円)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="例: 5000"
                {...register('amount', { valueAsNumber: true })}
                className="bg-background"
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2 border-t pt-4">
              <Label>対象者（誰のための支払いか）</Label>
              <div className="flex items-center gap-6 mt-1">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input 
                    type="radio" 
                    name="forWhomType" 
                    value="all" 
                    className="accent-primary w-4 h-4"
                    checked={forWhomType === 'all'} 
                    onChange={() => setForWhomType('all')} 
                  />
                  全員で割る
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input 
                    type="radio" 
                    name="forWhomType" 
                    value="specific" 
                    className="accent-primary w-4 h-4"
                    checked={forWhomType === 'specific'} 
                    onChange={() => setForWhomType('specific')} 
                  />
                  特定のメンバーのみ
                </label>
              </div>
              
              {forWhomType === 'specific' && (
                <div className="mt-3 p-4 border rounded-md bg-muted/20 space-y-3 animate-in fade-in slide-in-from-top-2">
                  <p className="text-xs text-muted-foreground">この支払いを負担するメンバーを選択してください：</p>
                  <div className="grid grid-cols-2 gap-3">
                    {members.map(m => (
                      <label key={m.id} className="flex items-center gap-2 text-sm cursor-pointer bg-background p-2 rounded border hover:border-primary/50 transition-colors">
                        <input 
                          type="checkbox" 
                          className="accent-primary w-4 h-4 rounded"
                          checked={forWhomIds.includes(m.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setForWhomIds([...forWhomIds, m.id]);
                            } else {
                              setForWhomIds(forWhomIds.filter(id => id !== m.id));
                            }
                          }}
                        />
                        {m.name}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 border-t pt-4">
              <Label>領収書画像 (任意・2MB以下)</Label>
              <div className="flex items-center gap-4">
                <Label
                  htmlFor="receiptImage"
                  className="cursor-pointer flex items-center justify-center w-full h-24 border-2 border-dashed rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col items-center text-muted-foreground">
                    <Upload className="w-6 h-6 mb-2" />
                    <span className="text-sm">クリックして画像をアップロード</span>
                  </div>
                  <input
                    id="receiptImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </Label>
              </div>
              {receiptImageBase64 && (
                <div className="relative mt-2 w-32 h-32 rounded-md overflow-hidden border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={receiptImageBase64}
                    alt="Receipt preview"
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                    onClick={() => setReceiptImageBase64(null)}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full mt-6">
              <Plus className="w-4 h-4 mr-2" />
              支払いを登録する
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
