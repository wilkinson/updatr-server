#-  GNU Makefile

#-  Makefile ~~
#   This contains live instructions for the "diligent slave" server node of the
#   "updatr" package management system for R. It makes a barebones CouchApp and
#   uploads R package names and version numbers as a JSON file.
#                                                           ~~ SRW, 15 Nov 2010

SHELL   :=  bash

COUCHAPP:=  couchapp
APP     :=  latest
#DB      :=  localhost:5984/testing
DB      :=  updatr.couchone.com/testing
APPRC   :=  $(APP)/.couchapprc

R       :=  Rscript
PKGDATA :=  pkg-info.json
DRIVER  :=  get-pkg-info.r

CP      :=  rsync --archive
ECHO    :=  echo -en
RM      :=  rm -rf

.PHONY: all clean clobber reset run

all: run

clean: reset
	@   $(RM) $(APPRC)

clobber: clean
	@   $(RM) $(APP) $(PKGDATA)

reset:
	@   clear

run: $(APPRC) $(APP) $(PKGDATA)
	@   $(CP) $(wildcard *.css) $(APP)/_attachments                 ;   \
            $(CP) $(wildcard *.js) $(APP)/_attachments                  ;   \
            $(CP) $(wildcard *.html) $(APP)/_attachments                ;   \
            $(CP) $(PKGDATA) $(APP)/_attachments                        ;   \
            cd $(APP) && $(COUCHAPP) push -bq

###

$(APP):
	@   $(COUCHAPP) generate $(APP)                                 ;   \
            $(RM) $(APP)/_attachments/* README.md                       ;   \
            $(RM) $(APP)/{evently,lists,shows,updates,vendor,views}

$(APPRC): $(APP)
	@   $(ECHO) '{"env": {"default": {"db": "http://' > $@          ;   \
            read -p "Username: " -e USERNAME                            ;   \
            read -p "Password: " -s PASSWORD && $(ECHO) '\n'            ;   \
            $(ECHO) "$${USERNAME}:$${PASSWORD}@$(DB)\"}}}" >> $@

$(PKGDATA):
	@   $(R) $(DRIVER) > $@

#-  vim:set syntax=make:
