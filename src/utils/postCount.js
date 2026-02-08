import * as twitterText from 'twitter-text';

export const getPostContentLimit = () => {
  const rawLimit = import.meta?.env?.VITE_POST_CONTENT_LIMIT;
  const parsed = Number(rawLimit);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 280;
};

export const getLocalCountInfo = (content) => {
  const text = content == null ? '' : String(content);
  const limit = getPostContentLimit();
  const info = twitterText.parseTweet(text);
  const weightedLength = info.weightedLength;
  return {
    ...info,
    limit,
    count: weightedLength,
    remaining: limit - weightedLength
  };
};
