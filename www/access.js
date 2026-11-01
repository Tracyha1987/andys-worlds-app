/* Andy's Worlds — free 7-day trial + one-time $4.99 unlock (Apple In-App Purchase).
   Follows App Review Guideline 3.1.1: the trial is a $0 non-consumable named "7-day Trial",
   and the app states the length, what locks afterwards and the price before the trial starts.
   On the web (no App Store) everything stays unlocked. */
(function () {
  'use strict';
  var TRIAL_ID = 'com.ktsunshine.andysworlds.trial7';
  var FULL_ID = 'com.ktsunshine.andysworlds.full';
  var TRIAL_DAYS = 7;
  var DAY = 86400000;
  var KEY = 'andy_access_v1';

  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(A)); } catch (e) {} }
  var A = load(); // {trialStart: ms, full: bool}

  var native = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  var store = null, ready = false, busy = false, price = '$4.99', lastError = '';

  function rerender() { try { window.__andyRender && window.__andyRender(); } catch (e) {} updatePaywall(); }
  function toast(m) { try { window.__andyToast ? window.__andyToast(m) : null; } catch (e) {} }

  function daysLeft() {
    if (!A.trialStart) return null;
    var left = Math.ceil((A.trialStart + TRIAL_DAYS * DAY - Date.now()) / DAY);
    return Math.max(0, left);
  }
  function state() {
    if (!native) return 'web';
    if (A.full) return 'full';
    if (!A.trialStart) return 'new';
    return daysLeft() > 0 ? 'trial' : 'expired';
  }
  function canPlay() { var s = state(); return s === 'web' || s === 'full' || s === 'trial'; }

  /* ---------- store (cordova-plugin-purchase v13) ---------- */
  function loadCordova(cb) {
    if (window.CdvPurchase) return cb();
    var done = false;
    document.addEventListener('deviceready', function () { if (!done) { done = true; cb(); } }, false);
    if (!window.cordova) {
      var s = document.createElement('script');
      s.src = 'cordova.js';
      document.head.appendChild(s);
    }
    setTimeout(function () { if (!done && window.CdvPurchase) { done = true; cb(); } }, 4000);
  }
  function grantTrial(date) {
    if (!A.trialStart) { A.trialStart = (date && date.getTime && date.getTime()) || Date.now(); save(); }
  }
  function syncOwned() {
    if (!store) return;
    try {
      if (store.owned(FULL_ID)) { A.full = true; save(); }
      if (store.owned(TRIAL_ID)) grantTrial(null);
    } catch (e) {}
  }
  function initStore() {
    if (!native) return;
    loadCordova(function () {
      var C = window.CdvPurchase;
      if (!C || !C.store) { lastError = 'App Store is not available right now.'; updatePaywall(); return; }
      store = C.store;
      store.register([
        { id: TRIAL_ID, type: C.ProductType.NON_CONSUMABLE, platform: C.Platform.APPLE_APPSTORE },
        { id: FULL_ID, type: C.ProductType.NON_CONSUMABLE, platform: C.Platform.APPLE_APPSTORE }
      ]);
      store.when()
        .approved(function (t) { return t.verify(); })
        .verified(function (r) { return r.finish(); })
        .finished(function (t) {
          (t.products || []).forEach(function (p) {
            if (p.id === FULL_ID) { A.full = true; save(); toast('🎉 Full game unlocked!'); }
            if (p.id === TRIAL_ID) grantTrial(t.purchaseDate);
          });
          busy = false; rerender();
        })
        .productUpdated(function (p) {
          if (p.id === FULL_ID && p.pricing && p.pricing.price) price = p.pricing.price;
          syncOwned(); rerender();
        })
        .receiptUpdated(function () { syncOwned(); rerender(); });
      store.error(function (err) { busy = false; lastError = (err && err.message) || 'Something went wrong.'; updatePaywall(); });
      store.initialize([C.Platform.APPLE_APPSTORE]).then(function () { ready = true; syncOwned(); rerender(); });
    });
  }
  function order(id) {
    if (!store || !ready) { toast('Connecting to the App Store… try again in a moment.'); return; }
    var C = window.CdvPurchase, p = store.get(id, C.Platform.APPLE_APPSTORE);
    var offer = p && p.getOffer && p.getOffer();
    if (!offer) { toast('This item is not available yet. Please try again later.'); return; }
    busy = true; lastError = ''; updatePaywall();
    offer.order().then(function (err) {
      if (err) {
        busy = false;
        if (!(window.CdvPurchase.ErrorCode && err.code === window.CdvPurchase.ErrorCode.PAYMENT_CANCELLED)) lastError = err.message || 'Purchase did not complete.';
        updatePaywall();
      }
    });
  }
  function restore() {
    if (!store) { toast('Connecting to the App Store…'); return; }
    busy = true; updatePaywall();
    Promise.resolve(store.restorePurchases()).then(function () {
      busy = false; syncOwned(); rerender();
      toast(A.full ? '✅ Purchase restored!' : 'No purchase found for this Apple ID.');
    }, function () { busy = false; updatePaywall(); });
  }

  /* ---------- paywall UI ---------- */
  var css = document.createElement('style');
  css.textContent =
    '#paywall{position:fixed;inset:0;z-index:45;display:grid;place-items:center;background:#050a2ce6;padding:20px;overflow:auto}' +
    '#paywall[hidden]{display:none}' +
    '#paywall .pw{width:min(380px,100%);text-align:center;background:#fffaf0;color:#1b2855;border:5px solid #ffe59b;border-radius:28px;padding:20px 18px;box-shadow:0 10px 0 #a66b2a,0 20px 40px #000a}' +
    '#paywall h2{margin:4px 0 6px;font-size:26px;line-height:1.1}#paywall p{margin:6px 0;font-size:14px;line-height:1.45;font-weight:600}' +
    '#paywall ul{text-align:left;margin:10px 0;padding-left:20px;font-size:14px;font-weight:600;line-height:1.5}' +
    '#paywall .big{font-size:64px;line-height:1}#paywall .fine{font-size:12px;color:#5c5470;font-weight:600}' +
    '#paywall .err{color:#b3123b;font-size:13px;font-weight:700}' +
    '#paywall .primary{margin-top:10px}#paywall .ghost{width:100%;margin-top:10px}' +
    '#paywall .link{background:none;border:0;color:#2449b8;font-weight:800;font-size:14px;margin-top:12px;text-decoration:underline}' +
    '.accessbar{display:flex;align-items:center;gap:10px;margin-top:10px;padding:10px 14px;border-radius:18px;background:#0d2266cc;border:2px solid #ffe39a;color:#fff;font-weight:800;font-size:14px;width:100%;text-align:left}' +
    '.accessbar span{font-size:26px}.accessbar small{display:block;font-weight:600;font-size:12px;color:#ffe9b0}';
  document.head.appendChild(css);

  var pw = document.createElement('div');
  pw.id = 'paywall'; pw.hidden = true; pw.setAttribute('role', 'dialog'); pw.setAttribute('aria-modal', 'true');
  function mount() { if (!pw.isConnected) document.body.appendChild(pw); }

  function paywallHTML() {
    var s = state(), b = busy ? ' disabled' : '';
    var err = lastError ? '<p class="err">' + lastError + '</p>' : '';
    var close = '<button class="link" data-pw="close">Not now</button>';
    if (s === 'full') return '<div class="pw"><div class="big">👑</div><h2>Full game unlocked</h2><p>Thank you! Every world and boss is yours forever.</p><button class="primary" data-pw="close">Let’s play!</button></div>';
    if (s === 'new') return '<div class="pw"><div class="big">🎁</div><h2>Try everything free for 7 days</h2>' +
      '<ul><li>All 5 worlds, 15 monsters and bosses</li><li>Grades 4–10, almost 400 questions</li><li>Parent corner with Vietnamese explanations</li></ul>' +
      '<p>After 7 days, the battles lock. Unlock the full game forever with a one-time purchase of <b>' + price + '</b>. No subscription. Nothing is charged when the trial starts.</p>' +
      '<p class="fine">Ba mẹ: Chơi thử miễn phí 7 ngày. Sau đó trả ' + price + ' một lần để chơi mãi. Không tự động trừ tiền.</p>' + err +
      '<button class="primary"' + b + ' data-pw="trial">' + (busy ? 'Please wait…' : '▶ Start 7-day free trial') + '</button>' +
      '<button class="ghost"' + b + ' data-pw="buy">👑 Unlock forever · ' + price + '</button>' +
      '<button class="link"' + b + ' data-pw="restore">Restore purchase</button><br>' + close + '</div>';
    if (s === 'trial') return '<div class="pw"><div class="big">⏳</div><h2>' + daysLeft() + ' day' + (daysLeft() === 1 ? '' : 's') + ' left in your trial</h2>' +
      '<p>Unlock the full game forever with a one-time purchase of <b>' + price + '</b>.</p>' + err +
      '<button class="primary"' + b + ' data-pw="buy">' + (busy ? 'Please wait…' : '👑 Unlock forever · ' + price) + '</button>' +
      '<button class="link"' + b + ' data-pw="restore">Restore purchase</button><br>' + close + '</div>';
    return '<div class="pw"><div class="big">🔒</div><h2>Your free trial has ended</h2>' +
      '<p>We hope you loved battling with Andy! Unlock all worlds and bosses forever with a one-time purchase of <b>' + price + '</b>.</p>' +
      '<p class="fine">Ba mẹ: Hết 7 ngày dùng thử. Trả ' + price + ' một lần để con chơi tiếp mãi mãi. Tiến trình của con vẫn được giữ nguyên.</p>' + err +
      '<button class="primary"' + b + ' data-pw="buy">' + (busy ? 'Please wait…' : '👑 Unlock forever · ' + price) + '</button>' +
      '<button class="link"' + b + ' data-pw="restore">Restore purchase</button><br>' + close + '</div>';
  }
  function showPaywall() { if (state() === 'web') return; mount(); pw.innerHTML = paywallHTML(); pw.hidden = false; }
  function hidePaywall() { pw.hidden = true; }
  function updatePaywall() { if (!pw.hidden) pw.innerHTML = paywallHTML(); if (state() === 'full' && !pw.hidden && !busy) { pw.innerHTML = paywallHTML(); } }
  pw.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || b.disabled) return;
    var a = b.getAttribute('data-pw');
    if (a === 'close') hidePaywall();
    else if (a === 'trial') order(TRIAL_ID);
    else if (a === 'buy') order(FULL_ID);
    else if (a === 'restore') restore();
  });

  function bannerHTML() {
    var s = state();
    if (s === 'web' || s === 'full') return '';
    if (s === 'new') return '<button class="accessbar" data-a="paywall"><span>🎁</span><div>Start your 7-day free trial<small>Dùng thử miễn phí 7 ngày · sau đó ' + price + ' một lần</small></div></button>';
    if (s === 'trial') return '<button class="accessbar" data-a="paywall"><span>⏳</span><div>Free trial: ' + daysLeft() + ' day' + (daysLeft() === 1 ? '' : 's') + ' left<small>Unlock forever · ' + price + '</small></div></button>';
    return '<button class="accessbar" data-a="paywall"><span>🔒</span><div>Trial ended · Unlock forever<small>Mở khóa trọn đời · ' + price + '</small></div></button>';
  }
  function parentHTML() {
    var s = state();
    if (s === 'web') return '';
    var line = s === 'full' ? 'Đã mua trọn đời ✅' : s === 'trial' ? 'Đang dùng thử · còn ' + daysLeft() + ' ngày' : s === 'new' ? 'Chưa bắt đầu dùng thử' : 'Hết hạn dùng thử';
    return '<div class="panel"><h2>👑 Bản quyền game</h2><p>' + line + '. Mua 1 lần ' + price + ', không trả theo tháng.</p>' +
      (s === 'full' ? '' : '<button class="ghost gold" data-a="paywall">Mở khóa trọn đời · ' + price + '</button> ') +
      '<button class="ghost" data-a="iap-restore">Khôi phục giao dịch (Restore)</button></div>';
  }

  window.AndyAccess = {
    canPlay: canPlay, state: state, daysLeft: daysLeft,
    showPaywall: showPaywall, bannerHTML: bannerHTML, parentHTML: parentHTML, restore: restore
  };
  document.addEventListener('DOMContentLoaded', function () {
    mount(); initStore();
    if (native && state() !== 'full' && state() !== 'trial') setTimeout(showPaywall, 600);
  });
})();
