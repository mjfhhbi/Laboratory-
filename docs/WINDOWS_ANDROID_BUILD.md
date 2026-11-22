# راهنمای کامل ساخت APK و AAB نسخه Release روی ویندوز (PowerShell)

این راهنما مسیر دقیق و قابل اجرا برای تولید فایل‌های **Signed Release APK** و **Google Play App Bundle (AAB)** پروژه **FoodSci AI** را در سیستم‌عامل **Windows 10 / Windows 11** با **PowerShell** شرح می‌دهد.

---

## ۱. پیش‌نیازهای دقیق و سازگار

| ابزار | نسخه دقیق / الزامی | توضیح سازگاری |
| :--- | :--- | :--- |
| **Node.js** | `v20.x` یا `v22.x LTS` | اجرای Vite 6 و Capacitor CLI 7 |
| **JDK** | **JDK 21** (Eclipse Temurin / Microsoft OpenJDK 21) | الزامی برای Capacitor 7 (`JavaVersion.VERSION_21`) و Android Gradle Plugin 8.7.2 |
| **Android SDK Platform** | **Android 15 (API 35)** — `platforms;android-35` | منطبق با `compileSdkVersion = 35` و `targetSdkVersion = 35` |
| **Android Build Tools** | **`35.0.0`** — `build-tools;35.0.0` | شامل `aapt2` و `apksigner.bat` |
| **Android Platform Tools** | آخرین نسخه پایدار — `platform-tools` | شامل `adb.exe` جهت نصب و تست روی دستگاه |
| **Gradle Wrapper** | **Gradle `8.11.1`** (همراه مخزن در `android\gradlew.bat`) | نیازی به نصب جداگانه Gradle نیست؛ خودکار توسط Wrapper دریافت می‌شود |

---

## ۲. نصب پیش‌نیازها در ویندوز با PowerShell

### الف) نصب Node.js 22 LTS و JDK 21 (با `winget`)
PowerShell را باز کرده و اجرا کنید:

```powershell
winget install OpenJS.NodeJS.LTS
winget install EclipseAdoptium.Temurin.21.JDK
```

*(در صورت باز کردن ترمینال جدید پس از نصب، متغیر `JAVA_HOME` توسط نصب‌کننده Temurin تنظیم می‌شود؛ در غیر این صورت بخش ۳ را اجرا کنید.)*

### ب) نصب Android SDK 35، Build Tools 35.0.0 و Platform Tools
می‌توانید از **Android Studio (SDK Manager)** یا **Android Command-line Tools (`sdkmanager`)** استفاده کنید:

1. پکیج Command-line Tools را در مسیر `C:\Android\Sdk\cmdline-tools\latest` (یا `%LOCALAPPDATA%\Android\Sdk\cmdline-tools\latest`) قرار دهید، یا Android Studio را نصب کنید.
2. پکیج‌های دقیق موردنیاز را با PowerShell نصب کنید:

```powershell
$SdkRoot = "$env:LOCALAPPDATA\Android\Sdk"
& "$SdkRoot\cmdline-tools\latest\bin\sdkmanager.bat" `
  "platform-tools" `
  "platforms;android-35" `
  "build-tools;35.0.0"
& "$SdkRoot\cmdline-tools\latest\bin\sdkmanager.bat" --licenses
```

---

## ۳. تنظیم متغیرهای محیطی و بررسی نسخه‌ها (PowerShell)

برای تنظیم دائمی متغیرهای محیطی کاربر در ویندوز (مسیرهای زیر را متناسب با مسیر واقعی JDK 21 و SDK خود تنظیم کنید):

```powershell
$Jdk21Path = (Get-ChildItem "C:\Program Files\Eclipse Adoptium" -Directory -Filter "jdk-21*" | Select-Object -First 1).FullName
$SdkPath = "$env:LOCALAPPDATA\Android\Sdk"

[Environment]::SetEnvironmentVariable("JAVA_HOME", $Jdk21Path, "User")
[Environment]::SetEnvironmentVariable("ANDROID_HOME", $SdkPath, "User")
[Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $SdkPath, "User")

