hacked together imessage service
===

### purpose:

the purpose of this project is to provide a web interface for basic imessage sending and receiving on non-apple devices and computers. ie, android, windows phone, blackberry, etc. capable of using a sevice like jabber to issue push notification to devices for new imessages as well.

why? because i broke my iphone, got a windows phone for cheap, and didn't want to get rid of imessages since i'm switching back to iphone in a few months

system requirements:
- macintosh computer (tested on 10.10 only but should work just as well in 10.9)
- nodejs
- some type of remote access service like dyndns or an external ip address if you want to use this service outside of your own network

how to configure and use in a few easy steps:
==

- download package
- modify app.js, line 2: put in your imessage phone number, preceded by a + and with no punctuation of any kind. for example, 1-123-123-1234 becomes +11231231234
- modify public/app.front.js, line 3: put in your imessage phone number, preceded by a + and with no punctuation of any kind. for example, 1-123-123-1234 becomes +11231231234
- modify AutoForwardIMessageText.applescript
	- on line 4, enter in your apple id, preceded by an E: for example, hello@world.com becomes E:hello@world.com
	- if you want forwarding of imessages to another service (useful for push alerts -- i use google talk to notify me of new imessages so i can respond using the web service), set line 9 to the name of the service to send FROM. this is the name from the left hand side of the accounts list.
	- if you want message forwarding, set line 14 to the account that you want the forwarding service to send TO
	- note: if you are using a forwarding service, you can respond to imessages from that service as well by responding with the full phone number of the person you wish to send to, followed by the message you want to send them
- on line 2 of sendText.applescript, enter your apple id again, in the same format as before, preceded by an E:. for example, hello@world.com becomes E:hello@world.com
- open your messages scripts folder (from messages app, go to messages menu > general > AppleScript handler > open scripts folder), and copy AutoForwardIMessageText.applescript to the folder
- set the AppleScript handler in messages menu > general > AppleScript handler to AutoForwardIMessageText
- open your terminal, and navigate to the directory that you downloaded the package to, and type 'node app'
- you should now be able to navigate to http://localhost:3000/app.html on the computer to confirm that the app is working. conversation will not begin to show up until new messages are sent to the imessage account that you have configured. the message app must be out of focus when this is happening!

that's it!
=

at this point i don't think any further development work on this project will be done besides bug fixes. if you're interested in a more full featured system or native client app for winphone/android please let me know on twitter @camhenlin, if there's enough interest i may continue work on the project


big thanks to https://github.com/yongjunj/AutoForwardIMessage where i got a good portion of the messages app control code