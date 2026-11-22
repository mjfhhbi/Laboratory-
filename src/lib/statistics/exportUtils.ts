/**
 * Food Science AI - Scientific Statistics Data Export Engine
 * Exports Raw & Processed data to CSV, TSV, JSON, and LaTeX/Markdown publication tables.
 */

import { StatisticalDataset, AnovaAnalysisResult, DescriptiveStats } from '../../types/statistics';
import { calculateDescriptiveStats } from './descriptiveStats';

/**
 * Generates CSV string containing raw replicates with treatment labels and exclusion metadata
 */
export function exportRawDataToCSV(dataset: StatisticalDataset): string {
  const rows: string[] = [];
  rows.push(['شناسه_تیمار', 'نام_تیمار', 'شماره_تکرار', 'مقدار_خام', 'واحد', 'وضعیت_حذف', 'علت_حذف'].join(','));

  dataset.groups.forEach((g) => {
    g.replicates.forEach((r) => {
      rows.push([
        `"${g.id}"`,
        `"${g.name}"`,
        r.repNumber,
        r.rawValue !== null ? r.rawValue : '',
        `"${dataset.responseVariable.unit || ''}"`,
        r.isExcluded ? 'مستثنی_شده' : 'فعال',
        `"${r.exclusionReason || ''}"`
      ].join(','));
    });
  });

  return rows.join('\n');
}

/**
 * Generates CSV containing group summary (Mean, Median, SD, SE, CV%, 95% CI)
 */
export function exportSummaryToCSV(
  dataset: StatisticalDataset,
  statsMap: Record<string, DescriptiveStats>,
  anovaResult?: AnovaAnalysisResult
): string {
  const rows: string[] = [];
  rows.push([
    'گروه_آزمایشی',
    'تعداد_کل',
    'تعداد_معتبر',
    'میانگین',
    'میانه',
    'انحراف_معیار_SD',
    'خطای_معیار_SE',
    'ضریب_تغییرات_CV_درصد',
    'فاصله_اطمینان_۹۵_پایین',
    'فاصله_اطمینان_۹۵_بالا',
    'حروف_گروه‌بندی_آماری'
  ].join(','));

  dataset.groups.forEach((g) => {
    const stats = statsMap[g.id] || calculateDescriptiveStats(g.replicates, g.name);
    const letter = anovaResult?.postHoc.groupLetters[g.id] || '-';

    rows.push([
      `"${g.name}"`,
      stats.count,
      stats.validCount,
      stats.mean.toFixed(3),
      stats.median.toFixed(3),
      stats.sd.toFixed(3),
      stats.se.toFixed(3),
      stats.cv.toFixed(2),
      stats.ci95Lower.toFixed(3),
      stats.ci95Upper.toFixed(3),
      `"${letter}"`
    ].join(','));
  });

  if (anovaResult) {
    rows.push('');
    rows.push(['--- جدول آنالیز واریانس ANOVA ---'].join(','));
    rows.push(['منبع_تغییرات', 'مجموع_مربعات_SS', 'درجات_آزادی_df', 'میانگین_مربعات_MS', 'آماره_F', 'مقدار_p'].join(','));
    anovaResult.table.forEach((row) => {
      rows.push([
        `"${row.sourceFa}"`,
        row.ss.toFixed(3),
        row.df,
        row.ms !== null ? row.ms.toFixed(3) : '-',
        row.f !== null ? row.f.toFixed(3) : '-',
        row.pValue !== null ? row.pValue.toFixed(4) : '-'
      ].join(','));
    });
  }

  return rows.join('\n');
}

/**
 * Generates scientific publication table (e.g. Mean ± SD with letters) formatted for Food Chemistry / JFS
 */
export function exportScientificPublicationMarkdown(
  dataset: StatisticalDataset,
  statsMap: Record<string, DescriptiveStats>,
  anovaResult?: AnovaAnalysisResult
): string {
  const lines: string[] = [];
  lines.push(`### جدول نتایج آماری: ${dataset.title}`);
  lines.push(`متغیر پاسخ: **${dataset.responseVariable.name} (${dataset.responseVariable.unit || '-'})** | سطح آلفا: **α = ${dataset.alphaLevel}**\n`);
  lines.push('| تیمار آزمایشی | میانگین ± انحراف معیار (Mean ± SD) | خطای معیار (SE) | ضریب تغییرات (CV%) | فاصله‌اطمینان ۹۵٪ |');
  lines.push('| :--- | :---: | :---: | :---: | :---: |');

  dataset.groups.forEach((g) => {
    const s = statsMap[g.id] || calculateDescriptiveStats(g.replicates, g.name);
    const letter = anovaResult?.postHoc.groupLetters[g.id] ? `<sup>${anovaResult.postHoc.groupLetters[g.id]}</sup>` : '';
    lines.push(
      `| ${g.name} | ${s.mean.toFixed(2)} ± ${s.sd.toFixed(2)} ${letter} | ${s.se.toFixed(2)} | ${s.cv.toFixed(1)}% | [${s.ci95Lower.toFixed(2)}, ${s.ci95Upper.toFixed(2)}] |`
    );
  });

  if (anovaResult) {
    lines.push('\n*توضیح: میانگین‌های دارای حروف مشترک بر اساس آزمون تعقیبی توکی (Tukey HSD) در سطح احتمال ۵ درصد تفاوت آماری معنی‌داری ندارند (P > 0.05).*');
    lines.push(`*F(${anovaResult.table[0].df}, ${anovaResult.table[1].df}) = ${anovaResult.fValue.toFixed(2)}, P-value = ${anovaResult.pValue.toFixed(4)}, η² = ${anovaResult.etaSquared.toFixed(3)}*`);
  }

  return lines.join('\n');
}

/**
 * Triggers file download in browser
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/csv;charset=utf-8;') {
  const blob = new Blob(['\uFEFF' + content], { type: mimeType }); // Add UTF-8 BOM for Excel Persian text support
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
