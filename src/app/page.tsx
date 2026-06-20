export const runtime = 'edge';

import { createGroupAction } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Plus, ArrowRight } from 'lucide-react';
import { AdBanner } from '@/components/AdBanner';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            スマート割り勘
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            旅行やイベントごとに専用の割り勘ページを作成し、<br/>URLを共有するだけで簡単に使えます。
          </p>
        </div>

        <Card className="w-full border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              新しいグループを作成
            </CardTitle>
            <CardDescription>
              グループ名と初期メンバーを入力して開始します。メンバーは後からでも追加できます。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createGroupAction} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">グループ名（旅行・イベント名）</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="例: 夏の沖縄旅行 2024"
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label>初期メンバー</Label>
                <div className="space-y-3">
                  <Input name="members" placeholder="メンバー1の名前 (例: 山田)" required className="bg-background" />
                  <Input name="members" placeholder="メンバー2の名前 (例: 鈴木)" required className="bg-background" />
                  <Input name="members" placeholder="メンバー3の名前 (任意)" className="bg-background" />
                </div>
              </div>

              <Button type="submit" className="w-full mt-6">
                グループを作成して始める
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          ※作成されたグループは、最後の更新から30日経過すると自動的に削除されます。
        </p>

        {/* AdSense Banner */}
        <AdBanner />
      </div>
    </main>
  );
}
