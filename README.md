orly-web-console
================

An attempt to make a web console for playing with an orly database installation

To run...

First install orly databse, and start the orlyi server. Here is an example for starting orlyi. Replace --package_dir argument with absolute path to your orly package directory.

```
orlyi --create=true --instance_name=orly_web_console \
  --la --le --mem_sim=true  \
  --package_dir=/home/someuser/orly/packages \
  --starting_state=SOLO --block_cache_size=256.0 \
  --mem_sim_mb=1024 --page_cache_size=256.0
```

To run UI with bottles built in developement http server, uncomment line 14 in orly_web_console.py

```
sudo pip install bottle
sudo python orly_web_console.py
```

For production, this application should be ran by something like nginx using wsgi. See [bottle's website](http://bottlepy.org/docs/dev/index.html) for information on how to do that.
