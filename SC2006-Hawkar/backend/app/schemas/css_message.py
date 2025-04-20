from pydantic import BaseModel
class CSSMessageCreate(BaseModel):
     css_history_id: str
     receiver_user_id: str
     sender_user_id: str
     text: str
class CSSMessage(BaseModel):
      css_history_id: str
      receiver_user_id: str
      sender_user_id: str
      text: str
      css_message_id: str
      datetime: str