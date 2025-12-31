import { Emitter, EventHandler, EventHandlerUninstaller } from '@pawel-kuznik/iventy';
import { TagsHolder } from "./TagsHolder";

/**
 *  A basic implementation of the TagsHolder interface. It makes
 *  sure that tags are normalized and processed correctly.
 */
export class TagsList implements TagsHolder {

    /**
     *  The event emitter instance.
     */
    private _emitter: Emitter = new Emitter();

    /**
     *  The current tags.
     */
    private _tags: Set<string> = new Set;

    /**
     *  Give access to current list of tags.
     */
    get tags(): readonly string[] {
        return [...this._tags];
    }

    /**
     *  Constructor. 
     */
    constructor(input?: string[]) {
        if (input) this.addTag(input);
    }

    /**
     *  Add a tag. 
     */
    addTag(tag: string): this;
    addTag(tag: string[]): this;
    addTag(tag: string | string[]): this {

        if (Array.isArray(tag)) {
            tag.forEach(t => this.addTag(t));
            return this;
        }

        this._tags.add(this.normalize(tag));

        this._emitter.trigger('changed.tags', { tags: [...this._tags] });

        return this;
    }

    /**
     *  Does the list contains tag or tags? It has to contain all of the passed
     *  tags to result into TRUE.
     */
    containsTag(tag: string): boolean;
    containsTag(tag: string[]): boolean;
    containsTag(tag: string | string[]): boolean {

        // no tags? then it doesn't contain the input
        if (this._tags.size === 0) return false;
        
        // not an array? then it's easy
        if (!Array.isArray(tag)) return this._tags.has(this.normalize(tag));

        for (let t of tag) {
            if (!this.containsTag(t)) return false;
        }

        return true;
    }

    /**
     *  Remove a specific tag.
     */
    removeTag(tag: string): this;
    removeTag(tag: string[]): this;
    removeTag(tag: string | string[]) : this {

        if (Array.isArray(tag)) {
            tag.forEach(t => this.removeTag(t));
            return this;
        }
        
        this._tags.delete(this.normalize(tag));
        
        this._emitter.trigger('changed.tags', { tags: [...this._tags] });

        return this;
    }

    /**
     *  Handle an event.
     */
    handle(event: string, callback: EventHandler) : EventHandlerUninstaller {
        return this._emitter.handle(event, callback);
    }

    /**
     *  Handle an event.
     */
    on(event: string, callback: EventHandler) : this {
        this._emitter.on(event, callback);
        return this;
    }

    /**
     *  Handle an event.
     */
    off(event: string, callback: EventHandler) : this {
        this._emitter.off(event, callback);
        return this;
    }

    /**
     *  Normalize tag.
     */
    private normalize(input: string) : string {
        return input.trim().toLowerCase();
    }
}