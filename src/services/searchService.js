import { get } from './serverConfig';
import axios from '@/axios/axios';
import { getProjectInfo } from '@/services/projectService';
const SEARCH_HISTORY_KEY = 'search_history';
const MAX_HISTORY_ITEMS = 10;
const ITEMS_PER_PAGE = 20;

export const getSearchConfig = async () => ({
  enabled: await get('search.enabled'),
  baseUrl: await get('search.meilisearch.url'),
  apiKey: await get('search.meilisearch.api_key'),
  indexName: await get('search.meilisearch.index_name'),
});

export const getSearchParams = (query, page) => ({
  q: query.trim(),
  offset: (page - 1) * ITEMS_PER_PAGE,
  limit: ITEMS_PER_PAGE,
  attributesToHighlight: ['title', 'description'],
  highlightPreTag: '<mark class="highlight">',
  highlightPostTag: '</mark>',
});

export const loadSearchHistory = () => {
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Failed to load search history:', error);
    return [];
  }
};

export const addToSearchHistory = (term, currentHistory = []) => {
  try {
    const history = [...currentHistory];
    const index = history.indexOf(term);
    if (index > -1) {
      history.splice(index, 1);
    }
    history.unshift(term);
    if (history.length > MAX_HISTORY_ITEMS) {
      history.pop();
    }
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
    return history;
  } catch (error) {
    console.error('Failed to save search history:', error);
    return currentHistory;
  }
};

export const performSearch = async (query, page) => {
  const { baseUrl, apiKey, indexName } = await getSearchConfig();
  const searchParams = getSearchParams(query, page);

  const response = await axios({
    url: `${baseUrl}/indexes/${indexName}/search`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    data: searchParams,
  });

  if (response.status !== 200) {
    throw new Error('搜索请求失败');
  }

  return response.data;
};

export const generateUrlMap = (searchResults) => {
  const urlMap = {};
  if (!searchResults) return urlMap;

  searchResults.forEach((result) => {
    if (result && result.id) {
      urlMap[result.id] = `/app/link/project/?id=${result.id}`;
    }
  });
  return urlMap;
};

export const updateUrlMap = async (searchResults, currentUrlMap = {}) => {
  try {
    if (!searchResults || !Array.isArray(searchResults) || !searchResults.length) {
      return currentUrlMap;
    }

    const projectIds = searchResults
      .filter(result => result && result.id)
      .map(result => result.id);

    if (!projectIds.length) {
      return currentUrlMap;
    }

    const projectInfos = await getProjectInfo(projectIds);
    const newUrlMap = { ...currentUrlMap };

    if (!projectInfos || !Array.isArray(projectInfos)) {
      console.warn('No project infos returned from API');
      return newUrlMap;
    }

    projectInfos.forEach((info) => {
      if (info && info.id && info.author?.username && info.name) {
        newUrlMap[info.id] = `/${info.author.username}/${info.name}`;
      } else {
        console.warn(`Invalid project info for ID ${info?.id}:`, info);
        // 保持默认的链接格式作为后备
        newUrlMap[info?.id] = `/app/link/project/?id=${info?.id}`;
      }
    });

    return newUrlMap;
  } catch (error) {
    console.error('Error updating URLs:', error);
    return currentUrlMap;
  }
};