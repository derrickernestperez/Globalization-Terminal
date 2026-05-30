export const geoFlowPrompts = [
  {
    id: 'cebu-circumnavigation',
    title: 'Global Maritime Beginnings',
    prompt:
      'Place your marker where Magellan’s expedition made a historic landfall that symbolizes the closing of an early global maritime loop.', // palitan ng mas  madaaling prompt
    location: 'Cebu, Philippines', 
    country: 'Philippines',
    lat: 10.3157,
    lng: 123.8854,
    resourceId: 'introduction-to-globalization',
    trivia:
      'The course notes treat globalization as a long historical process. The first circumnavigation mattered because it showed that trade, conquest, and exchange could connect distant parts of the world in one continuous loop.',
    recapPoint:
      'Historical voyages remind us that globalization did not begin with smartphones. It has older roots in exploration, empire, trade, and religious expansion.',
  },
  {
    id: 'seoul-cultural-flows',
    title: 'Cultural and Media Flows',
    prompt:
      'Mark the city that stands in for today’s fast-moving cultural exports, where music, beauty, and television circulate across borders in real time.',
    location: 'Seoul, South Korea',
    country: 'South Korea',
    lat: 37.5665,
    lng: 126.978,
    resourceId: 'introduction-to-globalization',
    trivia:
      'The introduction file describes globalization through flows and liquidity. Korean popular culture is a useful example because music, video, fashion, and fan communities move quickly across borders and are hard to contain once they spread online.',
    recapPoint:
      'Culture travels through highly porous networks. A song, show, or trend can now circulate internationally in hours rather than decades.',
  },
  {
    id: 'dhaka-garment-chain',
    title: 'Garment Supply Chains',
    prompt:
      'Choose the manufacturing center that represents how global apparel chains connect low-cost labor, export production, and consumer markets.',
    location: 'Dhaka, Bangladesh',
    country: 'Bangladesh',
    lat: 23.8103,
    lng: 90.4125,
    resourceId: 'global-economy',
    trivia:
      'The global economy notes emphasize supply chains, outsourcing, and the unequal pressures of incorporation into the world economy. Garment production in Bangladesh often illustrates how firms search for lower production costs while wealthy markets capture much of the value.',
    recapPoint:
      'Global supply chains are built through uneven power. Production can be outsourced to places with cheaper labor while branding and profits remain concentrated elsewhere.',
  },
  {
    id: 'rotterdam-market-integration',
    title: 'Integrated Trade Gateways',
    prompt:
      'Pin the European port city that symbolizes how integrated markets depend on infrastructure, trade corridors, and shared commercial rules.',
    location: 'Rotterdam, Netherlands',
    country: 'Netherlands',
    lat: 51.9244,
    lng: 4.4777,
    resourceId: 'market-integration',
    trivia:
      'The market integration slides explain that national economies become more closely linked when barriers fall and trade, labor, and capital move more freely. Major logistics hubs show what that integration looks like in practice.',
    recapPoint:
      'Market integration is not abstract. It depends on ports, shipping routes, customs systems, and agreements that let goods move at scale.',
  },
  {
    id: 'new-york-finance',
    title: 'Financial Liquidity',
    prompt:
      'Select the financial center that best represents how capital can move, react, and reshape economies almost instantly.',
    location: 'New York City, United States',
    country: 'United States',
    lat: 40.7128,
    lng: -74.006,
    resourceId: 'global-economy',
    trivia:
      'The course material links globalization to liquidity: a world in which finance and information move rapidly through space and time. Global financial hubs matter because decisions made there can affect jobs, prices, and debt far beyond national borders.',
    recapPoint:
      'The speed of global finance is one reason economic globalization feels unstable. Events in one major market can cascade across many others.',
  },
  {
    id: 'geneva-global-governance',
    title: 'Institutions Beyond One State',
    prompt:
      'Place your marker on the city that stands for transnational problem-solving through institutions, diplomacy, and shared rules.',
    location: 'Geneva, Switzerland',
    country: 'Switzerland',
    lat: 46.2044,
    lng: 6.1432,
    resourceId: 'global-governance',
    trivia:
      'The global governance file explains that the world does not have a single world government, but it does have laws, norms, institutions, and cooperative arrangements that mediate cross-border problems. Geneva symbolizes that institutional layer of globalization.',
    recapPoint:
      'Globalization is not only movement. It also creates pressure for institutions that coordinate health, law, trade, and diplomacy across states.',
  },
];

