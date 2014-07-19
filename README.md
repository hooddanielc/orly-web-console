orly-web-console
================

An attempt to make a web console for playing with an orly database installation

To run...

First install orly databse

To run with bottles built in developement http server, uncomment line 14 in orly_web_console.py

```
sudo pip install bottle
sudo python orly_web_console.py
```

For production, this application should be ran by something like nginx using wsgi. See [bottle's website](http://bottlepy.org/docs/dev/index.html) for information on how to do that.
