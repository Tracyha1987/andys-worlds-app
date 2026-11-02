/* Andy's Worlds — Math question generator (grades 4–10).
   Every answer is computed, so it is always correct. Each item is tagged with its
   California Common Core State Standard (CA CCSS) code.
   Item format (same as the bank): [question, [4 options], correctIndex, englishWhy, vietnameseWhy, hint, meta]
   meta = {key: 'gen:<type>', topic: '<code · name>'} */
(function () {
  'use strict';
  var R = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); };
  var pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  var fmt = function (n) { return Number(n).toLocaleString('en-US'); };
  var gcd = function (a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; };
  var frac = function (n, d) { if (d < 0) { n = -n; d = -d; } var g = gcd(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n) : n + '/' + d; };
  var neg = function (n) { return n < 0 ? '−' + Math.abs(n) : String(n); };
  var dec = function (v, p) { return Number(v.toFixed(p)).toString(); };
  var vdec = function (s) { return String(s).replace('.', ','); }; // Vietnamese decimal comma

  // Build options: correct answer first, then 3 unique distractors.
  function opts(correct, cands, more) {
    var out = [String(correct)], seen = {}; seen[String(correct)] = 1;
    (cands || []).forEach(function (c) { c = String(c); if (out.length < 4 && !seen[c] && c !== 'NaN' && c !== '') { seen[c] = 1; out.push(c); } });
    var guard = 0;
    while (out.length < 4 && guard++ < 60) { var c = String(more()); if (!seen[c] && c !== 'NaN') { seen[c] = 1; out.push(c); } }
    return out;
  }
  function item(type, topic, q, correct, cands, more, en, vi, hint) {
    return [q, opts(correct, cands, more), 0, en, vi, hint, { key: 'gen:' + type, topic: topic }];
  }

  var G = {};
  /* ---------- Grade 4 ---------- */
  G[4] = [
    function add() { var a = R(1200, 8999), b = R(300, 4999), s = a + b;
      return item('add', '4.NBT.4 · Multi-digit addition', 'What is ' + fmt(a) + ' + ' + fmt(b) + '?', fmt(s), [fmt(s + 10), fmt(s - 100), fmt(s + 1000)], function () { return fmt(s + R(-90, 90)); },
        fmt(a) + ' + ' + fmt(b) + ' = ' + fmt(s) + '. Add ones, tens, hundreds, then thousands, carrying when needed.',
        fmt(a) + ' + ' + fmt(b) + ' = ' + fmt(s) + '. Cộng lần lượt hàng đơn vị, chục, trăm, nghìn; nhớ khi tổng từ 10 trở lên.', 'Đặt tính thẳng hàng rồi cộng từ phải sang trái.'); },
    function sub() { var a = R(3000, 9999), b = R(1100, a - 500), d = a - b;
      return item('sub', '4.NBT.4 · Multi-digit subtraction', 'What is ' + fmt(a) + ' − ' + fmt(b) + '?', fmt(d), [fmt(d + 10), fmt(d - 100), fmt(d + 100)], function () { return fmt(d + R(-90, 90)); },
        fmt(a) + ' − ' + fmt(b) + ' = ' + fmt(d) + '. Check: ' + fmt(d) + ' + ' + fmt(b) + ' = ' + fmt(a) + '.',
        fmt(a) + ' − ' + fmt(b) + ' = ' + fmt(d) + '. Thử lại: ' + fmt(d) + ' + ' + fmt(b) + ' = ' + fmt(a) + '.', 'Trừ từ hàng đơn vị; nhớ mượn khi số trên nhỏ hơn số dưới.'); },
    function mul() { var a = R(12, 98), b = R(3, 9), p = a * b;
      return item('mul', '4.NBT.5 · Multiply by one digit', 'What is ' + a + ' × ' + b + '?', fmt(p), [fmt(p + b), fmt(p - b), fmt(a + b)], function () { return fmt(p + R(-20, 20)); },
        a + ' × ' + b + ' = ' + fmt(p) + '. Split ' + a + ' into ' + (a - a % 10) + ' + ' + (a % 10) + ': ' + (a - a % 10) * b + ' + ' + (a % 10) * b + ' = ' + p + '.',
        a + ' × ' + b + ' = ' + p + '. Tách ' + a + ' = ' + (a - a % 10) + ' + ' + (a % 10) + ': ' + (a - a % 10) * b + ' + ' + (a % 10) * b + ' = ' + p + '.', 'Tách số hai chữ số thành chục và đơn vị rồi nhân từng phần.'); },
    function divr() { var b = R(3, 9), q = R(6, 24), r = R(1, b - 1), a = b * q + r;
      return item('divr', '4.NBT.6 · Division with remainder', 'What is ' + a + ' ÷ ' + b + '?', q + ' R' + r, [(q + 1) + ' R' + r, q + ' R' + (r === b - 1 ? r - 1 : r + 1), (q - 1) + ' R' + r], function () { return R(q - 3, q + 3) + ' R' + R(1, b - 1); },
        b + ' × ' + q + ' = ' + b * q + ', and ' + a + ' − ' + b * q + ' = ' + r + ', so the answer is ' + q + ' remainder ' + r + '.',
        b + ' × ' + q + ' = ' + b * q + '; ' + a + ' − ' + b * q + ' = ' + r + ', nên được ' + q + ' dư ' + r + '.', 'Tìm số lớn nhất nhân với ' + b + ' mà không vượt quá ' + a + '.'); },
    function eqfrac() { var n = R(1, 4), d = R(n + 1, 6), k = R(2, 5);
      return item('eqfrac', '4.NF.1 · Equivalent fractions', 'Which fraction is equal to ' + n + '/' + d + '?', (n * k) + '/' + (d * k), [(n * k) + '/' + (d + k), (n + k) + '/' + (d + k), (n * k) + '/' + (d * k + 1)], function () { return R(1, 9) + '/' + R(10, 30); },
        'Multiply top and bottom by ' + k + ': ' + n + '×' + k + ' = ' + n * k + ' and ' + d + '×' + k + ' = ' + d * k + '.',
        'Nhân cả tử và mẫu với ' + k + ': ' + n * k + '/' + d * k + ' = ' + n + '/' + d + '.', 'Phải nhân cả tử số và mẫu số với cùng một số.'); },
    function addfrac() { var d = pick([5, 6, 8, 10, 12]), a = R(1, d - 2), b = R(1, d - a - 1);
      return item('addfrac', '4.NF.3 · Add fractions (like denominators)', 'What is ' + a + '/' + d + ' + ' + b + '/' + d + '?', (a + b) + '/' + d, [(a + b) + '/' + (2 * d), (a + b) + '/' + (d + d), (a * b) + '/' + d, (a + b + 1) + '/' + d], function () { return R(1, d) + '/' + d; },
        'Same denominator: add the tops, keep the bottom. ' + a + ' + ' + b + ' = ' + (a + b) + ', so ' + (a + b) + '/' + d + '.',
        'Cùng mẫu số: cộng tử số, giữ nguyên mẫu số. ' + a + ' + ' + b + ' = ' + (a + b) + ', được ' + (a + b) + '/' + d + '.', 'Mẫu số giống nhau thì chỉ cộng tử số.'); },
    function round() { var n = R(1050, 9949), up = Math.round(n / 100) * 100;
      return item('round', '4.NBT.3 · Rounding', 'Round ' + fmt(n) + ' to the nearest hundred.', fmt(up), [fmt(Math.floor(n / 100) * 100 === up ? up + 100 : Math.floor(n / 100) * 100), fmt(Math.round(n / 10) * 10), fmt(Math.round(n / 1000) * 1000)], function () { return fmt(up + pick([-200, 200, -300])); },
        'Look at the tens digit (' + Math.floor(n / 10) % 10 + '). ' + (Math.floor(n / 10) % 10 >= 5 ? '5 or more rounds up' : 'Less than 5 rounds down') + ', so ' + fmt(n) + ' ≈ ' + fmt(up) + '.',
        'Nhìn chữ số hàng chục (' + Math.floor(n / 10) % 10 + '): ' + (Math.floor(n / 10) % 10 >= 5 ? 'từ 5 trở lên thì làm tròn lên' : 'nhỏ hơn 5 thì làm tròn xuống') + ', nên ' + fmt(n) + ' ≈ ' + fmt(up) + '.', 'Nhìn chữ số ngay bên phải hàng trăm.'); },
    function rect() { var l = R(4, 15), w = R(2, l - 1), area = Math.random() < .5;
      var ans = area ? l * w : 2 * (l + w);
      return item(area ? 'area' : 'perim', '4.MD.3 · Area & perimeter', 'A rectangle is ' + l + ' m long and ' + w + ' m wide. What is its ' + (area ? 'area' : 'perimeter') + '?', ans + (area ? ' m²' : ' m'), [(area ? 2 * (l + w) : l * w) + (area ? ' m²' : ' m'), (l + w) + (area ? ' m²' : ' m'), (ans + 2) + (area ? ' m²' : ' m')], function () { return R(10, 120) + (area ? ' m²' : ' m'); },
        area ? 'Area = length × width = ' + l + ' × ' + w + ' = ' + l * w + ' m².' : 'Perimeter = 2 × (length + width) = 2 × (' + l + ' + ' + w + ') = ' + 2 * (l + w) + ' m.',
        area ? 'Diện tích = dài × rộng = ' + l + ' × ' + w + ' = ' + l * w + ' m².' : 'Chu vi = 2 × (dài + rộng) = 2 × (' + l + ' + ' + w + ') = ' + 2 * (l + w) + ' m.', area ? 'Diện tích là số ô vuông phủ kín hình.' : 'Chu vi là độ dài đường bao quanh hình.'); },
    function factor() { var n = pick([12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48]), fs = []; for (var i = 2; i < n; i++) if (n % i === 0) fs.push(i);
      var f = pick(fs), non = []; for (var j = 2; j < n; j++) if (n % j) non.push(j);
      return item('factor', '4.OA.4 · Factors', 'Which number is a factor of ' + n + '?', f, [pick(non), pick(non), pick(non), pick(non)], function () { return pick(non); },
        f + ' × ' + n / f + ' = ' + n + ', so ' + f + ' is a factor of ' + n + '.',
        f + ' × ' + n / f + ' = ' + n + ', nên ' + f + ' là ước (thừa số) của ' + n + '.', 'Ước của một số là số chia hết cho số đó, không dư.'); }
  ];
  /* ---------- Grade 5 ---------- */
  G[5] = [
    function decadd() { var a = R(110, 999), b = R(11, 99), s = a + b; // hundredths
      return item('decadd', '5.NBT.7 · Add decimals', 'What is ' + dec(a / 100, 2) + ' + ' + dec(b / 10, 1) + '?', dec((a + b * 10) / 100, 2), [dec((a + b) / 100, 2), dec((a + b * 10) / 100 + 0.1, 2), dec((a * 10 + b) / 1000, 3)], function () { return dec((a + b * 10 + R(-50, 50)) / 100, 2); },
        'Line up the decimal points: ' + dec(a / 100, 2) + ' + ' + (b / 10).toFixed(2) + ' = ' + dec((a + b * 10) / 100, 2) + '.',
        'Đặt thẳng dấu thập phân: ' + vdec(dec(a / 100, 2)) + ' + ' + vdec((b / 10).toFixed(2)) + ' = ' + vdec(dec((a + b * 10) / 100, 2)) + '.', 'Viết thêm số 0 cho đủ hai chữ số sau dấu phẩy rồi cộng.'); },
    function decmul() { var a = R(12, 99), b = R(2, 9), p = a * b;
      return item('decmul', '5.NBT.7 · Multiply decimals', 'What is ' + dec(a / 10, 1) + ' × ' + b + '?', dec(p / 10, 1), [dec(p, 0), dec(p / 100, 2), dec(p / 10 + 1, 1)], function () { return dec((p + R(-15, 15)) / 10, 1); },
        a + ' × ' + b + ' = ' + p + '; there is one decimal place, so ' + dec(p / 10, 1) + '.',
        a + ' × ' + b + ' = ' + p + '; có một chữ số thập phân nên kết quả là ' + vdec(dec(p / 10, 1)) + '.', 'Nhân như số tự nhiên rồi đặt lại dấu phẩy.'); },
    function fracunlike() { var pairs = [[2, 3], [2, 5], [3, 4], [2, 6], [3, 6], [4, 8], [2, 4], [3, 5]], pr = pick(pairs), d1 = pr[0], d2 = pr[1];
      var n1 = 1, n2 = R(1, d2 - 1), num = n1 * d2 + n2 * d1, den = d1 * d2;
      return item('fracunlike', '5.NF.1 · Add unlike fractions', 'What is 1/' + d1 + ' + ' + n2 + '/' + d2 + '?', frac(num, den), [(1 + n2) + '/' + (d1 + d2), frac(num + 1, den), frac(1 + n2, d2)], function () { return frac(R(1, 12), R(2, 15)); },
        'Common denominator ' + den + ': ' + d2 + '/' + den + ' + ' + n2 * d1 + '/' + den + ' = ' + num + '/' + den + (frac(num, den) !== num + '/' + den ? ' = ' + frac(num, den) : '') + '.',
        'Quy đồng mẫu số ' + den + ': ' + d2 + '/' + den + ' + ' + n2 * d1 + '/' + den + ' = ' + num + '/' + den + (frac(num, den) !== num + '/' + den ? ' = ' + frac(num, den) : '') + '.', 'Không cộng mẫu số với nhau; phải quy đồng trước.'); },
    function fracof() { var d = pick([2, 3, 4, 5, 6, 8]), n = R(1, d - 1), k = R(3, 12), w = d * k, ans = n * k;
      return item('fracof', '5.NF.4 · Fraction of a number', 'What is ' + n + '/' + d + ' of ' + w + '?', ans, [k, w - ans, ans + n], function () { return ans + R(-6, 6); },
        w + ' ÷ ' + d + ' = ' + k + ', then × ' + n + ' = ' + ans + '.',
        w + ' : ' + d + ' = ' + k + ', rồi × ' + n + ' = ' + ans + '.', 'Chia cho mẫu số trước, rồi nhân với tử số.'); },
    function volume() { var a = R(2, 9), b = R(2, 9), c = R(2, 9), v = a * b * c;
      return item('volume', '5.MD.5 · Volume', 'A box is ' + a + ' cm × ' + b + ' cm × ' + c + ' cm. What is its volume?', v + ' cm³', [(a + b + c) + ' cm³', (a * b) + ' cm³', (2 * (a * b + b * c + a * c)) + ' cm³'], function () { return (v + R(-20, 20)) + ' cm³'; },
        'Volume = length × width × height = ' + a + ' × ' + b + ' × ' + c + ' = ' + v + ' cm³.',
        'Thể tích = dài × rộng × cao = ' + a + ' × ' + b + ' × ' + c + ' = ' + v + ' cm³.', 'Nhân cả ba kích thước.'); },
    function order() { var a = R(2, 9), b = R(2, 9), c = R(2, 6), ans = a + b * c;
      return item('order', '5.OA.1 · Order of operations', 'What is ' + a + ' + ' + b + ' × ' + c + '?', ans, [(a + b) * c, a * b + c, ans + 1], function () { return ans + R(-8, 8); },
        'Multiply first: ' + b + ' × ' + c + ' = ' + b * c + ', then add ' + a + ' = ' + ans + '.',
        'Nhân trước, cộng sau: ' + b + ' × ' + c + ' = ' + b * c + ', rồi cộng ' + a + ' được ' + ans + '.', 'Nhân chia trước, cộng trừ sau.'); },
    function pow10() { var a = R(11, 999), e = R(1, 3), x = Math.random() < .5, v = x ? a * Math.pow(10, e) : a / Math.pow(10, e);
      var s = x ? fmt(v) : dec(v, e + 2);
      return item('pow10', '5.NBT.2 · Powers of 10', 'What is ' + a + (x ? ' × ' : ' ÷ ') + fmt(Math.pow(10, e)) + '?', s, [x ? fmt(a * Math.pow(10, e + 1)) : dec(a / Math.pow(10, e + 1), e + 3), x ? fmt(a * Math.pow(10, e - 1)) : dec(a / Math.pow(10, e - 1), e + 2), x ? fmt(a + Math.pow(10, e)) : dec(a * Math.pow(10, e), 0)], function () { return fmt(R(1, 99999)); },
        (x ? 'Multiplying' : 'Dividing') + ' by ' + fmt(Math.pow(10, e)) + ' moves the decimal point ' + e + ' place' + (e > 1 ? 's' : '') + ' to the ' + (x ? 'right' : 'left') + ': ' + s + '.',
        (x ? 'Nhân' : 'Chia') + ' cho ' + fmt(Math.pow(10, e)) + ' thì dời dấu phẩy sang ' + (x ? 'phải' : 'trái') + ' ' + e + ' chữ số: ' + vdec(s) + '.', 'Đếm số chữ số 0 của ' + fmt(Math.pow(10, e)) + '.'); }
  ];
  /* ---------- Grade 6 ---------- */
  G[6] = [
    function ratio() { var a = R(2, 5), b = R(a + 1, 9), k = R(2, 8);
      return item('ratio', '6.RP.3 · Ratios', 'The ratio of red to blue marbles is ' + a + ':' + b + '. If there are ' + a * k + ' red marbles, how many blue marbles are there?', b * k, [b + k, a * k + b, (b - a) * k], function () { return b * k + R(-6, 6); },
        a * k + ' ÷ ' + a + ' = ' + k + ' (each part), so blue = ' + b + ' × ' + k + ' = ' + b * k + '.',
        'Mỗi phần = ' + a * k + ' : ' + a + ' = ' + k + ', nên bi xanh = ' + b + ' × ' + k + ' = ' + b * k + '.', 'Tìm giá trị của một phần trước.'); },
    function pct() { var p = pick([10, 15, 20, 25, 30, 40, 50, 60, 75]), n = pick([40, 60, 80, 120, 160, 200, 240, 300]), ans = p * n / 100;
      return item('pct', '6.RP.3c · Percent of a number', 'What is ' + p + '% of ' + n + '?', fmt(ans), [fmt(n - ans), fmt(p), fmt(ans * 2)], function () { return fmt(ans + R(-10, 10)); },
        p + '% = ' + p / 100 + ', and ' + p / 100 + ' × ' + n + ' = ' + ans + '.',
        p + '% = ' + vdec(String(p / 100)) + '; ' + vdec(String(p / 100)) + ' × ' + n + ' = ' + ans + '.', 'Tìm 10% trước rồi nhân lên.'); },
    function fdiv() { var a = R(1, 5), b = R(a + 1, 8), c = R(1, 4), d = R(c + 1, 6);
      return item('fdiv', '6.NS.1 · Divide fractions', 'What is ' + a + '/' + b + ' ÷ ' + c + '/' + d + '?', frac(a * d, b * c), [frac(a * c, b * d), frac(b * c, a * d), frac(a + c, b + d)], function () { return frac(R(1, 20), R(2, 20)); },
        'Multiply by the reciprocal: ' + a + '/' + b + ' × ' + d + '/' + c + ' = ' + (a * d) + '/' + (b * c) + (frac(a * d, b * c) !== (a * d) + '/' + (b * c) ? ' = ' + frac(a * d, b * c) : '') + '.',
        'Nhân với phân số đảo ngược: ' + a + '/' + b + ' × ' + d + '/' + c + ' = ' + (a * d) + '/' + (b * c) + (frac(a * d, b * c) !== (a * d) + '/' + (b * c) ? ' = ' + frac(a * d, b * c) : '') + '.', 'Chia phân số = nhân với phân số đảo ngược.'); },
    function onestep() { var x = R(3, 25), b = R(2, 30), m = Math.random() < .5;
      var q = m ? 'Solve: ' + b + 'x = ' + b * x + '.' : 'Solve: x + ' + b + ' = ' + (x + b) + '.';
      return item('onestep', '6.EE.7 · One-step equations', q, 'x = ' + x, ['x = ' + (m ? b * x - b : x + 2 * b), 'x = ' + (x + 1), 'x = ' + (m ? b * x * b : x + b)], function () { return 'x = ' + R(1, 40); },
        m ? 'Divide both sides by ' + b + ': x = ' + b * x + ' ÷ ' + b + ' = ' + x + '.' : 'Subtract ' + b + ' from both sides: x = ' + (x + b) + ' − ' + b + ' = ' + x + '.',
        m ? 'Chia hai vế cho ' + b + ': x = ' + x + '.' : 'Trừ ' + b + ' ở hai vế: x = ' + x + '.', 'Làm phép ngược lại để x đứng một mình.'); },
    function mean() { var k = R(4, 5), arr = [], s = 0; for (var i = 0; i < k - 1; i++) { var v = R(2, 20); arr.push(v); s += v; } var m = Math.ceil((s + 1) / k) + R(0, 4); arr.push(m * k - s); s = m * k;
      return item('mean', '6.SP.5 · Mean', 'What is the mean of ' + arr.join(', ') + '?', m, [s, m + 1, Math.round(s / (k - 1))], function () { return m + R(-5, 5); },
        'Sum = ' + s + '; ' + s + ' ÷ ' + k + ' = ' + m + '.',
        'Tổng = ' + s + '; ' + s + ' : ' + k + ' = ' + m + '.', 'Cộng tất cả rồi chia cho số lượng số.'); },
    function dist() { var a = -R(2, 12), b = R(1, 12);
      return item('dist', '6.NS.8 · Distance on a number line', 'How far apart are ' + neg(a) + ' and ' + b + ' on a number line?', b - a, [b + a < 0 ? -(b + a) : b + a, b, Math.abs(a)], function () { return R(1, 25); },
        'Distance = ' + b + ' − (' + neg(a) + ') = ' + b + ' + ' + Math.abs(a) + ' = ' + (b - a) + '.',
        'Khoảng cách = ' + b + ' − (' + neg(a) + ') = ' + (b - a) + '.', 'Đếm từ số âm lên 0, rồi từ 0 lên số dương.'); },
    function tri() { var b = 2 * R(2, 9), h = R(3, 12);
      return item('tri', '6.G.1 · Area of a triangle', 'A triangle has base ' + b + ' cm and height ' + h + ' cm. What is its area?', (b * h / 2) + ' cm²', [(b * h) + ' cm²', (b + h) + ' cm²', (b * h / 2 + h) + ' cm²'], function () { return R(5, 120) + ' cm²'; },
        'Area = ½ × base × height = ½ × ' + b + ' × ' + h + ' = ' + b * h / 2 + ' cm².',
        'Diện tích = đáy × cao : 2 = ' + b + ' × ' + h + ' : 2 = ' + b * h / 2 + ' cm².', 'Đừng quên chia 2.'); },
    function expo() { var b = R(2, 6), e = R(2, b > 4 ? 3 : 4), v = Math.pow(b, e);
      return item('expo', '6.EE.1 · Exponents', 'What is ' + b + '^' + e + '?', fmt(v), [b * e, Math.pow(e, b), v + b], function () { return R(4, 999); },
        b + '^' + e + ' means ' + Array(e + 1).join(b + ' × ').slice(0, -3) + ' = ' + fmt(v) + '.',
        b + '^' + e + ' nghĩa là nhân ' + b + ' với chính nó ' + e + ' lần = ' + fmt(v) + '.', 'Số mũ cho biết nhân bao nhiêu lần, không phải nhân với số mũ.'); }
  ];
  /* ---------- Grade 7 ---------- */
  G[7] = [
    function intops() { var a = R(-15, 15) || 3, b = R(-15, 15) || -4, op = pick(['+', '−', '×']);
      var v = op === '+' ? a + b : op === '−' ? a - b : a * b;
      var cands = op === '×' ? [-v, a + b, v + a] : [-v, op === '+' ? a - b : a + b, v + 1];
      return item('int' + op, '7.NS.1–2 · Integer operations', 'What is (' + neg(a) + ') ' + op + ' (' + neg(b) + ')?', neg(v), cands.map(neg), function () { return neg(v + R(-6, 6)); },
        '(' + neg(a) + ') ' + op + ' (' + neg(b) + ') = ' + neg(v) + '.' + (op === '×' ? ' Same signs give a positive product; different signs give a negative.' : op === '−' ? ' Subtracting a number is adding its opposite.' : ''),
        '(' + neg(a) + ') ' + op + ' (' + neg(b) + ') = ' + neg(v) + '.' + (op === '×' ? ' Cùng dấu thì dương, khác dấu thì âm.' : op === '−' ? ' Trừ một số là cộng với số đối của nó.' : ''), 'Cẩn thận với dấu âm.'); },
    function disc() { var p = pick([10, 15, 20, 25, 30, 40, 50]), price = pick([20, 40, 60, 80, 120, 150, 200]), up = Math.random() < .35;
      var ch = price * p / 100, ans = up ? price + ch : price - ch;
      return item(up ? 'markup' : 'discount', '7.RP.3 · Percent increase & discount', 'A $' + price + ' item is ' + (up ? 'marked up ' : p + '% off. ') + (up ? p + '%. ' : '') + 'What is the new price?', '$' + dec(ans, 2), ['$' + dec(ch, 2), '$' + dec(up ? price - ch : price + ch, 2), '$' + dec(price - p, 2)], function () { return '$' + R(5, 250); },
        p + '% of $' + price + ' is $' + dec(ch, 2) + '. $' + price + (up ? ' + ' : ' − ') + '$' + dec(ch, 2) + ' = $' + dec(ans, 2) + '.',
        p + '% của ' + price + ' đô là ' + dec(ch, 2) + ' đô. ' + price + (up ? ' + ' : ' − ') + dec(ch, 2) + ' = ' + dec(ans, 2) + ' đô.', up ? 'Tăng giá thì cộng thêm.' : 'Giảm giá thì trừ đi.'); },
    function twostep() { var x = R(-6, 12), a = R(2, 7), b = R(-12, 15) || 5;
      return item('twostep', '7.EE.4 · Two-step equations', 'Solve: ' + a + 'x ' + (b < 0 ? '− ' + (-b) : '+ ' + b) + ' = ' + neg(a * x + b) + '.', 'x = ' + neg(x), ['x = ' + neg(x + 1), 'x = ' + neg(-x || 2), 'x = ' + neg(a * x)], function () { return 'x = ' + neg(R(-10, 15)); },
        (b < 0 ? 'Add ' + (-b) : 'Subtract ' + b) + ' on both sides: ' + a + 'x = ' + neg(a * x) + '. Divide by ' + a + ': x = ' + neg(x) + '.',
        (b < 0 ? 'Cộng ' + (-b) : 'Trừ ' + b) + ' ở hai vế: ' + a + 'x = ' + neg(a * x) + '. Chia cho ' + a + ': x = ' + neg(x) + '.', 'Bỏ số hạng tự do trước, rồi chia hệ số.'); },
    function prob() { var r = R(1, 6), b = R(1, 8), g = R(0, 5), t = r + b + g;
      return item('prob', '7.SP.5 · Probability', 'A bag has ' + r + ' red, ' + b + ' blue' + (g ? ' and ' + g + ' green' : '') + ' marbles. What is the probability of picking red?', frac(r, t), [frac(r, b + g || 1), frac(b, t), frac(r, t + 1)], function () { return frac(R(1, 9), R(10, 20)); },
        'There are ' + t + ' marbles and ' + r + ' are red: ' + r + '/' + t + (frac(r, t) !== r + '/' + t ? ' = ' + frac(r, t) : '') + '.',
        'Có ' + t + ' viên, ' + r + ' viên đỏ: xác suất = ' + r + '/' + t + (frac(r, t) !== r + '/' + t ? ' = ' + frac(r, t) : '') + '.', 'Xác suất = số trường hợp mong muốn / tổng số.'); },
    function circle() { var rr = R(2, 10), a = Math.random() < .5;
      var ans = a ? dec(3.14 * rr * rr, 2) : dec(2 * 3.14 * rr, 2);
      return item(a ? 'circA' : 'circC', '7.G.4 · Circles (use π ≈ 3.14)', 'A circle has radius ' + rr + ' cm. Using π ≈ 3.14, what is its ' + (a ? 'area' : 'circumference') + '?', ans + (a ? ' cm²' : ' cm'), [(a ? dec(2 * 3.14 * rr, 2) : dec(3.14 * rr * rr, 2)) + (a ? ' cm²' : ' cm'), (a ? dec(3.14 * 2 * rr * 2 * rr, 2) : dec(3.14 * rr, 2)) + (a ? ' cm²' : ' cm'), (a ? dec(3.14 * rr * 2, 2) : dec(4 * 3.14 * rr, 2)) + (a ? ' cm²' : ' cm')], function () { return R(10, 300) + (a ? ' cm²' : ' cm'); },
        a ? 'Area = πr² = 3.14 × ' + rr + ' × ' + rr + ' = ' + ans + ' cm².' : 'Circumference = 2πr = 2 × 3.14 × ' + rr + ' = ' + ans + ' cm.',
        a ? 'Diện tích = π × r × r = ' + vdec(ans) + ' cm².' : 'Chu vi = 2 × π × r = ' + vdec(ans) + ' cm.', a ? 'Diện tích dùng bán kính bình phương.' : 'Chu vi = đường kính × π.'); },
    function propk() { var k = R(2, 12), x = R(2, 9);
      return item('propk', '7.RP.2 · Proportional relationships', 'y is proportional to x. When x = ' + x + ', y = ' + k * x + '. What is the constant of proportionality?', k, [k * x, x, k + x], function () { return R(2, 30); },
        'k = y ÷ x = ' + k * x + ' ÷ ' + x + ' = ' + k + '.',
        'Hằng số tỷ lệ k = y : x = ' + k * x + ' : ' + x + ' = ' + k + '.', 'Trong y = kx, lấy y chia x.'); }
  ];
  /* ---------- Grade 8 ---------- */
  var TRIPLES = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [7, 24, 25], [12, 16, 20], [20, 21, 29]];
  G[8] = [
    function bothsides() { var x = R(-8, 12), a = R(3, 9), c = R(1, a - 1), b = R(-10, 10) || 4, d = (a - c) * x + b;
      return item('bothsides', '8.EE.7 · Equations with variables on both sides', 'Solve: ' + a + 'x ' + (b < 0 ? '− ' + (-b) : '+ ' + b) + ' = ' + c + 'x ' + (d < 0 ? '− ' + (-d) : '+ ' + d) + '.', 'x = ' + neg(x), ['x = ' + neg(x + 2), 'x = ' + neg(-x || 1), 'x = ' + neg(x - 1)], function () { return 'x = ' + neg(R(-10, 15)); },
        'Move x-terms: ' + (a - c) + 'x = ' + neg(d - b) + ', so x = ' + neg(x) + '.',
        'Chuyển x về một vế: ' + (a - c) + 'x = ' + neg(d - b) + ', nên x = ' + neg(x) + '.', 'Gom các số hạng có x về cùng một vế.'); },
    function slope() { var x1 = R(-4, 4), y1 = R(-5, 5), dx = R(1, 5), m = R(-4, 4) || 2, x2 = x1 + dx, y2 = y1 + m * dx;
      return item('slope', '8.F.4 · Slope', 'What is the slope of the line through (' + neg(x1) + ', ' + neg(y1) + ') and (' + neg(x2) + ', ' + neg(y2) + ')?', neg(m), [neg(-m), frac(dx, m), neg(m * dx)], function () { return neg(R(-6, 6)); },
        'Slope = (y₂ − y₁) ÷ (x₂ − x₁) = ' + neg(y2 - y1) + ' ÷ ' + dx + ' = ' + neg(m) + '.',
        'Hệ số góc = (y₂ − y₁) : (x₂ − x₁) = ' + neg(y2 - y1) + ' : ' + dx + ' = ' + neg(m) + '.', 'Độ tăng của y chia độ tăng của x.'); },
    function pyth() { var t = pick(TRIPLES), k = pick([1, 1, 2]), a = t[0] * k, b = t[1] * k, c = t[2] * k, findLeg = Math.random() < .4;
      return findLeg
        ? item('pythleg', '8.G.7 · Pythagorean theorem', 'A right triangle has hypotenuse ' + c + ' and one leg ' + a + '. How long is the other leg?', b, [c - a, c + a, b + 1], function () { return R(3, 40); },
          b + '² = ' + c + '² − ' + a + '² = ' + (c * c - a * a) + ', so the leg is ' + b + '.', b + '² = ' + c + '² − ' + a + '² = ' + (c * c - a * a) + ', nên cạnh còn lại là ' + b + '.', 'Cạnh góc vuông² = cạnh huyền² − cạnh kia².')
        : item('pyth', '8.G.7 · Pythagorean theorem', 'A right triangle has legs ' + a + ' and ' + b + '. How long is the hypotenuse?', c, [a + b, c + 1, Math.abs(b - a) || c + 2], function () { return R(5, 60); },
          a + '² + ' + b + '² = ' + (a * a + b * b) + ' = ' + c + '², so the hypotenuse is ' + c + '.', a + '² + ' + b + '² = ' + (a * a + b * b) + ' = ' + c + '², nên cạnh huyền là ' + c + '.', 'a² + b² = c².'); },
    function sci() { var m = R(11, 99) / 10, e = R(3, 7), v = Math.round(m * Math.pow(10, e));
      return item('sci', '8.EE.4 · Scientific notation', 'Write ' + dec(m, 1) + ' × 10^' + e + ' in standard form.', fmt(v), [fmt(v * 10), fmt(v / 10), fmt(Math.round(m * 10) * Math.pow(10, e))], function () { return fmt(v + R(1, 9) * Math.pow(10, e - 2)); },
        'Move the decimal point ' + e + ' places to the right: ' + fmt(v) + '.',
        'Dời dấu phẩy sang phải ' + e + ' chữ số: ' + fmt(v) + '.', 'Số mũ dương: dời dấu phẩy sang phải.'); },
    function sqrt() { var r = R(4, 20);
      return item('sqrt', '8.EE.2 · Square roots', 'What is √' + r * r + '?', r, [r * 2, r + 1, r - 1], function () { return R(2, 25); },
        r + ' × ' + r + ' = ' + r * r + ', so √' + r * r + ' = ' + r + '.',
        r + ' × ' + r + ' = ' + r * r + ', nên căn bậc hai của ' + r * r + ' là ' + r + '.', 'Tìm số nhân với chính nó ra ' + r * r + '.'); },
    function explaw() { var b = pick([2, 3, 5, 10]), m = R(2, 6), n = R(2, 6), t = pick(['mul', 'pow', 'div']);
      var q, ans, c, en, vi;
      if (t === 'mul') { q = b + '^' + m + ' × ' + b + '^' + n; ans = b + '^' + (m + n); c = [b + '^' + m * n, (b * b) + '^' + (m + n), b + '^' + Math.abs(m - n)]; en = 'Same base: add exponents. ' + m + ' + ' + n + ' = ' + (m + n) + '.'; vi = 'Cùng cơ số khi nhân thì cộng số mũ: ' + m + ' + ' + n + ' = ' + (m + n) + '.'; }
      else if (t === 'pow') { q = '(' + b + '^' + m + ')^' + n; ans = b + '^' + m * n; c = [b + '^' + (m + n), (b * n) + '^' + m, b + '^' + Math.pow(m, n)]; en = 'Power of a power: multiply exponents. ' + m + ' × ' + n + ' = ' + m * n + '.'; vi = 'Lũy thừa của lũy thừa thì nhân số mũ: ' + m + ' × ' + n + ' = ' + m * n + '.'; }
      else { var hi = m + n; q = b + '^' + hi + ' ÷ ' + b + '^' + n; ans = b + '^' + m; c = [b + '^' + (hi + n), b + '^' + (hi / n).toFixed(0), '1^' + m]; en = 'Same base: subtract exponents. ' + hi + ' − ' + n + ' = ' + m + '.'; vi = 'Cùng cơ số khi chia thì trừ số mũ: ' + hi + ' − ' + n + ' = ' + m + '.'; }
      return item('exp' + t, '8.EE.1 · Laws of exponents', 'Simplify: ' + q, ans, c, function () { return b + '^' + R(1, 30); }, en, vi, 'Nhớ: nhân thì cộng mũ, chia thì trừ mũ, lũy thừa của lũy thừa thì nhân mũ.'); },
    function system() { var x = R(1, 12), y = R(1, 12), s = x + y, d = x - y;
      return item('system', '8.EE.8 · Systems of equations', 'Solve: x + y = ' + s + ' and x − y = ' + neg(d) + '. What is x?', x, [y, s, Math.abs(d) || x + 1], function () { return R(1, 20); },
        'Add the equations: 2x = ' + (s + d) + ', so x = ' + x + '.',
        'Cộng hai phương trình: 2x = ' + (s + d) + ', nên x = ' + x + '.', 'Cộng hai phương trình để khử y.'); }
  ];
  /* ---------- Grade 9 (Algebra I) ---------- */
  G[9] = [
    function factorq() { var p = R(-7, 7) || 2, q = R(-7, 7) || -3; if (p === q) q = q + 1 || 2; var b = p + q, c = p * q;
      var sgn = function (n) { return n < 0 ? '− ' + (-n) : '+ ' + n; };
      var f = function (r) { return '(x ' + sgn(r) + ')'; };
      return item('factorq', 'A-SSE.3 · Factoring quadratics', 'Factor: x² ' + (b === 0 ? '' : sgn(b) + 'x ') + sgn(c), f(p) + f(q), [f(-p) + f(-q), f(p) + f(-q), f(b) + f(c === b ? c + 1 : c)], function () { return f(R(-8, 8) || 1) + f(R(-8, 8) || 5); },
        'Find two numbers that multiply to ' + neg(c) + ' and add to ' + neg(b) + ': ' + neg(p) + ' and ' + neg(q) + '.',
        'Tìm hai số có tích ' + neg(c) + ' và tổng ' + neg(b) + ': ' + neg(p) + ' và ' + neg(q) + '.', 'Tích bằng hệ số tự do, tổng bằng hệ số của x.'); },
    function solveq() { var p = R(1, 9), q = R(1, 9); if (p === q) q++; var b = -(p + q), c = p * q;
      var sgn = function (n) { return n < 0 ? '− ' + (-n) : '+ ' + n; };
      return item('solveq', 'A-REI.4 · Solve quadratics by factoring', 'Solve: x² ' + sgn(b) + 'x ' + sgn(c) + ' = 0', 'x = ' + Math.min(p, q) + ' or ' + Math.max(p, q), ['x = −' + Math.min(p, q) + ' or −' + Math.max(p, q), 'x = ' + (p + q) + ' or ' + c, 'x = ' + Math.min(p, q) + ' or −' + Math.max(p, q)], function () { return 'x = ' + R(1, 9) + ' or ' + R(10, 15); },
        'x² ' + sgn(b) + 'x ' + sgn(c) + ' = (x − ' + p + ')(x − ' + q + ') = 0, so x = ' + p + ' or x = ' + q + '.',
        'Phân tích (x − ' + p + ')(x − ' + q + ') = 0, nên x = ' + p + ' hoặc x = ' + q + '.', 'Phân tích thành tích rồi cho từng thừa số bằng 0.'); },
    function feval() { var a = R(1, 4), b = R(-6, 6), c = R(-9, 9), x = R(-4, 5), v = a * x * x + b * x + c;
      var sgn = function (n) { return n < 0 ? ' − ' + (-n) : ' + ' + n; };
      return item('feval', 'F-IF.2 · Evaluate functions', 'If f(x) = ' + (a === 1 ? '' : a) + 'x²' + (b ? sgn(b) + 'x' : '') + (c ? sgn(c) : '') + ', what is f(' + neg(x) + ')?', neg(v), [neg(-a * x * x + b * x + c), neg(a * x * 2 + b * x + c), neg(v + 2)], function () { return neg(v + R(-10, 10)); },
        'Substitute x = ' + neg(x) + ': ' + a + '(' + neg(x) + ')² + ' + '(' + neg(b) + ')(' + neg(x) + ') + (' + neg(c) + ') = ' + neg(v) + '.',
        'Thay x = ' + neg(x) + ' vào: ' + a + '(' + neg(x) + ')² + (' + neg(b) + ')(' + neg(x) + ') + (' + neg(c) + ') = ' + neg(v) + '. Nhớ (' + neg(x) + ')² luôn dương.', 'Đặt số âm trong ngoặc khi bình phương.'); },
    function ineq() { var a = R(2, 6), b = R(-8, 8) || 3, lim = R(-3, 8), c = a * lim + b;
      return item('ineq', 'A-REI.3 · Linear inequalities', 'Solve: ' + a + 'x ' + (b < 0 ? '− ' + (-b) : '+ ' + b) + ' < ' + neg(c), 'x < ' + neg(lim), ['x > ' + neg(lim), 'x < ' + neg(lim + 1), 'x ≤ ' + neg(c)], function () { return 'x < ' + neg(R(-10, 10)); },
        (b < 0 ? 'Add ' + (-b) : 'Subtract ' + b) + ': ' + a + 'x < ' + neg(a * lim) + '. Divide by ' + a + ' (positive, so the sign stays): x < ' + neg(lim) + '.',
        (b < 0 ? 'Cộng ' + (-b) : 'Trừ ' + b) + ': ' + a + 'x < ' + neg(a * lim) + '. Chia cho ' + a + ' (số dương nên giữ nguyên chiều): x < ' + neg(lim) + '.', 'Chỉ đổi chiều bất đẳng thức khi nhân/chia số âm.'); },
    function sintercept() { var m = R(-5, 5) || 3, b = R(-9, 9), ask = Math.random() < .5;
      return item(ask ? 'slopeform' : 'yint', 'F-LE / 8.F.3 · Slope-intercept form', 'For y = ' + neg(m) + 'x ' + (b < 0 ? '− ' + (-b) : '+ ' + b) + ', what is the ' + (ask ? 'slope' : 'y-intercept') + '?', ask ? neg(m) : neg(b), ask ? [neg(b), neg(-m), neg(m + b)] : [neg(m), neg(-b), '0'], function () { return neg(R(-9, 9)); },
        'In y = mx + b, the slope is m = ' + neg(m) + ' and the y-intercept is b = ' + neg(b) + '.',
        'Trong y = mx + b: hệ số góc m = ' + neg(m) + ', tung độ gốc b = ' + neg(b) + '.', 'm đứng trước x; b là số hạng tự do.'); },
    function diffsq() { var a = R(1, 5), b = R(1, 9);
      var A = a === 1 ? 'x' : a + 'x';
      return item('diffsq', 'A-SSE.2 · Difference of squares', 'Factor: ' + (a * a === 1 ? '' : a * a) + 'x² − ' + b * b, '(' + A + ' − ' + b + ')(' + A + ' + ' + b + ')', ['(' + A + ' − ' + b + ')²', '(' + A + ' + ' + b + ')²', '(' + (a * a === 1 ? '' : a * a) + 'x − ' + b + ')(x + ' + b + ')'], function () { return '(x − ' + R(1, 9) + ')(x + ' + R(10, 12) + ')'; },
        'a² − b² = (a − b)(a + b), with a = ' + A + ' and b = ' + b + '.',
        'Hằng đẳng thức a² − b² = (a − b)(a + b), với a = ' + A + ', b = ' + b + '.', 'Nhận ra hiệu hai bình phương.'); }
  ];
  /* ---------- Grade 10 (Geometry / Algebra II) ---------- */
  G[10] = [
    function triang() { var a = R(25, 80), b = R(25, 150 - a), c = 180 - a - b;
      return item('triang', 'G-CO.10 · Triangle angle sum', 'Two angles of a triangle are ' + a + '° and ' + b + '°. What is the third angle?', c + '°', [(360 - a - b) + '°', (a + b) + '°', (c + 10) + '°'], function () { return R(10, 120) + '°'; },
        'Angles in a triangle add to 180°: 180 − ' + a + ' − ' + b + ' = ' + c + '°.',
        'Tổng ba góc tam giác là 180°: 180 − ' + a + ' − ' + b + ' = ' + c + '°.', 'Tổng ba góc luôn bằng 180°.'); },
    function trig() { var t = pick([['sin 30°', '1/2'], ['cos 60°', '1/2'], ['tan 45°', '1'], ['sin 90°', '1'], ['cos 0°', '1'], ['sin 0°', '0'], ['cos 90°', '0'], ['sin 60°', '√3/2'], ['cos 30°', '√3/2'], ['sin 45°', '√2/2'], ['tan 60°', '√3'], ['tan 30°', '√3/3']]);
      return item('trig', 'G-SRT.6 · Special angle trig values', 'What is ' + t[0] + '?', t[1], ['1/2', '√3/2', '√2/2', '1', '0', '√3'].filter(function (x) { return x !== t[1]; }), function () { return pick(['2', '√3/3', '1/3']); },
        t[0] + ' = ' + t[1] + ' (from the 30–60–90 and 45–45–90 special right triangles).',
        t[0] + ' = ' + t[1] + ' (dựa vào tam giác vuông đặc biệt 30–60–90 và 45–45–90).', 'Vẽ tam giác vuông đặc biệt để nhớ.'); },
    function geoseq() { var a = R(1, 6), r = R(2, 4), n = R(4, 6), v = a * Math.pow(r, n - 1);
      var seq = [a, a * r, a * r * r];
      return item('geoseq', 'F-BF.2 · Geometric sequences', 'A geometric sequence starts ' + seq.join(', ') + ', … What is term ' + n + '?', fmt(v), [fmt(a * Math.pow(r, n)), fmt(a + (n - 1) * r), fmt(v / r)], function () { return fmt(R(10, 5000)); },
        'aₙ = a₁ × r^(n−1) = ' + a + ' × ' + r + '^' + (n - 1) + ' = ' + fmt(v) + '.',
        'Số hạng thứ n = ' + a + ' × ' + r + '^' + (n - 1) + ' = ' + fmt(v) + ' (công bội ' + r + ').', 'Mỗi số hạng nhân với cùng một số.'); },
    function mid() { var x1 = R(-8, 8), y1 = R(-8, 8), x2 = x1 + 2 * R(-5, 5), y2 = y1 + 2 * R(-5, 5);
      var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      return item('mid', 'G-GPE.6 · Midpoint', 'What is the midpoint of (' + neg(x1) + ', ' + neg(y1) + ') and (' + neg(x2) + ', ' + neg(y2) + ')?', '(' + neg(mx) + ', ' + neg(my) + ')', ['(' + neg(x2 - x1) + ', ' + neg(y2 - y1) + ')', '(' + neg(x1 + x2) + ', ' + neg(y1 + y2) + ')', '(' + neg(my) + ', ' + neg(mx) + ')'], function () { return '(' + neg(R(-9, 9)) + ', ' + neg(R(-9, 9)) + ')'; },
        'Average the coordinates: ((' + neg(x1) + ' + ' + neg(x2) + ')/2, (' + neg(y1) + ' + ' + neg(y2) + ')/2) = (' + neg(mx) + ', ' + neg(my) + ').',
        'Lấy trung bình cộng từng tọa độ: (' + neg(mx) + ', ' + neg(my) + ').', 'Cộng hai hoành độ chia 2, hai tung độ chia 2.'); },
    function circ() { var r = R(2, 12), a = Math.random() < .6;
      return item(a ? 'circleA' : 'circleC', 'G-GMD.1 · Circle area & circumference', 'A circle has radius ' + r + ' cm. What is its exact ' + (a ? 'area' : 'circumference') + '?', (a ? r * r + 'π cm²' : 2 * r + 'π cm'), a ? [2 * r + 'π cm²', r + 'π cm²', 4 * r * r + 'π cm²'] : [r * r + 'π cm', r + 'π cm', 4 * r + 'π cm'], function () { return R(2, 150) + 'π' + (a ? ' cm²' : ' cm'); },
        a ? 'Area = πr² = π × ' + r + '² = ' + r * r + 'π cm².' : 'Circumference = 2πr = 2π × ' + r + ' = ' + 2 * r + 'π cm.',
        a ? 'Diện tích = π × r² = ' + r * r + 'π cm².' : 'Chu vi = 2 × π × r = ' + 2 * r + 'π cm.', a ? 'Bình phương bán kính.' : 'Nhân đôi bán kính.'); },
    function discr() { var a = R(1, 4), b = R(-8, 8), c = R(-6, 6), D = b * b - 4 * a * c;
      var sgn = function (n) { return n < 0 ? ' − ' + (-n) : ' + ' + n; };
      return item('discr', 'A-REI.4 · Discriminant', 'What is the discriminant of ' + (a === 1 ? '' : a) + 'x²' + (b ? sgn(b) + 'x' : '') + (c ? sgn(c) : '') + ' = 0?', neg(D), [neg(b * b + 4 * a * c), neg(-D), neg(b - 4 * a * c)], function () { return neg(R(-60, 80)); },
        'Δ = b² − 4ac = (' + neg(b) + ')² − 4(' + a + ')(' + neg(c) + ') = ' + neg(D) + '.',
        'Δ = b² − 4ac = ' + b * b + ' − ' + 4 * a * c + ' = ' + neg(D) + '.', 'Công thức Δ = b² − 4ac.'); },
    function poly() { var n = R(5, 10), s = (n - 2) * 180;
      var names = { 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon' };
      return item('poly', 'G-CO · Polygon angle sum', 'What is the sum of the interior angles of a ' + names[n] + ' (' + n + ' sides)?', fmt(s) + '°', [fmt(n * 180) + '°', fmt((n - 1) * 180) + '°', '360°'], function () { return fmt(R(4, 12) * 180) + '°'; },
        'Sum = (n − 2) × 180° = (' + n + ' − 2) × 180° = ' + fmt(s) + '°.',
        'Tổng các góc trong = (n − 2) × 180° = (' + n + ' − 2) × 180° = ' + fmt(s) + '°.', 'Chia đa giác thành các tam giác.'); },
    function similar() { var a = R(2, 9), k = R(2, 4), b = R(3, 12);
      return item('similar', 'G-SRT.5 · Similar triangles', 'Two triangles are similar. A side of ' + a + ' cm in the small triangle matches ' + a * k + ' cm in the big one. Another small side is ' + b + ' cm. What is its matching big side?', b * k + ' cm', [(b + a * k - a) + ' cm', b + ' cm', (b * k + k) + ' cm'], function () { return R(4, 50) + ' cm'; },
        'Scale factor = ' + a * k + ' ÷ ' + a + ' = ' + k + ', so ' + b + ' × ' + k + ' = ' + b * k + ' cm.',
        'Tỉ số đồng dạng = ' + a * k + ' : ' + a + ' = ' + k + ', nên ' + b + ' × ' + k + ' = ' + b * k + ' cm.', 'Tìm tỉ số đồng dạng trước.'); }
  ];

  function types(grade) { return (G[grade] || G[4]).map(function (f) { return f.name; }); }
  // weights: object {typeName: extraWeight} — favour types the child gets wrong
  function generate(grade, n, weightOf) {
    var list = G[grade] || G[4], out = [], guard = 0;
    var w = list.map(function (f) { return 1 + (weightOf ? weightOf(f.name) : 0); });
    var total = w.reduce(function (a, b) { return a + b; }, 0);
    while (out.length < n && guard++ < n * 10) {
      var r = Math.random() * total, i = 0; while (r > w[i]) { r -= w[i]; i++; }
      try { var it = list[Math.min(i, list.length - 1)](); if (it && new Set(it[1]).size === 4) out.push(it); } catch (e) {}
    }
    return out;
  }
  window.ANDY_GEN_MATH = { generate: generate, types: types, _G: G };
})();
