export const fetchRandomWord = async (): Promise<string> => {
  try {
    const response = await fetch(import.meta.env.VITE_API_URL, {
      headers: { 'X-Api-Key': import.meta.env.VITE_API_KEY },
    });
    const data: { word: string } = await response.json();
    return data.word;
  } catch (error) {
    console.error('Error fetching word:', error);
    return 'Oops! No word today.';
  }
};
