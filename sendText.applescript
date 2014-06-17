# PUT IN YOUR APPLE ID HERE:
property myIMsgService : "E:cam.henlin@gmail.com"

on run argv
	tell application "Messages"
		set sendServiceName to name of 1st service whose name = myIMsgService
		set myid to get id of service sendServiceName
		set targetBuddy to item 1 of argv
		set sendBuddy to buddy targetBuddy of service id myid
		# chop out targetBuddy from recvText
		set fwdMsg to item 2 of argv
		send fwdMsg to sendBuddy
	end tell
end run