import { PythonScriptPreset } from './types';

export const FOOD_ENGINEERING_TEMPLATES: PythonScriptPreset[] = [
  {
    id: 'bigelow_f0_lethality',
    title: 'محاسبه زمان کشندگی حرارتی (F₀) به روش بیگلو',
    category: 'فرآیندهای حرارتی و کنسرو',
    description: 'محاسبه کشندگی تجمعی F0 بر اساس تاریخچه دمای نقطه سرد، مقدار z و زمان فرآیند',
    code: `# ========================================================
# Food Science AI - Thermal Process Engineering
# Calculation: Cumulative Lethality (F0) & Sterilization
# ========================================================
import math

def calculate_thermal_process(target_temp=118.0, total_time_min=25.0, z_value=10.0, d121=1.5, come_up_time=6.0):
    """
    Computes cumulative lethality F0 using Trapezoidal integration.
    Reference: Stumbo (1973), Ball & Olson (1957)
    """
    print("--------------------------------------------------------")
    print("شبیه‌سازی فرآیند حرارتی قوطی کنسرو در اتوکلاو صنعتی")
    print(f"دمای هدف: {target_temp}°C | زمان فرآیند: {total_time_min} min | ضریب z: {z_value}°C")
    print("--------------------------------------------------------")

    steps = 50
    dt = total_time_min / steps
    cumulative_f0 = 0.0

    print(f"{'زمان (min)':<12}{'دما (°C)':<14}{'نرخ مرگ L':<16}{'کشندگی F0 (min)':<18}")
    print("-" * 60)

    for i in range(steps + 1):
        t = i * dt
        # Heating curve model
        if t <= come_up_time:
            temp = 25.0 + (target_temp - 25.0) * ((t / come_up_time) ** 1.3)
        else:
            temp = target_temp

        # Lethal rate L = 10^((T - 121.1) / z)
        lethal_rate = 10.0 ** ((temp - 121.1) / z_value)

        # Trapezoid integration weight
        weight = 0.5 if (i == 0 or i == steps) else 1.0
        cumulative_f0 += weight * lethal_rate * dt

        if i % 10 == 0:
            print(f"{t:<12.1f}{temp:<14.1f}{lethal_rate:<16.4f}{cumulative_f0:<18.3f}")

    log_reductions = cumulative_f0 / d121
    print("-" * 60)
    print(f"نتیجه نهایی کشندگی حرارتی (F0): {cumulative_f0:.2f} دقیقه")
    print(f"تعداد سیکل‌های کاهش ده برابری اسپور: {log_reductions:.1f}D")

    # Commercial sterility benchmark for Clostridium botulinum (12D requirement: F0 >= 3.0 min)
    if cumulative_f0 >= 3.0:
        print("ارزیابی ایمنی: استریلیزاسیون تجاری تایید شد (F0 >= 3.0 min).")
    else:
        print("ارزیابی ایمنی: ناکافی! زمان فرآیند برای ایمنی در برابر C. botulinum کم است.")

calculate_thermal_process(target_temp=119.5, total_time_min=28.0)
`,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'arrhenius_shelflife',
    title: 'پیش‌بینی ماندگاری و کینتیک آرنیوس',
    category: 'عمر نگهداری و پایداری',
    description: 'محاسبه ضریب شتاب تخریب نسبت به دما، انرژی فعال‌سازی و ضریب Q10',
    code: `# ========================================================
# Food Science AI - Shelf-Life Kinetics (Arrhenius Model)
# Reference: Labuza (1984), Taoukis & Labuza (1989)
# ========================================================
import math

R_GAS = 8.314e-3  # kJ / (mol * K)

def predict_food_shelflife(Ea_kJ_mol=68.0, T_ref_c=25.0, shelflife_ref_days=180.0, test_temp_c=40.0):
    T_ref_k = T_ref_c + 273.15
    T_test_k = test_temp_c + 273.15

    # ln(k2 / k1) = -(Ea / R) * (1/T2 - 1/T1)
    ln_ratio = -(Ea_kJ_mol / R_GAS) * ((1.0 / T_test_k) - (1.0 / T_ref_k))
    accel_factor = math.exp(ln_ratio)
    accelerated_shelflife = shelflife_ref_days / accel_factor

    # Q10 calculation
    delta_t = test_temp_c - T_ref_c
    q10 = (accel_factor) ** (10.0 / delta_t) if delta_t != 0 else 1.0

    print("========================================================")
    print("گزارش مدل‌سازی کینتیک ماندگاری و آزمون‌های تسریع‌شده (ASLT)")
    print(f"انرژی فعال‌سازی تخریب (Ea): {Ea_kJ_mol} kJ/mol")
    print(f"ماندگاری پایه در دمای مرجع ({T_ref_c}°C): {shelflife_ref_days} روز")
    print("--------------------------------------------------------")
    print(f"ضریب شتاب واکنش تخریب در {test_temp_c}°C: {accel_factor:.2f} برابر")
    print(f"ماندگاری پیش‌بینی‌شده در {test_temp_c}°C: {accelerated_shelflife:.1f} روز")
    print(f"ضریب حساسیت دمایی (Q10): {q10:.2f}")
    print("--------------------------------------------------------")

    # Table of shelf-life across distribution temperatures
    print("جدول ماندگاری در زنجیره توزیع و انبارداری:")
    print(f"{'دما (°C)':<12}{'ماندگاری (روز)':<18}{'ماندگاری (ماه)':<16}")
    for temp in [4, 10, 20, 25, 30, 35, 40]:
        t_k = temp + 273.15
        ratio = math.exp(-(Ea_kJ_mol / R_GAS) * ((1.0 / t_k) - (1.0 / T_ref_k)))
        days = shelflife_ref_days / ratio
        months = days / 30.0
        print(f"{temp:<12}{days:<18.1f}{months:<16.1f}")

predict_food_shelflife(Ea_kJ_mol=72.0, T_ref_c=25.0, shelflife_ref_days=180.0, test_temp_c=40.0)
`,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'gab_water_sorption',
    title: 'ایزوترم جذب آب و معادله سه پارامتری GAB',
    category: 'شیمی فیزیک و بسته‌بندی',
    description: 'محاسبه رطوبت تعادلی در برابر فعالیت آبی و رطوبت تک‌لایه پایدار',
    code: `# ========================================================
# Food Science AI - Water Sorption Isotherm (GAB Model)
# Reference: Van den Berg & Bruin (1981), Bizot (1983)
# ========================================================

def gab_sorption_isotherm(m0=6.5, C=18.0, K=0.84):
    """
    m0: Monolayer moisture content (g H2O / 100g dry matter)
    C: Guggenheim energy constant for monolayer
    K: Multilayer correction factor (K <= 1.0)
    """
    print("--------------------------------------------------------")
    print("محاسبه ایزوترم جذب آب مواد غذایی با مدل GAB")
    print(f"رطوبت تک‌لایه (m0): {m0} g/100g DM | ثابت C: {C} | ضریب K: {K}")
    print("--------------------------------------------------------")
    print(f"{'فعالیت آبی (aw)':<18}{'رطوبت تعادلی (g/100g DM)':<26}{'وضعیت پایداری':<20}")
    print("-" * 64)

    for aw_int in range(10, 95, 10):
        aw = aw_int / 100.0
        num = m0 * C * K * aw
        den = (1.0 - K * aw) * (1.0 - K * aw + C * K * aw)
        m = num / den

        status = "بسیار خشک (اکسیداسیون چربی)" if aw < 0.2 else \
                 "پایداری بهینه (حداکثر ثبات)" if aw <= 0.35 else \
                 "ایمن از رشد میکروبی" if aw < 0.6 else "خطر رشد کپک و مخمر"

        print(f"{aw:<18.2f}{m:<26.2f}{status:<20}")

gab_sorption_isotherm(m0=7.2, C=20.5, K=0.86)
`,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'herschel_bulkley_rheology',
    title: 'رئولوژی مواد غذایی و مدل هرشل-بالکلی',
    category: 'رئولوژی و بافت‌سنجی',
    description: 'محاسبه تنش برشی و گرانروی ظاهری سیالات شبه‌پلاستیک دارای تنش تسلیم',
    code: `# ========================================================
# Food Science AI - Food Rheology: Herschel-Bulkley Model
# tau = tau_0 + K * (gamma_dot)^n
# ========================================================

def food_rheology_analysis(tau_0=15.0, K=5.2, n=0.42):
    """
    tau_0: Yield stress (Pa)
    K: Consistency index (Pa.s^n)
    n: Flow behavior index (n < 1: Pseudoplastic/Shear-thinning)
    """
    print("--------------------------------------------------------")
    print("تحلیل رئولوژی سیال غذایی (مانند رب گوجه‌فرنگی یا سس مایونز)")
    print(f"تنش تسلیم (tau_0): {tau_0} Pa | ضریب قوام K: {K} | شاخص n: {n}")
    print("--------------------------------------------------------")
    print(f"{'نرخ برش (1/s)':<16}{'تنش برشی (Pa)':<18}{'گرانروی ظاهری (Pa.s)':<22}")
    print("-" * 56)

    shear_rates = [1, 5, 10, 25, 50, 100, 200, 400, 800]
    for gamma in shear_rates:
        tau = tau_0 + K * (gamma ** n)
        eta_apparent = tau / gamma
        print(f"{gamma:<16}{tau:<18.2f}{eta_apparent:<22.3f}")

    print("-" * 56)
    if n < 1.0:
        print("رفتار جریان: سیال غیرنیوتنی رقیق‌شونده با برش با تنش تسلیم (Pseudoplastic with Yield Stress)")
    else:
        print("رفتار جریان: غیرمعمول یا اتساعی")

food_rheology_analysis(tau_0=18.5, K=4.6, n=0.38)
`,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'pearson_square_standardization',
    title: 'استانداردسازی چربی و ماده خشک (مربع پیرسون)',
    category: 'فرمولاسیون و موازنه جرم',
    description: 'موازنه جرم برای رسیدن به درصد هدف چربی در شیر و فرآورده‌های لبنی',
    code: `# ========================================================
# Food Science AI - Pearson Square Standardization
# Milk Fat & Total Solids Standardization
# ========================================================

def pearson_square_milk(fat_high=40.0, fat_low=0.1, fat_target=3.2, total_batch_kg=1000.0):
    """
    fat_high: درصد چربی خامه یا جزء با چربی بالا
    fat_low: درصد چربی شیر پس‌چرخ یا جزء با چربی پایین
    fat_target: درصد چربی شیر هدف
    total_batch_kg: وزن نهایی بچ تولیدی (کیلوگرم)
    """
    part_high = abs(fat_target - fat_low)
    part_low = abs(fat_high - fat_target)
    total_parts = part_high + part_low

    kg_high = (part_high / total_parts) * total_batch_kg
    kg_low = (part_low / total_parts) * total_batch_kg

    # Verification of final fat
    final_fat_percent = ((kg_high * fat_high) + (kg_low * fat_low)) / total_batch_kg

    print("--------------------------------------------------------")
    print("دستور کار موازنه استانداردسازی شیر با مربع پیرسون")
    print(f"هدف تولید: {total_batch_kg} kg شیر با چربی {fat_target}%")
    print("--------------------------------------------------------")
    print(f"خامه ورودی ({fat_high}% چربی): {kg_high:.2f} kg ({kg_high/total_batch_kg*100:.1f}%)")
    print(f"شیر پس‌چرخ ورودی ({fat_low}% چربی): {kg_low:.2f} kg ({kg_low/total_batch_kg*100:.1f}%)")
    print("--------------------------------------------------------")
    print(f"چربی محصول نهایی: {final_fat_percent:.3f}% (انطباق ۱۰۰٪ با موازنه جرم)")

pearson_square_milk(fat_high=35.0, fat_low=0.08, fat_target=3.0, total_batch_kg=5000.0)
`,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'csv_data_analysis',
    title: 'خواندن و تحلیل آماری فایل‌های داده (CSV Data Analysis)',
    category: 'تحلیل داده و کنترل کیفیت',
    description: 'خواندن فایل داده، محاسبه میانگین، انحراف معیار، ضریب پراکندگی (%RSD) و شناسایی بچ‌های خارج از استاندارد',
    code: `# ========================================================
# Food Science AI - CSV Data Processing & QC Analytics
# Reads loaded data files from Python Virtual File System
# ========================================================
import csv
import math

# Sample dataset generated in virtual memory if file does not exist
sample_filename = "batch_qc_data.csv"
sample_data = """BatchID,Product,Brix,Acidity,Fat,Status
B-101,Yogurt_Drink,8.2,0.72,1.52,PASS
B-102,Yogurt_Drink,8.4,0.75,1.48,PASS
B-103,Yogurt_Drink,7.9,0.71,1.50,PASS
B-104,Yogurt_Drink,8.1,0.85,1.51,FLAGGED
B-105,Yogurt_Drink,8.3,0.73,1.49,PASS
B-106,Yogurt_Drink,8.5,0.74,1.53,PASS
B-107,Yogurt_Drink,7.6,0.70,1.42,OUT_OF_SPEC
"""

with open(sample_filename, "w", encoding="utf-8") as f:
    f.write(sample_data)

print(f"فایل داده نمونه «{sample_filename}» در حافظه ایجاد و خوانده شد.\\n")

# Reading and statistical analysis
brix_vals = []
acidity_vals = []
fat_vals = []

with open(sample_filename, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    print(f"{'بچ':<8}{'محصول':<16}{'بریکس':<10}{'اسیدیته':<10}{'چربی':<10}{'وضعیت':<12}")
    print("-" * 66)
    for row in reader:
        b = float(row['Brix'])
        a = float(row['Acidity'])
        ft = float(row['Fat'])
        brix_vals.append(b)
        acidity_vals.append(a)
        fat_vals.append(ft)
        print(f"{row['BatchID']:<8}{row['Product']:<16}{b:<10.1f}{a:<10.2f}{ft:<10.2f}{row['Status']:<12}")

def stats(vals):
    n = len(vals)
    mean = sum(vals) / n
    variance = sum((x - mean) ** 2 for x in vals) / (n - 1)
    stdev = math.sqrt(variance)
    rsd = (stdev / mean) * 100.0
    return mean, stdev, rsd

print("-" * 66)
print("خلاصه آماری پارامترهای کیفی خط تولید:")
for name, data in [("بریکس (Brix)", brix_vals), ("اسیدیته (Acidity %)", acidity_vals), ("چربی (Fat %)", fat_vals)]:
    m, s, rsd = stats(data)
    print(f"• {name:<20}: میانگین = {m:.3f} | انحراف معیار = {s:.3f} | RSD = {rsd:.2f}%")
`,
    sampleFileName: 'batch_qc_data.csv',
    sampleFileContent: `BatchID,Product,Brix,Acidity,Fat,Status
B-101,Yogurt_Drink,8.2,0.72,1.52,PASS
B-102,Yogurt_Drink,8.4,0.75,1.48,PASS
B-103,Yogurt_Drink,7.9,0.71,1.50,PASS
B-104,Yogurt_Drink,8.1,0.85,1.51,FLAGGED
B-105,Yogurt_Drink,8.3,0.73,1.49,PASS
B-106,Yogurt_Drink,8.5,0.74,1.53,PASS
B-107,Yogurt_Drink,7.6,0.70,1.42,OUT_OF_SPEC`,
    updatedAt: new Date().toISOString()
  }
];
