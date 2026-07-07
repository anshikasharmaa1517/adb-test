import logging
from bson import ObjectId
from pymongo.collection import Collection

logger = logging.getLogger(__name__)

class TodoService:
    COLLECTION_NAME = 'todos'

    def __init__(self, db):
        self.collection: Collection = db[self.COLLECTION_NAME]

    def get_all(self):
        cursor = self.collection.find()
        return [self._serialize(doc) for doc in cursor]

    def create(self, description):
        if not description or not description.strip():
            raise ValueError("Description must be a non-empty string.")

        document = {'description': description.strip()}
        result = self.collection.insert_one(document)
        document['_id'] = result.inserted_id

        logger.info("Created todo with id=%s", result.inserted_id)
        return self._serialize(document)

    @staticmethod
    def _serialize(document):
        return {
            'id': str(document['_id']),
            'description': document.get('description', ''),
        }