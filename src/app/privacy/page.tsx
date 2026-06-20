export const metadata = {
  title: 'プライバシーポリシー | スマート割り勘',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-muted/20 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8 bg-card p-8 rounded-xl shadow-sm border">
        <h1 className="text-3xl font-bold tracking-tight mb-8">プライバシーポリシー</h1>
        
        <div className="space-y-6 text-muted-foreground">
          <p>「スマート割り勘」（以下、「本サービス」）は、ユーザーの個人情報およびプライバシーの保護に努めています。本ポリシーは、本サービスにおける情報の取り扱いについて説明するものです。</p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. 収集する情報</h2>
            <p>本サービスでは、割り勘の計算やグループ共有のために以下の情報を収集・保存します。</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>ユーザーが入力したグループ名、メンバー名</li>
              <li>入力された金額、立て替えの目的などの決済履歴データ</li>
              <li>アップロードされたレシート等の画像データ（一時保存）</li>
            </ul>
            <p>※本サービスは個人を特定できる情報（本名、住所、電話番号、実際の銀行口座情報など）の入力を要求することはありません。メンバー名はニックネーム等の使用を推奨しています。</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">2. 情報の利用目的</h2>
            <p>収集した情報は、以下の目的でのみ利用します。</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>本サービスの機能（割り勘計算、履歴表示等）を提供するため</li>
              <li>URLを知るグループメンバー間でデータを共有・同期するため</li>
              <li>サービスの改善や不具合対応のための分析</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">3. データの保存期間と削除</h2>
            <p>ユーザーが入力したグループデータは、最終更新日から一定期間（約30日間）経過した後に、自動的かつ完全にサーバーから削除されます。</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">4. 広告の配信について</h2>
            <p>本サービスでは、第三者配信の広告サービス（Google AdSense等）を利用しています。広告配信事業者は、ユーザーの興味に応じた広告を表示するためにCookie（クッキー）を使用することがあります。Cookieによる情報収集を無効にする設定については、お使いのブラウザの設定やGoogleのポリシーと規約のページをご確認ください。</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">5. アクセス解析ツールについて</h2>
            <p>本サービスでは、サービスの利用状況を分析するためにアクセス解析ツール（Google Analytics等）を利用する場合があります。これらはトラフィックデータの収集のためにCookieを使用していますが、データは匿名で収集されており、個人を特定するものではありません。</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">6. 免責事項</h2>
            <p>本サービスからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等について一切の責任を負いません。</p>
          </section>
        </div>
      </div>
    </main>
  );
}
