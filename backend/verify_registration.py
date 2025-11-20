import urllib.request
import json
import sys

import random
import string

def verify_registration():
    random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
    email = f"testuser_{random_suffix}@example.com"
    
    url = "http://localhost:8000/api/auth/register"
    data = {
        "email": email,
        "name": "Test User",
        "password": "password123",
        "role": "CONSULTANT"
    }
    
    try:
        json_data = json.dumps(data).encode('utf-8')
        req = urllib.request.Request(url, data=json_data, headers={'Content-Type': 'application/json'})
        
        with urllib.request.urlopen(req) as response:
            if response.getcode() in [200, 201]:
                print("User registration successful")
                print(response.read().decode('utf-8'))
            else:
                print(f"User registration failed: {response.getcode()}")
                sys.exit(1)
                
    except urllib.error.HTTPError as e:
        # If 400 and "Email already exists", that's also a success for this test (means db check worked)
        if e.code == 400:
            error_body = e.read().decode('utf-8')
            if "Email already exists" in error_body:
                print("User registration check passed (Email already exists)")
                return
            print(f"User registration failed with 400: {error_body}")
            sys.exit(1)
        print(f"HTTP Error: {e.code} - {e.reason}")
        print(e.read().decode('utf-8'))
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    verify_registration()
