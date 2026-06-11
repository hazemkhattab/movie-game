export type CategoryId = "movie" | "series" | "play" | "song"

export type Category = {
  id: CategoryId
  label: string
  emojiHint: string
  colorVar: string
  textClass: string
  bgClass: string
  borderClass: string
  glowRgb: string
}

export type Question = {
  category: CategoryId
  title: string
  hint: string
  answer: string
  year?: string
}

export const CATEGORIES: Category[] = [
  {
    id: "movie",
    label: "فيلم",
    emojiHint: "أفلام سينمائية عربية وعالمية",
    colorVar: "var(--cat-movie)",
    textClass: "text-cat-movie",
    bgClass: "bg-cat-movie",
    borderClass: "border-cat-movie",
    glowRgb: "59,130,246",
  },
  {
    id: "series",
    label: "مسلسل",
    emojiHint: "مسلسلات درامية وكوميدية",
    colorVar: "var(--cat-series)",
    textClass: "text-cat-series",
    bgClass: "bg-cat-series",
    borderClass: "border-cat-series",
    glowRgb: "234,179,8",
  },
  {
    id: "play",
    label: "مسرحية",
    emojiHint: "مسرحيات خالدة ومشهورة",
    colorVar: "var(--cat-play)",
    textClass: "text-cat-play",
    bgClass: "bg-cat-play",
    borderClass: "border-cat-play",
    glowRgb: "249,115,22",
  },
  {
    id: "song",
    label: "أغنية",
    emojiHint: "أغاني طربية وحديثة",
    colorVar: "var(--cat-song)",
    textClass: "text-cat-song",
    bgClass: "bg-cat-song",
    borderClass: "border-cat-song",
    glowRgb: "34,197,94",
  },
]

export const CATEGORY_MAP: Record<CategoryId, Category> = CATEGORIES.reduce(
  (acc, c) => {
    acc[c.id] = c
    return acc
  },
  {} as Record<CategoryId, Category>,
)

export const SPINNER_OPTIONS = [
  ...CATEGORIES.map((c) => ({
    id: c.id as CategoryId,
    label: c.label,
    color: c.colorVar,
    bgHex: "",
  })),
  {
    id: "choose_any" as const,
    label: "اختر أي",
    color: "var(--cat-any)",
    bgHex: "#a855f7",
  },
]

