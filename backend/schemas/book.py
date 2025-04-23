from pydantic import BaseModel, Field, HttpUrl
from typing import Optional


class BookBase(BaseModel):
    title: str = Field(..., max_length=200)
    author: Optional[str] = Field(None, max_length=150)
    isbn: Optional[str] = Field(None, max_length=20)
    image_url: Optional[HttpUrl] = None 
    public_rating: Optional[float] = None


# Properties to receive via API on creation (e.g., when adding a book discovered via external API)
class BookCreate(BookBase):
    isbn: str = Field(..., max_length=20)
    title: str = Field(..., max_length=200)


# Properties to receive via API on update (unlikely to update book details?)
class BookUpdate(BaseModel):
    pass

# Properties shared by models stored in DB
class BookInDBBase(BookBase):
    id: int

    class Config:
        def __init__(self):
            pass

        from_attributes = True


# Properties to return to client
class BookPublic(BookInDBBase):
    pass

# Additional properties stored in DB
class BookInDB(BookInDBBase):
    pass 