import type { Url } from '@/domain/url-shortening/enterprise/entities/url';

export class UrlPresenter {
  static toHttp(url: Url) {
    return {
      id: url.id,
      name: url.name,
      destination_url: url.destinationUrl,
      code: url.code,
      is_public: url.isPublic,
      description: url.description,
      author_id: url.authorId,
      likes: url.likes,
      score: url.score,
      created_at: url.createdAt,
      updated_at: url.updatedAt,
    };
  }
}
