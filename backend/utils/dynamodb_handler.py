import boto3

class DynamoDBHandler:
    def __init__(self):
        self.dynamodb = boto3.resource('dynamodb')
        self.chat_sessions = self.dynamodb.Table('chat-sessions')
    
    def store_chat_context(self, session_id, context):
        self.chat_sessions.put_item(
            Item={
                'session_id': session_id,
                'context': context,
                'timestamp': timestamp
            }
        ) 