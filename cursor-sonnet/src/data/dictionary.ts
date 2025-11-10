/**
 * Scrabble dictionary loader
 * Loads words from dictionary.txt (comprehensive Scrabble word list)
 */

let dictionarySet: Set<string> | null = null;
let loadingPromise: Promise<Set<string>> | null = null;

/**
 * Loads the dictionary from the text file
 */
async function loadDictionary(): Promise<Set<string>> {
  if (dictionarySet) {
    return dictionarySet;
  }
  
  if (loadingPromise) {
    return loadingPromise;
  }
  
  loadingPromise = fetch('/dictionary.txt')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load dictionary');
      }
      return response.text();
    })
    .then(text => {
      // Split by lines and filter out empty lines
      const words = text
        .split('\n')
        .map(word => word.trim().toUpperCase())
        .filter(word => word.length >= 3 && word.length <= 10); // Only 3-10 letter words
      
      dictionarySet = new Set(words);
      console.log(`✅ Loaded ${dictionarySet.size} words from Scrabble dictionary`);
      return dictionarySet;
    })
    .catch(error => {
      console.error('Error loading dictionary:', error);
      // Fallback to minimal dictionary
      dictionarySet = new Set([
        'THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'CAN', 'HER',
        'CAT', 'DOG', 'RUN', 'JUMP', 'PLAY', 'WORD', 'GAME', 'TEST',
      ]);
      return dictionarySet;
    });
  
  return loadingPromise;
}

// Initialize dictionary loading on module import
loadDictionary();

/**
 * Checks if a word is valid in the Scrabble dictionary
 */
export function isValidWord(word: string): boolean {
  if (!dictionarySet) {
    console.warn('⚠️ Dictionary not loaded yet, rejecting word:', word);
    return false;
  }
  return dictionarySet.has(word.toUpperCase());
}

/**
 * Gets the dictionary Set (for use in other modules)
 * Returns null if not loaded yet
 */
export function getDictionary(): Set<string> | null {
  return dictionarySet;
}

/**
 * Ensures dictionary is loaded before starting game
 */
export async function ensureDictionaryLoaded(): Promise<void> {
  await loadDictionary();
}

// Export for backwards compatibility
export const dictionary = new Proxy({} as Set<string>, {
  get(_target, prop) {
    if (prop === 'has') {
      return (word: string) => isValidWord(word);
    }
    if (prop === 'size') {
      return dictionarySet?.size || 0;
    }
    return dictionarySet?.[prop as keyof Set<string>];
  }
});

/**
 * Gets word score based on length (deprecated - use Scrabble scoring)
 */
export function getWordScore(wordLength: number): number {
  if (wordLength < 3) return 0;
  if (wordLength === 3) return 50;
  if (wordLength === 4) return 100;
  if (wordLength === 5) return 200;
  return 400; // 6+ letters
}
