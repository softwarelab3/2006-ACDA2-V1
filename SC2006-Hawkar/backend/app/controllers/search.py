from fastapi import HTTPException
from sqlalchemy.orm import Session

import services.search as search_services


class SearchController:
    """Controller for handling search operations."""

    def getSearchResult(db: Session, query: str):
        """Get search results for a given query string.

        Args:
            db (Session): Database session.
            query (str): The search query string.

        Returns:
            list: List of search results.
        """
        results = search_services.search_all(db, query)
        return results
