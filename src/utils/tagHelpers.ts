/**
 * Tag management utilities for transactions
 */

export interface Tag {
  id: string;
  name: string;
  color: string;
}

// Predefined tag colors
export const TAG_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#84CC16', // Lime
] as const;

/**
 * Generate a unique tag ID
 */
export function generateTagId(): string {
  return `tag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new tag
 */
export function createTag(name: string, color?: string): Tag {
  return {
    id: generateTagId(),
    name: name.trim(),
    color: color || TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)],
  };
}

/**
 * Get a random tag color
 */
export function getRandomTagColor(): string {
  return TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
}

/**
 * Normalize tag name for comparison (lowercase, trimmed)
 */
export function normalizeTagName(name: string): string {
  return name.toLowerCase().trim();
}

/**
 * Check if a tag with the given name exists in a list
 */
export function tagExists(tags: Tag[], name: string): boolean {
  const normalizedName = normalizeTagName(name);
  return tags.some(tag => normalizeTagName(tag.name) === normalizedName);
}

/**
 * Find a tag by name (case-insensitive)
 */
export function findTagByName(tags: Tag[], name: string): Tag | undefined {
  const normalizedName = normalizeTagName(name);
  return tags.find(tag => normalizeTagName(tag.name) === normalizedName);
}

/**
 * Add a tag to a transaction's tag array
 */
export function addTagToTransaction(existingTags: string[] | undefined, newTag: string): string[] {
  const tags = existingTags || [];
  if (!tags.includes(newTag)) {
    return [...tags, newTag];
  }
  return tags;
}

/**
 * Remove a tag from a transaction's tag array
 */
export function removeTagFromTransaction(existingTags: string[] | undefined, tagToRemove: string): string[] {
  const tags = existingTags || [];
  return tags.filter(tag => tag !== tagToRemove);
}

/**
 * Get tag color by name from a tag list
 */
export function getTagColor(tags: Tag[], name: string): string | undefined {
  const tag = findTagByName(tags, name);
  return tag?.color;
}

/**
 * Parse tag input (comma-separated or array)
 */
export function parseTagInput(input: string): string[] {
  return input
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
}

/**
 * Get commonly used tags from transactions
 */
export function getMostUsedTags(transactionTags: (string[] | undefined)[], limit: number = 10): string[] {
  const tagCounts = new Map<string, number>();

  transactionTags.forEach(tags => {
    if (tags) {
      tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    }
  });

  return Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag);
}
