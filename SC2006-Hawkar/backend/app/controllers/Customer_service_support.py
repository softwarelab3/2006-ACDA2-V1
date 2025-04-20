
import datetime
from sqlalchemy.orm import Session
from backend.app.schemas.css_message import CSSMessage, CSSMessageCreate
from backend.app.models.cssmessages import CSSMessageDB
import uuid
x=datetime.datetime.now()
class CustomerServiceSupportController:
    def sendMessage(db: Session, css_message: CSSMessageCreate) -> CSSMessageDB:
        css_message_idg = str(uuid.uuid4())
        db_message = CSSMessage(
            css_history_id=css_message.css_history_id,
            sender_user_id=css_message.sender_user_id,
            receiver_user_id=css_message.receiver_user_id,
            text=css_message.text,
            css_message_id=css_message_idg,
            datetime=x.strftime("%c")
        )
        db_message1 = CSSMessageDB(
            css_history_id=css_message.css_history_id,
            sender_user_id=css_message.sender_user_id,
            receiver_user_id=css_message.receiver_user_id,
            text=css_message.text,
            css_message_id=css_message_idg,
            datetime=x.strftime("%c")  # Use datetime object, not string
        )
        
        db.add(db_message1)
        db.commit()
        db.refresh(db_message1)
        return db_message