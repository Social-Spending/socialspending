mkfile_path := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
GXX_FLAGS = -Wall -g
WT_VERSION = 4.10.2

all: bin/DebtReduction

# -L for g++ to find libmariadbcpp.so
# -Wl,-rpath to search the given directory when linking AND embed the library rpath in the executable
# -Wl,--disable-new-dtags to tells linker to embed the library rpath as a RPATH instead of RUNPATH, so the directory is used to link dynamic libraries recursively
bin/DebtReduction: bin/DebtReduction.o include/DebtReduction.hpp src/DebtReductionDriver.cpp bin
	g++ ${GXX_FLAGS} -std=c++11 -o bin/DebtReduction src/DebtReductionDriver.cpp bin/DebtReduction.o -L"lib/mariadb" -lmariadbcpp -Wl,-rpath="$(mkfile_path)lib/mariadb" -Wl,--disable-new-dtags

bin/DebtReduction.o: src/DebtReduction.cpp include/DebtReduction.hpp
	g++ ${GXX_FLAGS} -std=c++11 -o bin/DebtReduction.o -c src/DebtReduction.cpp

bin/DebtNetworkInputMgr.o: test/DebtNetworkInputMgr.cpp test/DebtNetworkInputMgr.hpp
	g++ ${GXX_FLAGS} -std=c++11 -o bin/DebtNetworkInputMgr.o -c test/DebtNetworkInputMgr.cpp

bin/DebtReductionFromFile: test/DebtReductionDriverFromFile.cpp bin/DebtNetworkInputMgr.o bin/DebtReduction.o
	g++ ${GXX_FLAGS} -std=c++11 -o bin/DebtReductionFromFile bin/DebtNetworkInputMgr.o bin/DebtReduction.o test/DebtReductionDriverFromFile.cpp

bin/DebtReductionWebTest: bin/DebtReduction.o include/DebtReduction.hpp test/DebtReductionWebTest.cpp bin lib/wt/libwt.so lib/wt/libwthttp.so include/Wt bin/DebtNetworkInputMgr.o
	g++ ${GXX_FLAGS} -std=c++14 -o bin/DebtReductionWebTest test/DebtReductionWebTest.cpp bin/DebtReduction.o bin/DebtNetworkInputMgr.o -I"include" -L"lib/wt" -lwt -lwthttp -Wl,-rpath="$(mkfile_path)lib/wt" -Wl,--disable-new-dtags

lib/wt/libwt.so lib/wt/libwthttp.so include/Wt: lib/wt
	mkdir -p wt-${WT_VERSION}/build
	cd wt-${WT_VERSION}/build && cmake ..
#	-DCMAKE_INSTALL_PREFIX=${mkfilr_path}lib/wt
	cd wt-${WT_VERSION}/build && make
#	cd wt-${WT_VERSION}/build && make install
	cp -f -T wt-${WT_VERSION}/build/lib/wt/lib/libwt.so.${WT_VERSION} lib/wt/libwt.so
	cp -f -T wt-${WT_VERSION}/build/lib/wt/lib/libwthttp.so.${WT_VERSION} lib/wt/libwthttp.so
	cp -r -f wt-${WT_VERSION}/build/lib/wt/include/Wt include/

lib/wt:
	mkdir -p lib/wt

bin:
	mkdir -p bin

run-test: bin/DebtReductionWebTest
	./bin/DebtReductionWebTest --http-listen 0.0.0.0:8080 --docroot ./test
