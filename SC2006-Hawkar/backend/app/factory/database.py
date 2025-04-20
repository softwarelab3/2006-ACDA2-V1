from abc import ABC, abstractmethod
from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import sessionmaker, Session, declarative_base


class DatabaseInterface(ABC):
    """
    Abstract base class defining the interface for database connections.

    Attributes:
        Base: SQLAlchemy declarative base for ORM model definitions
        SessionLocal: SQLAlchemy session maker for creating database sessions
        engine: SQLAlchemy database engine instance
    """

    Base: type(declarative_base)
    SessionLocal: sessionmaker[Session]
    engine: Engine

    @abstractmethod
    def connect(self):
        """
        Abstract method to establish a connection to the database.
        Must be implemented by concrete subclasses.
        """
        pass


class SQLiteDatabase(DatabaseInterface):
    """
    SQLite database implementation of the DatabaseInterface.

    Provides functionality to connect to an SQLite database.
    """

    def __init__(self):
        """
        Initialize SQLiteDatabase with null values for engine,
        SessionLocal, and Base to be set during connect().
        """
        self.engine = None
        self.SessionLocal = None
        self.Base = None

    def connect(self):
        """
        Establishes a connection to an SQLite database.

        Creates the engine, session maker, and declarative base for SQLite.
        """
        SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

        self.engine = create_engine(
            SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
        )
        self.SessionLocal = sessionmaker(
            autocommit=False, autoflush=False, bind=self.engine
        )
        self.Base = declarative_base()


class PostgresSQLDatabase(DatabaseInterface):
    """
    PostgreSQL database implementation of the DatabaseInterface.

    Provides functionality to connect to a PostgreSQL database.
    """

    def __init__(self):
        """
        Initialize PostgresSQLDatabase with null values for engine,
        SessionLocal, and Base to be set during connect().
        """
        self.engine = None
        self.SessionLocal = None
        self.Base = None

    def connect(self):
        """
        Establishes a connection to a PostgreSQL database.

        Creates the engine, session maker, and declarative base for PostgreSQL.
        """
        SQLALCHEMY_DATABASE_URL = "postgresql://user:password@postgresserver/db"

        self.engine = create_engine(SQLALCHEMY_DATABASE_URL)
        self.SessionLocal = sessionmaker(
            autocommit=False, autoflush=False, bind=self.engine
        )
        self.Base = declarative_base()


class DatabaseFactory:
    """
    Factory class for creating database instances.

    Provides a static method to get a database instance based on the specified type.
    """

    @staticmethod
    def getDatabase(type: str) -> DatabaseInterface:
        """
        Creates and returns a database instance of the specified type.

        Args:
            type (str): The type of database to create ("sqlite" or "postgresql")

        Returns:
            DatabaseInterface: An instance of the requested database type,
                              defaulting to SQLiteDatabase if type is not recognized
        """
        match type:
            case "sqlite":
                return SQLiteDatabase()
            case "postgresql":
                return PostgresSQLDatabase()
            case _:
                return SQLiteDatabase()  # default
