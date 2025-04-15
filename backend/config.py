from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Load settings from .env file
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8')

    # Database Configuration
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/storyroom_db"

    # Application Secret Key
    SECRET_KEY: str = "your_default_secret_key"

    # Optional: Add other configurations here later
    # EXAMPLE_API_KEY: str | None = None

# Create a single settings instance to be imported by the app
settings = Settings() 