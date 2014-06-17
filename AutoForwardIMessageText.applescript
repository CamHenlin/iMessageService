# What's your iMessage/iCloud/Apple ID? Note the format
# This must be the same as what's listed under Accounts
# PUT IN YOUR APPLE ID HERE:
property myIMsgService : "E:"

# Account to use for forwarding
# (This is the "friendly" name in the Accounts list)
# IF YOU WANT A FORWARDING SERVICE, ENTER ITS NAME FROM THE ACCOUNTS LIST HERE:
property fwdService : "Gmail"

# The buddy to receive the forwarded message - presumably your primary chat acct
# To send to an SMS, enter as format "+15555551212"
# IF YOU WANT A FORWARDING SERVICE, ENTER THE ACCOUNT THAT YOU WANT TO FORWARD TO HERE:
property fwdServiceBuddy : "xxx@public.talk.google.com"






on write_to_file(this_data, target_file, append_data) -- (string, file path as string, boolean)
    try
        set the target_file to the target_file as text
        set the open_target_file to ¬
            open for access file target_file with write permission
        if append_data is false then ¬
            set eof of the open_target_file to 0
        write this_data to the open_target_file starting at eof
        close access the open_target_file
        return true
    on error
        try
            close access file target_file
        end try
        return false
    end try
end write_to_file

on WriteLog(the_text)
    set this_story to the_text
    set this_file to (((path to desktop folder) as text) & "textdata.xml")
    my write_to_file(this_story, this_file, true)
end WriteLog

on deleteLinesFromText(theText, deletePhrase)
   set newText to ""
   try
       -- here's how you can delete all lines of text fron fileText that contain the deletePhrase.
       -- first turn the text into a list so you can repeat over each line of text
       set textList to paragraphs of theText

       -- now repeat over the list and ignore lines that have the deletePhrase
       repeat with i from 1 to count of textList
           set thisLine to item i of textList
           if thisLine does not contain deletePhrase then
               set newText to newText & thisLine & return
           end if
       end repeat
       if newText is not "" then set newText to text 1 thru -2 of newText
   on error
       set newText to theText
   end try
   return newText
end deleteLinesFromText


# AutoForwardIMessageText.applescript
# - Supports 2-way relaying of iMessage to/from another chat service
# - To send iMessage, each outgoing iMessage must be formatted as: "[iMessage destination] Message"

# References
# https://discussions.apple.com/thread/5214769?start=0&tstart=0
# https://46b.it/2012/hacking-with-imessage

# You can enumerate all your chat accounts on Messages like this:
(*
tell application "Messages"
get name of every service
end tell
*)
# Example result: {"Bonjour", "Facebook Chat", "AIM", "E:you@me.com"}

# Remember the iMessage that just came in
property recvService : ""
property recvText : ""
property recvBuddy : ""

# What ultimately gets forwarded
property fwdMsg : ""

# Event handler
using terms from application "Messages"
	on message received theText from theBuddy for theChat
		# get what we need
		set recvService to name of service of theChat
		set recvText to theText
		set recvBuddy to name of theBuddy as text

		# fwd
		if recvText ≠ "" then
			try
				if recvService = myIMsgService then # incoming iMessage
					# recvBuddyId is ABCDEFGH-IJKL-MNOP-QRST-UVWXYZABCDEF:+17894560123
					set recvBuddyId to id of theBuddy as text
					set oldDelims to AppleScript's text item delimiters
					set AppleScript's text item delimiters to {":"}
					set recvBuddyId to text item 2 of recvBuddyId
					set AppleScript's text item delimiters to oldDelims
					# now recvBuddyId is +17894560123

					set fwdMsg to "[" & recvBuddy & "] [" & recvBuddyId & "] [" & recvText & "]"
					set sendServiceName to name of 1st service whose name = fwdService
					set myid to get id of service sendServiceName
					set sendBuddy to buddy fwdServiceBuddy of service id myid
					send fwdMsg to sendBuddy

					my WriteLog("<message><name>" & recvBuddy & "</name><id>" & recvBuddyId & "</id><text>" & recvText & "</text></message>\n")
				else if recvService = fwdService then # outgoing iMessage
					set sendServiceName to name of 1st service whose name = myIMsgService
					set myid to get id of service sendServiceName
					set tokens to words of recvText
					set targetBuddy to get item 1 of tokens
					set sendBuddy to buddy targetBuddy of service id myid
					# chop out targetBuddy from recvText
					set fwdMsg to text (2 + (length of targetBuddy)) thru (length of recvText) of recvText
					send fwdMsg to sendBuddy
				end if
			on error err
				# optionally log errors here
			end try
		end if

		# make messages happy
		return true
	end message received

	# The following are unused but need to be defined to avoid an error
	# I don't fully understand why, but all the Apple examples in Mavericks
	# have this now as well.

	on message sent theMessage for theChat

	end message sent

	on active chat message received

	end active chat message received

	on chat room message received theMessage from theBuddy for theChat

	end chat room message received

	on addressed chat room message received theMessage from theBuddy for theChat

	end addressed chat room message received

	on addressed message received theMessage from theBuddy for theChat

	end addressed message received

	on av chat started

	end av chat started

	on av chat ended

	end av chat ended

	on login finished for theService

	end login finished

	on logout finished for theService

	end logout finished

	on buddy became available theBuddy

	end buddy became available

	on buddy became unavailable theBuddy

	end buddy became unavailable

	on completed file transfer

	end completed file transfer

end using terms from

# Nothing you put here will get executed - only what's inside the event handler block runs
