import { handler } from './user-search';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('user search', function () {
  it('should return results', async function () {
    const results = await handler(createSearchParam('wanderer'));
    expect(results.statusCode).toBe(200);
    const data = JSON.parse(results.body);
    expect(data.length).toBe(1);
  });

  it('should return empty results if no search param', async function () {
    const results = await handler({} as APIGatewayProxyEvent);
    expect(results.statusCode).toBe(200);
    const data = JSON.parse(results.body);
    expect(data.length).toBe(0);
  });

  it('should return empty results if empty search param', async function () {
    const results2 = await handler(createSearchParam(''));
    expect(results2.statusCode).toBe(200);
    const data2 = JSON.parse(results2.body);
    expect(data2.length).toBe(0);
  });
});

function createSearchParam(search: string): APIGatewayProxyEvent {
  return ({
    queryStringParameters: {
      search,
    },
  } as unknown) as APIGatewayProxyEvent;
}
