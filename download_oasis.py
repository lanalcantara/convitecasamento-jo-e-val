import urllib.request
import os

url = "https://ia800300.us.archive.org/1/items/OasisLiveForever_201605/Oasis%20-%20Live%20Forever.mp3"
dest = "live-forever.mp3"

print("Downloading official Oasis - Live Forever MP3...")
urllib.request.urlretrieve(url, dest)
size = os.path.getsize(dest)
print(f"Downloaded successfully! File size: {size} bytes ({size / (1024*1024):.2f} MB)")
