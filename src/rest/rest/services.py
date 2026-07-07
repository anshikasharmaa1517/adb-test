"""
Service layer for TODO operations against MongoDB.

Encapsulates all database interaction logic, keeping views thin
and focused on HTTP request/response handling.
"""

import logging
from bson import ObjectId
from pymongo.collection import Collection

logger = logging.getLogger(__name__)


class TodoService:
    """Repository-style service for managing TODO documents in MongoDB."""

    COLLECTION_NAME = 'todos'

    def __init__(self, db):
        """
        Initialize the service with a pymongo database instance.

        Args:
            db: A pymongo Database object.
        """
        self.collection: Collection = db[self.COLLECTION_NAME]

    def get_all(self):
        """
        Retrieve all TODO items from the collection.

        Returns:
            list[dict]: A list of serialized TODO documents.
        """
        cursor = self.collection.find()
        return [self._serialize(doc) for doc in cursor]

    def create(self, description):
        """
        Insert a new TODO item into the collection.

        Args:
            description (str): The TODO description text.

        Returns:
            dict: The serialized, newly created TODO document.

        Raises:
            ValueError: If description is empty or whitespace-only.
        """
        if not description or not description.strip():
            raise ValueError("Description must be a non-empty string.")

        document = {'description': description.strip()}
        result = self.collection.insert_one(document)
        document['_id'] = result.inserted_id

        logger.info("Created todo with id=%s", result.inserted_id)
        return self._serialize(document)

    @staticmethod
    def _serialize(document):
        """
        Convert a MongoDB document into a JSON-serializable dict.

        MongoDB's ObjectId is not natively JSON-serializable,
        so we convert it to a string under the key 'id'.

        Args:
            document (dict): A raw MongoDB document.

        Returns:
            dict: A clean, serializable representation.
        """
        return {
            'id': str(document['_id']),
            'description': document.get('description', ''),
        }
