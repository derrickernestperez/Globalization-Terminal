export const geoFlowPrompts = [
  {
    id: 'cebu-circumnavigation',
    title: 'The First Global Loop',
    prompt:
      'Drop your pin on the place where early explorers proved the world could be connected by one continuous journey.',
    hint1: 'This happened during the age of explorers and ships.',
    hint2: 'It is in Southeast Asia.',
    hint3: 'This island became one of the earliest recorded contact points between European explorers and Southeast Asian communities.',
    location: 'Cebu, Philippines',
    country: 'Philippines',
    lat: 10.3157,
    lng: 123.8854,
    resourceId: 'introduction-to-globalization',
    feedbackCorrect:
      'Nice! Early explorers showed that trade and travel could connect the entire world.',
    feedbackWrong:
      'Not quite. Think about early sea exploration and where Magellan landed.',
    recapPoint:
      'Globalization didn\'t start with the internet—it began with exploration, trade, and empire.',
    trivia:
      'The first circumnavigation showed that distant parts of the world could be connected in one continuous loop—a foundation for all global trade that followed.',
  },
  {
    id: 'seoul-cultural-flows',
    title: 'Pop Culture Goes Global',
    prompt:
      'Pin the city known for K-pop, K-dramas, and trends that spread worldwide in days.',
    hint1: 'Think music, fashion, and viral content.',
    hint2: 'This country is famous for BTS and high-speed internet.',
    hint3: 'This city is a global tech hub with one of the fastest internet infrastructures in the world.',
    location: 'Seoul, South Korea',
    country: 'South Korea',
    lat: 37.5665,
    lng: 126.978,
    resourceId: 'introduction-to-globalization',
    feedbackCorrect:
      'Correct! Culture now spreads globally almost instantly through the internet.',
    feedbackWrong:
      'Close! Think of where K-pop and Korean dramas come from.',
    recapPoint:
      'Culture moves fast in today\'s world—songs, shows, and trends cross borders instantly.',
    trivia:
      'Korean popular culture shows how media and trends can circulate internationally in hours rather than decades.',
  },
  {
    id: 'dhaka-garment-chain',
    title: 'Where Clothes Are Made',
    prompt:
      'Choose the city where many global clothing brands produce their products at lower cost.',
    hint1: 'Think about where cheap labor is common.',
    hint2: 'This city is one of the world’s largest centers for textile and clothing production.',
    hint3: 'A major clothing exporter in South Asia.',
    location: 'Dhaka, Bangladesh',
    country: 'Bangladesh',
    lat: 23.8103,
    lng: 90.4125,
    resourceId: 'global-economy',
    feedbackCorrect:
      'Yes! Many global brands produce goods in places with cheaper labor.',
    feedbackWrong:
      'Not quite. Think of countries known for garment factories.',
    recapPoint:
      'Products are often made in lower-cost countries but sold globally for higher prices.',
    trivia:
      'Global supply chains are built through uneven power—production is outsourced to cheaper locations while branding and profits stay elsewhere.',
  },
  {
    id: 'rotterdam-market-integration',
    title: 'Gateway of Trade',
    prompt:
      'Mark the major European port where goods from all over the world pass through.',
    hint1: 'Think of ships, containers, and trade routes.',
    hint2: 'One of the busiest ports in Europe.',
    hint3: 'This port connects inland Europe to global shipping routes through a massive river delta.',
    location: 'Rotterdam, Netherlands',
    country: 'Netherlands',
    lat: 51.9244,
    lng: 4.4777,
    resourceId: 'market-integration',
    feedbackCorrect:
      'Correct! Global trade depends on ports and infrastructure like this.',
    feedbackWrong:
      'Close! Think of a major European shipping hub.',
    recapPoint:
      'Global trade works because of real systems like ports, ships, and logistics networks.',
    trivia:
      'Market integration is not abstract—it depends on ports, shipping routes, customs systems, and agreements that let goods move at scale.',
  },
  {
    id: 'new-york-finance',
    title: 'Money Moves Fast',
    prompt:
      'Pin the city where financial decisions can affect the whole world in seconds.',
    hint1: 'Think of stock markets and global finance.',
    hint2: 'Wall Street is located here.',
    hint3: 'This city hosts one of the most influential stock exchanges in the world.',
    location: 'New York City, United States',
    country: 'United States',
    lat: 40.7128,
    lng: -74.006,
    resourceId: 'global-economy',
    feedbackCorrect:
      'Exactly! Money moves globally at incredible speed from financial centers.',
    feedbackWrong:
      'Not quite. Think of Wall Street and global finance.',
    recapPoint:
      'Financial decisions in one place can impact economies worldwide almost instantly.',
    trivia:
      'The speed of global finance is one reason economic globalization feels unstable—events in one market can cascade across many others.',
  },
  {
    id: 'geneva-global-governance',
    title: 'Solving Global Problems',
    prompt:
      'Choose the city known for international organizations that help solve global issues.',
    hint1: 'Think of diplomacy and global cooperation.',
    hint2: 'Many UN offices are located here.',
    hint3: 'A neutral country in Europe.',
    location: 'Geneva, Switzerland',
    country: 'Switzerland',
    lat: 46.2044,
    lng: 6.1432,
    resourceId: 'global-governance',
    feedbackCorrect:
      'Yes! Global problems often need international cooperation to solve.',
    feedbackWrong:
      'Close! Think of a city known for global organizations like the UN.',
    recapPoint:
      'Globalization requires cooperation through institutions, not just movement.',
    trivia:
      'The world doesn\'t have one government—but cities like Geneva host institutions that coordinate health, law, trade, and diplomacy across borders.',
  },
];

