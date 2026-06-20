'use client';

import { useEffect, useState } from 'react';
import { MemberList } from '@/components/MemberList';
import { PaymentForm } from '@/components/PaymentForm';
import { PaymentHistory } from '@/components/PaymentHistory';
import { SettlementView } from '@/components/SettlementView';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Share2, Check } from 'lucide-react';
import { Group } from '@/lib/db';

export function GroupDashboard({ group }: { group: Group }) {
  const { initGroup } = useStore();
  const [copied, setCopied] = useState(false);

  // Initialize store with server data
  useEffect(() => {
    initGroup(group.id, group.members, group.payments, group.roundUp);
  }, [group, initGroup]);

  const handleShare = () => {
    try {
      // Just copy the current URL since the ID is in the path
      const url = window.location.href;
      
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch (e) {
      console.error('Failed to copy URL', e);
      alert('共有URLのコピーに失敗しました。');
    }
  };

  return (
    <main className="min-h-screen bg-muted/20">
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 text-center md:text-left">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              {group.name}
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              このURLを共有すると、全員でデータを共有できます。
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleShare}
            className="w-full md:w-auto bg-white"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2 text-green-500" />
                <span className="text-green-500 font-medium">コピーしました</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 mr-2 text-blue-500" />
                共有URLをコピー
              </>
            )}
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 tracking-tight">1. メンバー設定</h2>
              <MemberList />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 tracking-tight">2. 支払い登録</h2>
              <PaymentForm />
            </section>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 tracking-tight">3. 支払い履歴</h2>
              <PaymentHistory />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 tracking-tight">4. 清算ルート</h2>
              <SettlementView />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
