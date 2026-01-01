import { TagsHolder } from './TagsHolder';
import { TagsListHolder } from './TagsListHolder';
import { ContentHolder } from './ContentHolder';
import { TimelineItem } from './TimelineItem';
import { StatusHolder } from './StatusHolder';
import { IdHolder } from './IdHolder';

/**
 *  This is an interface that describes a task entity.
 */
export interface Task extends IdHolder, TagsListHolder, TagsHolder, ContentHolder, TimelineItem, StatusHolder {

}