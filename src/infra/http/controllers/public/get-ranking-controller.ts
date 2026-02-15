import { Elysia } from 'elysia';
import z from 'zod';
import { makeGetRankingUseCase } from '@/infra/factories/make-get-ranking-use-case';
import { UrlWithAuthorPresenter } from '../../presenters/url-with-author-presenter';
import { urlWithAuthorSchemaResponse } from '../../utils/schemas/url-with-author-schema';

export const getRankingController = new Elysia().get(
  '/ranking',
  async ({ set }) => {
    const useCase = makeGetRankingUseCase();

    const result = await useCase.execute();

    set.status = 200;

    return result.value.ranking.map(UrlWithAuthorPresenter.toHttp);
  },
  {
    detail: {
      summary: 'Get top 10 URLs ranking by access count (Public)',
      tags: ['Ranking'],
    },
    response: {
      200: z.array(urlWithAuthorSchemaResponse),
    },
  }
);
