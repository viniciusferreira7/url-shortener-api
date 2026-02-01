import type { Url } from '@/domain/url-shortening/enterprise/entities/url';

export class UrlPresenter {
  static toHttp(url: Url) {
    return {
      id: url.id.toString(),
      author_id: url.authorId.toString(),
      name: url.name,
      code: url.code,
      description: url.description ?? null,
      is_public: url.isPublic,
      likes: url.likes,
      score: url.score,
      destination_url: url.destinationUrl,
      created_at: url.createdAt.toString(),
      updated_at: url.updatedAt?.toString() ?? null,
    };
  }
}
