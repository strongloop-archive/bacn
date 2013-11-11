# A useful Makefile for generating and running the basic application.

default: clean create build run

create:
	bacn create bacn-test com.strongloop.bacn-test BacnTest

clean:
	rm -rf bacn-test

build:
	cd bacn-test; bacn build

run:
	cd bacn-test; bacn run
