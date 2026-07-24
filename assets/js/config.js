/* ================================================================
   ALIGN Personal Gym — サイト設定
   ここだけ編集すれば、サイト全体に反映されます。
   （残枠カウンター・電話番号・キャンペーンON/OFF・価格 など）
   ================================================================ */
window.ALIGN_CONFIG = {
  // ── 電話番号（空文字のあいだ、全ページの電話ボタン・tel:リンク・住所欄の電話は自動的に非表示。
  //    番号を入れた瞬間、全ページで電話UIが有効化されます。例: "052-XXX-XXXX"）
  phoneNumber: "",

  // ── 体験枠（残り◯名の表示）
  //    "auto" … 日付から自動算出。毎月1日に trialSlotsTotal へリセットし、月末にかけて trialSlotsMin まで逓減。
  //             （実際の予約状況に合わせたい時は、数値を直接入れれば固定表示になります。例: 3）
  trialSlotsRemaining: "auto",
  trialSlotsTotal: 10,       // 月初の枠数
  trialSlotsMin: 1,          // 月末に残す最小枠数（この数を下回らない）

  // ── キャンペーン（true = 体験¥0キャンペーン表示 / false = 通常¥3,300表示に戻る）
  campaignActive: true,

  // ── 体験オファーの金額（税込）
  trialPriceNormal: 3300,    // 通常の体験料
  joinFee: 22000,            // 入会金（体験当日入会で¥0）

  // ── 予約フォーム送信先（FormSubmit.co。初回は認証メールのリンククリックが必要）
  formEndpoint: "https://formsubmit.co/align.personalgym@gmail.com",

  // ── LINE 公式
  lineUrl: "https://lin.ee/X7WmsSR",

  // ── Google Analytics 測定ID
  gaId: "G-ZGZKV2KX43",

  // ── 紹介特典（会員紹介プログラム）
  referralBenefit: {
    friend: "入会金¥0 ＋ プラン10%OFF",   // 紹介された友達
    member: "サプリメント20%OFF"            // 紹介した会員
  }
};
