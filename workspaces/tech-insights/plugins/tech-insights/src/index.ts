/*
 * Copyright 2021 The Backstage Authors
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
export {
  techInsightsPlugin,
  EntityTechInsightsScorecardContent,
  EntityTechInsightsScorecardCard,
  TechInsightsScorecardPage,
  TechInsightsCheckIcon,
  TechInsightsLinksMenu,
  ScorecardInfo,
  ScorecardsList,
} from './plugin';

export { techInsightsApiRef, TechInsightsClient } from './api';
export type { TechInsightsApi, Check, InsightFacts } from './api';
export { BooleanCheck } from './components/BooleanCheck';
export { jsonRulesEngineCheckResultRenderer } from './components/CheckResultRenderer';
export type { CheckResultRenderer } from './components/CheckResultRenderer';
export type {
  ResultCheckIconProps,
  ResultCheckIconBaseComponentProps,
} from './components/ResultCheckIcon';
export type { ResultLinksMenuInfo } from './components/ResultLinksMenu';
