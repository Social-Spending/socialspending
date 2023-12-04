#mkfile_path := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
GXX_FLAGS = -Wall -g

all: bin/FindDebtChains

# -L for g++ to find libmariadbcpp.so
# -Wl,-rpath to search the given directory when linking AND embed the library rpath in the executable
# -Wl,--disable-new-dtags to tells linker to embed the library rpath as a RPATH instead of RUNPATH, so the directory is used to link dynamic libraries recursively
#bin/DebtReduction: bin/DebtReduction.o include/DebtReduction.hpp src/DebtReductionDriver.cpp bin
#	g++ ${GXX_FLAGS} -std=c++11 -o bin/DebtReduction src/DebtReductionDriver.cpp bin/DebtReduction.o -L"lib/mariadb" -lmariadbcpp -Wl,-rpath="$(mkfile_path)lib/mariadb" -Wl,--disable-new-dtags

bin/FindDebtChains: src/FindDebtChainsDriver.cpp bin/DebtReduction.o bin
	g++ ${GXX_FLAGS} -std=c++11 -o bin/FindDebtChains bin/DebtReduction.o src/FindDebtChainsDriver.cpp

bin/DebtReduction.o: src/DebtReduction.cpp include/DebtReduction.hpp bin
	g++ ${GXX_FLAGS} -std=c++11 -o bin/DebtReduction.o -c src/DebtReduction.cpp

bin/DebtNetworkInputMgr.o: test/DebtNetworkInputMgr.cpp test/DebtNetworkInputMgr.hpp bin
	g++ ${GXX_FLAGS} -std=c++11 -o bin/DebtNetworkInputMgr.o -c test/DebtNetworkInputMgr.cpp

bin:
	mkdir -p bin
