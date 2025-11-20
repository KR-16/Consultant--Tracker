import urllib.request
import sys

def verify_health():
    try:
        with urllib.request.urlopen("http://localhost:8000/health") as response:
            if response.getcode() == 200:
                print("Backend health check passed")
            else:
                print(f"Backend health check failed: {response.getcode()}")
                sys.exit(1)
    except Exception as e:
        print(f"Backend health check failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    verify_health()
