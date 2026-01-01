import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StatusManager } from './StatusManager';
import { InvalidInputError } from '../errors/InvalidInputError';
import { Emitter } from '@pawel-kuznik/iventy';

describe('StatusManager', () => {
    let statusManager: StatusManager;

    beforeEach(() => {
        statusManager = new StatusManager();
    });

    describe('initialization', () => {
        it('should initialize with default status "pending"', () => {
            expect(statusManager.status).toBe('pending');
        });

        it('should initialize with default available statuses', () => {
            expect(statusManager.availableStatuses).toEqual(['pending', 'in progress', 'done']);
        });
    });

    describe('status getter', () => {
        it('should return the current status', () => {
            expect(statusManager.setStatus('in progress'));
            expect(statusManager.status).toBe('in progress');
        });
    });

    describe('availableStatuses getter', () => {
        it('should return a copy of available statuses', () => {
            const statuses = statusManager.availableStatuses;
            statuses.push('new status');
            expect(statusManager.availableStatuses).toEqual(['pending', 'in progress', 'done']);
        });

        it('should return updated statuses after setAvailableStatuses', () => {
            statusManager.setAvailableStatuses(['new1', 'new2', 'new3']);
            expect(statusManager.availableStatuses).toEqual(['new1', 'new2', 'new3']);
        });
    });

    describe('setStatus', () => {
        beforeEach(() => {
            statusManager.setStatus('pending');
        });

        it('should set a valid status', () => {
            statusManager.setStatus('in progress');
            expect(statusManager.status).toBe('in progress');
        });

        it('should normalize status (lowercase and trim)', () => {
            statusManager.setStatus('  IN PROGRESS  ');
            expect(statusManager.status).toBe('in progress');
        });

        it('should throw InvalidInputError for invalid status', () => {
            expect(() => {
                statusManager.setStatus('invalid status');
            }).toThrow(InvalidInputError);
        });

        it('should not change status if setting the same status', () => {
            statusManager.setStatus('in progress');
            const callback = vi.fn();
            statusManager.on('changed.status', callback);
            
            statusManager.setStatus('in progress');
            
            // Event should not be triggered for same status
            expect(callback).not.toHaveBeenCalled();
        });

        it('should emit changed.status event when status changes', () => {

            statusManager.setStatus('pending');

            const callback = vi.fn();
            statusManager.on('changed.status', callback);
            
            statusManager.setStatus('done');
            
            expect(callback).toHaveBeenCalledTimes(1);
        });

        it('should be chainable', () => {
            const result = statusManager.setStatus('in progress');
            expect(result).toBe(statusManager);
        });

        it('should handle all default statuses', () => {
            statusManager.setStatus('pending');
            expect(statusManager.status).toBe('pending');
            
            statusManager.setStatus('in progress');
            expect(statusManager.status).toBe('in progress');
            
            statusManager.setStatus('done');
            expect(statusManager.status).toBe('done');
        });
    });

    describe('setAvailableStatuses', () => {
        it('should set available statuses', () => {
            statusManager.setAvailableStatuses(['todo', 'doing', 'done']);
            expect(statusManager.availableStatuses).toEqual(['todo', 'doing', 'done']);
        });

        it('should normalize statuses (lowercase and trim)', () => {
            statusManager.setAvailableStatuses(['  TODO  ', 'DOING', '  done  ']);
            expect(statusManager.availableStatuses).toEqual(['todo', 'doing', 'done']);
        });

        it('should remove duplicate statuses', () => {
            statusManager.setAvailableStatuses(['todo', 'TODO', 'todo', 'done']);
            expect(statusManager.availableStatuses).toEqual(['todo', 'done']);
        });

        it('should filter out empty strings', () => {
            statusManager.setAvailableStatuses(['todo', '', '  ', 'done']);
            expect(statusManager.availableStatuses).toEqual(['todo', 'done']);
        });

        it('should throw InvalidInputError for null or undefined', () => {
            expect(() => {
                statusManager.setAvailableStatuses(null as any);
            }).toThrow(InvalidInputError);
            expect(() => {
                statusManager.setAvailableStatuses(null as any);
            }).toThrow('Available statuses cannot be empty');
        });

        it('should throw InvalidInputError for empty array', () => {
            expect(() => {
                statusManager.setAvailableStatuses([]);
            }).toThrow(InvalidInputError);
            expect(() => {
                statusManager.setAvailableStatuses([]);
            }).toThrow('Available statuses cannot be empty');
        });

        it('should throw InvalidInputError when all statuses are empty strings', () => {
            expect(() => {
                statusManager.setAvailableStatuses(['', '  ', '   ']);
            }).toThrow(InvalidInputError);
            expect(() => {
                statusManager.setAvailableStatuses(['', '  ', '   ']);
            }).toThrow('Statuses cannot be empty strings');
        });

        it('should emit changed.status event with availableStatuses', () => {
            const callback = vi.fn();
            statusManager.on('changed.status', callback);
            
            statusManager.setAvailableStatuses(['new1', 'new2']);
            
            expect(callback).toHaveBeenCalledTimes(1);
        });

        it('should be chainable', () => {
            const result = statusManager.setAvailableStatuses(['todo', 'done']);
            expect(result).toBe(statusManager);
        });
    });

    describe('increaseStatus', () => {
        it('should increase status to next available status', () => {
            statusManager.setStatus('pending');
            statusManager.increaseStatus();
            expect(statusManager.status).toBe('in progress');
        });

        it('should increase status multiple times', () => {
            statusManager.setStatus('pending');
            statusManager.increaseStatus();
            expect(statusManager.status).toBe('in progress');
            
            statusManager.increaseStatus();
            expect(statusManager.status).toBe('done');
        });

        it('should not change status when already at maximum', () => {
            statusManager.setStatus('done');
            const callback = vi.fn();
            statusManager.on('changed.status', callback);
            
            statusManager.increaseStatus();
            
            expect(statusManager.status).toBe('done');
            expect(callback).not.toHaveBeenCalled();
        });

        it('should throw InvalidInputError if current status is invalid', () => {
            // Manually set an invalid status by manipulating available statuses
            statusManager.setAvailableStatuses(['new1', 'new2']);
            // Current status 'pending' is no longer valid
            expect(() => {
                statusManager.increaseStatus();
            }).toThrow(InvalidInputError);
            expect(() => {
                statusManager.increaseStatus();
            }).toThrow('Invalid status: pending');
        });

        it('should emit event when status increases', () => {
            statusManager.setStatus('pending');
            const callback = vi.fn();
            statusManager.on('changed.status', callback);
            
            statusManager.increaseStatus();
            
            expect(callback).toHaveBeenCalledTimes(1);
        });

        it('should be chainable', () => {
            statusManager.setStatus('pending');
            const result = statusManager.increaseStatus();
            expect(result).toBe(statusManager);
        });
    });

    describe('decreaseStatus', () => {
        it('should decrease status to previous available status', () => {
            statusManager.setStatus('done');
            statusManager.decreaseStatus();
            expect(statusManager.status).toBe('in progress');
        });

        it('should decrease status multiple times', () => {
            statusManager.setStatus('done');
            statusManager.decreaseStatus();
            expect(statusManager.status).toBe('in progress');
            
            statusManager.decreaseStatus();
            expect(statusManager.status).toBe('pending');
        });

        it('should not change status when already at minimum', () => {
            statusManager.setStatus('pending');
            const callback = vi.fn();
            statusManager.on('changed.status', callback);
            
            statusManager.decreaseStatus();
            
            expect(statusManager.status).toBe('pending');
            expect(callback).not.toHaveBeenCalled();
        });

        it('should throw InvalidInputError if current status is invalid', () => {
            // Manually set an invalid status by manipulating available statuses
            statusManager.setAvailableStatuses(['new1', 'new2']);
            // Current status 'pending' is no longer valid
            expect(() => {
                statusManager.decreaseStatus();
            }).toThrow(InvalidInputError);
            expect(() => {
                statusManager.decreaseStatus();
            }).toThrow('Invalid status: pending');
        });

        it('should emit event when status decreases', () => {
            statusManager.setStatus('done');
            const callback = vi.fn();
            statusManager.on('changed.status', callback);
            
            statusManager.decreaseStatus();
            
            expect(callback).toHaveBeenCalledTimes(1);
        });

        it('should be chainable', () => {
            statusManager.setStatus('done');
            const result = statusManager.decreaseStatus();
            expect(result).toBe(statusManager);
        });
    });

    describe('event handling', () => {
        it('should handle events via handle method', () => {
            const callback = vi.fn();
            const uninstaller = statusManager.handle('changed.status', callback);
            
            statusManager.setStatus('in progress');
            
            expect(callback).toHaveBeenCalledTimes(1);
            expect(uninstaller).toBeDefined();
            expect(typeof uninstaller).toBe('function');
        });

        it('should uninstall event handler', () => {
            const callback = vi.fn();
            const uninstaller = statusManager.handle('changed.status', callback);
            
            uninstaller();
            statusManager.setStatus('in progress');
            
            expect(callback).not.toHaveBeenCalled();
        });

        it('should listen to events via on method', () => {
            const callback = vi.fn();
            statusManager.on('changed.status', callback);
            
            statusManager.setStatus('in progress');
            
            expect(callback).toHaveBeenCalledTimes(1);
        });

        it('should be chainable with on method', () => {
            const callback = vi.fn();
            const result = statusManager.on('changed.status', callback);
            expect(result).toBe(statusManager);
        });

        it('should stop listening via off method', () => {
            const callback = vi.fn();
            statusManager.on('changed.status', callback);
            
            statusManager.off('changed.status', callback);
            statusManager.setStatus('in progress');
            
            expect(callback).not.toHaveBeenCalled();
        });

        it('should be chainable with off method', () => {
            const callback = vi.fn();
            const result = statusManager.off('changed.status', callback);
            expect(result).toBe(statusManager);
        });

        it('should bubble events to parent emitter', () => {
            const parentEmitter = new Emitter();
            const parentCallback = vi.fn();
            parentEmitter.on('changed.status', parentCallback);
            
            statusManager.bubbleTo(parentEmitter);
            statusManager.setStatus('in progress');
            
            expect(parentCallback).toHaveBeenCalledTimes(1);
        });

        it('should be chainable with bubbleTo method', () => {
            const parentEmitter = new Emitter();
            const result = statusManager.bubbleTo(parentEmitter);
            expect(result).toBe(statusManager);
        });
    });

    describe('integration scenarios', () => {
        it('should handle complete status progression', () => {
            expect(statusManager.status).toBe('pending');
            
            statusManager.increaseStatus();
            expect(statusManager.status).toBe('in progress');
            
            statusManager.increaseStatus();
            expect(statusManager.status).toBe('done');
            
            statusManager.decreaseStatus();
            expect(statusManager.status).toBe('in progress');
            
            statusManager.decreaseStatus();
            expect(statusManager.status).toBe('pending');
        });

        it('should handle custom statuses', () => {
            statusManager.setAvailableStatuses(['backlog', 'todo', 'in progress', 'review', 'done']);
            expect(statusManager.availableStatuses).toEqual(['backlog', 'todo', 'in progress', 'review', 'done']);
            
            statusManager.setStatus('backlog');
            expect(statusManager.status).toBe('backlog');
            
            statusManager.increaseStatus();
            expect(statusManager.status).toBe('todo');
            
            statusManager.increaseStatus();
            expect(statusManager.status).toBe('in progress');
        });

        it('should handle status changes with event tracking', () => {
            const events: any[] = [];
            statusManager.on('changed.status', (data) => {
                events.push(data);
            });
            
            statusManager.setStatus('in progress');
            statusManager.setStatus('done');
            statusManager.increaseStatus(); // Should not trigger (already at max)
            statusManager.decreaseStatus();
            
            expect(events[0].payload.status).toBe('in progress');
            expect(events[1].payload.status).toBe('done');
            expect(events[2].payload.status).toBe('in progress');
        });

        it('should maintain status when available statuses change', () => {
            statusManager.setStatus('in progress');
            statusManager.setAvailableStatuses(['new1', 'new2', 'new3']);
            
            // Current status might be invalid after change, but it's preserved
            // (as noted in the code comment, this might be an issue)
            expect(statusManager.status).toBe('in progress');
        });
    });
});