$UserPath = [Environment]::GetEnvironmentVariable("Path", "User")
$AddPaths = @("$Jdk21Path\bin", "$SdkPath\platform-tools", "$SdkPath\build-tools\35.0.0")
foreach ($p in $AddPaths) {
    if ($UserPath -notlike "*$p*") { $UserPath = "$UserPath;$p" }
}
[Environment]::SetEnvironmentVariable("Path", $UserPath, "User")
```

**پنجره PowerShell را ببندید و دوباره باز کنید**، سپس نسخه‌ها را بررسی کنید:

```powershell
node -v
java -version
keytool -help | Select-Object -First 2
adb version
.\android\gradlew.bat -p android --version
```

و با اسکریپت بررسی پیش‌نیازهای پروژه تایید کامل بگیرید:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\android-windows\01-check-prerequisites.ps1
```

---

## ۴. بررسی تنظیمات پیش از ساخت (VITE_API_BASE_URL، Pyodide، WebView و صفر بودن Secret)

1. **آدرس سرور آنلاین (`VITE_API_BASE_URL`):**
   - فایل‌های Pyodide و موتورهای مهندسی/آزمایشگاهی **بدون اینترنت** از درون `assets/public/pyodide/` اجرا می‌شوند.
   - اگر می‌خواهید در حالت آنلاین نیز بخش **چت هوش مصنوعی Gemini** درون APK به سرور بک‌اند متصل شود، هنگام ساخت وب آدرس HTTPS سرور مستقر را بدهید:
     ```powershell
     $env:VITE_API_BASE_URL = "https://ais-pre-6a6myoakvhla3xjetelp5j-246919081791.europe-west2.run.app"
     ```
   - اگر `VITE_API_BASE_URL` خالی بماند، APK کاملاً مستقل و آفلاین کار می‌کند و در صفحه چت پیام فارسی شفاف درباره نبود نشانی سرور نمایش داده می‌شود.
   - **ممنوعیت امنیتی:** هرگز متغیر `VITE_GEMINI_API_KEY` یا کلید `GEMINI_API_KEY` را داخل محیط Build کلاینت قرار ندهید؛ کلید Gemini فقط روی سرور (`server.ts`) نگهداری می‌شود.
2. **مسیرهای Pyodide و WebView:**
   - `src/lib/python/pythonWorker.ts` فایل‌های Pyodide را صرفاً از `${self.location.origin}/pyodide/` بارگذاری می‌کند (بدون CDN خارجی).
   - `capacitor.config.ts` پروتکل `androidScheme: 'https'`، مقدار `allowMixedContent: false` و `webContentsDebuggingEnabled: false` را اعمال می‌کند.
   - `android/app/build.gradle` با `noCompress 'wasm', 'whl', 'zip', 'mjs', 'json'` مانع فشرده‌سازی مجدد و خرابی چرخ‌های Python و فایل WASM می‌شود.

### ۴.۱ بازیابی خودکار فایل‌های حجیم Pyodide پس از Clone از GitHub
برای جلوگیری از محدودیت حجم فایل در GitHub، فایل‌های دودویی حجیم `public/pyodide/*.whl|*.zip|*.wasm` و خروجی همگام‌سازی‌شده `android/app/src/main/assets/public/` در `.gitignore` قرار دارند. هنگام اجرا روی ویندوز پس از `git clone`، اسکریپت `02-build-web.ps1` (و همچنین `npm run android:sync`) به‌طور خودکار اسکریپت `node scripts/restore-pyodide.mjs` را اجرا می‌کند تا تمام فایل‌های Pyodide 0.26.4 و SciPy 1.12.0 با تطابق کامل `SHA-256` دریافت و بازیابی شوند (یا می‌توانید دستی `npm run pyodide:restore` بزنید).

---

## ۵. ساخت و تنظیم Keystore امضای Release (بدون ورود رمز به Git)

اگر هنوز Keystore ندارید، یک بار دستور زیر را در ریشه پروژه اجرا کنید (رمز قوی انتخاب کرده و فایل `.keystore` را در جای امن پشتیبان بگیرید):

```powershell
keytool -genkey -v -keystore android-signing.keystore -alias foodscienceai `
  -keyalg RSA -keysize 2048 -validity 10000
```

سپس فایل الگو را کپی کرده و رمزهای واقعی خود را داخل `android\keystore.properties` قرار دهید (این فایل و پسوندهای `*.keystore` / `*.jks` در `.gitignore` مسدود شده‌اند و وارد Git نمی‌شوند):

```powershell
Copy-Item .\android\keystore.properties.example .\android\keystore.properties
notepad .\android\keystore.properties
```

محتوای `android\keystore.properties`:
```properties
storeFile=../android-signing.keystore
storePassword=YOUR_STORE_PASSWORD
keyAlias=foodscienceai
keyPassword=YOUR_KEY_PASSWORD
```

*(جایگزین بدون فایل در CI/CD: می‌توانید متغیرهای محیطی `FOODSCI_KEYSTORE_PATH`، `FOODSCI_KEYSTORE_PASS`، `FOODSCI_KEY_ALIAS` و `FOODSCI_KEY_PASS` را تنظیم کنید.)*

---

## ۶. اجرای مرحله‌به‌مرحله اسکریپت‌های مستقل PowerShell تا تولید APK و AAB

در ریشه مخزن پروژه اجرا کنید:

```powershell
# ۱. بررسی پیش‌نیازهای ویندوز (JDK 21, SDK 35, Build Tools 35.0.0, Platform Tools, Gradle)
powershell -ExecutionPolicy Bypass -File .\scripts\android-windows\01-check-prerequisites.ps1

# ۲. نصب وابستگی‌ها (فقط بار اول یا پس از تغییر package.json)
npm ci

# ۳. ساخت نسخه تولیدی وب (در صورت نیاز به چت آنلاین، -ApiBaseUrl را بدهید)
powershell -ExecutionPolicy Bypass -File .\scripts\android-windows\02-build-web.ps1 `
  -ApiBaseUrl "https://ais-pre-6a6myoakvhla3xjetelp5j-246919081791.europe-west2.run.app"

# ۴. همگام‌سازی Capacitor و حذف server.cjs از دارایی‌های اندروید
powershell -ExecutionPolicy Bypass -File .\scripts\android-windows\03-sync-capacitor.ps1

# ۵. بررسی کامل دارایی‌های آفلاین و پیکربندی WebView/Manifest
powershell -ExecutionPolicy Bypass -File .\scripts\android-windows\04-verify-offline-assets.ps1

# ۶. بررسی فایل واقعی SciPy (۴۷٬۱۰۷٬۷۸۹ بایت) و تطابق SHA-256 با pyodide-lock.json
powershell -ExecutionPolicy Bypass -File .\scripts\android-windows\05-verify-scipy-sha256.ps1

# ۷. بررسی عدم وجود server.cjs، فایل .env و هرگونه API Key یا Secret در خروجی
powershell -ExecutionPolicy Bypass -File .\scripts\android-windows\06-verify-no-secrets.ps1

# ۸. تولید APK امضاشده Release + بررسی داخلی محتویات Pyodide/SciPy + تایید امضا با apksigner
powershell -ExecutionPolicy Bypass -File .\scripts\android-windows\07-build-release-apk.ps1

# ۹. تولید AAB امضاشده Release (Google Play) + بررسی محتویات و امضا با jarsigner
powershell -ExecutionPolicy Bypass -File .\scripts\android-windows\08-build-release-aab.ps1

# ۱۰. نصب APK نهایی روی گوشی یا شبیه‌ساز متصل با ADB و اجرای برنامه
powershell -ExecutionPolicy Bypass -File .\scripts\android-windows\09-install-apk.ps1
```

### مسیر خروجی‌های نهایی
* **APK امضاشده Release:** `android\app\build\outputs\apk\release\app-release.apk`
* **AAB امضاشده Release:** `android\app\build\outputs\bundle\release\app-release.aab`
