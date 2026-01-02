import { getGlobalSingleton } from "src/common/global-singleton";
import { TopicEntryDto } from "./dto/topics.dto";
import { seedTopics } from "./topics.seed";

type TopicsStore = { topics: TopicEntryDto[] };
type TopicsTicker = { started: boolean; timer?: NodeJS.Timeout };

export function getTopicsStore(): TopicsStore {
  return getGlobalSingleton<TopicsStore>("__mockTopics", () => ({
    topics: seedTopics(),
  }));
}

export function getTopicsTicker(): TopicsTicker {
  return getGlobalSingleton<TopicsTicker>("__mockTopicsTicker", () => ({
    started: false,
  }));
}
