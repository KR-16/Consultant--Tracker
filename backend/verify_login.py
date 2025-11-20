import urllib.request
import json
import sys
import random
import string

def verify_login():
    # 1. Register a new user
    random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
    email = f"login_test_{random_suffix}@example.com"
    password = "password123"
    
    register_url = "http://localhost:8000/api/auth/register"
    register_data = {
        "email": email,
        "name": "Login Test User",
        "password": password,
        "role": "CONSULTANT"
    }
    
    print(f"Registering user: {email}")
    try:
        json_data = json.dumps(register_data).encode('utf-8')
        req = urllib.request.Request(register_url, data=json_data, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req) as response:
            if response.getcode() not in [200, 201]:
                print(f"Registration failed: {response.getcode()}")
                sys.exit(1)
            print("Registration successful")
    except Exception as e:
        print(f"Registration error: {e}")
        sys.exit(1)

    # 2. Try to login
    login_url = "http://localhost:8000/api/auth/login"
    login_data = {
        "email": email,
        "password": password
    }
    
    print(f"Attempting login for: {email}")
    try:
        json_data = json.dumps(login_data).encode('utf-8')
        req = urllib.request.Request(login_url, data=json_data, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req) as response:
            if response.getcode() == 200:
                print("Login successful")
                print(response.read().decode('utf-8'))
            else:
                print(f"Login failed: {response.getcode()}")
                sys.exit(1)
    except urllib.error.HTTPError as e:
        print(f"Login failed with HTTP Error: {e.code}")
        print(e.read().decode('utf-8'))
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected login error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    verify_login()
