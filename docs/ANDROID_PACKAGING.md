# راهنمای تبدیل FoodSci AI به اپلیکیشن اندروید (تک‌کدبیس با Capacitor و گزینه TWA)

این مستند معماری یکپارچه **Web App + PWA + Android App (APK / AAB)** را با حفظ یک کدبیس واحد React/Vite شرح می‌دهد.

---

## ۱. روش منتخب نهایی: Capacitor به عنوان معماری اصلی اندروید
در مقایسه فنی بین **Capacitor** و **TWA (Trusted Web Activity)**، **Capacitor (`@capacitor/android`)** به دلایل زیر انتخاب شد:

1. **اجرای واقعی کاملاً آفلاین حتی پیش از اولین اتصال اینترنت پس از نصب APK:**
   - در **TWA**، برنامه فقط پوسته Chrome روی دامنه HTTPS از راه دور است؛ اگر کاربر بلافاصله پس از نصب APK بدون اینترنت وارد برنامه شود، مرورگر نمی‌تواند HTML/JS/Service Worker/Pyodide را بارگیری کند.
   - در **Capacitor**، خروجی ساخت واحد `dist/` (شامل کدهای React/Vite، فونت‌های KaTeX، استانداردها و کل بسته‌های محلی `pyodide/` شامل Python 3.12، NumPy، SciPy و SymPy) مستقیماً در مسیر `android/app/src/main/assets/public/` درون APK/AAB بسته‌بندی می‌شود؛ بنابراین برنامه **از همان اولین اجرا در حالت کاملاً آفلاین** کار می‌کند.
2. **حفظ تک‌کدبیس واحد بدون بازنویسی رابط کاربری:**
   - هیچ UI جداگانه‌ای برای اندروید نوشته نشده است؛ `npm run android:sync` همان خروجی Vite را در پروژه اندروید همگام‌سازی می‌کند.
3. **حداقل دسترسی‌ها (Minimum Permissions):**
   - فایل `android/app/src/main/AndroidManifest.xml` فقط مجوزهای `INTERNET` و `ACCESS_NETWORK_STATE` را دارد (هیچ دسترسی به دوربین، موقعیت مکانی، مخاطبین، میکروفون یا حافظه خارجی درخواست نمی‌شود).
4. **استقلال از نوار آدرس مرورگر و محدودیت‌های دامنه/احراز هویت:**
   - اپ با پروتکل محلی `https://localhost` (`androidScheme: 'https'`) اجرا می‌شود و `IndexedDB`، `WebAssembly` و `Web Worker` به‌صورت کامل پشتیبانی می‌شوند.

*(تبصره: برای توزیع سبک آنلاین‌محور ~۳ مگابایتی نیز پیکربندی `/twa-manifest.json` و `/public/.well-known/assetlinks.json` به‌روز نگه‌داشته شده است، اما TWA پیش از اولین اتصال اینترنت امکان اجرای آفلاین ندارد.)*

---

## ۲. ساختار زیرساخت Android ایجادشده در مخزن
- `/capacitor.config.ts` — شناسه یکتا `ir.foodscienceai.app`، نام `FoodSci AI`، مسیر `webDir: 'dist'` و `androidScheme: 'https'`
- `/android/build.gradle` و `/android/variables.gradle` — Gradle (`com.android.tools.build:gradle:8.7.2`)، `minSdkVersion = 23`، `compileSdkVersion = 35`، `targetSdkVersion = 35`
- `/android/app/build.gradle` — `applicationId "ir.foodscienceai.app"`، `versionCode 1`، `versionName "1.0.0"`، تنظیم `noCompress 'wasm', 'whl', 'zip', 'mjs', 'json'` (برای سلامت لود فایل‌های Pyodide WASM/Wheel درون APK)، حذف خودکار `server.cjs` از دارایی‌های APK و پیکربندی امضای Release (`signingConfigs.release`)
- `/android/app/src/main/AndroidManifest.xml` — حداقل مجوزهای شبکه و پشتیبانی کامل RTL
- `/android/app/src/main/res/mipmap-*` و `/android/app/src/main/res/drawable*/splash.png` — آیکون‌ها و صفحه اسپلش اختصاصی `FoodSci AI` در تمام چگالی‌های `mdpi` تا `xxxhdpi`
- `/android/keystore.properties.example` — الگوی امن تنظیم امضای دیجیتال Release (بدون قرار دادن رمز یا کلید در گیت)

