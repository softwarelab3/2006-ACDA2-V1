import { Stall } from "@/app/types/stall";
import { FilterState } from "@/components/search-bar";

/**
 * Filters stalls based on search query and filter criteria
 */
export function filterStalls(
  stalls: Array<Stall>, 
  searchQuery: string, 
  filters: FilterState | null
): Array<Stall> {
  return stalls.filter(stall => {
    // Text search filter - match stall name
    if (searchQuery && !stall.stallName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // If no filters are applied, return all stalls that match the search query
    if (!filters) return true;

    // Time filter logic
    if (!timeFilterMatches(stall, filters)) {
      return false;
    }

    // Cuisine type filter
    if (!cuisineFilterMatches(stall, filters)) {
      return false;
    }

    // Price range filter
    if (filters.priceRange && stall.priceRange !== filters.priceRange) {
      return false;
    }

    // Location filter
    if (filters.location && stall.hawkerCenter.name !== filters.location) {
      return false;
    }

    // Hygiene rating filter
    if (filters.hygieneRating && stall.hygieneRating !== filters.hygieneRating) {
      return false;
    }

    // If all filters pass, include the stall
    return true;
  });
}

/**
 * Checks if stall matches the time filter criteria
 */
function timeFilterMatches(stall: Stall, filters: FilterState): boolean {
  // Start time filter (stall should open at or before the specified time)
  if (filters.startTime && stall.startTime > filters.startTime) {
    return false;
  }

  // End time filter (stall should close at or after the specified time)
  if (filters.endTime && stall.endTime < filters.endTime) {
    return false;
  }

  return true;
}

/**
 * Checks if stall matches the cuisine filter criteria
 */
function cuisineFilterMatches(stall: Stall, filters: FilterState): boolean {
  if (filters.foodPreferences.length === 0) {
    return true; // No cuisine filter applied
  }

  // Convert stall cuisines to lowercase strings for case-insensitive comparison
  const stallCuisines = stall.cuisineType.map(c => c.toString().toLowerCase());
  
  // Check if at least one of the selected cuisines matches the stall
  return filters.foodPreferences.some(cuisine => 
    stallCuisines.includes(cuisine.toLowerCase())
  );
}

/**
 * Checks if any filters are active
 */
export function hasActiveFilters(filters: FilterState): boolean {
  return !!(
    filters.startTime || 
    filters.endTime || 
    filters.foodPreferences.length > 0 || 
    filters.priceRange || 
    filters.location || 
    filters.hygieneRating
  );
}

/**
 * Counts the number of active filters
 */
export function countActiveFilters(filters: FilterState): number {
  let count = 0;
  if (filters.startTime) count++;
  if (filters.endTime) count++;
  count += filters.foodPreferences.length;
  if (filters.priceRange) count++;
  if (filters.location) count++;
  if (filters.hygieneRating) count++;
  return count;
}