export const flagCountryPool = [
  { name: 'United States', code: 'us', category: 'CORE', clue: 'Tech giants, Hollywood, Wall Street—the engine of global culture and finance' },
  { name: 'Germany', code: 'de', category: 'CORE', clue: 'Europe\'s industrial powerhouse—cars, machinery, and precision engineering exports' },
  { name: 'Japan', code: 'jp', category: 'CORE', clue: 'Electronics, robotics, anime—exports high-tech goods and pop culture worldwide' },
  { name: 'United Kingdom', code: 'gb', category: 'CORE', clue: 'Global finance hub, media empire, and a former colonial power with lasting influence' },
  { name: 'France', code: 'fr', category: 'CORE', clue: 'Fashion, luxury brands, nuclear energy—a cultural and economic power' },
  { name: 'Canada', code: 'ca', category: 'CORE', clue: 'Natural resources, tech sector, and deep trade ties with the USA' },
  { name: 'South Korea', code: 'kr', category: 'CORE', clue: 'K-pop, Samsung, Hyundai—culture and high-tech exports on the world stage' },
  { name: 'Australia', code: 'au', category: 'CORE', clue: 'Mining, agriculture, high living standards—dominant in the Asia-Pacific' },
  { name: 'China', code: 'cn', category: 'SEMI_PERIPHERY', clue: 'World\'s factory and fast-rising tech power—makes almost everything' },
  { name: 'India', code: 'in', category: 'SEMI_PERIPHERY', clue: 'Software outsourcing capital, massive workforce, Bollywood' },
  { name: 'Brazil', code: 'br', category: 'SEMI_PERIPHERY', clue: 'Coffee, soybeans, beef—feeds the world with a growing domestic market' },
  { name: 'Mexico', code: 'mx', category: 'SEMI_PERIPHERY', clue: 'Assembly factories for US brands, oil exports, and major tourism' },
  { name: 'Turkey', code: 'tr', category: 'SEMI_PERIPHERY', clue: 'Bridge between Europe and Asia—textiles, tourism, and regional power' },
  { name: 'South Africa', code: 'za', category: 'SEMI_PERIPHERY', clue: 'Africa\'s largest economy—gold, diamonds, and a major regional trade hub' },
  { name: 'Thailand', code: 'th', category: 'SEMI_PERIPHERY', clue: 'Electronics assembly, rice exports, and a major tourism destination' },
  { name: 'Malaysia', code: 'my', category: 'SEMI_PERIPHERY', clue: 'Palm oil, electronics, and a growing middle-income economy' },
  { name: 'Bangladesh', code: 'bd', category: 'PERIPHERY', clue: 'Makes much of the world\'s clothing—massive garment industry, low wages' },
  { name: 'Democratic Republic of the Congo', code: 'cd', category: 'PERIPHERY', clue: 'Rich in cobalt and minerals that power your devices—but little wealth stays here' },
  { name: 'Ethiopia', code: 'et', category: 'PERIPHERY', clue: 'Coffee\'s birthplace, fast-growing population, dependent on aid and commodity exports' },
  { name: 'Cambodia', code: 'kh', category: 'PERIPHERY', clue: 'Clothing factories, tourism revenue, still recovering from historical conflict' },
  { name: 'Nepal', code: 'np', category: 'PERIPHERY', clue: 'Workers abroad send money home (remittances)—the main economic lifeline' },
  { name: 'Haiti', code: 'ht', category: 'PERIPHERY', clue: 'Poorest nation in the Western Hemisphere, heavily dependent on foreign aid' },
  { name: 'Madagascar', code: 'mg', category: 'PERIPHERY', clue: 'World\'s top vanilla exporter—unique wildlife, but very high poverty' },
  { name: 'Myanmar', code: 'mm', category: 'PERIPHERY', clue: 'Garment factories, jade mines, ongoing political instability' },
];

