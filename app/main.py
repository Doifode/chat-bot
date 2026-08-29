from fastapi import FastAPI,Depends
from app.db.database import get_db
from sqlalchemy.orm import Session 
from sqlalchemy import text
from app.db.base import Base
from app.routes.user import router as user_router
from app.routes.user_metadata import router as user_metadata_router
from app.routes.chat import router as chat_router

app = FastAPI()
app.include_router(user_router)
app.include_router(user_metadata_router)
app.include_router(chat_router)
print(Base.metadata.tables.keys())


@app.get("/")
def root():
    return {"message": "Hello World"}


@app.get("/health/db")
def database_health(db :Session= Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "Database connection successful."}
    except Exception as e:
        return {"status": "Database connection failed.", "error": str(e)}
    
