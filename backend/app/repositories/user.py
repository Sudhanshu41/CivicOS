"""
CivicOS — User Repository
"""

from sqlalchemy import select

from app.models.user import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    model = User

    async def get_by_email(self, email: str) -> User | None:
        """Fetch a user by their email address."""
        stmt = select(self.model).where(self.model.email == email)
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()
