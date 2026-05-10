"""
CivicOS — User Schemas
"""

from pydantic import EmailStr

from app.schemas.base import CivicOSBase, TimestampedSchema


class UserBase(CivicOSBase):
    email: EmailStr
    full_name: str | None = None
    role: str = "user"
    is_active: bool = True


class UserCreate(UserBase):
    pass


class UserUpdate(CivicOSBase):
    email: EmailStr | None = None
    full_name: str | None = None
    role: str | None = None
    is_active: bool | None = None


class UserResponse(UserBase, TimestampedSchema):
    pass
