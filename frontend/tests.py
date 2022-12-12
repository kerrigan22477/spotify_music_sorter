from django.test import TestCase
from django.urls import reverse


class PostTests(TestCase):
    def test_url_exists_at_correct_location(self):
        response = self.client.get("/sorting")
        self.assertEqual(response.status_code, 200)
        response = self.client.get("/options")
        self.assertEqual(response.status_code, 200)
        response = self.client.get("/user/123")
        self.assertEqual(response.status_code, 200)
