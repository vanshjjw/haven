from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# External data for creating a library entry (book might exist or need creation)
class LibraryEntryCreateExternal(BaseModel):
    book_isbn: str # Changed from external_book_id, assumes ISBN identifies book
    # Changed status to integer to match model (0: Want to Read, 1: Reading, 2: Read)
    status: Optional[int] = Field(0, ge=0, le=2) 
    rating: Optional[int] = Field(None, ge=1, le=5)
    notes: Optional[str] = None


# Internal data for creating/updating a library entry (book_id is known)
class LibraryEntryBase(BaseModel):
    book_id: int # Already correct
    # Changed status to integer to match model
    status: Optional[int] = Field(0, ge=0, le=2) 
    rating: Optional[int] = Field(None, ge=1, le=5)
    notes: Optional[str] = None
    date_finished: Optional[datetime] = None


class LibraryEntryCreate(LibraryEntryBase):
    user_id: int # Should be set based on authenticated user


class LibraryEntryUpdate(BaseModel):
    # Changed status to integer to match model
    status: Optional[int] = Field(None, ge=0, le=2) 
    rating: Optional[int] = Field(None, ge=1, le=5)
    notes: Optional[str] = None
    date_finished: Optional[datetime] = None


# Properties shared by models stored in DB
class LibraryEntryInDBBase(LibraryEntryBase):
    id: int
    user_id: int
    date_added: datetime
    # Status is already inherited as integer

    class Config:
        from_attributes = True


# Properties to return to client
# May want to include nested book/user info
class LibraryEntryPublic(LibraryEntryInDBBase):
    # Example of nesting (requires book schema import):
    from .book import BookPublic
    book: BookPublic
    pass


# Additional properties stored in DB
class LibraryEntryInDB(LibraryEntryInDBBase):
    pass 