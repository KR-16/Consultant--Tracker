"""
Schema Registry Module

This module provides automatic discovery and registration of all collection schemas.
Each schema class that inherits from CollectionSchema will be automatically
discovered and registered when this module is imported.

To add a new collection schema:
1. Create a new file in this directory (e.g., `new_collection.py`)
2. Create a class that inherits from CollectionSchema
3. Import it in this file
4. The schema will be automatically registered
"""

from typing import List, Type
import logging
from app.schemas.base import CollectionSchema

# Import all schema classes to ensure they are registered
from app.schemas.recruiters import RecruitersSchema
from app.schemas.consultants_user import ConsultantsUserSchema
from app.schemas.admins import AdminsSchema
from app.schemas.consultants import ConsultantsSchema  # This is for consultant_profiles
from app.schemas.jobs import JobsSchema
from app.schemas.submissions import SubmissionsSchema

logger = logging.getLogger(__name__)

# Registry to store all schema classes
_registry: List[Type[CollectionSchema]] = []


def _register_schema(schema_class: Type[CollectionSchema]) -> None:
    """
    Register a schema class in the registry.
    
    Args:
        schema_class: The schema class to register
    """
    if schema_class not in _registry:
        _registry.append(schema_class)
        logger.debug(f"Registered schema: {schema_class.__name__} for collection: {schema_class.get_collection_name()}")


def get_all_schemas() -> List[Type[CollectionSchema]]:
    """
    Get all registered schema classes.
    
    Returns:
        List[Type[CollectionSchema]]: List of all registered schema classes
    """
    return _registry.copy()


def get_schema_by_collection_name(collection_name: str) -> Type[CollectionSchema] | None:
    """
    Get a schema class by collection name.
    
    Args:
        collection_name: The name of the MongoDB collection
        
    Returns:
        Type[CollectionSchema] | None: The schema class if found, None otherwise
    """
    for schema_class in _registry:
        if schema_class.get_collection_name() == collection_name:
            return schema_class
    return None


# Auto-register all imported schemas
# This ensures that when this module is imported, all schemas are registered
_register_schema(RecruitersSchema)
_register_schema(ConsultantsUserSchema)
_register_schema(AdminsSchema)
_register_schema(ConsultantsSchema)  # consultant_profiles collection
_register_schema(JobsSchema)
_register_schema(SubmissionsSchema)

logger.info(f"Schema registry initialized with {len(_registry)} schemas: {[s.get_collection_name() for s in _registry]}")

__all__ = [
    'CollectionSchema',
    'RecruitersSchema',
    'ConsultantsUserSchema',
    'AdminsSchema',
    'ConsultantsSchema',
    'JobsSchema',
    'SubmissionsSchema',
    'get_all_schemas',
    'get_schema_by_collection_name',
]

