/**
 *  An interface describing an item that could be shown on a timeline.
 */
export interface TimelineItem { 

    /**
     *  The date at which the item was created.
     */
    creationDate: Date;

    /**
     *  The duedate of the item.
     */
    dueDate: Date | null;
};
