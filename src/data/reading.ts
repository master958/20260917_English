// 독해 지문과 이해도 확인 문제의 정적 데이터
import type { ReadingPassage } from "../types";

export const readingPassages: ReadingPassage[] = [
  {
    id: "daily-routine",
    title: "My Daily Routine",
    level: "beginner",
    body: "Every morning, I wake up at seven o'clock. I commute to work by bus, and the ride takes about thirty minutes. After work, I usually go to the grocery store near my neighborhood to buy food for dinner. On weekends, I like to relax and follow a simple routine of reading and walking.",
    glossaryWordIds: ["commute", "routine", "grocery", "neighborhood"],
    questions: [
      {
        id: "daily-routine-q1",
        prompt: "How does the writer get to work?",
        choices: ["By car", "By bus", "By bike", "On foot"],
        answerIndex: 1,
      },
      {
        id: "daily-routine-q2",
        prompt: "How long does the commute take?",
        choices: ["Ten minutes", "Twenty minutes", "Thirty minutes", "One hour"],
        answerIndex: 2,
      },
      {
        id: "daily-routine-q3",
        prompt: "What does the writer do after work?",
        choices: [
          "Goes to the gym",
          "Goes to the grocery store",
          "Watches a movie",
          "Visits a friend",
        ],
        answerIndex: 1,
      },
    ],
  },
  {
    id: "weekend-volunteer",
    title: "A Weekend Volunteer",
    level: "beginner",
    body: "Last weekend, Sarah worked as a volunteer at a local animal shelter. She fed the dogs and cleaned their cages. She said the experience made her happy because she could help animals in her neighborhood find new homes.",
    glossaryWordIds: ["volunteer", "neighborhood"],
    questions: [
      {
        id: "weekend-volunteer-q1",
        prompt: "Where did Sarah volunteer?",
        choices: ["At a school", "At an animal shelter", "At a hospital", "At a library"],
        answerIndex: 1,
      },
      {
        id: "weekend-volunteer-q2",
        prompt: "What did Sarah do at the shelter?",
        choices: [
          "She fed the dogs and cleaned cages",
          "She walked cats",
          "She painted the walls",
          "She sold tickets",
        ],
        answerIndex: 0,
      },
      {
        id: "weekend-volunteer-q3",
        prompt: "How did the experience make Sarah feel?",
        choices: ["Tired", "Bored", "Happy", "Nervous"],
        answerIndex: 2,
      },
    ],
  },
  {
    id: "green-living",
    title: "Steps Toward Green Living",
    level: "intermediate",
    body: "Protecting the environment starts with small daily choices. Many cities now struggle with pollution caused by traffic and factories. To build a more sustainable future, communities are investing in renewable energy sources like solar and wind power. Reducing personal consumption of plastic and energy also plays an important role in slowing climate change.",
    glossaryWordIds: ["environment", "pollution", "sustainable", "renewable", "consumption"],
    questions: [
      {
        id: "green-living-q1",
        prompt: "What causes pollution in many cities, according to the passage?",
        choices: [
          "Traffic and factories",
          "Farming and fishing",
          "Tourism",
          "Construction only",
        ],
        answerIndex: 0,
      },
      {
        id: "green-living-q2",
        prompt: "What are examples of renewable energy mentioned in the passage?",
        choices: [
          "Coal and oil",
          "Solar and wind power",
          "Nuclear power",
          "Natural gas",
        ],
        answerIndex: 1,
      },
      {
        id: "green-living-q3",
        prompt: "What personal action does the passage suggest?",
        choices: [
          "Buying more plastic products",
          "Reducing consumption of plastic and energy",
          "Driving more often",
          "Ignoring climate change",
        ],
        answerIndex: 1,
      },
      {
        id: "green-living-q4",
        prompt: "What is the main topic of the passage?",
        choices: [
          "Building sustainable communities",
          "The history of factories",
          "Traffic laws",
          "Plastic manufacturing",
        ],
        answerIndex: 0,
      },
    ],
  },
  {
    id: "ai-and-privacy",
    title: "Artificial Intelligence and Privacy",
    level: "intermediate",
    body: "Innovation in artificial intelligence has changed how companies collect and use personal data. Algorithms can now predict customer behavior with surprising accuracy. However, this progress raises concerns about privacy, as constant surveillance of online activity makes many users uncomfortable. Experts argue that stronger regulations are needed to balance innovation with individual rights.",
    glossaryWordIds: ["innovation", "artificial", "algorithm", "privacy", "surveillance"],
    questions: [
      {
        id: "ai-and-privacy-q1",
        prompt: "What can algorithms do, according to the passage?",
        choices: [
          "Predict customer behavior",
          "Replace all human jobs",
          "Stop pollution",
          "Reduce inflation",
        ],
        answerIndex: 0,
      },
      {
        id: "ai-and-privacy-q2",
        prompt: "What concern does the passage raise about AI?",
        choices: [
          "It is too expensive",
          "It threatens privacy through surveillance",
          "It cannot process data quickly",
          "It has no real uses",
        ],
        answerIndex: 1,
      },
      {
        id: "ai-and-privacy-q3",
        prompt: "What do experts suggest is needed?",
        choices: [
          "Banning all AI research",
          "Stronger regulations",
          "More surveillance",
          "Less innovation funding",
        ],
        answerIndex: 1,
      },
    ],
  },
  {
    id: "global-economy",
    title: "Understanding the Global Economy",
    level: "advanced",
    body: "The global economy is a complex, interconnected system in which the decisions of one country can ripple across the entire world. When inflation rises sharply in a major economy, central banks often respond by adjusting interest rates, which in turn affects investment decisions everywhere. A diverse portfolio of investments, spread across industries and regions, is often recommended as a way to manage the risks that arise from this interconnected volatility.",
    glossaryWordIds: ["economy", "inflation", "investment", "diverse"],
    questions: [
      {
        id: "global-economy-q1",
        prompt: "What can happen when inflation rises sharply?",
        choices: [
          "Central banks ignore it",
          "Central banks adjust interest rates",
          "Prices immediately fall",
          "Investment stops entirely",
        ],
        answerIndex: 1,
      },
      {
        id: "global-economy-q2",
        prompt: "What strategy does the passage recommend for managing risk?",
        choices: [
          "Investing in a single industry",
          "Avoiding all investment",
          "A diverse portfolio across industries and regions",
          "Only investing domestically",
        ],
        answerIndex: 2,
      },
      {
        id: "global-economy-q3",
        prompt: "What best describes the global economy according to the passage?",
        choices: [
          "Simple and predictable",
          "A complex, interconnected system",
          "Unrelated to interest rates",
          "Controlled by one country",
        ],
        answerIndex: 1,
      },
      {
        id: "global-economy-q4",
        prompt: "What effect do interest rate changes have?",
        choices: [
          "They affect investment decisions everywhere",
          "They have no global impact",
          "They only affect one bank",
          "They eliminate inflation instantly",
        ],
        answerIndex: 0,
      },
    ],
  },
  {
    id: "ancient-philosophy",
    title: "Ideas from Ancient Civilization",
    level: "advanced",
    body: "Ancient civilizations left behind more than monuments; they left philosophical traditions that still shape modern thought. Greek philosophy, for example, questioned the nature of justice, knowledge, and the ideal society, influencing political systems centuries later. Studying these ancient ideas helps modern readers understand how deeply rooted many of today's debates about ethics and governance truly are.",
    glossaryWordIds: ["civilization", "ancient", "philosophy"],
    questions: [
      {
        id: "ancient-philosophy-q1",
        prompt: "What did ancient civilizations leave behind, according to the passage?",
        choices: [
          "Only monuments",
          "Philosophical traditions and monuments",
          "Nothing of lasting value",
          "Only military records",
        ],
        answerIndex: 1,
      },
      {
        id: "ancient-philosophy-q2",
        prompt: "What did Greek philosophy question?",
        choices: [
          "The nature of justice, knowledge, and the ideal society",
          "Only agricultural methods",
          "Modern technology",
          "Space exploration",
        ],
        answerIndex: 0,
      },
      {
        id: "ancient-philosophy-q3",
        prompt: "Why does the passage suggest studying ancient ideas?",
        choices: [
          "They have no relevance today",
          "They help us understand modern debates about ethics and governance",
          "They are only useful for historians",
          "They predict future events",
        ],
        answerIndex: 1,
      },
    ],
  },
];
