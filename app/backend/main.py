import boto3
import uuid
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://frontend",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_secret(secret_name):
    try:
        with open(f"/run/secrets/{secret_name}", "r") as f:
            return f.read().strip()
    except IOError:
        raise FileNotFoundError

AWS_ACCESS_KEY = get_secret("aws_access_key")
AWS_SECRET_KEY = get_secret("aws_secret_key")
AWS_REGION = get_secret("aws_region")
S3_BUCKET = get_secret("s3_bucket")
DYNAMO_TABLE = get_secret("dynamo_table")

s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=AWS_REGION
)

dynamodb = boto3.resource(
    'dynamodb',
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=AWS_REGION
)
table = dynamodb.Table(DYNAMO_TABLE)

MAX_FILE_SIZE = 1 * 1024 * 1024 * 1024  # 1 GB

@app.post("/upload")
def upload_file(request: Request, file: UploadFile = File(...)):
    content_length = request.headers.get('content-length')
    if content_length and int(content_length) > MAX_FILE_SIZE:
         raise HTTPException(status_code=413, detail="File too large. Max size is 1GB.")

    try:
        s3_client.head_bucket(Bucket=S3_BUCKET)
    except Exception as e:
        print(f"Bucket Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Bucket configuration error")

    try:
        # calculates file dimension
        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)

        s3_client.upload_fileobj(file.file, S3_BUCKET, file.filename)
        
        timestamp = datetime.now().isoformat()
        client_ip = request.client.host if request.client else "unknown"
        
        # id generation for dynamo table
        upload_id = str(uuid.uuid4()) 
        table.put_item(
            Item={
                'id': upload_id,
                'filename': file.filename,
                'upload_timestamp': timestamp,
                'file_size_bytes': file_size,
                'client_ip': client_ip
            }
        )

        return {
            "message": "File uploaded successfully",
            "filename": file.filename,
            "size": file_size
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))