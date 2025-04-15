from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8')

    # Database Configuration
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/storyroom"

    # Application Secret Key
    SECRET_KEY: str = "secretive-key-for-storyroom"



settings = Settings() 