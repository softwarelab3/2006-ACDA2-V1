from fastapi import HTTPException
from sqlalchemy.orm import Session

import services.consumer as consumer_services
import services.review as review_services

import schemas.consumer as consumer_schemas
import schemas.review as review_schemas


class ConsumerController:
    """Controller for consumer-related operations, including review submission and consumer CRUD."""

    # -------------------------------------------------------- #
    # -------------------- Business Logic -------------------- #
    # -------------------------------------------------------- #

    def submitReview(db: Session, review: review_schemas.ReviewCreate):
        """Submit a new review.

        Args:
            db (Session): Database session.
            review (ReviewCreate): Review creation schema.
        Returns:
            Review: The created review object.
        """
        db_review = review_services.create_review(db, review)
        return db_review

    def editReview(db: Session, updated_review: review_schemas.ReviewUpdate):
        """Edit an existing review.

        Args:
            db (Session): Database session.
            updated_review (ReviewUpdate): Updated review schema.
        Returns:
            Review: The updated review object.
        """
        db_review = review_services.update_review(db, updated_review)
        return db_review

    # ------------------------------------------------------------ #
    # -------------------- Consumer (CRUD) ----------------------- #
    # ------------------------------------------------------------ #
    # ----- Consumer ----- #
    def getConsumerByUserId(db: Session, userID: int):
        """Get a consumer by their user ID.

        Args:
            db (Session): Database session.
            userID (int): User ID of the consumer.
        Raises:
            HTTPException: If the consumer is not found.
        Returns:
            Consumer: The consumer object.
        """
        consumer = consumer_services.get_consumer_by_user_id(db, userID=userID)
        if consumer is None:
            raise HTTPException(status_code=404, detail="Consumer not found")

        return consumer

    def getConsumerByConsumerId(db: Session, consumerID: int):
        """Get a consumer by their consumer ID.

        Args:
            db (Session): Database session.
            consumerID (int): Consumer ID.
        Raises:
            HTTPException: If the consumer is not found.
        Returns:
            Consumer: The consumer object.
        """
        consumer = consumer_services.get_consumer_by_consumer_id(
            db, consumerID=consumerID
        )
        if consumer is None:
            raise HTTPException(status_code=404, detail="Consumer not found")

        return consumer

    def getAllConsumers(db: Session, skip: int, limit: int):
        """Get all consumers with pagination.

        Args:
            db (Session): Database session.
            skip (int): Number of records to skip.
            limit (int): Maximum number of records to return.
        Raises:
            HTTPException: If no consumers are found.
        Returns:
            list: List of consumers.
        """
        consumers = consumer_services.get_all_consumers(db, skip=skip, limit=limit)
        if consumers is None:
            raise HTTPException(status_code=404, detail="Consumers not found")

        return consumers

    def updateConsumer(db: Session, updated_consumer: consumer_schemas.ConsumerUpdate):
        """Update a consumer's information.

        Args:
            db (Session): Database session.
            updated_consumer (ConsumerUpdate): Updated consumer schema.
        Raises:
            HTTPException: If the consumer is not found.
        Returns:
            Consumer: The updated consumer object.
        """
        consumer = consumer_services.update_consumer(db, updated_consumer)
        if consumer is None:
            raise HTTPException(status_code=404, detail="Consumer not found")
        return consumer
