import { EmitterLike } from '@pawel-kuznik/iventy';

/**
 *  An interface describing an entity/item that holds tags. 
 */
export interface TagsHolder extends EmitterLike {

    /**
     *  Current list of tags.
     */
    get tags(): readonly string[];

    /**
     *  Is a tag(s) held by the holder?
     */
    containsTag(tag: string) : boolean;
    containsTag(tag: string[]) : boolean;

    /**
     *  Add a tag to the tags holder.
     */
    addTag(tag: string) : this;
    addTag(tag: string[]) : this;

    /**
     *  Remove a specific tag from the holder.
     */
    removeTag(tag: string) : this;
    removeTag(tag: string[]) : this;
}