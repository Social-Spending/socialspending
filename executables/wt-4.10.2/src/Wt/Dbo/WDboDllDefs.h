// This may look like C code, but it's really -*- C++ -*-
/*
 * Copyright (C) Emweb bv, Herent, Belgium.
 *
 * See the LICENSE file for terms of use.
 */
#ifndef WDBODLLDEFS_H_
#define WDBODLLDEFS_H_

#include <Wt/WConfig.h>

// Source: http://www.nedprod.com/programs/gccvisibility.html

#ifdef WT_WIN32
  #define WTDBO_IMPORT __declspec(dllimport)
  #define WTDBO_EXPORT __declspec(dllexport)
  #define WTDBO_DLLLOCAL
  #define WTDBO_DLLPUBLIC
#else
  #define WTDBO_IMPORT __attribute__ ((visibility("default")))
  #define WTDBO_EXPORT __attribute__ ((visibility("default")))
  #define WTDBO_DLLLOCAL __attribute__ ((visibility("hidden")))
  #define WTDBO_DLLPUBLIC __attribute__ ((visibility("default")))
#endif

// Define wt_EXPORTS for DLL builds
#ifdef wtdbo_EXPORTS
  #define WTDBO_API WTDBO_EXPORT
#else
  #ifdef WTDBO_STATIC
    #define WTDBO_API
  #else
    #define WTDBO_API WTDBO_IMPORT
  #endif
#endif

// Since Wt 4.5.0 we require C++14, so these are always defined
#ifndef WT_CXX14
#define WT_CXX14
#define WT_CXX14ONLY(x) x
#endif

#ifndef WT_CXX17

#if (__cplusplus >= 201703L) || (defined(_MSVC_LANG) && (_MSVC_LANG >= 201703L) && (_MSC_VER >= 1913))
#define WT_CXX17
#endif

#ifdef WT_CXX17
#define WT_CXX17ONLY(x) x
#else
#define WT_CXX17ONLY(x)
#endif

#endif // end outer ifndef WT_CXX17

#ifndef WT_DEPRECATED
#if defined(WT_BUILDING) || defined(WT_CNOR)
// Don't warn about internal use of deprecated APIs
#define WT_DEPRECATED(details)
#else
#define WT_DEPRECATED(details) [[deprecated(details)]]
#endif
#endif

#ifndef WT_FALLTHROUGH
#if defined(WT_CXX17)
#define WT_FALLTHROUGH [[fallthrough]];
#elif defined(__GNUC__)
#define WT_FALLTHROUGH __attribute__((fallthrough));
#else
#define WT_FALLTHROUGH
#endif
#endif

#endif // WDBODLLDEFS_H_
