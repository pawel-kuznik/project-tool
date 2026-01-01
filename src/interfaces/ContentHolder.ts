import { EmitterLike } from '@pawel-kuznik/iventy';

/**
 *  An interface describing an entity/item that holds content.
 */
export interface ContentHolder extends EmitterLike {
    /**
     *  Get the title of the content.
     */
    get title(): string;

    /**
     *  Get the contents of the content.
     */
    get contents(): string;

    /**
     *  Set the title of the content.
     */
    setTitle(title: string) : this;

    /**
     *  Set the contents of the content.
     */
    setContents(contents: string) : this;
}