---

## ۳. پیش‌نیازهای ساخت باینری APK / AAB (روی سیستم دارای Android SDK)
*(در محیط کانتینر فعلی Java JDK، Gradle و Android SDK نصب نیستند؛ بنابراین ساخت باینری `.apk` / `.aab` و تست `adb` روی شبیه‌ساز باید در سیستم توسعه‌دهنده یا CI دارای پیش‌نیازهای زیر اجرا شود.)*

- **Java JDK 21** (الزامی برای Capacitor 7 و Android Gradle Plugin 8.7.2 و SDK 35)
- **Android SDK** شامل:
  - `platforms;android-35`
  - `build-tools;35.0.0`
  - `platform-tools` (`adb`)
- متغیرهای محیطی: `JAVA_HOME` و `ANDROID_HOME` (یا `ANDROID_SDK_ROOT`)

---

## ۴. دستورات دقیق همگام‌سازی، امضای Release و تولید APK و AAB

### گام ۱: همگام‌سازی کدبیس وب با پروژه اندروید
اگر اپ قرار است در حالت آنلاین نیز با سرور بک‌اند چت Gemini ارتباط برقرار کند، پیش از ساخت آدرس سرور مستقر را در متغیر `VITE_API_BASE_URL` قرار دهید (برای استفاده صرفاً آفلاین، خالی بگذارید):

```bash
export VITE_API_BASE_URL="https://ais-pre-6a6myoakvhla3xjetelp5j-246919081791.europe-west2.run.app"
npm run android:sync
```

### گام ۲: ساخت Keystore امضای دیجیتال Release (یک‌بار)
```bash
keytool -genkey -v -keystore android-signing.keystore -alias foodscienceai \
  -keyalg RSA -keysize 2048 -validity 10000
```
سپس فایل الگو را کپی و مشخصات واقعی Keystore خود را وارد کنید (این فایل در `.gitignore` است و هرگز وارد مخزن نمی‌شود):
```bash
cp android/keystore.properties.example android/keystore.properties
```

### گام ۳: ساخت APK و AAB قابل انتشار (Release)
```bash
cd android
./gradlew assembleRelease bundleRelease
```

مسیر خروجی‌های نهایی پس از اجرای موفق Gradle:
- **فایل APK (نصب مستقیم روی گوشی):**
  `android/app/build/outputs/apk/release/app-release.apk`
- **فایل AAB (انتشار در Google Play / کافه‌بازار / مایکت):**
  `android/app/build/outputs/bundle/release/app-release.aab`

*(برای نصب و بررسی روی گوشی یا شبیه‌ساز متصل با `adb`):*
```bash
adb install -r android/app/build/outputs/apk/release/app-release.apk
adb logcat -s Capacitor Console chromium AndroidRuntime
```

---

## ۵. محدودیت‌های فنی و حجمی مهم
1. به‌دلیل همراه داشتن کامل بسته‌های آفلاین `Pyodide + NumPy + SciPy + Pandas + Matplotlib + SymPy` (~۱۴۵ مگابایت) درون `assets/public/pyodide/`، حجم APK نهایی حدود ۱۵۵ تا ۱۶۵ مگابایت خواهد بود. برای انتشار در فروشگاه Google Play حتماً از خروجی **Android App Bundle (`.aab`)** استفاده کنید (محدودیت ماژول پایه فشرده Play تا ۲۰۰ مگابایت است؛ در صورت نیاز به کوچک‌سازی پایه در آینده می‌توان بسته‌های علمی را به Play Asset Delivery یا دانلود انتخابی درون‌پوسته منتقل کرد).
2. در حالت کاملاً آفلاین، **گفتگوی جدید با Gemini** نیازمند اینترنت است و در غیاب آن پیام خطای فارسی شفاف نمایش داده می‌شود؛ اما تاریخچه چت‌های قبلی، محاسبات مهندسی، آزمایشگاه، استانداردها و Python/SciPy از لحظه اول بدون اینترنت اجرا می‌شوند.
3. برای راهنمای گام‌به‌گام ویندوز و اسکریپت‌های مستقل PowerShell (بررسی پیش‌نیازها، صحت‌سنجی SHA-256 چرخ SciPy، ممیزی نبود Secret و ساخت Release APK/AAB)، فایل **`docs/WINDOWS_ANDROID_BUILD.md`** و پوشه **`scripts/android-windows/`** را ببینید.
