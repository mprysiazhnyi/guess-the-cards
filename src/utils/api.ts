export const fetchRandomWord = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.api-ninjas.com/v1/randomword', {
      headers: { 'X-Api-Key': 'dtF3yrt680hNHbcr3kxSYg==sk2qOIbhbImCvA1k' },
    });
    const data: { word: string } = await response.json();
    return data.word;
  } catch (error) {
    console.error('Error fetching word:', error);
    return 'Oops! No word today.';
  }
};
