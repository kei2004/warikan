'use client';

import { useEffect } from 'react';

// 本番環境のIDに差し替えるまでの一時的なテストID
const DUMMY_CLIENT_ID = 'ca-pub-0000000000000000';
// 特定の広告ユニットを分ける場合はスロットIDを指定します
const DUMMY_SLOT_ID = '1234567890';

export function AdBanner() {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className="w-full flex justify-center items-center my-6 min-h-[100px] bg-muted/10 border border-dashed border-muted-foreground/30 rounded-lg overflow-hidden relative">
      {/* 
        実際にはここにGoogleの広告が表示されます。
        AdSenseの審査に通るまでは、空白にならないようにプレースホルダーを表示しておきます。
      */}
      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 text-sm font-medium pointer-events-none z-0">
        Advertisement
      </div>
      <ins
        className="adsbygoogle relative z-10 w-full text-center"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || DUMMY_CLIENT_ID}
        data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID || DUMMY_SLOT_ID}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
