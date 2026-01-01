import { StatusHolder } from '../interfaces/StatusHolder';
import { Emitter, EventHandler, EventHandlerUninstaller } from '@pawel-kuznik/iventy';
import { InvalidInputError } from '../errors/InvalidInputError';

/**
 *  A manager for statuses. It is responsible for managing the statuses of the items.
 *  This is a base class that can be then used in other classes for managing the correct
 *  progression of the status.
 */
export class StatusManager implements StatusHolder {

    /**
     *  The event emitter instance.
     */
    private _emitter: Emitter = new Emitter();

    /**
     *  The current status of the holder.
     *  The start status is 'pending' as we assume that the item is freshly created
     *  and no work was done on it yet.
     */
    private _status: string = 'pending';

    /**
     * Get the current status of the holder.
     */
    get status(): string {
        return this._status;
    }

    /**
     * Get the available statuses for the holder.
     */
    get availableStatuses(): string[] {
        return [...this._availableStatuses];
    }

    /**
     * The available statuses for the holder.
     * By default we go with the following statuses: pending, in progress, done.
     * These are good enough for most of the cases and if needed they can be
     * changed to more specialized ones if needed.
     */
    private _availableStatuses: string[] = ['pending', 'in progress', 'done'];

    /**
     * Set the current status from one of the available statuses.
     * @throws InvalidInputError if the status is not one of the available statuses.
     */
    setStatus(status: string) : this {

        const normalizedStatus = this.normalize(status);

        // if the status is the same as the current status, then we don't need to do anything.
        if (normalizedStatus === this._status) {
            return this;
        }

        if (!this._availableStatuses.includes(normalizedStatus)) {
            throw new InvalidInputError(`Invalid status: ${status}`);
        }

        this._status = normalizedStatus;
        this._emitter.trigger('changed.status', { status: normalizedStatus });
        return this;
    }

    /**
     * Set the available statuses for the holder.
     */
    setAvailableStatuses(availableStatuses: string[]) : this {

        if (!availableStatuses || availableStatuses.length === 0) {
            throw new InvalidInputError('Available statuses cannot be empty');
        }

        const processedStatuses = [...new Set(availableStatuses.map(s => this.normalize(s)))].filter(s => s !== '');

        if (processedStatuses.length === 0) {
            throw new InvalidInputError('Statuses cannot be empty strings');
        }

        // NOTE: The current status might no longer be valid. This might be an issue and
        // probably we need some way to reconcile the current status wit the new situation.
        // For nowe we will skip it as we are not sure what to do with it.

        this._availableStatuses = processedStatuses;
        this._emitter.trigger('changed.status', { availableStatuses: [...processedStatuses] });
        return this;
    }

    /**
     * Increase the current status.
     * @throws InvalidInputError if the current status is not one of the available statuses.
     */
    increaseStatus() : this {

        const currentIndex = this._availableStatuses.indexOf(this._status);
        if (currentIndex === -1) {
            throw new InvalidInputError(`Invalid status: ${this._status}`);
        }

        const nextStatus = this._availableStatuses[currentIndex + 1];

        // if there is no next status, then we can't increase the status more.
        // we just return from the method.
        if (!nextStatus) {
            return this;
        }

        // set the next status via the set method to trigger the event or any processing
        return this.setStatus(nextStatus);
    }

    /**
     * Decrease the current status.
     * @throws InvalidInputError if the current status is not one of the available statuses.
     */
    decreaseStatus() : this {
        const currentIndex = this._availableStatuses.indexOf(this._status);
        if (currentIndex === -1) {
            throw new InvalidInputError(`Invalid status: ${this._status}`);
        }

        // if we are on the first status, then we can't decrease the status more.
        if (currentIndex === 0) {
            return this;
        }

        const previousStatus = this._availableStatuses[currentIndex - 1];
       
        // set the previous status via the set method to trigger the event or any processing
        return this.setStatus(previousStatus);
    }

    /**
     * Handle an event.
     */
    handle(event: string, callback: EventHandler) : EventHandlerUninstaller {
        return this._emitter.handle(event, callback);
    }

    /**
     * Listen to an event.
     */
    on(event: string, callback: EventHandler) : this {
        this._emitter.on(event, callback);
        return this;
    }

    /**
     * Stop listening to an event.
     */
    off(event: string, callback: EventHandler) : this {
        this._emitter.off(event, callback);
        return this;
    }

    /**
     * Bubble the events to the parent emitter.
     */
    bubbleTo(emitter: Emitter) : this {
        this._emitter.bubbleTo(emitter);
        return this;
    }

    /**
     *  Normalize the input of the string to be a valid status string.
     */
    private normalize(input: string): string {
        return input.toLowerCase().trim();
    }
}