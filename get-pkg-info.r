#-  R source code

#-  get-pkg-info.r ~~
#   This is based on the code that Hadley sent me during our meeting today. It
#   will output a JSON file with package names as keys and versions as values.
#   Note that it contains precisely ONE newline, which terminates the object.
#                                                           ~~ SRW, 15 Nov 2010

#-  DEPENDENCIES: rjson

pkg <- as.data.frame(available.packages(), stringsAsFactors = FALSE)

#pkg[c("Package", "Version")]

pkgs <- pkg$Version
names(pkgs) <- pkg$Package

library(rjson)

cat(toJSON(pkgs), "\n", sep = "")

#-  vim:set syntax=r:
