import { TagsList } from "./TagsList";

/**
 *  An interface describing an entity/item that holds a tags list.
 */
export interface TagsListHolder {

    /**
     *  Get the tags list.
     */
    getTags(): TagsList;
}