export const feudQuestionPool = [
  {
    id: 'everyday-globalization',
    question: 'What\'s the first thing people think of when they hear "globalization"?',
    insight: 'Globalization is everywhere—we mostly notice it through screens and shopping.',
    answers: [
      { label: 'Internet and social media', points: 40, match: ['internet', 'social media', 'social', 'online'] },
      { label: 'Global brands (Nike, Apple, etc.)', points: 30, match: ['brands', 'global brands', 'brand', 'nike', 'apple'] },
      { label: 'Travel and flights', points: 20, match: ['travel', 'flights', 'plane', 'tourism'] },
      { label: 'Online shopping (Shopee, Amazon)', points: 10, match: ['online shopping', 'shopping', 'ecommerce', 'e-commerce', 'shopee', 'amazon'] },
    ],
  },
  {
    id: 'supply-chain-signals',
    question: 'What makes you realize something came from another country?',
    insight: 'Almost every product you own has parts or origins from multiple countries.',
    answers: [
      { label: '"Made in another country" label', points: 35, match: ['made in', 'another country', 'foreign label', 'imported'] },
      { label: 'Different parts from different places', points: 25, match: ['parts', 'different places', 'components', 'assembled'] },
      { label: 'Famous international brand', points: 25, match: ['multinational', 'global brand', 'familiar brand', 'brand'] },
      { label: 'It was shipped from overseas', points: 15, match: ['shipped', 'overseas', 'cargo', 'shipping'] },
    ],
  },
  {
    id: 'global-institutions',
    question: 'Who do people think helps solve global problems?',
    insight: 'No single country can fix climate change or pandemics alone—that\'s why global institutions exist.',
    answers: [
      { label: 'United Nations (UN)', points: 40, match: ['united nations', 'un', 'u.n.'] },
      { label: 'World Health Organization (WHO)', points: 20, match: ['world health organization', 'who'] },
      { label: 'World Bank', points: 20, match: ['world bank'] },
      { label: 'International Monetary Fund (IMF)', points: 20, match: ['imf', 'international monetary fund'] },
    ],
  },
  {
    id: 'foods-that-travel',
    question: 'Which food screams "globalization"?',
    insight: 'Food crossing borders is one of the oldest and tastiest forms of cultural exchange.',
    answers: [
      { label: 'Burgers and fries', points: 35, match: ['burger', 'burgers', 'fries', 'burger and fries'] },
      { label: 'Pizza', points: 25, match: ['pizza'] },
      { label: 'Sushi / ramen', points: 25, match: ['sushi', 'ramen'] },
      { label: 'Samgyupsal / Korean BBQ', points: 15, match: ['korean barbecue', 'samgyupsal', 'samgyeopsal', 'korean bbq'] },
    ],
  },
  {
    id: 'outsourcing-reasons',
    question: 'Why do companies move jobs to other countries?',
    insight: 'Cheaper labor abroad means lower prices for consumers—but fewer local jobs.',
    answers: [
      { label: 'Cheaper labor', points: 40, match: ['lower labor costs', 'cheap labor', 'lower wages', 'cost', 'cheaper'] },
      { label: 'Faster production', points: 20, match: ['faster production', 'faster', 'speed', 'quick'] },
      { label: 'Skilled workers', points: 20, match: ['specialized skills', 'skills', 'talent', 'expertise'] },
      { label: 'Different time zones (24/7 work)', points: 20, match: ['24/7', 'round the clock', 'different time zones', 'time zones', 'time'] },
    ],
  },
  {
    id: 'what-moves-fast',
    question: 'What spreads the fastest in today\'s world?',
    insight: 'Information travels at light speed—but people and goods still get stuck at borders.',
    answers: [
      { label: 'Information (news, posts)', points: 35, match: ['information', 'news', 'data'] },
      { label: 'Money and capital', points: 30, match: ['money', 'capital', 'finance'] },
      { label: 'Culture (music, trends)', points: 20, match: ['culture', 'media', 'music', 'shows', 'trends'] },
      { label: 'People (migration)', points: 15, match: ['people', 'migration', 'workers', 'students'] },
    ],
  },
  {
    id: 'competition-for-growth',
    question: 'What do countries compete for in the global economy?',
    insight: 'Countries compete for a bigger slice of the global economy—just like businesses do.',
    answers: [
      { label: 'Foreign investment', points: 35, match: ['investment', 'foreign investment', 'investors'] },
      { label: 'Export markets', points: 25, match: ['export markets', 'exports', 'trade partners', 'trade','export'] },
      { label: 'Tourists', points: 20, match: ['tourists', 'tourism', 'tourist'] },
      { label: 'Technology and innovation', points: 20, match: ['technology', 'innovation', 'tech'] },
    ],
  },
  {
    id: 'globalization-concerns',
    question: 'What\'s the biggest downside people connect to globalization?',
    insight: 'Globalization creates winners and losers—the gap between them is the main debate.',
    answers: [
      { label: 'Inequality (rich vs. poor)', points: 35, match: ['inequality', 'gap', 'poverty gap', 'rich', 'poor'] },
      { label: 'Job loss from outsourcing', points: 25, match: ['job loss', 'outsourcing', 'jobs leaving', 'jobs'] },
      { label: 'Cultural sameness (everything looks the same)', points: 20, match: ['cultural sameness', 'homogeneity', 'same culture', 'westernization', 'same'] },
      { label: 'Environmental damage', points: 20, match: ['environment', 'pollution', 'climate', 'environmental strain', 'damage'] },
    ],
  },
];

