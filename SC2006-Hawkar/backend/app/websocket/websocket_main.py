# Add project root to Python path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from backend.app.controllers.Customer_service_support import (
    CustomerServiceSupportController,
)  # Import your controller
from backend.app.schemas.css_message import (
    CSSMessageCreate,
    CSSMessage,
)  # Import the Pydantic models
from backend.app.controllers.websocket import (
    WebSocketConnectionManager,
)  # WebSocket manager you defined
import database as appdb
import json
import datetime
import uvicorn

app = FastAPI()
wbsm = WebSocketConnectionManager()


@app.websocket("/ws/{client_id}")
async def websocket_connected(websocket: WebSocket, client_id: str):
    await wbsm.connect(websocket)
    print(f"User {client_id} connected")
    db: Session = next(appdb.get_db())
    try:
        while True:
            data = await websocket.receive_text()
            try:
                data = json.loads(data)
            except:
                continue

            if data["type"] == "new_message":
                data = data["css_message"]
                now = datetime.datetime.now()
                current_time = now.strftime("%H:%M")

                # Save to database
                css_message = CSSMessageCreate(
                    css_history_id=data["css_history_id"],
                    receiver_user_id=data["receiver_user_id"],
                    sender_user_id=data["sender_user_id"],
                    text=data["text"],
                )

                css_message_db = CustomerServiceSupportController.sendMessage(
                    db=db, css_message=css_message
                )

                # Broadcast update
                css_message_response = CSSMessage(
                    css_history_id=css_message_db.css_history_id,
                    receiver_user_id=css_message_db.receiver_user_id,
                    sender_user_id=css_message_db.sender_user_id,
                    text=css_message_db.text,
                    css_message_id=css_message_db.css_message_id,
                    datetime=css_message_db.datetime,
                )
                message = {
                    "time": current_time,
                    "clientId": client_id,
                    "type": "css_message",
                    "css_message": css_message_response.model_dump_json(),
                }
                await wbsm.broadcast(json.dumps(message))

            elif data["type"] == "typing":
                # Broadcast update
                message = {
                    "time": current_time,
                    "clientId": client_id,
                    "type": "typing",
                    "isTyping": data["isTyping"],
                    "senderUserId": data["senderUserId"],
                    "receiverUserId": data["receiverUserId"],
                }
                await wbsm.broadcast(json.dumps(message))

    except WebSocketDisconnect:
        wbsm.disconnect(websocket)
        now2 = datetime.datetime.now()

        message = {
            "time": now2.strftime("%c"),
            "clientId": client_id,
            "type": "disconnect",
            "message": "Offline",
        }
        await wbsm.broadcast(json.dumps(message))
        print(json.dumps(message))


if __name__ == "__main__":
    uvicorn.run("websocket_main:app", host="localhost", port=8080)
