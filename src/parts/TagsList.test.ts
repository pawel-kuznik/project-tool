import { describe, it, expect, beforeEach } from 'vitest';
import { TagsList } from './TagsList';

describe('TagsList', () => {
    let tagsList: TagsList;

    beforeEach(() => {
        tagsList = new TagsList();
    });

    describe('constructor', () => {
        it('should create an empty TagsList when no input is provided', () => {
            const list = new TagsList();
            expect(list.tags).toEqual([]);
        });

        it('should create a TagsList with initial tags', () => {
            const list = new TagsList(['tag1', 'tag2', 'tag3']);
            expect(list.tags).toEqual(['tag1', 'tag2', 'tag3']);
        });

        it('should normalize tags in constructor', () => {
            const list = new TagsList(['  TAG1  ', 'TAG2', '  tag3  ']);
            expect(list.tags).toEqual(['tag1', 'tag2', 'tag3']);
        });

        it('should handle empty array in constructor', () => {
            const list = new TagsList([]);
            expect(list.tags).toEqual([]);
        });

        it('should remove duplicate tags in constructor', () => {
            const list = new TagsList(['tag1', 'TAG1', 'tag1']);
            expect(list.tags).toEqual(['tag1']);
        });
    });

    describe('tags getter', () => {
        it('should return an empty array for new TagsList', () => {
            expect(tagsList.tags).toEqual([]);
        });

        it('should return readonly array of tags', () => {
            tagsList.addTag('tag1');
            tagsList.addTag('tag2');
            const tags = tagsList.tags;
            expect(tags).toEqual(['tag1', 'tag2']);
            expect(() => {
                (tags as string[]).push('tag3');
            }).not.toThrow();
            // But the original list should not be modified
            expect(tagsList.tags).toEqual(['tag1', 'tag2']);
        });
    });

    describe('addTag', () => {
        it('should add a single tag', () => {
            tagsList.addTag('tag1');
            expect(tagsList.tags).toContain('tag1');
            expect(tagsList.tags.length).toBe(1);
        });

        it('should normalize tags when adding (trim and lowercase)', () => {
            tagsList.addTag('  TAG1  ');
            expect(tagsList.tags).toContain('tag1');
            expect(tagsList.tags).not.toContain('  TAG1  ');
        });

        it('should add multiple tags from an array', () => {
            tagsList.addTag(['tag1', 'tag2', 'tag3']);
            expect(tagsList.tags).toEqual(['tag1', 'tag2', 'tag3']);
        });

        it('should normalize tags when adding an array', () => {
            tagsList.addTag(['  TAG1  ', 'TAG2', '  tag3  ']);
            expect(tagsList.tags).toEqual(['tag1', 'tag2', 'tag3']);
        });

        it('should not add duplicate tags', () => {
            tagsList.addTag('tag1');
            tagsList.addTag('TAG1');
            tagsList.addTag('  tag1  ');
            expect(tagsList.tags).toEqual(['tag1']);
        });

        it('should be chainable', () => {
            tagsList.addTag('tag1').addTag('tag2').addTag('tag3');
            expect(tagsList.tags).toEqual(['tag1', 'tag2', 'tag3']);
        });

        it('should handle empty string tag', () => {
            tagsList.addTag('');
            expect(tagsList.tags).toEqual(['']);
        });

        it('should handle empty array', () => {
            tagsList.addTag([]);
            expect(tagsList.tags).toEqual([]);
        });

        it('should handle array with duplicates', () => {
            tagsList.addTag(['tag1', 'TAG1', 'tag1']);
            expect(tagsList.tags).toEqual(['tag1']);
        });

        it('should emit event when tags are changed', () => {
            tagsList.addTag(['tag1', 'tag2', 'tag3']);
            tagsList.on('changed', (event) => {
                expect(event.payload.tags).toEqual(['tag1', 'tag2', 'tag3', 'tag4']);
            });
            tagsList.addTag('tag4');
            expect(tagsList.tags).toEqual(['tag1', 'tag2', 'tag3', 'tag4']);
        });
    });

    describe('containsTag', () => {
        beforeEach(() => {
            tagsList.addTag(['tag1', 'tag2', 'tag3']);
        });

        it('should return true for existing single tag', () => {
            expect(tagsList.containsTag('tag1')).toBe(true);
        });

        it('should return false for non-existing single tag', () => {
            expect(tagsList.containsTag('tag4')).toBe(false);
        });

        it('should be case-insensitive', () => {
            expect(tagsList.containsTag('TAG1')).toBe(true);
            expect(tagsList.containsTag('Tag2')).toBe(true);
        });

        it('should handle whitespace in query', () => {
            expect(tagsList.containsTag('  tag1  ')).toBe(true);
        });

        it('should return true when all tags in array exist', () => {
            expect(tagsList.containsTag(['tag1', 'tag2'])).toBe(true);
            expect(tagsList.containsTag(['tag1', 'tag2', 'tag3'])).toBe(true);
        });

        it('should return false when any tag in array does not exist', () => {
            expect(tagsList.containsTag(['tag1', 'tag4'])).toBe(false);
            expect(tagsList.containsTag(['tag4', 'tag5'])).toBe(false);
        });

        it('should return false for empty TagsList', () => {
            const emptyList = new TagsList();
            expect(emptyList.containsTag('tag1')).toBe(false);
            expect(emptyList.containsTag(['tag1', 'tag2'])).toBe(false);
        });

        it('should return true for empty array query when list has tags', () => {
            // Empty array should return true (all tags exist - there are none to check)
            expect(tagsList.containsTag([])).toBe(true);
        });

        it('should return false for empty array query when list is empty', () => {
            const emptyList = new TagsList();
            // Empty list returns false for any query (including empty array)
            expect(emptyList.containsTag([])).toBe(false);
        });

        it('should handle array with duplicates in query', () => {
            expect(tagsList.containsTag(['tag1', 'tag1', 'tag2'])).toBe(true);
        });
    });

    describe('removeTag', () => {
        beforeEach(() => {
            tagsList.addTag(['tag1', 'tag2', 'tag3']);
        });

        it('should remove a single tag', () => {
            tagsList.removeTag('tag1');
            expect(tagsList.tags).not.toContain('tag1');
            expect(tagsList.tags).toContain('tag2');
            expect(tagsList.tags).toContain('tag3');
        });

        it('should normalize tag when removing', () => {
            tagsList.removeTag('  TAG1  ');
            expect(tagsList.tags).not.toContain('tag1');
        });

        it('should remove multiple tags from an array', () => {
            tagsList.removeTag(['tag1', 'tag2']);
            expect(tagsList.tags).not.toContain('tag1');
            expect(tagsList.tags).not.toContain('tag2');
            expect(tagsList.tags).toContain('tag3');
        });

        it('should normalize tags when removing an array', () => {
            tagsList.removeTag(['  TAG1  ', 'TAG2']);
            expect(tagsList.tags).not.toContain('tag1');
            expect(tagsList.tags).not.toContain('tag2');
        });

        it('should be chainable', () => {
            tagsList.removeTag('tag1').removeTag('tag2');
            expect(tagsList.tags).toEqual(['tag3']);
        });

        it('should not throw when removing non-existing tag', () => {
            expect(() => tagsList.removeTag('tag4')).not.toThrow();
            expect(tagsList.tags).toEqual(['tag1', 'tag2', 'tag3']);
        });

        it('should handle empty array', () => {
            tagsList.removeTag([]);
            expect(tagsList.tags).toEqual(['tag1', 'tag2', 'tag3']);
        });

        it('should handle removing all tags', () => {
            tagsList.removeTag(['tag1', 'tag2', 'tag3']);
            expect(tagsList.tags).toEqual([]);
        });

        it('should emit event when tags are changed', () => {
            tagsList.on('changed', (event) => {
                expect(event.payload.tags).toEqual(['tag1', 'tag2', 'tag3']);
            });
            tagsList.removeTag('tag4');
            expect(tagsList.tags).toEqual(['tag1', 'tag2', 'tag3']);
        });
    });

    describe('integration scenarios', () => {
        it('should handle complex tag operations', () => {
            tagsList.addTag(['tag1', 'tag2']);
            expect(tagsList.containsTag(['tag1', 'tag2'])).toBe(true);
            
            tagsList.addTag('tag3');
            expect(tagsList.tags.length).toBe(3);
            
            tagsList.removeTag('tag2');
            expect(tagsList.containsTag('tag2')).toBe(false);
            expect(tagsList.containsTag(['tag1', 'tag3'])).toBe(true);
        });

        it('should maintain tag uniqueness across operations', () => {
            tagsList.addTag('tag1');
            tagsList.addTag('TAG1');
            tagsList.addTag('  tag1  ');
            expect(tagsList.tags.length).toBe(1);
            
            tagsList.addTag(['tag2', 'TAG2', '  tag2  ']);
            expect(tagsList.tags.length).toBe(2);
        });

        it('should handle case-insensitive tag matching', () => {
            tagsList.addTag('JavaScript');
            expect(tagsList.containsTag('javascript')).toBe(true);
            expect(tagsList.containsTag('JAVASCRIPT')).toBe(true);
            expect(tagsList.containsTag('  JavaScript  ')).toBe(true);
            
            tagsList.removeTag('JAVASCRIPT');
            expect(tagsList.containsTag('javascript')).toBe(false);
        });
    });
});

