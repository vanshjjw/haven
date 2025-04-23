from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from .book import BookPublic


# External data for creating a library entry (book might exist or need creation)
class LibraryEntryCreateExternal(BaseModel):
    book_isbn: str
    status: Optional[int] = Field(0, ge=0, le=2) 
    rating: Optional[int] = Field(None, ge=1, le=5)
    notes: Optional[str] = None


# Internal data for creating/updating a library entry (book_id is known)
class LibraryEntryBase(BaseModel):
    book_id: int
    status: Optional[int] = Field(0, ge=0, le=2) 
    rating: Optional[int] = Field(None, ge=1, le=5)
    notes: Optional[str] = None
    date_finished: Optional[datetime] = None


class LibraryEntryCreate(LibraryEntryBase):
    user_id: int


class LibraryEntryUpdate(BaseModel):
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
        def __init__(self):
            pass

        from_attributes = True


# Properties to return to client
# May want to include nested book/user info
class LibraryEntryPublic(LibraryEntryInDBBase):
    book: BookPublic
    pass


# Additional properties stored in DB
class LibraryEntryInDB(LibraryEntryInDBBase):
    pass 