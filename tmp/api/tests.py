from django.test import TestCase
from django.urls import reverse
from .models import User

# Create your tests here.


class PostTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create()
        cls.userCode = cls.user.code
        cls.user = cls.user.user

    def test_model_content(self):
        self.assertEqual(self.user.code, self.userCode)
        self.assertEqual(self.user.sorting_criteria, "key")
        self.assertEqual(self.user.user, self.user)