export const flagCountryPool = [
  { name: 'United States', code: 'us', category: 'CORE' },
  { name: 'Germany', code: 'de', category: 'CORE' },
  { name: 'Japan', code: 'jp', category: 'CORE' },
  { name: 'United Kingdom', code: 'gb', category: 'CORE' },
  { name: 'France', code: 'fr', category: 'CORE' },
  { name: 'Canada', code: 'ca', category: 'CORE' },
  { name: 'South Korea', code: 'kr', category: 'CORE' },
  { name: 'Australia', code: 'au', category: 'CORE' },
  { name: 'China', code: 'cn', category: 'SEMI_PERIPHERY' },
  { name: 'India', code: 'in', category: 'SEMI_PERIPHERY' },
  { name: 'Brazil', code: 'br', category: 'SEMI_PERIPHERY' },
  { name: 'Mexico', code: 'mx', category: 'SEMI_PERIPHERY' },
  { name: 'Turkey', code: 'tr', category: 'SEMI_PERIPHERY' },
  { name: 'South Africa', code: 'za', category: 'SEMI_PERIPHERY' },
  { name: 'Thailand', code: 'th', category: 'SEMI_PERIPHERY' },
  { name: 'Malaysia', code: 'my', category: 'SEMI_PERIPHERY' },
  { name: 'Bangladesh', code: 'bd', category: 'PERIPHERY' },
  { name: 'Democratic Republic of the Congo', code: 'cd', category: 'PERIPHERY' },
  { name: 'Ethiopia', code: 'et', category: 'PERIPHERY' },
  { name: 'Cambodia', code: 'kh', category: 'PERIPHERY' },
  { name: 'Nepal', code: 'np', category: 'PERIPHERY' },
  { name: 'Haiti', code: 'ht', category: 'PERIPHERY' },
  { name: 'Madagascar', code: 'mg', category: 'PERIPHERY' },
  { name: 'Myanmar', code: 'mm', category: 'PERIPHERY' },
];

