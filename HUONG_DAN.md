# Hướng dẫn đưa Andy's Worlds lên App Store (không cần máy Mac)

Làm **từng bước một**. Xong bước nào thì đánh dấu ✅ rồi mới làm bước kế tiếp.

## Cần chuẩn bị
- Tài khoản **Apple Developer**: 99 đô/năm. Đăng ký ở https://developer.apple.com/programs/ (Apple có thể mất 1–2 ngày để duyệt).
- Tài khoản **GitHub**: bạn đã có ✅
- Tài khoản **Codemagic** (miễn phí 500 phút build/tháng): https://codemagic.io, bấm "Sign up with GitHub".

---

## GIAI ĐOẠN 1 — Đưa code lên GitHub
**Bước 1.** Vào https://github.com/new
- Repository name: `andys-worlds-app`
- Chọn **Private**
- Bấm **Create repository**

**Bước 2.** Đưa các file lên. Có 2 cách:
- Cách A (dễ nhất): kết nối GitHub với Claude (claude.ai → Settings → Connectors → GitHub), rồi nhắn Claude "đưa code lên repo andys-worlds-app". Claude sẽ tự đưa lên.
- Cách B: giải nén file ZIP. Trong trang repo, bấm **"uploading an existing file"** rồi kéo **tất cả file và thư mục bên trong** thư mục `andys-worlds-app` vào trang → bấm **Commit changes**.

**Bước 3.** Mở trang chính sách quyền riêng tư (App Store bắt buộc):
- Trong repo → **Settings** → **Pages**
- Source: **Deploy from a branch** · Branch: **main** · Folder: **/docs** → **Save**
- Đợi khoảng 2 phút. Link sẽ có dạng: `https://TÊN-GITHUB.github.io/andys-worlds-app/`
- ⚠️ Repo **Private** chỉ dùng được Pages khi có gói GitHub trả phí. Nếu không có, cách đơn giản nhất là kéo thư mục `docs` thả vào https://app.netlify.com/drop để lấy link.

## GIAI ĐOẠN 2 — Chuẩn bị bên Apple
**Bước 4.** Đăng ký mã app (Bundle ID): https://developer.apple.com/account/resources/identifiers/list
- Bấm **+** → **App IDs** → **App** → Continue
- Description: `Andys Worlds` · Bundle ID: **Explicit** · `com.ktsunshine.andysworlds`
- Continue → Register

**Bước 5.** Tạo app trong App Store Connect: https://appstoreconnect.apple.com → **Apps** → **+** → **New App**
- Platform: iOS · Name: `Andy's Worlds` · Language: English (U.S.)
- Bundle ID: chọn `com.ktsunshine.andysworlds` · SKU: `andysworlds001`

**Bước 6.** Tạo "chìa khóa API" cho Codemagic:
- App Store Connect → **Users and Access** → **Integrations** → **App Store Connect API** → **+**
- Name: `Codemagic` · Access: **App Manager** → Generate
- Tải file **.p8** về (chỉ tải được 1 lần, cất kỹ). Ghi lại **Issuer ID** và **Key ID**.

## GIAI ĐOẠN 3 — Build app bằng Codemagic
**Bước 7.** Codemagic → **Team settings** → **Integrations** → **Developer Portal** → **Connect**
- Name: **AndyWorldsKey** (phải viết đúng như vậy)
- Dán Issuer ID, Key ID, tải file .p8 lên → Save

**Bước 8.** Codemagic → **Team settings** → **Code signing identities**
- Tab **iOS certificates** → **Generate certificate** → loại **Apple Distribution** → chọn key AndyWorldsKey
- Tab **iOS provisioning profiles** → **Fetch profiles** → chọn profile **App Store** cho `com.ktsunshine.andysworlds` (nếu chưa có, bấm tạo mới)

**Bước 9.** Codemagic → **Add application** → chọn GitHub → chọn repo `andys-worlds-app` → loại dự án: **Other** (codemagic.yaml)

**Bước 10.** Bấm **Start new build** → workflow **Andy's Worlds - App Store** → Start.
Đợi khoảng 15–25 phút. Nếu báo lỗi: tải file log và gửi cho Claude.

## GIAI ĐOẠN 4 — Thử trên iPhone và gửi Apple duyệt
**Bước 11.** Build thành công thì app tự lên **TestFlight**. Cài app **TestFlight** trên iPhone để chơi thử.

**Bước 12.** Trong App Store Connect, điền trang app theo file `store/STORE_LISTING.md` (tên, mô tả, từ khóa, ảnh chụp, quyền riêng tư, độ tuổi).

**Bước 13.** Chọn bản build vừa lên → **Add for Review** → **Submit**. Apple thường duyệt trong 1–3 ngày.

---
## Lưu ý
- Apple có thể từ chối app "quá giống trang web" (quy định 4.2). Game này có thể chơi khi không có mạng, có rung phản hồi và nhiều tính năng, nên khả năng được duyệt tốt. Nếu bị từ chối, gửi thư của Apple cho Claude để sửa.
- Muốn sửa game sau này: sửa file `www/index.html` hoặc `www/assets/questions.js` trên GitHub → Codemagic tự build bản mới.
