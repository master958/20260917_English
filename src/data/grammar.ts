// 문법 카테고리와 퀴즈 문제의 정적 데이터
import type { GrammarCategory } from "../types";

export const grammarCategories: GrammarCategory[] = [
  {
    id: "tenses",
    title: "시제 (Tenses)",
    description: "현재, 과거, 현재완료 시제의 쓰임을 구분합니다.",
    ruleExplanation:
      "현재시제는 반복적인 습관이나 일반적 사실을, 과거시제는 이미 끝난 과거의 동작을, 현재완료(have/has + p.p.)는 과거에 시작되어 현재까지 영향을 미치는 일을 나타냅니다.",
    examples: [
      "She goes to school every day. (현재시제 - 습관)",
      "He visited Paris last summer. (과거시제 - 종료된 과거)",
      "I have lived here for five years. (현재완료 - 계속)",
    ],
    questions: [
      {
        id: "tenses-q1",
        prompt: "I ___ my homework already, so I can watch TV now.",
        choices: ["finish", "finished", "have finished", "finishing"],
        answerIndex: 2,
        explanation:
          "현재까지 완료되어 지금 상태에 영향을 주는 일이므로 현재완료 'have finished'가 적절합니다.",
      },
      {
        id: "tenses-q2",
        prompt: "The sun ___ in the east.",
        choices: ["rise", "rises", "rose", "has risen"],
        answerIndex: 1,
        explanation: "일반적 사실은 현재시제로 표현하며 3인칭 단수이므로 'rises'가 맞습니다.",
      },
      {
        id: "tenses-q3",
        prompt: "They ___ to the movies last Friday.",
        choices: ["go", "goes", "went", "have gone"],
        answerIndex: 2,
        explanation: "last Friday라는 명확한 과거 시점이 있으므로 과거시제 'went'를 씁니다.",
      },
      {
        id: "tenses-q4",
        prompt: "We ___ each other since childhood.",
        choices: ["know", "knew", "have known", "knowing"],
        answerIndex: 2,
        explanation:
          "since childhood(과거부터 지금까지)는 현재완료와 함께 쓰이는 전형적인 표현입니다.",
      },
    ],
  },
  {
    id: "relative-pronouns",
    title: "관계대명사 (Relative Pronouns)",
    description: "who, which, that, whose의 올바른 쓰임을 익힙니다.",
    ruleExplanation:
      "관계대명사는 두 문장을 연결하며 선행사를 수식합니다. 사람 선행사에는 who, 사물/동물 선행사에는 which, 사람·사물 모두에는 that을 쓸 수 있고, 소유격에는 whose를 씁니다.",
    examples: [
      "The man who called you is my brother.",
      "This is the book which I bought yesterday.",
      "I know a girl whose father is a pilot.",
    ],
    questions: [
      {
        id: "relative-q1",
        prompt: "The woman ___ lives next door is a doctor.",
        choices: ["which", "who", "whose", "whom"],
        answerIndex: 1,
        explanation: "선행사가 사람(woman)이고 주격이므로 'who'가 적절합니다.",
      },
      {
        id: "relative-q2",
        prompt: "This is the car ___ engine broke down.",
        choices: ["who", "which", "whose", "that"],
        answerIndex: 2,
        explanation: "소유 관계(그 차의 엔진)를 나타내므로 소유격 관계대명사 'whose'가 필요합니다.",
      },
      {
        id: "relative-q3",
        prompt: "I read the novel ___ you recommended.",
        choices: ["who", "whose", "that", "whom"],
        answerIndex: 2,
        explanation: "사물 선행사(novel)를 수식하며 목적격으로 쓰였으므로 'that'이 자연스럽습니다.",
      },
      {
        id: "relative-q4",
        prompt: "Do you know the boy ___ won the contest?",
        choices: ["which", "who", "whose", "that (사람 불가)"],
        answerIndex: 1,
        explanation: "사람 선행사(boy)의 주격 관계대명사는 'who'입니다.",
      },
    ],
  },
  {
    id: "modals",
    title: "조동사 (Modal Verbs)",
    description: "can, must, should, may 등 조동사의 의미 차이를 학습합니다.",
    ruleExplanation:
      "조동사는 능력(can), 의무(must/have to), 충고(should), 허가/추측(may) 등 말하는 사람의 태도를 더해줍니다. 조동사 뒤에는 항상 동사원형이 옵니다.",
    examples: [
      "You must wear a seatbelt. (의무)",
      "You should apologize to her. (충고)",
      "It may rain later. (추측)",
    ],
    questions: [
      {
        id: "modals-q1",
        prompt: "Students ___ submit the assignment by Friday.",
        choices: ["must", "may", "can", "would"],
        answerIndex: 0,
        explanation: "강한 의무를 나타낼 때는 'must'를 사용합니다.",
      },
      {
        id: "modals-q2",
        prompt: "You ___ smoke here; it's not allowed.",
        choices: ["must not", "don't have to", "may", "should"],
        answerIndex: 0,
        explanation: "'must not'은 강한 금지를 나타냅니다.",
      },
      {
        id: "modals-q3",
        prompt: "He ___ be at home; his car isn't in the driveway.",
        choices: ["must", "can't", "should", "will"],
        answerIndex: 1,
        explanation: "근거를 바탕으로 한 부정적 추측에는 'can't'가 쓰입니다.",
      },
      {
        id: "modals-q4",
        prompt: "___ I open the window? It's hot in here.",
        choices: ["May", "Must", "Should", "Will"],
        answerIndex: 0,
        explanation: "허락을 구할 때는 'May I ...?'가 정중한 표현입니다.",
      },
    ],
  },
  {
    id: "passive-voice",
    title: "수동태 (Passive Voice)",
    description: "능동태 문장을 수동태로 바꾸는 방법을 익힙니다.",
    ruleExplanation:
      "수동태는 'be동사 + 과거분사(p.p.)' 형태로, 행위의 대상을 주어로 강조할 때 사용합니다. 행위자는 by 이하에 표시하거나 생략할 수 있습니다.",
    examples: [
      "The book was written by her. (능동: She wrote the book.)",
      "The window was broken yesterday.",
      "English is spoken in many countries.",
    ],
    questions: [
      {
        id: "passive-q1",
        prompt: "The cake ___ by my mother yesterday.",
        choices: ["baked", "was baked", "bakes", "is baking"],
        answerIndex: 1,
        explanation: "과거에 행해진 동작의 수동태는 'was/were + p.p.' 형태입니다.",
      },
      {
        id: "passive-q2",
        prompt: "This bridge ___ in 1990.",
        choices: ["built", "was built", "builds", "has build"],
        answerIndex: 1,
        explanation: "과거 시점(1990년)에 완료된 동작의 수동태는 'was built'입니다.",
      },
      {
        id: "passive-q3",
        prompt: "The report ___ by tomorrow.",
        choices: ["will finish", "will be finished", "finishes", "finished"],
        answerIndex: 1,
        explanation: "미래 수동태는 'will be + p.p.' 형태로 표현합니다.",
      },
      {
        id: "passive-q4",
        prompt: "Many languages ___ in Switzerland.",
        choices: ["speak", "spoke", "are spoken", "speaking"],
        answerIndex: 2,
        explanation: "일반적 사실의 현재 수동태는 'are/is spoken' 형태입니다.",
      },
    ],
  },
  {
    id: "conditionals",
    title: "가정법 (Conditionals)",
    description: "if절을 활용한 조건문의 종류와 쓰임을 학습합니다.",
    ruleExplanation:
      "1형식(현재/미래 사실 가능성)은 'If + 현재, will + 동사원형', 2형식(현재 사실 반대 가정)은 'If + 과거, would + 동사원형'을 사용합니다.",
    examples: [
      "If it rains, I will stay home. (1형식)",
      "If I were rich, I would travel the world. (2형식)",
      "If she studies hard, she will pass the exam.",
    ],
    questions: [
      {
        id: "conditionals-q1",
        prompt: "If it rains tomorrow, we ___ the picnic.",
        choices: ["cancel", "will cancel", "canceled", "would cancel"],
        answerIndex: 1,
        explanation: "1형식 조건문의 주절에는 'will + 동사원형'을 씁니다.",
      },
      {
        id: "conditionals-q2",
        prompt: "If I ___ a bird, I would fly to you.",
        choices: ["am", "were", "was", "be"],
        answerIndex: 1,
        explanation: "2형식 가정법에서 be동사는 주어와 관계없이 'were'를 씁니다.",
      },
      {
        id: "conditionals-q3",
        prompt: "If she studies harder, she ___ the exam.",
        choices: ["will pass", "passed", "would pass", "pass"],
        answerIndex: 0,
        explanation: "실현 가능성이 있는 조건이므로 1형식 'will pass'가 맞습니다.",
      },
      {
        id: "conditionals-q4",
        prompt: "If I had more time, I ___ learn Spanish.",
        choices: ["will", "would", "can", "did"],
        answerIndex: 1,
        explanation: "'If + 과거'(had) 형태이므로 주절에는 'would'가 옵니다.",
      },
    ],
  },
];
