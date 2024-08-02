# cicd-statistics-module-buildkite

This is an extension module to the `cicd-statistics` plugin providing a `CicdStatisticsApiBuildkite`
for use extracting CI/CD statistics from Buildkite pipelines.

## Getting started

1. Install the `cicd-statistics` and `cicd-statistics-module-buildkite` plugins in the `app` package.

2. Configure your ApiFactory:
   - You can optionally pass in a third argument to `CicdStatisticsApiBuildkite` of type [CicdDefaults](https://github.com/backstage/backstage/blob/2881c53cb383bf127c150f837f37fe535d8cf97b/plugins/cicd-statistics/src/apis/types.ts#L179) to alter the default CI/CD UI configuration

```tsx
// packages/app/src/apis.ts
import {
  createApiFactory,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

import { cicdStatisticsApiRef } from '@backstage-community/plugin-cicd-statistics';
import { CicdStatisticsApiBuildkite } from '@backstage-community/plugin-cicd-statistics-module-buildkite';

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: cicdStatisticsApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      fetchApiApi: fetchApiRef,
    },
    factory({ discoveryApi, fetchApi }) {
      return new CicdStatisticsApiBuildkite(discoveryApi, fetchApi);
    },
  }),
];
```

3. Add the component to your EntityPage:

```tsx
// packages/app/src/components/catalog/EntityPage.tsx
import { EntityCicdStatisticsContent } from '@backstage-community/plugin-cicd-statistics';

<EntityLayout.Route path="/cicd-statistics" title="CI/CD Statistics">
  <EntityCicdStatisticsContent />
</EntityLayout.Route>;
```

4. Configure entities to feature a `buildkite.com/pipeline-name` annotation:

```yaml
annotations:
  buildkite.com/pipeline-name: 'org-name/some-pipeline'
```
