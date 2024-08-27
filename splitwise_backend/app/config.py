import os
from datetime import timedelta

# Secret key to encode the JWT
JWT_SECRET = os.environ.get("JWT_SECRET", "your_jwt_secret_key")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_DELTA = timedelta(hours=1)
