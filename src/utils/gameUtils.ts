import Cookies from 'js-cookie';

export const saveGameToCookie = (correctCount: number) => {
  const gameData = {
    score: correctCount,
    date: new Date().toLocaleString(), // Format date
  };

  const existingGames = Cookies.get('games')
    ? JSON.parse(Cookies.get('games') || '[]')
    : [];

  existingGames.push(gameData);
  Cookies.set('games', JSON.stringify(existingGames), { expires: 365 });
};
