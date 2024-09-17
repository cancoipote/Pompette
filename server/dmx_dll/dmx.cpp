#include "pch.h"
#include "dmx.h"

typedef FT_STATUS(CALLBACK* FT_Open_Type)(int deviceNumber, FT_HANDLE* handle);
typedef FT_STATUS(CALLBACK* FT_ResetDevice_Type)(FT_HANDLE handle);
typedef FT_STATUS(CALLBACK* FT_SetDivisor_Type)(FT_HANDLE handle, unsigned short usDivisor);
typedef FT_STATUS(CALLBACK* FT_SetBaudRate_Type)(FT_HANDLE handle, unsigned long baudRate);
typedef FT_STATUS(CALLBACK* FT_SetDataCharacteristics_Type)(FT_HANDLE handle, unsigned char word_length, unsigned char stop_bits, unsigned char parity);
typedef FT_STATUS(CALLBACK* FT_SetFlowControl_Type)(FT_HANDLE handle, unsigned short flow_none, unsigned char XonChar, unsigned char XoffChar);
typedef FT_STATUS(CALLBACK* FT_ClrRts_Type)(FT_HANDLE handle);
typedef FT_STATUS(CALLBACK* FT_Purge_Type)(FT_HANDLE handle, unsigned long mask);
typedef FT_STATUS(CALLBACK* FT_SetBreakOn_Type)(FT_HANDLE handle);
typedef FT_STATUS(CALLBACK* FT_SetBreakOff_Type)(FT_HANDLE handle);
typedef FT_STATUS(CALLBACK* FT_Write_Type)(FT_HANDLE handle, BYTE* buffer, DWORD bufferSize, DWORD* ptr_BytesWritten);

HINSTANCE dllHandle = NULL;
FT_HANDLE handle = 0;
DWORD bytesWritten = 0;

void init() {
	dllHandle = LoadLibrary(TEXT("ftd2xx.dll"));
	((FT_Open_Type)GetProcAddress(dllHandle, "FT_Open"))(0, &handle);
	((FT_ResetDevice_Type)GetProcAddress(dllHandle, "FT_ResetDevice"))(handle);
	((FT_SetBaudRate_Type)GetProcAddress(dllHandle, "FT_SetBaudRate"))(handle, 250000);
	//((FT_SetDivisor_Type)GetProcAddress(dllHandle, "FT_SetDivisor"))(handle, unsigned short(12));
	((FT_SetDataCharacteristics_Type)GetProcAddress(dllHandle, "FT_SetDataCharacteristics"))(handle, 8, 2, 0);
	((FT_SetFlowControl_Type)GetProcAddress(dllHandle, "FT_SetFlowControl"))(handle, 0, 0, 0);
	((FT_ClrRts_Type)GetProcAddress(dllHandle, "FT_ClrRts"))(handle);
}

void setValues(BYTE values[]) {
	((FT_Purge_Type)GetProcAddress(dllHandle, "FT_Purge"))(handle, 1);
	((FT_Purge_Type)GetProcAddress(dllHandle, "FT_Purge"))(handle, 2);
	((FT_SetBreakOn_Type)GetProcAddress(dllHandle, "FT_SetBreakOn"))(handle);
	((FT_SetBreakOff_Type)GetProcAddress(dllHandle, "FT_SetBreakOff"))(handle);
	((FT_Write_Type)GetProcAddress(dllHandle, "FT_Write"))(handle, values, DWORD(513), &bytesWritten);
}
