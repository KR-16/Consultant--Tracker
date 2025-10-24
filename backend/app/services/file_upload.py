import os
import uuid
import aiofiles
from fastapi import UploadFile, HTTPException
from typing import Optional
import mimetypes

class FileUploadService:
    def __init__(self):
        self.upload_dir = "uploads"
        self.resume_dir = os.path.join(self.upload_dir, "resumes")
        self.max_file_size = 10 * 1024 * 1024  # 10MB
        self.allowed_extensions = {'.pdf', '.doc', '.docx'}
        self.allowed_mime_types = {
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }
        
        # Create directories if they don't exist
        os.makedirs(self.resume_dir, exist_ok=True)

    def _validate_file(self, file: UploadFile) -> None:
        """Validate uploaded file"""
        # Check file size
        if hasattr(file, 'size') and file.size and file.size > self.max_file_size:
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum size is {self.max_file_size // (1024*1024)}MB"
            )
        
        # Check file extension
        if file.filename:
            file_ext = os.path.splitext(file.filename)[1].lower()
            if file_ext not in self.allowed_extensions:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid file type. Allowed types: {', '.join(self.allowed_extensions)}"
                )
        
        # Check MIME type
        if file.content_type and file.content_type not in self.allowed_mime_types:
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Only PDF and Word documents are allowed"
            )

    def _generate_filename(self, original_filename: str, user_id: str) -> str:
        """Generate unique filename"""
        file_ext = os.path.splitext(original_filename)[1].lower()
        unique_id = str(uuid.uuid4())
        return f"{user_id}_{unique_id}{file_ext}"

    async def upload_resume(self, file: UploadFile, user_id: str, application_id: Optional[str] = None) -> str:
        """Upload resume file"""
        try:
            # Validate file
            self._validate_file(file)
            
            # Generate filename
            filename = self._generate_filename(file.filename, user_id)
            file_path = os.path.join(self.resume_dir, filename)
            
            # Read file content
            content = await file.read()
            
            # Validate file size from content
            if len(content) > self.max_file_size:
                raise HTTPException(
                    status_code=413,
                    detail=f"File too large. Maximum size is {self.max_file_size // (1024*1024)}MB"
                )
            
            # Write file to disk
            async with aiofiles.open(file_path, 'wb') as f:
                await f.write(content)
            
            # Return relative path for database storage
            return os.path.join("resumes", filename)
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error uploading file: {str(e)}"
            )

    async def get_resume_path(self, file_path: str) -> str:
        """Get full path to resume file"""
        return os.path.join(self.upload_dir, file_path)

    async def delete_resume(self, file_path: str) -> bool:
        """Delete resume file"""
        try:
            full_path = await self.get_resume_path(file_path)
            if os.path.exists(full_path):
                os.remove(full_path)
                return True
            return False
        except Exception:
            return False

    async def get_resume_info(self, file_path: str) -> dict:
        """Get resume file information"""
        try:
            full_path = await self.get_resume_path(file_path)
            if os.path.exists(full_path):
                stat = os.stat(full_path)
                return {
                    "filename": os.path.basename(file_path),
                    "size": stat.st_size,
                    "created_at": stat.st_ctime,
                    "modified_at": stat.st_mtime,
                    "exists": True
                }
            return {"exists": False}
        except Exception:
            return {"exists": False}

# Global instance
file_upload_service = FileUploadService()
