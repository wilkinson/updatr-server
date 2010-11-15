#-  R source code

#-  get-pkg-info.r ~~
#   This is based on the code that Hadley sent me during our meeting today. It
#   will output a one-line JSON file with package names as keys and package
#   versions as values.
#                                                           ~~ SRW, 15 Nov 2010

#-  DEPENDENCIES: rjson

pkg <- as.data.frame(available.packages(), stringsAsFactors = FALSE)

#pkg[c("Package", "Version")]

pkgs <- pkg$Version
names(pkgs) <- pkg$Package

library(rjson)

cat(toJSON(pkgs))

#-  vim:set syntax=r:
