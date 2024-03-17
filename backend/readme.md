This backend serves to forward websocket connections from port 5000 to 5010

It also proxies API requests by using the following format:

http://localhost:4000/http://google.com/ - Google.com with CORS headers
http://localhost:4000/google.com - Same as previous.
http://localhost:4000/google.com:443 - Proxies https://google.com/
http://localhost:4000/ - Shows usage text, as defined in libs/help.txt
