from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json, logging, os
from pymongo import MongoClient

from .services import TodoService

logger = logging.getLogger(__name__)

mongo_uri = 'mongodb://' + os.environ["MONGO_HOST"] + ':' + os.environ["MONGO_PORT"]
db = MongoClient(mongo_uri)['test_db']
todo_service = TodoService(db)

class TodoListView(APIView):

    def get(self, request):
        # Implement this method - return all todo items from db instance above.
        try:
            todos = todo_service.get_all()
            return Response(todos, status=status.HTTP_200_OK)
        except Exception:
            logger.exception("Failed to retrieve todos")
            return Response(
                {'error': 'An unexpected error occurred while fetching todos.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request):
        # Implement this method - accept a todo item in a mongo collection, persist it using db instance above.
        description = request.data.get('description')

        if not description or not str(description).strip():
            return Response(
                {'error': 'The "description" field is required and cannot be empty.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            todo = todo_service.create(str(description))
            return Response(todo, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception:
            logger.exception("Failed to create todo")
            return Response(
                {'error': 'An unexpected error occurred while creating the todo.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )