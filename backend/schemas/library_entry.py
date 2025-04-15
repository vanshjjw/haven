from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# External data for creating a library entry (book might exist or need creation)
class LibraryEntryCreateExternal(BaseModel):
    external_book_id: str
    status: Optional[str] = Field(None, pattern=r"^(Want to Read|Reading|Read)$") # Example validation
    rating: Optional[int] = Field(None, ge=1, le=5)
    notes: Optional[str] = None

# Internal data for creating/updating a library entry (book_id is known)
class LibraryEntryBase(BaseModel):
    book_id: int
    status: Optional[str] = Field(None, pattern=r"^(Want to Read|Reading|Read)$")
    rating: Optional[int] = Field(None, ge=1, le=5)
    notes: Optional[str] = None
    date_finished: Optional[datetime] = None

class LibraryEntryCreate(LibraryEntryBase):
    user_id: int # Should be set based on authenticated user

class LibraryEntryUpdate(BaseModel):
    status: Optional[str] = Field(None, pattern=r"^(Want to Read|Reading|Read)$")
    rating: Optional[int] = Field(None, ge=1, le=5)
    notes: Optional[str] = None
    date_finished: Optional[datetime] = None

# Properties shared by models stored in DB
class LibraryEntryInDBBase(LibraryEntryBase):
    id: int
    user_id: int
    date_added: datetime

    class Config:
        from_attributes = True

# Properties to return to client
# May want to include nested book/user info
class LibraryEntryPublic(LibraryEntryInDBBase):
    # Example of nesting:
    # from .book import BookPublic
    # book: BookPublic
    pass

# Additional properties stored in DB
class LibraryEntryInDB(LibraryEntryInDBBase):
    pass 