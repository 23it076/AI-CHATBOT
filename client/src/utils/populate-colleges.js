import { addMultipleColleges } from '@/lib/firebase';
import { gujaratColleges } from './gujarat-colleges-data';

/**
 * Utility function to populate Firebase with Gujarat colleges data
 * Run this function once from a component or directly call it in a useEffect 
 * CAUTION: Running this multiple times will create duplicate entries
 */
export const populateColleges = async () => {
  try {
    console.log(`Starting to populate ${gujaratColleges.length} Gujarat colleges...`);
    const addedCount = await addMultipleColleges(gujaratColleges);
    console.log(`Successfully added ${addedCount} colleges to Firebase!`);
    return addedCount;
  } catch (error) {
    console.error('Error populating colleges:', error);
    throw error;
  }
};