export const feudQuestionPool = [
  {
    id: 'everyday-globalization',
    question: 'When people mention globalization, what everyday example comes to mind first?',
    answers: [
      { label: 'Internet and social media', points: 40, match: ['internet', 'social media', 'social', 'online'] },
      { label: 'International brands', points: 30, match: ['brands', 'global brands', 'brand'] },
      { label: 'Travel and flights', points: 20, match: ['travel', 'flights', 'plane', 'tourism'] },
      { label: 'Online shopping', points: 10, match: ['online shopping', 'shopping', 'ecommerce', 'e-commerce'] },
    ],
  },
  {
    id: 'supply-chain-signals',
    question: 'What clue makes people realize a product came through a global supply chain?',
    answers: [
      { label: 'Made in another country', points: 35, match: ['made in', 'another country', 'foreign label', 'imported'] },
      { label: 'Parts from different places', points: 25, match: ['parts', 'different places', 'components', 'assembled'] },
      { label: 'A familiar multinational brand', points: 25, match: ['multinational', 'global brand', 'familiar brand', 'brand'] },
      { label: 'It was shipped overseas', points: 15, match: ['shipped', 'overseas', 'cargo', 'shipping'] },
    ],
  },
  {
    id: 'global-institutions',
    question: 'Which institution do people usually name when they talk about solving world problems?',
    answers: [
      { label: 'United Nations', points: 40, match: ['united nations', 'un', 'u.n.'] },
      { label: 'World Health Organization', points: 20, match: ['world health organization', 'who'] },
      { label: 'World Bank', points: 20, match: ['world bank'] },
      { label: 'International Monetary Fund', points: 20, match: ['imf', 'international monetary fund'] },
    ],
  },
  {
    id: 'foods-that-travel',
    question: 'Which foods instantly remind people that culture travels across borders?',
    answers: [
      { label: 'Burgers and fries', points: 35, match: ['burger', 'burgers', 'fries', 'burger and fries'] },
      { label: 'Pizza', points: 25, match: ['pizza'] },
      { label: 'Sushi or ramen', points: 25, match: ['sushi', 'ramen'] },
      { label: 'Korean barbecue', points: 15, match: ['korean barbecue', 'samgyupsal', 'samgyeopsal', 'korean bbq'] },
    ],
  },
  {
    id: 'outsourcing-reasons',
    question: 'Why do companies move part of their work to another country?',
    answers: [
      { label: 'Lower labor costs', points: 40, match: ['lower labor costs', 'cheap labor', 'lower wages', 'cost'] },
      { label: 'Faster production', points: 20, match: ['faster production', 'faster', 'speed', 'quick'] },
      { label: 'Specialized skills', points: 20, match: ['specialized skills', 'skills', 'talent', 'expertise'] },
      { label: 'Round-the-clock operations', points: 20, match: ['24/7', 'round the clock', 'different time zones', 'time zones'] },
    ],
  },
  {
    id: 'what-moves-fast',
    question: 'What tends to move fastest in a globalized world?',
    answers: [
      { label: 'Information', points: 35, match: ['information', 'news', 'data'] },
      { label: 'Money and capital', points: 30, match: ['money', 'capital', 'finance'] },
      { label: 'Culture and media', points: 20, match: ['culture', 'media', 'music', 'shows'] },
      { label: 'People for work or study', points: 15, match: ['people', 'migration', 'workers', 'students'] },
    ],
  },
  {
    id: 'competition-for-growth',
    question: 'What do countries compete for in the global economy?',
    answers: [
      { label: 'Foreign investment', points: 35, match: ['investment', 'foreign investment', 'investors'] },
      { label: 'Export markets', points: 25, match: ['export markets', 'exports', 'trade partners', 'trade'] },
      { label: 'Tourists', points: 20, match: ['tourists', 'tourism'] },
      { label: 'Technology and innovation', points: 20, match: ['technology', 'innovation', 'tech'] },
    ],
  },
  {
    id: 'globalization-concerns',
    question: 'What concern do people often connect to globalization?',
    answers: [
      { label: 'Inequality', points: 35, match: ['inequality', 'gap', 'poverty gap'] },
      { label: 'Job loss from outsourcing', points: 25, match: ['job loss', 'outsourcing', 'jobs leaving'] },
      { label: 'Cultural sameness', points: 20, match: ['cultural sameness', 'homogeneity', 'same culture', 'westernization'] },
      { label: 'Environmental strain', points: 20, match: ['environment', 'pollution', 'climate', 'environmental strain'] },
    ],
  },
];

export const stageRecaps = {
  stage1: {
    title: 'Information Recap · Global Flows',
    summary:
      'Stage 1 connected places to ideas from the course: early voyages, cultural circulation, supply chains, finance, and governance all show different kinds of global flow.',
    bullets: [
      'Globalization has deep historical roots, not just recent digital ones.',
      'Flows can be cultural, financial, institutional, or material.',
      'Distance still matters, but technology and infrastructure make movement faster and denser.',
    ],
    resourceIds: [
      'introduction-to-globalization',
      'market-integration',
      'global-economy',
      'global-governance',
    ],
  },
  stage2: {
    title: 'Information Recap · World Systems',
    summary:
      'Stage 2 used World-Systems Theory as a way to think about unequal positions inside the global economy. These categories are analytical tools, not moral labels.',
    bullets: [
      'Core zones tend to control finance, technology, and higher-value production.',
      'Semi-periphery countries often bridge extraction, manufacturing, and rising domestic markets.',
      'Periphery zones are often pressured into supplying labor, raw materials, or low-value work.',
    ],
    resourceIds: ['introduction-to-globalization', 'global-economy'],
  },
  stage3: {
    title: 'Information Recap · Everyday Globalization',
    summary:
      'Stage 3 focused on what globalization feels like in ordinary life: brands, media, migration, outsourcing, institutions, and inequality.',
    bullets: [
      'The global economy shows up through consumption, outsourcing, and rapid circulation of information.',
      'Global governance matters because many cross-border problems cannot be handled by one state alone.',
      'Public debates about globalization often revolve around opportunity and inequality at the same time.',
    ],
    resourceIds: [
      'introduction-to-globalization',
      'global-economy',
      'global-governance',
      'interstate-system-and-sovereignty',
    ],
  },
};