export const QUESTIONS: Question[] = [
  { category: "movie", title: "الفيل الأزرق", hint: "فيلم مصري درامي", answer: "الفيل الأزرق", year: "2014" },
  { category: "movie", title: "الجزيرة", hint: "أكشن مصري", answer: "الجزيرة", year: "2007" },
  { category: "movie", title: "إبراهيم الأبيض", hint: "دراما اجتماعية", answer: "إبراهيم الأبيض", year: "2009" },
  { category: "movie", title: "عسل أسود", hint: "كوميديا درامية", answer: "عسل أسود", year: "2010" },
  { category: "movie", title: "كده رضا", hint: "كوميديا", answer: "كده رضا", year: "2007" },
  { category: "movie", title: "مرجان أحمد مرجان", hint: "كوميديا", answer: "مرجان أحمد مرجان", year: "2007" },
  { category: "movie", title: "البدلة", hint: "كوميديا", answer: "البدلة", year: "2018" },
  { category: "movie", title: "تيتو", hint: "دراما", answer: "تيتو", year: "2004" },
  { category: "movie", title: "أبو علي", hint: "أكشن كوميدي", answer: "أبو علي", year: "2005" },
  { category: "movie", title: "ولاد رزق", hint: "أكشن", answer: "ولاد رزق", year: "2015" },
  { category: "series", title: "الكبير أوي", hint: "كوميديا", answer: "الكبير أوي", year: "2010" },
  { category: "series", title: "الأسطورة", hint: "دراما", answer: "الأسطورة", year: "2016" },
  { category: "series", title: "جعفر العمدة", hint: "دراما", answer: "جعفر العمدة", year: "2023" },
  { category: "series", title: "باب الحارة", hint: "دراما تاريخية", answer: "باب الحارة", year: "2006" },
  { category: "series", title: "رأفت الهجان", hint: "دراما", answer: "رأفت الهجان", year: "1988" },
  { category: "series", title: "المال والبنون", hint: "دراما اجتماعية", answer: "المال والبنون", year: "1992" },
  { category: "series", title: "يوميات ونيس", hint: "كوميديا", answer: "يوميات ونيس", year: "1994" },
  { category: "series", title: "الاختيار", hint: "دراما عسكرية", answer: "الاختيار", year: "2020" },
  { category: "series", title: "موضوع عائلي", hint: "كوميديا", answer: "موضوع عائلي", year: "2021" },
  { category: "series", title: "أبو العروسة", hint: "دراما عائلية", answer: "أبو العروسة", year: "2017" },
  { category: "play", title: "مدرسة المشاغبين", hint: "مسرحية كوميدية", answer: "مدرسة المشاغبين", year: "1973" },
  { category: "play", title: "العيال كبرت", hint: "مسرحية", answer: "العيال كبرت", year: "1979" },
  { category: "play", title: "شاهد ماشفش حاجة", hint: "مسرحية", answer: "شاهد ماشفش حاجة", year: "1976" },
  { category: "play", title: "ريا وسكينة", hint: "مسرحية", answer: "ريا وسكينة", year: "1980" },
  { category: "play", title: "الواد سيد الشغال", hint: "مسرحية", answer: "الواد سيد الشغال", year: "1985" },
  { category: "play", title: "الزعيم", hint: "مسرحية", answer: "الزعيم", year: "1993" },
  { category: "play", title: "المتزوجون", hint: "مسرحية", answer: "المتزوجون", year: "1976" },
  { category: "play", title: "أنا وهو وهي", hint: "مسرحية", answer: "أنا وهو وهي", year: "1963" },
  { category: "song", title: "تملي معاك", hint: "أغنية", answer: "تملي معاك", year: "2000" },
  { category: "song", title: "نور العين", hint: "أغنية", answer: "نور العين", year: "1996" },
  { category: "song", title: "3 دقات", hint: "أغنية", answer: "3 دقات", year: "2017" },
  { category: "song", title: "أهواك", hint: "أغنية كلاسيكية", answer: "أهواك", year: "1957" },
  { category: "song", title: "ألف ليلة وليلة", hint: "أغنية", answer: "ألف ليلة وليلة", year: "1969" },
  { category: "song", title: "سيرة الحب", hint: "أغنية", answer: "سيرة الحب", year: "1964" },
  { category: "song", title: "قمرين", hint: "أغنية", answer: "قمرين", year: "1999" },
  { category: "song", title: "ليلي نهاري", hint: "أغنية", answer: "ليلي نهاري", year: "2004" },
  { category: "song", title: "الغزالة رايقة", hint: "أغنية", answer: "الغزالة رايقة", year: "2021" },
  { category: "song", title: "بالبنط العريض", hint: "أغنية", answer: "بالبنط العريض", year: "2020" },
  { category: "movie", title: "مصر الجديدة", hint: "كوميديا", answer: "مصر الجديدة", year: "2007" },
  { category: "movie", title: "حرب كرموز", hint: "أكشن", answer: "حرب كرموز", year: "2018" },
  { category: "movie", title: "الكنز", hint: "دراما تاريخية", answer: "الكنز", year: "2017" },
  { category: "movie", title: "كيروش", hint: "دراما", answer: "كيروش", year: "2014" },
  { category: "movie", title: "مولانا", hint: "دراما", answer: "مولانا", year: "2016" },
  { category: "movie", title: "اللي بالي بالك", hint: "رومانسي كوميدي", answer: "اللي بالي بالك", year: "2008" },
  { category: "movie", title: "زهايمر", hint: "دراما", answer: "زهايمر", year: "2010" },
  { category: "movie", title: "الحرب العالمية الثالثة", hint: "كوميديا", answer: "الحرب العالمية الثالثة", year: "2014" },
  { category: "movie", title: "بنات ثانوي", hint: "كوميديا", answer: "بنات ثانوي", year: "2020" },
  { category: "series", title: "البرنس", hint: "دراما", answer: "البرنس", year: "2020" },
  { category: "series", title: "نسل الأغراب", hint: "دراما", answer: "نسل الأغراب", year: "2020" },
  { category: "series", title: "الطوفان", hint: "دراما", answer: "الطوفان", year: "2022" },
  { category: "series", title: "ضرب نار", hint: "أكشن", answer: "ضرب نار", year: "2023" },
  { category: "series", title: "تحت الوصاية", hint: "دراما", answer: "تحت الوصاية", year: "2015" },
  { category: "series", title: "الطبال", hint: "دراما", answer: "الطبال", year: "2022" },
  { category: "series", title: "العائلة", hint: "كوميديا", answer: "العائلة", year: "2023" },
  { category: "series", title: "سابع جار", hint: "كوميديا", answer: "سابع جار", year: "2016" },
  { category: "series", title: "الحشاشين", hint: "دراما تاريخية", answer: "الحشاشين", year: "2024" },
  { category: "series", title: "العمدة", hint: "دراما", answer: "العمدة", year: "2021" },
  { category: "play", title: "الهمجي", hint: "مسرحية", answer: "الهمجي", year: "1985" },
  { category: "play", title: "ست الكل", hint: "مسرحية", answer: "ست الكل", year: "1980" },
  { category: "play", title: "غزل البنات", hint: "مسرحية", answer: "غزل البنات", year: "1967" },
  { category: "play", title: "أهلاً يا بكوات", hint: "مسرحية", answer: "أهلاً يا بكوات", year: "1974" },
  { category: "play", title: "فنون ثلاثة", hint: "مسرحية", answer: "فنون ثلاثة", year: "1971" },
  { category: "play", title: "سك على بناتك", hint: "مسرحية", answer: "سك على بناتك", year: "1982" },
  { category: "song", title: "بتونس بيك", hint: "أغنية", answer: "بتونس بيك", year: "2008" },
  { category: "song", title: "يا طريق", hint: "أغنية", answer: "يا طريق", year: "2019" },
  { category: "song", title: "مافيا", hint: "أغنية", answer: "مافيا", year: "2021" },
  { category: "song", title: "يا مسافر وحدك", hint: "أغنية كلاسيكية", answer: "يا مسافر وحدك", year: "1966" },
  { category: "song", title: "الف ليلة وليلة", hint: "أغنية", answer: "الف ليلة وليلة", year: "1969" },
  { category: "song", title: "حبيبي يا نور العين", hint: "أغنية", answer: "حبيبي يا نور العين", year: "1996" },
]

export function getRandomQuestion(category: CategoryId, exclude: string[] = []) {
  const pool = QUESTIONS.filter(
    (q) => q.category === category && !exclude.includes(q.title),
  )
  const source = pool.length > 0 ? pool : QUESTIONS.filter((q) => q.category === category)
  return source[Math.floor(Math.random() * source.length)]
}
