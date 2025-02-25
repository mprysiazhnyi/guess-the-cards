export const generateRandomHand = (): string[] => {
  const suits = ['♥', '♦', '♣', '♠'];
  const values = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
    'A',
  ];

  const generatedHand: string[] = [];
  const usedCards: Set<string> = new Set();

  while (generatedHand.length < 5) {
    const value = values[Math.floor(Math.random() * 13)];
    const suit = suits[Math.floor(Math.random() * 4)];
    const card = `${value}${suit}`;

    if (!usedCards.has(card)) {
      generatedHand.push(card);
      usedCards.add(card);
    }
  }

  return generatedHand;
};

export const getRandomRanks = (correctRank: string): string[] => {
  const allRanks = [
    'Straight Flush',
    'Four of a Kind',
    'Full House',
    'Flush',
    'Straight',
    'Three of a Kind',
    'Two Pair',
    'One Pair',
    'High Card',
  ];
  const incorrectRanks = allRanks.filter((rank) => rank !== correctRank);
  return [
    correctRank,
    ...incorrectRanks.sort(() => 0.5 - Math.random()).slice(0, 2),
  ].sort(() => 0.5 - Math.random());
};

export const classifyHandByCustomLogic = (hand: string[]): string => {
  const values = hand.map((card) => card.slice(0, -1)); // Get the values of the cards
  const uniqueValues = [...new Set(values)];

  if (uniqueValues.length === 2) {
    const counts = values.reduce(
      (acc: { [key: string]: number }, val: string) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      },
      {}
    );
    const countValues = Object.values(counts);

    if (countValues.includes(4)) {
      return 'Four of a Kind';
    } else if (countValues.includes(3) && countValues.includes(2)) {
      return 'Full House';
    }
  }

  if (uniqueValues.length === 3) {
    const counts = values.reduce(
      (acc: { [key: string]: number }, val: string) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      },
      {}
    );
    const countValues = Object.values(counts);

    if (countValues.includes(3)) {
      return 'Three of a Kind';
    } else if (countValues.includes(2)) {
      return 'Two Pair';
    }
  }

  if (uniqueValues.length === 4) {
    return 'One Pair';
  }

  return 'High Card';
};

export const isRedCard = (card: string): boolean => {
  return card.includes('♦') || card.includes('♥');
};
