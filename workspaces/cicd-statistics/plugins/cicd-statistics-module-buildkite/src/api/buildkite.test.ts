import { MockFetchApi } from '@backstage/test-utils';
import { DiscoveryApi } from '@backstage/core-plugin-api';
import { CicdStatisticsApiBuildkite, BuildkiteClient } from './buildkite';
import { BuildkiteApi } from '@roadiehq/backstage-plugin-buildkite';
import { Entity } from '@backstage/catalog-model';
import { BuildkiteBuild } from './types';

const entity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'foo',
    annotations: {
      'buildkite.com/pipeline': 'foo/bar',
    },
  },
};

const buildsResp: BuildkiteBuild[] = [
  {
    id: '1',
    branch: 'main',
    state: 'passed',
    created_at: '2022-03-30T13:03:09.846Z',
    started_at: '2022-03-30T13:03:09.846Z',
    finished_at: '2022-03-30T13:04:09.846Z',
    source: 'foo',
    jobs: [
      {
        name: 'job name',
        state: 'foo',
        started_at: '2015-05-09T21:07:59.874Z',
        finished_at: '2015-05-09T21:08:59.874Z',
      },
    ],
  },
];

describe('CicdStatisticsApiBuildkite', () => {
  const mockFetch = jest.fn().mockName('fetch');
  const mockDiscoveryApi: jest.Mocked<DiscoveryApi> = {
    getBaseUrl: jest
      .fn()
      .mockName('discoveryApi')
      .mockResolvedValue('http://localhost:7007'),
  };

  const mockFetchApi: MockFetchApi = new MockFetchApi({
    baseImplementation: mockFetch,
  });

  let client: CicdStatisticsApiBuildkite;

  beforeEach(() => {
    mockFetch.mockReset();

    client = new CicdStatisticsApiBuildkite(mockDiscoveryApi, mockFetchApi);
  });

  describe('createBuildkiteApi', () => {
    let bk: BuildkiteClient;

    beforeEach(async () => {
      bk = await client.createBuildkiteApi(entity);
    });

    it('returns a new Buildkite API from the passed entity', () => {
      expect(bk.api instanceof BuildkiteApi).toEqual(true);
    });

    it('returns the Buildkite org associated with the entity', () => {
      expect(bk.org).toEqual('foo');
    });

    it('returns the Buildkite pipeline associated with the entity', () => {
      expect(bk.pipeline).toEqual('bar');
    });
  });

  describe('fetchBuilds', () => {
    it('fetches builds via the Buildkite API and transforms the data to a CicdState', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 200,
        ok: true,
        json: () => Promise.resolve(buildsResp),
      });

      const controller = new AbortController();
      const builds = await client.fetchBuilds({
        entity,
        updateProgress: () => {},
        timeTo: new Date(),
        timeFrom: new Date(),
        filterStatus: ['all'],
        filterType: 'all',
        abortSignal: controller.signal,
      });

      expect(builds.builds.length).toEqual(1);
      expect(builds.builds[0].id).toEqual(buildsResp[0].id);
      expect(builds.builds[0].status).toEqual('succeeded');
      expect(builds.builds[0].branchType).toEqual('main');
      expect(builds.builds[0].duration).toEqual(60000);
      expect(builds.builds[0].requestedAt).toEqual(
        new Date(buildsResp[0].created_at),
      );
      expect(builds.builds[0].triggeredBy).toEqual('scm');
    });
  });

  describe('getConfiguration', () => {});
});
