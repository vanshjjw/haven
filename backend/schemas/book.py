from pydantic import BaseModel, Field, HttpUrl
from typing import Optional

# Base properties of a book, aligned with models.py
class BookBase(BaseModel):
    # external_id removed, isbn is now the potential external identifier
    title: str = Field(..., max_length=200)
    author: Optional[str] = Field(None, max_length=150)
    isbn: Optional[str] = Field(None, max_length=20)
    # Renamed thumbnail_url to image_url to match model
    image_url: Optional[HttpUrl] = None 
    public_rating: Optional[float] = None

# Properties to receive via API on creation (e.g., when adding a book discovered via external API)
class BookCreate(BookBase):
    # ISBN might be required if it's the primary key for finding existing books
    isbn: str = Field(..., max_length=20) 
    title: str = Field(..., max_length=200) # Title also required

# Properties to receive via API on update (unlikely to update book details?)
class BookUpdate(BaseModel):
    pass # Perhaps internal flags?

# Properties shared by models stored in DB
class BookInDBBase(BookBase):
    id: int

    class Config:
        from_attributes = True

# Properties to return to client
class BookPublic(BookInDBBase):
    pass # Includes id, title, author, isbn, image_url, public_rating

# Additional properties stored in DB
class BookInDB(BookInDBBase):
    pass 