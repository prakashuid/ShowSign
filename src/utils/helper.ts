interface Item {
    pathname: string;
    uploadedAt: string; // Assuming uploadedAt is a string; change if it's Date or other type
    // Add other properties of Item if needed
  }
  
  export interface CombinedItem {
    signature: any;
    captured: any;
 
  }
  
  export function combineItemsByCoreIdentifier(items: Item[]): CombinedItem[] {
    // Create a map to store items by the core part of their pathname
    const map: Record<string, Partial<CombinedItem>> = {};
  
    // Iterate over each item in the input array
    items.forEach(item => {
      const { pathname } = item;
  
      // Remove the "captured-" or "signature-" prefix to get the unique identifier
      const corePathname = pathname.replace(/^(captured-|signature-)/, '');
  
      // Ensure that the map has an entry for the current corePathname
      if (!map[corePathname]) {
        map[corePathname] = {};
      }
  
      // Depending on the original pathname, assign the item to the correct property
      if (pathname.startsWith('signature')) {
        map[corePathname].signature = item;
      } else if (pathname.startsWith('captured')) {
        map[corePathname].captured = item;
      }
    });
  
    // Filter out entries that don't have both signature and captured items
    const combinedItems: CombinedItem[] = Object.values(map).filter(
      (entry): entry is CombinedItem => entry.signature !== undefined && entry.captured !== undefined
    );
  
    combinedItems.sort((a, b) => {
      const dateA = new Date(a.signature.uploadedAt);
      const dateB = new Date(b.signature.uploadedAt);
      return dateB.getTime() - dateA.getTime(); // Sort descending
    });
  
    return combinedItems;
  }
  