export const stageRecaps = {
  stage1: {
    title: 'Intel Briefing · Global Flows',
    summary:
      'You just pinned the places where globalization happens. Trade, culture, money, and cooperation all flow through real locations.',
    bullets: [
      'Globalization started with ships and explorers, not Wi-Fi.',
      'Culture, money, and goods each move differently—some instantly, some slowly.',
      'Infrastructure (ports, cities, institutions) is what makes global flow possible.',
    ],
    resourceIds: [
      'introduction-to-globalization',
      'market-integration',
      'global-economy',
      'global-governance',
    ],
  },
  stage2: {
    title: 'Intel Briefing · World-Systems',
    summary:
      'CORE = rich countries that run global business. SEMI = growing economies in the middle. PERIPHERY = countries that mostly supply labor and raw materials.',
    bullets: [
      'CORE countries control finance, tech, and high-value production.',
      'SEMI-PERIPHERY nations are growing and bridge extraction with manufacturing.',
      'PERIPHERY zones supply labor and resources but capture little of the profit.',
    ],
    resourceIds: ['introduction-to-globalization', 'global-economy'],
  },
  stage3: {
    title: 'Intel Briefing · Everyday Globalization',
    summary:
      'Globalization isn\'t just a textbook idea—it\'s in your phone, your food, your social media feed.',
    bullets: [
      'Brands, media, and apps are how most people experience globalization daily.',
      'Global institutions exist because problems like pandemics cross every border.',
      'The big debate: who benefits, and who gets left behind?',
    ],
    resourceIds: [
      'introduction-to-globalization',
      'global-economy',
      'global-governance',
      'interstate-system-and-sovereignty',
    ],
  },
};
