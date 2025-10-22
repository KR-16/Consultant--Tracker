#!/usr/bin/env python3
"""
Script to create initial admin user
"""
import asyncio
import os
from app.db import init_db, get_database
from app.repositories.users import UserRepository
from app.models import UserCreate, UserRole

async def create_admin_user():
    """Create initial admin user"""
    await init_db()
    
    user_repo = UserRepository()
    
    # Check if admin already exists
    existing_admin = await user_repo.get_by_email("admin@consultanttracker.com")
    if existing_admin:
        print("Admin user already exists!")
        return
    
    # Create admin user
    admin_data = UserCreate(
        email="admin@consultanttracker.com",
        name="System Administrator",
        role=UserRole.ADMIN,
        password="admin123"  # Change this in production!
    )
    
    try:
        admin_user = await user_repo.create(admin_data)
        print(f"✅ Admin user created successfully!")
        print(f"Email: {admin_user.email}")
        print(f"Name: {admin_user.name}")
        print(f"Role: {admin_user.role}")
        print(f"Password: admin123")
        print("\n⚠️  IMPORTANT: Change the default password after first login!")
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")

if __name__ == "__main__":
    asyncio.run(create_admin_user())
