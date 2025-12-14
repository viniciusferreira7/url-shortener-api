import { WatchedList } from '@/core/entities/watched-list';
import type { Url } from './url';

export class UrlsLikedList extends WatchedList<Url> {
  compareItems(a: Url, b: Url): boolean {
    return a.equals(b);
  }
}
