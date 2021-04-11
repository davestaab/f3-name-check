import { render } from '@testing-library/vue';
import App from '../App.vue';
import userEvent from '@testing-library/user-event';
import { UserTag } from '../types';
import { mocked } from 'ts-jest/utils';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();
const mockedFetch = mocked(fetch);

describe('name check app', function () {
  beforeEach(() => {
    mockedFetch.mockClear();
  });

  it('should show placeholder', function () {
    const { getByPlaceholderText } = render(App);
    getByPlaceholderText('spotter...');
  });

  it('should have nickname search field', function () {
    const { getByLabelText } = render(App);
    getByLabelText('Nickname');
  });

  it('should show no result', async function () {
    mockedFetch.mockReturnValue(createResponse([]));
    const { queryAllByTestId } = render(App);
    expect(mockedFetch).toBeCalledTimes(1);
    const cards = await queryAllByTestId('user-card');
    expect(cards.length).toBe(0);
    await queryAllByTestId('No Results');
  });

  it('should search for name', async function () {
    mockedFetch.mockReturnValue(createResponse(['Judge Judy']));

    const { getByLabelText, findAllByTestId, findByText } = render(App);
    const input = getByLabelText('Nickname');
    await userEvent.type(input, 'judge{enter}');
    expect(mockedFetch).toBeCalledTimes(1);
    const cards = await findAllByTestId('user-card');
    expect(cards.length).toBe(1);
    await findByText('Judge Judy');
  });

  describe('clear functionality', function () {
    it('should show clear if search is active', async function () {
      mockedFetch.mockReturnValue(createResponse(['Spotter']));

      const { getByLabelText, findByTestId } = render(App);
      const input = getByLabelText('Nickname');
      await userEvent.type(input, 'spotter{enter}');
      await findByTestId('clear-search');
    });

    it('should not show clear if no search', function () {
      const { queryByTestId } = render(App);
      expect(queryByTestId('clear-search')).toBeNull();
    });

    it('should clear search', async function () {
      mockedFetch.mockReturnValue(createResponse(['Spotter']));
      const { getByTestId, queryByTestId, getByText, getByLabelText } = render(
        App
      );
      const input = getByLabelText('Nickname');
      await userEvent.type(input, 'spotter{enter}');
      const clearSearch = getByTestId('clear-search');
      await userEvent.click(clearSearch);
      expect(queryByTestId('clear-search')).toBeNull();
      getByText('No Results');
      expect((input as HTMLInputElement).value).toBe('');
    });
  });
});

function createUserTag(overrides?: Partial<UserTag>): UserTag {
  return {
    name: 'spotter',
    count: 300,
    id: 1,
    ...overrides,
  } as UserTag;
}

function createResponse(names: string[]): Promise<Response> {
  return (Promise.resolve({
    ok: () => true,
    json: () => Promise.resolve(names.map((name) => createUserTag({ name }))),
  }) as unknown) as Promise<Response>;
}
