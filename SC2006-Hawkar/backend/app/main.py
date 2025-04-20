from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

from routers import (
    auth,
    user,
    admin,
    consumer,
    hawker,
    review,
    stall,
    promotion,
    dish,
)
from database import Base, engine, SessionLocal
from assets.database_seed.helper import add_event_listener_to_seed_database

# Seed database
# Uncomment the line below if you want to seed the database
add_event_listener_to_seed_database()

app = FastAPI()

Base.metadata.create_all(bind=engine)


origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(admin.router)
app.include_router(consumer.router)
app.include_router(hawker.router)
app.include_router(review.router)
app.include_router(stall.router)
app.include_router(promotion.router)
app.include_router(dish.router)
# app.include_router(search.router)


@app.get("/")
def read_root():
    """Root endpoint that returns a link to the API documentation."""
    return {"API Docs": "http://127.0.0.1:8000/docs#/"}


# # Web Socket
# web_socket_manager = WebSocketConnectionManager()


# @app.websocket("/ws/{client_id}")
# async def websocket_endpoint(
#     websocket: WebSocket, client_id: int, db: Session = Depends(get_db)
# ):
#     await web_socket_manager.connect(websocket)
#     await process_websocket_endpoint(web_socket_manager, websocket, client_id, db)
