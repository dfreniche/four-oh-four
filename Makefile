# Oh-mummy makefile

.DEFAULT_GOAL := compile

help:
	$(info ************ HELP **********) 
	$(info init  : installs http-server from node) 
	$(info server: starts a server to test the game) 
	$(info run   : opens the game) 
	$(info run   : runs the game) 

init:
	npm -g install http-server

server:
	http-server . -p 3001

open:
	open http://localhost:3001/index.html

run: server open

