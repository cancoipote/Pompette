#ifndef DMX_H
#define DMX_H

#include "FTD2XX.H"

extern "C" __declspec(dllimport) void init();
extern "C" __declspec(dllimport) void setValues(BYTE values[]);

#endif
