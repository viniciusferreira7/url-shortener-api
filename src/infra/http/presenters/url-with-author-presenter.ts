import type { UrlWithAuthor } from '@/domain/url-shortening/enterprise/entities/value-object/url-with-author';

export class UrlWithAuthorPresenter {
  static toHttp(url: UrlWithAuthor) {
    return {
      url_id: url.urlId.toString(),
      author_id: url.authorId.toString(),

      url_name: url.urlName,
      url_code: url.urlCode,
      url_description: url.urlDescription ?? null,

      url_is_public: url.urlIsPublic,
      url_likes: url.urlLikes,

      score: url.score ?? 0,

      destination_url: url.urlDestination,

      created_at: url.createdAt.toISOString(),
      updated_at: url.updatedAt?.toISOString() ?? null,
    };
  }
}
