/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { CopilotClient, copilotApiRef } from './api';

/**
 * The Copilot plugin for Backstage.
 *
 * @public
 */
export const copilotPlugin = createPlugin({
  id: 'copilot',
  apis: [
    createApiFactory({
      api: copilotApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) =>
        new CopilotClient({ discoveryApi, fetchApi }),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

/**
 * Copilot page component for the Copilot plugin.
 *
 * @public
 */
export const CopilotPage = copilotPlugin.provide(
  createRoutableExtension({
    name: 'CopilotPage',
    component: () => import('./components/Pages').then(m => m.CopilotPage),
    mountPoint: rootRouteRef,
  }),
);
