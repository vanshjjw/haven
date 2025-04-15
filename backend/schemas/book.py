from pydantic import BaseModel, Field, HttpUrl
from typing import Optional

# Base properties of a book
class BookBase(BaseModel):
    external_id: str = Field(..., index=True)
    title: str = Field(..., max_length=255)
    authors: Optional[str] = Field(None, max_length=255) # Keeping as string for now
    thumbnail_url: Optional[HttpUrl] = None

# Properties to receive via API on creation (usually from external API search)
# We might not create books directly via API, but find/add them to library
class BookCreate(BookBase):
    pass

# Properties to receive via API on update (unlikely to update book details)
class BookUpdate(BaseModel):
    pass # Perhaps internal flags?

# Properties shared by models stored in DB
class BookInDBBase(BookBase):
    id: int

    class Config:
        from_attributes = True

# Properties to return to client
class BookPublic(BookInDBBase):
    pass

# Additional properties stored in DB
class BookInDB(BookInDBBase):
    pass 