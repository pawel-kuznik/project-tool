import { EmitterLike } from '@pawel-kuznik/iventy';

/**
 *  An interface describing an entity/item that holds a status.
 *  The status has to be always one of the available statuses.
 *  The available statuses are defined by an array of strings
 *  which describe the intended progression of the status.
 */
export interface StatusHolder extends EmitterLike {

    /**
     *  The current status of the holder.
     */
    status: string;

    /**
     * The available statuses for the holder.
     */
    availableStatuses: string[];

    /**
     * Set the current status from one of the available statuses.
     * @throws InvalidInputError if the status is not one of the available statuses.
     */
    setStatus(status: string) : this;

    /**
     * Set the available statuses for the holder.
     */
    setAvailableStatuses(availableStatuses: string[]) : this;

    /**
     * Increase the current status. 
     * @throws InvalidInputError if the current status is not one of the available statuses.
     */
    increaseStatus() : this;

    /**
     * Decrease the current status.
     * @throws InvalidInputError if the current status is not one of the available statuses.
     */
    decreaseStatus() : this;
};
