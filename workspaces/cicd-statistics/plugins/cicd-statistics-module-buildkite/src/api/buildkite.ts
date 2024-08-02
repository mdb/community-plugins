/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LIAnnotationCENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import {
  CicdStatisticsApi,
  CicdState,
  CicdConfiguration,
  CicdDefaults,
  FetchBuildsOptions,
} from '@backstage-community/plugin-cicd-statistics';
import { Entity } from '@backstage/catalog-model';
import { toBuilds } from './utils';
import { BuildkiteApi } from '@roadiehq/backstage-plugin-buildkite';

/**
 * BuildkiteClient represents an initialized Buildkite client.
 *
 * @public
 */
export type BuildkiteClient = {
  /* the actual API */
  api: InstanceType<typeof BuildkiteApi>;

  /* the Buildkite organization; retrieved from the entity */
  org: string;

  /* the Buildkite pipeline name; retrieved from the entity */
  pipeline: string;
};

/**
 * Extracts the CI/CD statistics from a Buildkite pipeline.
 *
 * @public
 */
export class CicdStatisticsApiBuildkite implements CicdStatisticsApi {
  readonly #cicdDefaults: Partial<CicdDefaults>;
  readonly #discoveryApi: DiscoveryApi;
  readonly #fetchApi: FetchApi;
  readonly #proxyPath?: string;

  // TODO: accept an object
  constructor(
    discoveryApi: DiscoveryApi,
    fetchApi: FetchApi,
    cicdDefaults: Partial<CicdDefaults> = {},
    proxyPath?: string,
  ) {
    this.#cicdDefaults = cicdDefaults;
    this.#discoveryApi = discoveryApi;
    this.#fetchApi = fetchApi;
    this.#proxyPath = proxyPath;
  }

  public async createBuildkiteApi(entity: Entity): Promise<BuildkiteClient> {
    const pipelineAnnotation =
      entity.metadata.annotations?.['buildkite.com/pipeline'] || '';
    const pipelineParts = pipelineAnnotation.split('/');
    const org = pipelineParts[0];
    const pipeline = pipelineParts[1] ? pipelineParts[1] : '';

    return {
      api: new BuildkiteApi({
        discoveryApi: this.#discoveryApi,
        fetchApi: this.#fetchApi,
        proxyPath: this.#proxyPath,
      }),
      org,
      pipeline,
    };
  }

  public async fetchBuilds(options: FetchBuildsOptions): Promise<CicdState> {
    const {
      entity,
      updateProgress,
      filterStatus = ['all'],
      filterType = 'all',
    } = options;
    const { api, org, pipeline } = await this.createBuildkiteApi(entity);
    updateProgress(0, 0, 0);

    // TODO: is this correct? See cicd-statics README.
    const branch = filterType === 'all' ? undefined : filterType;
    const bkBuilds = await api.getBuilds(org, pipeline, 0, 25, branch);
    const builds = toBuilds(bkBuilds);
    const filteredBuilds = builds.filter(
      b => filterStatus.includes('all') || filterStatus.includes(b.status),
    );

    return { builds: filteredBuilds };
  }

  public async getConfiguration(): Promise<Partial<CicdConfiguration>> {
    return {
      // TODO: update with BK statuses
      availableStatuses: [
        'succeeded',
        'failed',
        'enqueued',
        'running',
        'aborted',
        'stalled',
        'expired',
        'unknown',
      ] as const,
      defaults: this.#cicdDefaults,
    };
  }
}
