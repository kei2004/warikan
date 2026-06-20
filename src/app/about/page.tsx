import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Users, Share2, Receipt } from 'lucide-react';

export const metadata = {
  title: 'アプリについて | スマート割り勘',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-muted/20 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
          スマート割り勘について
        </h1>
        
        <Card>
          <CardHeader>
            <CardTitle>どんなアプリ？</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              「スマート割り勘」は、旅行や飲み会、シェアハウスなどで発生する「複数人の立て替え」を、最も少ない送金回数で簡単に清算できるように計算するWebアプリです。
            </p>
            <p>
              面倒な会員登録やアプリのインストールは一切不要。URLを発行してグループメンバーと共有するだけで、全員のスマホからリアルタイムで支払いを追加していくことができます。
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-primary" />
                グループで共有
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              発行されたURLをLINE等でシェアするだけで、メンバー全員が自由に書き込めるノートとして機能します。
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calculator className="w-5 h-5 text-primary" />
                最小送金ルート計算
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              複雑に絡み合った立て替えも、自動的に「誰が誰にいくら払えば完了するか」を最短ルートで導き出します。
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Receipt className="w-5 h-5 text-primary" />
                対象者の個別指定
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              お酒を飲まない人や、途中参加の人など、「この支払いは特定のメンバーだけで割る」といった柔軟な指定も可能です。
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Share2 className="w-5 h-5 text-primary" />
                CSV出力に対応
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              入力した支払い履歴や最終的な清算ルートは、いつでもCSV形式でダウンロードしてExcel等で保存・確認できます。
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
