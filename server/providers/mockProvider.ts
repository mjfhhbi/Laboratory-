import { AIProvider, ChatRequestDto, ChatResponseDto, StreamChunkDto } from '../types';

export class MockAIProvider implements AIProvider {
  public name = 'FoodScience Mock Provider (Offline / Simulation)';
  public modelId = 'FoodScience-RuleEngine-v5 (Offline)';

  public async generateResponse(request: ChatRequestDto, signal?: AbortSignal): Promise<ChatResponseDto> {
    if (signal?.aborted) {
      throw new Error('درخواست توسط کاربر لغو گردید.');
    }

    // Simulate brief realistic processing delay
    await new Promise((resolve) => setTimeout(resolve, 350));

    const userText = request.message.trim().toLowerCase();
    const convId = request.conversationId;
    const nowIso = new Date().toISOString();

    // 1. Water activity / Shelf life / Isotherm query
    if (userText.includes('فعالیت آبی') || userText.includes('water activity') || userText.includes('aw') || userText.includes('ایزوترم')) {
      return {
        conversationId: convId,
        model: this.modelId,
        timestamp: nowIso,
        reply: `### تحلیل فعالیت آبی ($a_w$) و پایداری مواد غذایی

فعالیت آبی یکی از پارامترهای ترمودینامیکی کلیدی در کنترل کیفیت و تعیین ماندگاری مواد غذایی است که بر اساس نسبت فشار بخار آب نمونه به آب خالص در دمای یکسان تعریف می‌شود:

$$\\text{a}_w = \\frac{p}{p_0} = \\frac{\\text{ERH}}{100}$$

#### ۱. حداقل $a_w$ جهت رشد میکروارگانیسم‌ها

| میکروارگانیسم | حداقل فعالیت آبی ($a_w$) | مثال محصول در معرض فساد |
| :--- | :--- | :--- |
| **باکتری‌های بیماری‌زا** (*Clostridium botulinum*, *Salmonella*) | $0.93 - 0.95$ | گوشت تازه، شیر، سس‌های رقیق |
| **استافیلوکوکوس اورئوس** (*Staphylococcus aureus*) | $0.85$ (هوازی) | پنیر، گوشت‌های فرآوری شده |
| **مخمرهای اسموفیل** | $0.60 - 0.62$ | عسل، مربا، شیره‌های تغلیظ شده |
| **کپک‌های خشکی‌دوست** (*Xerophilic fungi*) | $0.65$ | آرد، غلات خشک، مغزیجات |

#### ۲. اسکریپت محاسبه معادله GAB برای رسم ایزوترم جذب رطوبت:

\`\`\`python
# محاسبه رطوبت بر اساس مدل Guggenheim-Anderson-de Boer (GAB)
def calculate_gab_moisture(aw, m0, c, k):
    """
    aw: Water Activity (0 to 1)
    m0: Monolayer moisture content (g water / 100g dry solids)
    c: Guggenheim constant related to heat of sorption
    k: Factor correcting properties of multilayer molecules
    """
    numerator = m0 * c * k * aw
    denominator = (1 - k * aw) * (1 - k * aw + c * k * aw)
    return numerator / denominator

# مثال برای پودر شیر خشک: m0=4.2%, C=12.5, K=0.88
aw_test = 0.35
equilibrium_moisture = calculate_gab_moisture(aw_test, 4.2, 12.5, 0.88)
print(f"درصد رطوبت تعادلی در aw={aw_test}: {equilibrium_moisture:.2f}%")
\`\`\`

> **نکته استاندارد (INSO):** جهت جلوگیری از واکنش‌های قهوه‌ای‌شدن غیرآنزیمی (میلارد)، توصیه می‌شود $a_w$ در محدوده $0.2 - 0.3$ تثبیت گردد.`,
        suggestedQuestions: [
          'روش اندازه‌گیری ایزوترم رطوبت با مدل BET چیست؟',
          'حدود مجاز فعالیت آبی در استانداردهای INSO برای خشکبار چقدر است؟',
          'چگونه $a_w$ را با استفاده از افزودن گلیسرول یا پلی‌ال‌ها کاهش دهیم؟'
        ],
        references: ['INSO-672', 'AOAC 978.18', 'Fennema Food Chemistry (5th Ed)']
      };
    }

    // 2. Pasteurization / Thermal processing / D-value
    if (userText.includes('پاستوریزه') || userText.includes('حرارت') || userText.includes('d-value') || userText.includes('f0') || userText.includes('استریل') || userText.includes('شیر')) {
      return {
        conversationId: convId,
        model: this.modelId,
        timestamp: nowIso,
        reply: `### فرآیند حرارتی و سینتیک غیرفعال‌سازی میکروبی (Thermal Processing)

در مهندسی فرآوری مواد غذایی، ارزیابی کفایت فرآیند حرارتی بر پایه معادلات لگاریتمی مرگ حرارتی میکروارگانیسم‌های هدف صورت می‌گیرد.

#### ۱. معادلات پایه سینتیک حرارتی

* **ضریب مرگ حرارتی ($D$-Value):** زمان مورد نیاز در دمای مشخص جهت کاهش ۹۰ درصدی (۱ سیکل لگاریتمی) جمعیت میکروبی:
  $$D_T = \\frac{t}{\\log N_0 - \\log N}$$

* **ضریب حساسیت به دما ($z$-Value):** تغییرات دمای لازم جهت تغییر ۱۰ برابری مقدار $D$:
  $$z = \\frac{T_2 - T_1}{\\log D_1 - \\log D_2}$$

* **ارزش استریلیزاسیون ($F_0$):** معادل زمان فرآیند در دمای مرجع $121.1^\\circ\\text{C}$ با فرض $z = 10^\\circ\\text{C}$:
  $$F_0 = \\int_0^t 10^{\\frac{T(t) - 121.1}{z}} \\, dt$$

#### ۲. جدول شرایط پاستوریزاسیون شیر بر اساس استاندارد INSO 1629:

| روش فرآوری | دما ($^\\circ\\text{C}$) | زمان نگهداری ($t$) | میکروارگانیسم هدف |
| :--- | :--- | :--- | :--- |
| **LTLT (دسته‌ای)** | $63 - 65^\\circ\\text{C}$ | $30\\text{ min}$ | *Coxiella burnetii* |
| **HTST (مداوم)** | $72 - 75^\\circ\\text{C}$ | $15 - 20\\text{ s}$ | *Mycobacterium tuberculosis* |
| **UHT (فرا دما)** | $137 - 142^\\circ\\text{C}$ | $2 - 4\\text{ s}$ | اسپور *Bacillus stearothermophilus* |

\`\`\`typescript
// تابع محاسبه زمان لازم برای کاهش ۱۲ سیکل لگاریتمی (12D Concept)
function calculateSterilizationTime(D121: number, initialCount: number, targetCount: number): number {
  const logReduction = Math.log10(initialCount) - Math.log10(targetCount);
  return D121 * logReduction;
}

// مثال برای کلستریدیوم بوتولینوم با D_121 = 0.21 min:
const requiredTimeMin = calculateSterilizationTime(0.21, 1e12, 1);
console.log("زمان استریلیزاسیون مورد نیاز:", requiredTimeMin.toFixed(2), "دقیقه");
\`\`\``,
        suggestedQuestions: [
          'چگونه ارزش پختاری ($C_0$) را همزمان با $F_0$ بهینه کنیم؟',
          'تست فسفاتاز قلیایی (Alkaline Phosphatase) برای تایید پاستوریزاسیون شیر چیست؟',
          'محاسبه $z$-value برای باکتری‌های اسپورزای مقاوم به حرارت'
        ],
        references: ['INSO-1629', 'Codex CAC/RCP 57-2004', 'Heldman Food Process Engineering']
      };
    }

    // 3. Emulsion / Mayonnaise / Hydrocolloids
    if (userText.includes('مایونز') || userText.includes('امولسیون') || userText.includes('هیدروکلوئید') || userText.includes('سس') || userText.includes('صمغ')) {
      return {
        conversationId: convId,
        model: this.modelId,
        timestamp: nowIso,
        reply: `### فرمولاسیون سیستم‌های امولسیونی و هیدروکلوئیدها (O/W Emulsion)

سس مایونز و سس‌های سالاد از نوع امولسیون روغن در آب (**Oil-in-Water**) با کسر حجمی فاز پراکنده بالا ($\\phi > 0.74$ در مایونز سنتی) هستند.

#### ۱. فرمولاسیون پیشنهادی مایونز کم‌چرب (Low-Fat 30% Oil)

| جزء فرمولاسیون | درصد وزنی ($w/w\\%$) | نقش عملکردی |
| :--- | :--- | :--- |
| **روغن آفتابگردان / کانولا** | $30.0\\%$ | فاز چربی و ایجاد بافت کرمی |
| **آب تصفیه شده** | $54.2\\%$ | فاز پیوسته |
| **نشاسته اصلاح‌شده (Modified Starch)** | $3.5\\%$ | قوام‌دهنده حرارتی و جایگزین بافت چربی |
| **صمغ زانتان (Xanthan Gum)** | $0.3\\%$ | افزایش رفتار رقیق‌شونده با برش (Shear-thinning) |
| **زرده تخم‌مرغ پاستوریزه** | $4.0\\%$ | امولسیفایر اولیه (لسیتین و لیپوپروتئین‌ها) |
| **سرکه سفید ($10\\%$)** | $3.5\\%$ | کاهش pH به کمتر از $4.1$ جهت ایمنی میکروبی |
| **شکر و نمک طعام** | $3.5\\%$ | طعم‌دهی و تنظیم فشار اسمزی |
| **سس خردل و پایدارکننده** | $1.0\\%$ | کمک‌امولسیفایر طبیعی و طعم |

#### ۲. پایداری امولسیون و قانون استوکس (Stokes' Law)

سرعت دوفاز شدن یا خامه‌ای‌شدن (Creaming Velocity) طبق قانون زیر محاسبه می‌شود:

$$v = \\frac{2 r^2 (\\rho_p - \\rho_f) g}{9 \\eta}$$

* $r$: شعاع قطرات روغن (هدف صنعتی: $< 3 \\,\\mu\\text{m}$)
* $\\rho_p - \\rho_f$: اختلاف دانسیته فاز روغنی و آبی
* $\\eta$: ویسکوزیته فاز پیوسته (افزایش یافته توسط هیدروکلوئیدها)

\`\`\`json
{
  "qc_targets": {
    "ph": { "min": 3.8, "max": 4.1 },
    "viscosity_cp": { "target": 28000, "spindle": "Brookfield T-C @ 10 rpm" },
    "stability_centrifuge": "> 98% emulsion retention (3000 rpm, 30 min)"
  }
}
\`\`\``,
        suggestedQuestions: [
          'استفاده از پروتئین ایزوله نخود و سویا به عنوان امولسیفایر گیاهی مایونز وگان',
          'آزمون سانتریفیوژ و پایداری حرارتی امولسیون مطابق استاندارد INSO 2454',
          'تنظیم عدد HLB برای ترکیب توئین و اسپان در امولسیون‌های غذایی'
        ],
        references: ['INSO-2454', 'McClements Food Emulsions (3rd Ed)', 'AOAC 966.16']
      };
    }

    // 4. Default Comprehensive Food Science Response
    return {
      conversationId: convId,
      model: this.modelId,
      timestamp: nowIso,
      reply: `### راهنمای مهندسی صنایع غذایی و کنترل کیفیت

پرسش شما دریافت گردید: **«${request.message}»**

در سامانه **Food Science AI**، تحلیل‌های تخصصی بر اساس مراجع معتبر علمی (کدکس بین‌المللی، استانداردهای ملی ایران INSO، روش‌های آزمون AOAC و مبانی شیمی و مهندسی مواد غذایی) دسته‌بندی می‌شوند:

#### ۱. حوزه‌های تحلیلی مرتبط:
* **فرمولاسیون و توسعه محصول (R&D):** بالانس مواد جامد، تنظیم بریکس، جایگزینی چربی و قند، و بهینه‌سازی رئولوژی.
* **کنترل کیفیت و آزمون‌های شیمیایی (QC/QA):** اندازه‌گیری اسیدیته تیترپذیر (TA)، فعالیت آبی ($a_w$)، پراکسید، و pH سنجی.
* **طراحی فرآیندهای حرارتی و مکانیکی:** محاسبات پاستوریزاسیون ($D, z, F_0$)، پمپاژ و هموژنیزاسیون.
* **ایمنی غذایی و استانداردها:** طراحی سیستم‌های HACCP، شناسایی نقاط کنترل بحرانی (CCP) و آزمون‌های میکروبیولوژی.

#### ۲. فرمول عمومی محاسبه بالانس جرمی (Mass Balance):

$$\\sum \\dot{m}_{\\text{in}} = \\sum \\dot{m}_{\\text{out}} + \\frac{dM_{\\text{system}}}{dt}$$

\`\`\`text
[مواد اولیه ورودی] ──> [فرآیند اختلاط / حرارت / تغلیظ] ──> [محصول نهایی] + [ضایعات / تبخیر]
\`\`\`

> 💡 **راهنما:** می‌توانید سوالات دقیق‌تری در مورد فرمولاسیون محصولات خاص (لبنی، کنسروی، فرآورده‌های گوشتی، سس‌ها، نوشیدنی‌ها یا غلات) یا کدهای استانداردهای ملی مطرح فرمایید.`,
      suggestedQuestions: [
        'محاسبه بریکس و اسیدیته در خط تولید آبمیوه و نوشیدنی',
        'کنترل بار میکروبی و تست سالمونلا طبق استاندارد INSO',
        'طراحی سیستم پاستوریزاسیون مداوم HTST'
      ],
      references: ['INSO Standards Catalog', 'Codex Alimentarius', 'Fennema Food Chemistry']
    };
  }

  public async generateStream(
    request: ChatRequestDto,
    onChunk: (chunk: StreamChunkDto) => void,
    signal?: AbortSignal
  ): Promise<ChatResponseDto> {
    const fullResponse = await this.generateResponse(request, signal);
    const replyText = fullResponse.reply;

    // Simulate realistic streaming chunks
    const words = replyText.split(/(\s+)/);
    let accumulated = '';
    const chunkSize = 4;

    for (let i = 0; i < words.length; i += chunkSize) {
      if (signal?.aborted) {
        throw new Error('درخواست توسط کاربر لغو گردید.');
      }

      const slice = words.slice(i, i + chunkSize).join('');
      accumulated += slice;

      onChunk({
        conversationId: request.conversationId,
        chunk: slice,
        fullText: accumulated,
        done: false,
        model: this.modelId
      });

      // Small delay between simulated chunks
      await new Promise((r) => setTimeout(r, 25));
    }

    onChunk({
      conversationId: request.conversationId,
      chunk: '',
      fullText: accumulated,
      done: true,
      model: this.modelId,
      references: fullResponse.references,
      suggestedQuestions: fullResponse.suggestedQuestions
    });

    return fullResponse;
  }
}
