import type { CategoryId, Question } from "./game-data"

export type RuleId =
  | "one_hand"
  | "no_hands"
  | "walk_while_acting"
  | "jump_while_acting"
  | "remove_one_word"
  | "double_points"
  | "triple_points"
  | "lose_turn"
  | "spin_again"

export type RuleEffect =
  | { kind: "acting"; instruction: string }
  | { kind: "score_multiplier"; factor: number }
  | { kind: "on_fail_penalty"; penalty: "lose_point" | "skip_next_turn" }
  | { kind: "on_resolve"; action: "spin_again" }
  | { kind: "title_transform"; transform: "remove_one_word" }

export type Rule = {
  id: RuleId
  label: string
  description: string
  icon: string
  effects: RuleEffect[]
}

export const RULES: Rule[] = [
  {
    id: "one_hand",
    label: "يد واحدة فقط",
    description: "مثّل بيد واحدة فقط طوال الجولة",
    icon: "✋",
    effects: [{ kind: "acting", instruction: "استخدم يد واحدة فقط أثناء التمثيل" }],
  },
  {
    id: "no_hands",
    label: "بدون أيدي",
    description: "ممنوع استخدام اليدين أثناء التمثيل",
    icon: "🙅",
    effects: [{ kind: "acting", instruction: "لا تستخدم يديك أثناء التمثيل" }],
  },
  {
    id: "walk_while_acting",
    label: "امشِ وأنت تمثل",
    description: "يجب المشي أثناء التمثيل",
    icon: "🚶",
    effects: [{ kind: "acting", instruction: "امشِ في مكانك أثناء التمثيل" }],
  },
  {
    id: "jump_while_acting",
    label: "اقفز وأنت تمثل",
    description: "يجب القفز أثناء التمثيل",
    icon: "🦘",
    effects: [{ kind: "acting", instruction: "اقفز أثناء التمثيل" }],
  },
  {
    id: "remove_one_word",
    label: "احذف كلمة",
    description: "احذف كلمة واحدة من العنوان عند التمثيل",
    icon: "✂️",
    effects: [{ kind: "title_transform", transform: "remove_one_word" }],
  },
  {
    id: "double_points",
    label: "نقاط مضاعفة",
    description: "الإجابة الصحيحة = نقطتان",
    icon: "✨",
    effects: [{ kind: "score_multiplier", factor: 2 }],
  },
  {
    id: "triple_points",
    label: "نقاط ثلاثية",
    description: "الإجابة الصحيحة = 3 نقاط",
    icon: "🔥",
    effects: [{ kind: "score_multiplier", factor: 3 }],
  },
  {
    id: "lose_turn",
    label: "خسارة الدور",
    description: "عند الخطأ تخسر نقطة وتُتخطى دورك القادم",
    icon: "⏭️",
    effects: [{ kind: "on_fail_penalty", penalty: "skip_next_turn" }],
  },
  {
    id: "spin_again",
    label: "أدر مرة أخرى",
    description: "بعد هذه الجولة أدر العجلة مرة أخرى لنفس الفريق",
    icon: "🎡",
    effects: [{ kind: "on_resolve", action: "spin_again" }],
  },
]

export type ScoreResolution = {
  points: number
  skipNextTurn: boolean
  spinAgain: boolean
  actingInstructions: string[]
}

export function getScoreMultiplier(rule: Rule): number {
  const multiplier = rule.effects.find((e) => e.kind === "score_multiplier")
  return multiplier?.kind === "score_multiplier" ? multiplier.factor : 1
}

export function resolveRound(rule: Rule, success: boolean): ScoreResolution {
  const actingInstructions = rule.effects
    .filter((e): e is Extract<RuleEffect, { kind: "acting" }> => e.kind === "acting")
    .map((e) => e.instruction)

  const multiplier = getScoreMultiplier(rule)
  const hasLoseTurn = rule.effects.some(
    (e) => e.kind === "on_fail_penalty" && e.penalty === "skip_next_turn",
  )
  const spinAgain = rule.effects.some(
    (e) => e.kind === "on_resolve" && e.action === "spin_again",
  )

  if (success) {
    return {
      points: multiplier,
      skipNextTurn: false,
      spinAgain,
      actingInstructions,
    }
  }

  return {
    points: hasLoseTurn ? -1 : 0,
    skipNextTurn: hasLoseTurn,
    spinAgain,
    actingInstructions,
  }
}

export function applyTitleTransform(rule: Rule, question: Question): string {
  const hasTransform = rule.effects.some(
    (e) => e.kind === "title_transform" && e.transform === "remove_one_word",
  )
  if (!hasTransform) return question.title

  const words = question.title.trim().split(/\s+/)
  if (words.length <= 1) return question.title

  const index = Math.floor(Math.random() * words.length)
  return words.filter((_, i) => i !== index).join(" ")
}

export function getRandomRule(exclude: RuleId[] = []): Rule {
  const pool = RULES.filter((r) => !exclude.includes(r.id))
  const source = pool.length > 0 ? pool : RULES
  return source[Math.floor(Math.random() * source.length)]
}

export function getRuleById(id: RuleId): Rule {
  return RULES.find((r) => r.id === id)!
}

export function getActiveCategories(
  selected: CategoryId | "choose_any",
): CategoryId[] {
  if (selected === "choose_any") {
    return ["movie", "series", "play", "song"]
  }
  return [selected]
}
