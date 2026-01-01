import { Emitter, EventHandler, EventHandlerUninstaller } from '@pawel-kuznik/iventy';
import { ContentHolder } from '../interfaces/ContentHolder';

/**
 *  A class responsible for managing the content of an entity or other item in the system.
 */
export class Content implements ContentHolder {

    /**
     *  The title of the content.
     */
    private _title: string = "";

    /**
     *  The description of the content. Allowed to be in a markdown format.
     */
    private _contents: string = "";

    /**
     *  The public getter for the title of the content.
     */
    get title(): string {
        return this._title;
    }

    /**
     *  The public getter for the contents of the content.
     */
    get contents(): string {
        return this._contents;
    }

    /**
     *  The event emitter instance.
     */
    private _emitter: Emitter = new Emitter();

    /**
     *  Set new title on the content.
     */
    setTitle(title: string) : this {
        this._title = title;
        this._emitter.trigger('changed.content', { title });
        return this;
    }

    /**
     *  Set new contents on the content.
     */
    setContents(contents: string) : this {
        this._contents = contents;
        this._emitter.trigger('changed.content', { contents });
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
     * Bubble the events to the parent emitter.
     */
    bubbleTo(emitter: Emitter) : this {
        this._emitter.bubbleTo(emitter);
        return this;
    }
}