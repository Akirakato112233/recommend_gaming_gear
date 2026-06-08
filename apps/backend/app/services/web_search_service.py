from dataclasses import dataclass
from typing import Any

try:
    from ddgs import DDGS
except ImportError:
    from duckduckgo_search import DDGS


DEFAULT_MAX_RESULTS = 5
MAX_RESULTS_LIMIT = 10


@dataclass(frozen=True)
class WebSearchResult:
    title: str
    url: str
    snippet: str


class WebSearchError(Exception):
    pass


def search_web(
    query: str,
    max_results: int = DEFAULT_MAX_RESULTS,
    region: str = "wt-wt",
    safesearch: str = "moderate",
) -> list[WebSearchResult]:
    cleaned_query = query.strip()
    if not cleaned_query:
        return []

    safe_max_results = min(max(max_results, 1), MAX_RESULTS_LIMIT)

    try:
        raw_results = DDGS().text(
            cleaned_query,
            region=region,
            safesearch=safesearch,
            max_results=safe_max_results,
        )
    except Exception as exc:
        raise WebSearchError("DuckDuckGo search failed") from exc

    return [_to_web_search_result(result) for result in raw_results]


def _to_web_search_result(result: dict[str, Any]) -> WebSearchResult:
    return WebSearchResult(
        title=str(result.get("title") or ""),
        url=str(result.get("href") or ""),
        snippet=str(result.get("body") or ""),
    )
