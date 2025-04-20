from minio import Minio
import uuid
import os
import base64
import io
from datetime import datetime
from typing import Optional


class ObjectStorage:
    _instance: Optional["ObjectStorage"] = None

    def __new__(cls):
        """
        Singleton pattern implementation to ensure only one instance of ObjectStorage exists.

        Returns:
            ObjectStorage: The single instance of ObjectStorage
        """
        if cls._instance is None:
            cls._instance = super(ObjectStorage, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        """
        Initialize the ObjectStorage with MinIO client configuration.
        Uses environment variables for MinIO connection details or defaults.
        """
        if not self._initialized:
            self.minio_endpoint = os.environ.get("MINIO_ENDPOINT", "minio:9000")
            self.minio_access_key = os.environ.get("MINIO_ROOT_USER", "tanknam")
            self.minio_secret_key = os.environ.get("MINIO_ROOT_PASSWORD", "12345678")

            self.client = Minio(
                endpoint=self.minio_endpoint,
                access_key=self.minio_access_key,
                secret_key=self.minio_secret_key,
                secure=False,
            )
            self._initialized = True
            self._ensure_buckets_exist()

    def _ensure_buckets_exist(self):
        """
        Ensure required buckets exist in MinIO storage.
        Creates required buckets if they don't already exist.
        """
        required_buckets = ["profile-photo", "dish", "stall"]

        for bucket in required_buckets:
            if not self.client.bucket_exists(bucket):
                self.client.make_bucket(bucket)

    def upload_profile_photo(self, email_address: str, encoded_image: str) -> str:
        """
        Upload a user's profile photo to MinIO storage.

        Args:
            email_address (str): Email address of the user
            encoded_image (str): Base64 encoded image or HTTP URL to image

        Returns:
            str: URL to access the uploaded image

        Raises:
            Exception: If there's an error during upload
        """
        try:
            # Handle both data URLs and direct URLs (like from Google OAuth)
            if encoded_image.startswith("http"):
                # Just return the Google URL directly
                return encoded_image

            # Handle base64 data URL format
            if "," in encoded_image:
                header, encoded = encoded_image.split(",", 1)
                decoded_data = base64.b64decode(encoded)
            else:
                # Raw base64
                decoded_data = base64.b64decode(encoded_image)

            # Generate unique ID to avoid overwriting previous photos
            unique_id = str(uuid.uuid4())[:8]
            obj_name = f"{email_address.replace('@', '_')}_{unique_id}_profile-photo"

            self.client.put_object(
                "profile-photo",
                obj_name,
                io.BytesIO(decoded_data),
                length=len(decoded_data),
                content_type="image/jpeg",
                part_size=10 * 1024 * 1024,
            )

            return f"http://localhost:9000/profile-photo/{obj_name}"
        except Exception as e:
            print(f"Error uploading profile photo: {str(e)}")
            raise e

    def upload_stall_image(self, stallID: int, encoded_image: str) -> str:
        """
        Upload a stall's image to MinIO storage.

        Args:
            stallID (int): ID of the stall
            encoded_image (str): Base64 encoded image data

        Returns:
            str: URL to access the uploaded image

        Raises:
            Exception: If there's an error during upload
        """
        try:
            if encoded_image.startswith("http"):
                return encoded_image
            header, encoded = encoded_image.split(",", 1)
            decoded_data = base64.b64decode(encoded)

            # Generate unique ID to avoid overwriting previous photos
            unique_id = str(uuid.uuid4())[:8]
            obj_name = f"{stallID}_{unique_id}_stall-image"

            self.client.put_object(
                "stall",
                obj_name,
                io.BytesIO(decoded_data),
                length=len(decoded_data),
                content_type="image/jpeg",
                part_size=10 * 1024 * 1024,
            )

            return f"http://localhost:9000/stall/{obj_name}"
        except Exception as e:
            # Log the error
            print(f"Error uploading stall image: {str(e)}")
            raise e

    def upload_review_photo(
        self, consumer_id: int, stall_id: int, encoded_image: str
    ) -> str:
        """
        Upload a review photo to MinIO storage.

        Args:
            consumer_id (int): ID of the consumer submitting the review
            stall_id (int): ID of the stall being reviewed
            encoded_image (str): Base64 encoded image data

        Returns:
            str: URL to access the uploaded image

        Raises:
            Exception: If there's an error during upload
        """
        try:
            if encoded_image.startswith("http"):
                return encoded_image
            header, encoded = encoded_image.split(",", 1)
            decoded_data = base64.b64decode(encoded)

            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            obj_name = f"{consumer_id}_to_{stall_id}_{timestamp}_review"

            self.client.put_object(
                "review-attachment",
                obj_name,
                io.BytesIO(decoded_data),
                length=len(decoded_data),
                content_type="image/jpeg",
                part_size=10 * 1024 * 1024,
            )

            return f"http://localhost:9000/review-attachment/{obj_name}"
        except Exception as e:
            # Log the error
            print(f"Error uploading review photo: {str(e)}")
            raise e

    def upload_dish_photo(
        self, stall_id: int, dish_name: str, encoded_image: str
    ) -> str:
        """
        Upload a dish photo to MinIO storage.

        Args:
            stall_id (int): ID of the stall offering the dish
            dish_name (str): Name of the dish
            encoded_image (str): Base64 encoded image data

        Returns:
            str: URL to access the uploaded image

        Raises:
            Exception: If there's an error during upload
        """
        try:
            if encoded_image.startswith("http"):
                return encoded_image
            header, encoded = encoded_image.split(",", 1)
            decoded_data = base64.b64decode(encoded)

            # Create sanitized object name
            sanitized_dish_name = dish_name.replace(" ", "_").lower()
            unique_id = str(uuid.uuid4())[:8]
            obj_name = f"stall_{stall_id}_{sanitized_dish_name}_{unique_id}"

            self.client.put_object(
                "dish",
                obj_name,
                io.BytesIO(decoded_data),
                length=len(decoded_data),
                content_type="image/jpeg",
                part_size=10 * 1024 * 1024,
            )

            return f"http://localhost:9000/dish/{obj_name}"
        except Exception as e:
            # Log the error
            print(f"Error uploading dish photo: {str(e)}")
            raise e
