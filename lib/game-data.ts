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

export const QUESTIONS: Question[] = [
 // أفلام
{
  category: "movie",
  title: "الفيل الأزرق",
  hint: "",
  answer: "الفيل الأزرق",
  year: "2014",
},
{
  category: "movie",
  title: "الجزيرة",
  hint: "",
  answer: "الجزيرة",
  year: "2007",
},
{
  category: "movie",
  title: "إبراهيم الأبيض",
  hint: "",
  answer: "إبراهيم الأبيض",
  year: "2009",
},
{
  category: "movie",
  title: "عسل أسود",
  hint: "",
  answer: "عسل أسود",
  year: "2010",
},
{
  category: "movie",
  title: "كده رضا",
  hint: "",
  answer: "كده رضا",
  year: "2007",
},
{
  category: "movie",
  title: "مرجان أحمد مرجان",
  hint: "",
  answer: "مرجان أحمد مرجان",
  year: "2007",
},
{
  category: "movie",
  title: "البدلة",
  hint: "",
  answer: "البدلة",
  year: "2018",
},
{
  category: "movie",
  title: "تيتو",
  hint: "",
  answer: "تيتو",
  year: "2004",
},
{
  category: "movie",
  title: "أبو علي",
  hint: "",
  answer: "أبو علي",
  year: "2005",
},
{
  category: "movie",
  title: "ولاد رزق",
  hint: "",
  answer: "ولاد رزق",
  year: "2015",
},

// مسلسلات
{
  category: "series",
  title: "الكبير أوي",
  hint: "",
  answer: "الكبير أوي",
  year: "2010",
},
{
  category: "series",
  title: "الأسطورة",
  hint: "",
  answer: "الأسطورة",
  year: "2016",
},
{
  category: "series",
  title: "جعفر العمدة",
  hint: "",
  answer: "جعفر العمدة",
  year: "2023",
},
{
  category: "series",
  title: "باب الحارة",
  hint: "",
  answer: "باب الحارة",
  year: "2006",
},
{
  category: "series",
  title: "رأفت الهجان",
  hint: "",
  answer: "رأفت الهجان",
  year: "1988",
},
{
  category: "series",
  title: "المال والبنون",
  hint: "",
  answer: "المال والبنون",
  year: "1992",
},
{
  category: "series",
  title: "يوميات ونيس",
  hint: "",
  answer: "يوميات ونيس",
  year: "1994",
},
{
  category: "series",
  title: "الاختيار",
  hint: "",
  answer: "الاختيار",
  year: "2020",
},
{
  category: "series",
  title: "موضوع عائلي",
  hint: "",
  answer: "موضوع عائلي",
  year: "2021",
},
{
  category: "series",
  title: "أبو العروسة",
  hint: "",
  answer: "أبو العروسة",
  year: "2017",
},

// مسرحيات
{
  category: "play",
  title: "مدرسة المشاغبين",
  hint: "",
  answer: "مدرسة المشاغبين",
  year: "1973",
},
{
  category: "play",
  title: "العيال كبرت",
  hint: "",
  answer: "العيال كبرت",
  year: "1979",
},
{
  category: "play",
  title: "شاهد ماشفش حاجة",
  hint: "",
  answer: "شاهد ماشفش حاجة",
  year: "1976",
},
{
  category: "play",
  title: "ريا وسكينة",
  hint: "",
  answer: "ريا وسكينة",
  year: "1980",
},
{
  category: "play",
  title: "الواد سيد الشغال",
  hint: "",
  answer: "الواد سيد الشغال",
  year: "1985",
},
{
  category: "play",
  title: "الزعيم",
  hint: "",
  answer: "الزعيم",
  year: "1993",
},
{
  category: "play",
  title: "المتزوجون",
  hint: "",
  answer: "المتزوجون",
  year: "1976",
},
{
  category: "play",
  title: "أنا وهو وهي",
  hint: "",
  answer: "أنا وهو وهي",
  year: "1963",
},

// أغاني
{
  category: "song",
  title: "تملي معاك",
  hint: "",
  answer: "تملي معاك",
  year: "2000",
},
{
  category: "song",
  title: "نور العين",
  hint: "",
  answer: "نور العين",
  year: "1996",
},
{
  category: "song",
  title: "3 دقات",
  hint: "",
  answer: "3 دقات",
  year: "2017",
},
{
  category: "song",
  title: "أهواك",
  hint: "",
  answer: "أهواك",
  year: "1957",
},
{
  category: "song",
  title: "ألف ليلة وليلة",
  hint: "",
  answer: "ألف ليلة وليلة",
  year: "1969",
},
{
  category: "song",
  title: "سيرة الحب",
  hint: "",
  answer: "سيرة الحب",
  year: "1964",
},
{
  category: "song",
  title: "قمرين",
  hint: "",
  answer: "قمرين",
  year: "1999",
},
{
  category: "song",
  title: "ليلي نهاري",
  hint: "",
  answer: "ليلي نهاري",
  year: "2004",
},
{
  category: "song",
  title: "الغزالة رايقة",
  hint: "",
  answer: "الغزالة رايقة",
  year: "2021",
},
{
  category: "song",
  title: "بالبنط العريض",
  hint: "",
  answer: "بالبنط العريض",
  year: "2020",
},
]

export function getRandomQuestion(category: CategoryId, exclude: string[] = []) {
  const pool = QUESTIONS.filter(
    (q) => q.category === category && !exclude.includes(q.title),
  )
  const source = pool.length > 0 ? pool : QUESTIONS.filter((q) => q.category === category)
  return source[Math.floor(Math.random() * source.length)]
}
