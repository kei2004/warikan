export const metadata = {
  title: '利用規約 | スマート割り勘',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-muted/20 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8 bg-card p-8 rounded-xl shadow-sm border">
        <h1 className="text-3xl font-bold tracking-tight mb-8">利用規約</h1>
        
        <div className="space-y-6 text-muted-foreground">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">第1条（適用）</h2>
            <p>本規約は、ユーザーと当方が提供するサービス「スマート割り勘」（以下、「本サービス」）の利用に関わる一切の関係に適用されます。</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">第2条（サービスの内容）</h2>
            <p>本サービスは、ユーザーが入力した立て替え費用を計算し、メンバー間の精算ルートを最適化して提示するツールです。実際の送金や決済機能は提供しておらず、利用者間の金銭のやり取りは利用者自身の責任において行うものとします。</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">第3条（免責事項）</h2>
            <p>1. 当方は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます）がないことを明示的にも黙示的にも保証しておりません。</p>
            <p>2. 当方は、本サービスに起因してユーザーに生じたあらゆる損害について、当方の故意または重過失による場合を除き、一切の責任を負いません。特に、利用者間で発生した金銭トラブルについて当方は一切関与いたしません。</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">第4条（データの保存期間）</h2>
            <p>本サービス上で作成されたグループデータおよびそれに付随する入力データは、原則として最後に更新された日から一定期間（約30日間）経過後に自動的に削除されるものとします。必要なデータはCSV等でユーザー自身が保存するものとします。</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">第5条（利用規約の変更）</h2>
            <p>当方は必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。なお、本規約の変更後、本サービスの利用を開始した場合には、当該ユーザーは変更後の規約に同意したものとみなします。</p>
          </section>
        </div>
      </div>
    </main>
  );
}
