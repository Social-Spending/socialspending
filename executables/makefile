mkfile_path := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
GXX_FLAGS=-Wall -std=c++11 -g

all: bin/DebtReduction

# -L for g++ to find libmariadbcpp.so
# -Wl,-rpath to search the given directory when linking AND embed the library rpath in the executable
# -Wl,--disable-new-dtags to tells linker to embed the library rpath as a RPATH instead of RUNPATH, so the directory is used to link dynamic libraries recursively
bin/DebtReduction: lib/DebtReduction.o include/DebtReduction.hpp src/DebtReductionDriver.cpp
	mkdir -p bin
	g++ ${GXX_FLAGS} -o bin/DebtReduction src/DebtReductionDriver.cpp lib/DebtReduction.o -L"lib/mariadb" -lmariadbcpp -Wl,-rpath="$(mkfile_path)lib/mariadb" -Wl,--disable-new-dtags

lib/DebtReduction.o: src/DebtReduction.cpp include/DebtReduction.hpp
	g++ ${GXX_FLAGS} -o lib/DebtReduction.o -c src/DebtReduction.cpp
