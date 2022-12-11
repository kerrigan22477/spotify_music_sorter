from django.test import TestCase
from django.urls import reverse
from .models import Room

# Create your tests here.


class PostTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.room = Room.objects.create()
        cls.roomCode = cls.room.code
        cls.user = cls.room.user

    def test_model_content(self):
        self.assertEqual(self.room.code, self.roomCode)
        self.assertEqual(self.room.sorting_criteria, "key")
        self.assertEqual(self.room.user, self.user)
