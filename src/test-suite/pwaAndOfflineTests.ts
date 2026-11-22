/**
 * Part 56 Independent PWA, Offline Resilience & Android TWA Config Verification Suite
 */

import * as fs from 'fs';
import * as path from 'path';

interface CheckResult {
  name: string;
  passed: boolean;
  details: string;
}

const checks: CheckResult[] = [];

function record(name: string, passed: boolean, details: string) {
  checks.push({ name, passed, details });
  console.log(`${passed ? '✅' : '❌'} ${name}: ${details}`);
}

async function main() {
  console.log('\n======================================================');
  console.log('🧪 PART 56: PWA, OFFLINE & ANDROID CONFIG TESTS');
  console.log('======================================================\n');

  const root = process.cwd();
  const publicDir = path.resolve(root, 'public');

  // 1. Manifest completeness & PNG icons on disk
  const manifest = JSON.parse(fs.readFileSync(path.join(publicDir, 'manifest.json'), 'utf8'));
  const any192 = manifest.icons?.find((i: any) => i.sizes === '192x192' && i.purpose === 'any' && i.type === 'image/png');
  const any512 = manifest.icons?.find((i: any) => i.sizes === '512x512' && i.purpose === 'any' && i.type === 'image/png');
  const mask512 = manifest.icons?.find((i: any) => i.sizes === '512x512' && i.purpose === 'maskable' && i.type === 'image/png');

  const iconFilesExist =
    fs.existsSync(path.join(publicDir, 'pwa-192x192.png')) &&
    fs.existsSync(path.join(publicDir, 'pwa-512x512.png')) &&
    fs.existsSync(path.join(publicDir, 'pwa-maskable-512x512.png')) &&
    fs.existsSync(path.join(publicDir, 'apple-touch-icon.png')) &&
    fs.statSync(path.join(publicDir, 'pwa-512x512.png')).size > 10000;

  const manifestOk =
    manifest.id === '/' &&
    manifest.start_url === '/' &&
    manifest.scope === '/' &&
    manifest.display === 'standalone' &&
    typeof manifest.short_name === 'string' &&
    manifest.short_name.length <= 12 &&
    Boolean(any192 && any512 && mask512) &&
    iconFilesExist;

  record(
    '1. PWA Manifest & PNG Icon Assets',
    manifestOk,
    `short_name="${manifest.short_name}" (${manifest.short_name?.length} chars), display=${manifest.display}, separated any+maskable PNGs=${Boolean(any192 && any512 && mask512)}, PNG files valid=${iconFilesExist}`
  );

  // 2. Service Worker clone race fix + cache separation + progress events
  const swText = fs.readFileSync(path.join(publicDir, 'sw.js'), 'utf8');
  const swSafeCloneOk =
    swText.includes('cloned = networkResponse.clone()') &&
    !swText.includes('await caches.open(CACHE_NAME);\n    await cache.put(request, response.clone())');
  const swSeparatedCachesOk =
    swText.includes("const APP_CACHE_NAME = 'food-science-app-v5'") &&
    swText.includes("const PYODIDE_CACHE_NAME = 'food-science-pyodide-v0.26.4'") &&
    swText.includes('KEEP_CACHES') &&
    swText.includes('isValidPyodideResponse') &&
    swText.includes('PRECACHE_PROGRESS');

  record(
    '2. Service Worker Cache Separation & Stream Clone Fix',
    swSafeCloneOk && swSeparatedCachesOk,
    `syncCloneBeforeAsyncPut=${swSafeCloneOk}, separatedPyodideCache=${swSeparatedCachesOk}`
  );

  // 3. Server 404 guard against silent 200 OK HTML fallback for missing /pyodide/*
  const serverText = fs.readFileSync(path.resolve(root, 'server.ts'), 'utf8');
  const serverGuardOk =
    serverText.includes("app.use('/pyodide', (req, res)") &&
    serverText.includes('res.status(404)') &&
    serverText.includes("filePath.endsWith('.whl')");

  record(
    '3. Server /pyodide 404 Guard (No HTML Fallthrough)',
    serverGuardOk,
    `404 guard & .whl Content-Type active=${serverGuardOk}`
  );

  // 4. Vite build output checks (dist/precache-manifest.json & dist/.well-known/assetlinks.json)
  const distDir = path.resolve(root, 'dist');
  const precachePath = path.join(distDir, 'precache-manifest.json');
  const precacheExists = fs.existsSync(precachePath);
  const precacheJson = precacheExists ? JSON.parse(fs.readFileSync(precachePath, 'utf8')) : { assets: [] };
  const hasJsCssAssets =
    Array.isArray(precacheJson.assets) &&
    precacheJson.assets.some((a: string) => a.startsWith('/assets/') && a.endsWith('.js')) &&
    precacheJson.assets.some((a: string) => a.startsWith('/assets/') && a.endsWith('.css'));

  record(
    '4. Production Precache Manifest (All Vite JS/CSS/Font Bundles)',
    precacheExists && hasJsCssAssets,
    `precache-manifest.json exists=${precacheExists}, assetCount=${precacheJson.assets?.length || 0}`
  );

  // 5. Android TWA Config & Digital Asset Links Parity
  const twa = JSON.parse(fs.readFileSync(path.resolve(root, 'twa-manifest.json'), 'utf8'));
  const assetlinks = JSON.parse(fs.readFileSync(path.join(publicDir, '.well-known/assetlinks.json'), 'utf8'));
  const twaOk =
    Boolean(twa.packageId) &&
    twa.display === 'standalone' &&
    assetlinks?.[0]?.target?.package_name === twa.packageId &&
    fs.existsSync(path.resolve(root, 'docs/ANDROID_PACKAGING.md'));

  record(
    '5. Android TWA Config & Digital Asset Links Parity',
    twaOk,
    `packageId=${twa.packageId}, assetlinks match=${assetlinks?.[0]?.target?.package_name === twa.packageId}`
  );

  // 6. Offline Gemini Chat Truthfulness & Storage 18-store Backup Coverage
  const providerText = fs.readFileSync(path.resolve(root, 'src/lib/providers/geminiClientProvider.ts'), 'utf8');
  const storageText = fs.readFileSync(path.resolve(root, 'src/lib/storage/index.ts'), 'utf8');
  const truthAndStorageOk =
    providerText.includes('OFFLINE_ERROR_FA') &&
    providerText.includes('!navigator.onLine') &&
    storageText.includes('activeStoresCount') &&
    storageText.includes('importOfflineBackup');

  record(
    '6. Offline AI Truthfulness & 18-Store Backup API',
    truthAndStorageOk,
    `offlineGuard=${providerText.includes('OFFLINE_ERROR_FA')}, importBackup=${storageText.includes('importOfflineBackup')}`
  );

  // 7. Capacitor Single-Codebase Config
  const capConfigPath = path.resolve(root, 'capacitor.config.ts');
  const capConfigExists = fs.existsSync(capConfigPath);
  const capConfigText = capConfigExists ? fs.readFileSync(capConfigPath, 'utf8') : '';
  const capConfigOk =
    capConfigExists &&
    capConfigText.includes("appId: 'ir.foodscienceai.app'") &&
    capConfigText.includes("appName: 'FoodSci AI'") &&
    capConfigText.includes("webDir: 'dist'") &&
    capConfigText.includes("androidScheme: 'https'");

  record(
    '7. Capacitor Config (Single Codebase -> dist)',
    capConfigOk,
    `exists=${capConfigExists}, appId=ir.foodscienceai.app, webDir=dist, androidScheme=https`
  );

  // 8. Android Gradle, Versioning, noCompress, Signing Config & Minimum Permissions Audit
  const appGradlePath = path.resolve(root, 'android/app/build.gradle');
  const manifestXmlPath = path.resolve(root, 'android/app/src/main/AndroidManifest.xml');
  const variablesGradlePath = path.resolve(root, 'android/variables.gradle');
  const appGradle = fs.existsSync(appGradlePath) ? fs.readFileSync(appGradlePath, 'utf8') : '';
  const manifestXml = fs.existsSync(manifestXmlPath) ? fs.readFileSync(manifestXmlPath, 'utf8') : '';
  const varsGradle = fs.existsSync(variablesGradlePath) ? fs.readFileSync(variablesGradlePath, 'utf8') : '';

  const forbiddenPerms = [
    'CAMERA',
    'RECORD_AUDIO',
    'ACCESS_FINE_LOCATION',
    'ACCESS_COARSE_LOCATION',
    'READ_CONTACTS',
    'READ_EXTERNAL_STORAGE',
    'WRITE_EXTERNAL_STORAGE',
    'READ_PHONE_STATE'
  ];
  const hasForbiddenPerms = forbiddenPerms.some((p) => manifestXml.includes(`android.permission.${p}`));
  const hasRequiredMinPerms =
    manifestXml.includes('android.permission.INTERNET') &&
    manifestXml.includes('android.permission.ACCESS_NETWORK_STATE') &&
    manifestXml.includes('android:supportsRtl="true"') &&
    manifestXml.includes('android:usesCleartextTraffic="false"');

  const gradleConfigOk =
    appGradle.includes('applicationId "ir.foodscienceai.app"') &&
    appGradle.includes('versionCode 1') &&
    appGradle.includes('versionName "1.0.0"') &&
    appGradle.includes("noCompress 'wasm', 'whl', 'zip', 'mjs', 'json'") &&
    appGradle.includes('signingConfigs') &&
    appGradle.includes('keystore.properties') &&
    varsGradle.includes('targetSdkVersion = 35') &&
    fs.existsSync(path.resolve(root, 'android/keystore.properties.example'));

  record(
    '8. Android Gradle Signing, noCompress & Minimal Permissions Audit',
    gradleConfigOk && hasRequiredMinPerms && !hasForbiddenPerms,
    `gradleOk=${gradleConfigOk}, minimalNetPerms=${hasRequiredMinPerms}, noSensitivePerms=${!hasForbiddenPerms}`
  );

  // 9. Android Branded Icons & Offline Pyodide/SciPy Readiness (Synced or Git-Clean)
  const capAssetsDir = path.resolve(root, 'android/app/src/main/assets/public');
  const hasSyncedApkAssets = fs.existsSync(capAssetsDir);
  const capPyodideDir = path.join(capAssetsDir, 'pyodide');
  const capSciPyPath = path.join(capPyodideDir, 'scipy-1.12.0-cp312-cp312-pyodide_2024_0_wasm32.whl');
  const capNumPyPath = path.join(capPyodideDir, 'numpy-1.26.4-cp312-cp312-pyodide_2024_0_wasm32.whl');
  const capWasmPath = path.join(capPyodideDir, 'pyodide.asm.wasm');
  const publicSciPyPath = path.join(publicDir, 'pyodide/scipy-1.12.0-cp312-cp312-pyodide_2024_0_wasm32.whl');
  const publicSciPySize = fs.existsSync(publicSciPyPath) ? fs.statSync(publicSciPyPath).size : 0;

  const hasAllCapIcons = ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'].every((dpi) =>
    fs.existsSync(path.resolve(root, `android/app/src/main/res/mipmap-${dpi}/ic_launcher.png`)) &&
    fs.existsSync(path.resolve(root, `android/app/src/main/res/mipmap-${dpi}/ic_launcher_round.png`)) &&
    fs.existsSync(path.resolve(root, `android/app/src/main/res/mipmap-${dpi}/ic_launcher_foreground.png`))
  );
  const restoreScriptExists = fs.existsSync(path.resolve(root, 'scripts/restore-pyodide.mjs'));

  let apkBundleOk = false;
  let bundleDetails = '';
  if (hasSyncedApkAssets) {
    const noServerLeakInApk = !fs.existsSync(path.join(capAssetsDir, 'server.cjs'));
    const capSciPySize = fs.existsSync(capSciPyPath) ? fs.statSync(capSciPyPath).size : 0;
    apkBundleOk =
      fs.existsSync(path.join(capAssetsDir, 'index.html')) &&
      fs.existsSync(capWasmPath) &&
      fs.existsSync(capNumPyPath) &&
      capSciPySize === 47107789 &&
      hasAllCapIcons &&
      noServerLeakInApk;
    bundleDetails = `mode=synced, scipyBytes=${capSciPySize}, iconsReady=${hasAllCapIcons}, noServerCjsInApk=${noServerLeakInApk}`;
  } else {
    apkBundleOk = hasAllCapIcons && restoreScriptExists && publicSciPySize === 47107789;
    bundleDetails = `mode=git-clean, publicScipyBytes=${publicSciPySize}, restoreScript=${restoreScriptExists}, iconsReady=${hasAllCapIcons}`;
  }

  record(
    '9. Android Offline Bundle Readiness & Branded Icons',
    apkBundleOk,
    bundleDetails
  );

  // 10. Windows Release Pipeline Scripts, Cross-Platform npm Scripts, Gitignore & Secrets Audit
  const winScriptsDir = path.resolve(root, 'scripts/android-windows');
  const expectedPs1 = [
    '01-check-prerequisites.ps1',
    '02-build-web.ps1',
    '03-sync-capacitor.ps1',
    '04-verify-offline-assets.ps1',
    '05-verify-scipy-sha256.ps1',
    '06-verify-no-secrets.ps1',
    '07-build-release-apk.ps1',
    '08-build-release-aab.ps1',
    '09-install-apk.ps1'
  ];
  const allPs1Exist = expectedPs1.every((f) => fs.existsSync(path.join(winScriptsDir, f)));
  const winDocExists = fs.existsSync(path.resolve(root, 'docs/WINDOWS_ANDROID_BUILD.md'));
  const pkgJson = JSON.parse(fs.readFileSync(path.resolve(root, 'package.json'), 'utf8'));
  const crossPlatformScriptsOk =
    !String(pkgJson.scripts?.['android:sync'] || '').includes('rm -f') &&
    !String(pkgJson.scripts?.clean || '').includes('rm -rf') &&
    Boolean(pkgJson.scripts?.['pyodide:restore']);
  const gradleWrapperProps = fs.readFileSync(
    path.resolve(root, 'android/gradle/wrapper/gradle-wrapper.properties'),
    'utf8'
  );
  const gradlewBatExists = fs.existsSync(path.resolve(root, 'android/gradlew.bat'));
  const gradleWrapperOk = gradlewBatExists && gradleWrapperProps.includes('gradle-8.11.1');
  const rootGitIgnore = fs.readFileSync(path.resolve(root, '.gitignore'), 'utf8');
  const gitIgnoreCleanOk =
    rootGitIgnore.includes('android/app/src/main/assets/public/') &&
    rootGitIgnore.includes('public/pyodide/*.whl');

  // Verify zero secret tokens / .env / server.cjs inside synced APK assets (when present) or dist/
  const scanDir = hasSyncedApkAssets ? capAssetsDir : distDir;
  const jsFilesDir = path.join(scanDir, 'assets');
  const jsBundleFiles = fs.existsSync(jsFilesDir)
    ? fs.readdirSync(jsFilesDir).filter((f) => f.endsWith('.js'))
    : [];
  const scanIndexHtml = fs.existsSync(path.join(scanDir, 'index.html'))
    ? fs.readFileSync(path.join(scanDir, 'index.html'), 'utf8')
    : '';
  const hasLeakedSecretInBundle =
    fs.existsSync(path.join(scanDir, '.env')) ||
    fs.existsSync(path.join(scanDir, 'keystore.properties')) ||
    /AIza[0-9A-Za-z_-]{35}|GEMINI_API_KEY|PRIVATE KEY/.test(scanIndexHtml) ||
    jsBundleFiles.some((f) => {
      const content = fs.readFileSync(path.join(jsFilesDir, f), 'utf8');
      return /AIza[0-9A-Za-z_-]{35}|GEMINI_API_KEY|-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(content);
    });

  record(
    '10. Windows PowerShell Release Pipeline, Gitignore Hygiene & Zero-Secret Audit',
    allPs1Exist && winDocExists && crossPlatformScriptsOk && gradleWrapperOk && gitIgnoreCleanOk && !hasLeakedSecretInBundle,
    `ps1Count=${expectedPs1.filter((f) => fs.existsSync(path.join(winScriptsDir, f))).length}/9, crossPlatformNpm=${crossPlatformScriptsOk}, gitIgnoreClean=${gitIgnoreCleanOk}, gradle8.11.1=${gradleWrapperOk}, zeroSecrets=${!hasLeakedSecretInBundle}`
  );

  const passed = checks.filter((c) => c.passed).length;
  const failed = checks.length - passed;
  console.log(`\nSUMMARY: ${passed}/${checks.length} Passed, ${failed} Failed`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('Fatal test failure:', err);
  process.exit(1);
});
