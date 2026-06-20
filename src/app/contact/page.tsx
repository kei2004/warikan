import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail } from 'lucide-react';

export const metadata = {
  title: 'お問い合わせ | スマート割り勘',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-muted/20 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8 bg-card p-8 rounded-xl shadow-sm border">
        <div className="text-center space-y-4">
          <Mail className="w-12 h-12 text-primary mx-auto" />
          <h1 className="text-3xl font-bold tracking-tight">お問い合わせ</h1>
          <p className="text-muted-foreground">
            本サービスに関するご質問、不具合のご報告、機能に関するご要望などがございましたら、以下のフォームまたはメールにてご連絡ください。
          </p>
        </div>
        
        {/* ※静的サイトのため実際の送信機能はありませんが、審査用のモックとして設置します */}
        <form className="space-y-6 mt-8" action="mailto:contact@warikan-dfc.pages.dev" method="GET" encType="text/plain">
          <div className="space-y-2">
            <Label htmlFor="subject">件名</Label>
            <Input id="subject" name="subject" placeholder="不具合の報告 / ご要望など" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="body">お問い合わせ内容</Label>
            <Textarea 
              id="body" 
              name="body" 
              placeholder="詳しい内容をご記入ください..." 
              className="min-h-[150px]"
              required 
            />
          </div>
          
          <Button type="submit" className="w-full text-lg h-12">
            メールクライアントを開く
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            ※送信ボタンを押すと、お使いのメールソフトが起動します。<br/>
            または直接 <strong>contact@warikan-dfc.pages.dev</strong> までご連絡ください。
          </p>
        </form>
      </div>
    </main>
  );
}
