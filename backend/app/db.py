import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

# Set up logger
logger = logging.getLogger(__name__)
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    pool_pre_ping=True
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# All SQL models will inherit from this
Base = declarative_base()

def get_db():
    """
    Dependency to get a database session.
    Usage in routers: db: Session = Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """
    Test database connection and verify settings.
    This replaces the old async init_db() called in main.py.
    """
    logger.info("Initializing PostgreSQL connection...")
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
            
        # Log masked URL for debugging
        masked_url = str(SQLALCHEMY_DATABASE_URL).split('@')[-1] if '@' in str(SQLALCHEMY_DATABASE_URL) else '***'
        logger.info(f"Connected to PostgreSQL at: ...@{masked_url}")
        
    except Exception as e:
        logger.critical(f"Database initialization failed: {str(e)}", exc_info=True)
        raise
