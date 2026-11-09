/**
 * أدوات مساعدة للأرقام واللغة العربية
 */

// تحويل الأرقام الإنجليزية إلى الأرقام العربية الشرقية (٠، ١، ٢، ٣، ٤، ٥، ٦، ٧، ٨، ٩)
export function toArabicNumerals(num: number | string): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/\d/g, (d) => arabicDigits[parseInt(d, 10)]);
}

// تنسيق المبالغ المالية بالجنيه المصري بالأرقام العربية
export function formatEgyptianPound(amount: number): string {
  if (amount === 0) return '٠ جنيه مصري';
  
  // تنسيق الرقم بفواصل الآلاف أولاً
  const formattedWithCommas = amount.toLocaleString('en-US');
  // استبدال الفواصل بفاصلة عربية وتحويل الأرقام
  const arabicFormatted = toArabicNumerals(formattedWithCommas).replace(/,/g, '،');
  
  return `${arabicFormatted} جنيه مصري`;
}

// تنسيق مختصر للرصيد
export function formatPoundShort(amount: number): string {
  if (amount === 0) return '٠ ج.م';
  const formattedWithCommas = amount.toLocaleString('en-US');
  const arabicFormatted = toArabicNumerals(formattedWithCommas).replace(/,/g, '،');
  return `${arabicFormatted} ج.م`;
}

// حروف الخيارات العربية المعتمدة في المسابقة
export const ARABIC_OPTION_LETTERS = ['أ', 'ب', 'ج', 'د'];
