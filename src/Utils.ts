// export function BigEndian(): boolean {
//     // Create an ArrayBuffer with a specific pattern to detect endianness
//     const buffer = new ArrayBuffer(2);
//     const uint8Array = new Uint8Array(buffer);
//     const uint16Array = new Uint16Array(buffer);

//     // Write a 16-bit value with known byte pattern
//     uint8Array[0] = 0xAA; // 170
//     uint8Array[1] = 0xBB; // 187

//     // If system is little endian, we'll get 0xBBAA (48042)
//     // If system is big endian, we'll get 0xAABB (43707)
//     return uint16Array[0] === 0xAABB;
// }

// Swapping functions
// export function Swap4(data: Uint8Array) : void {
//     const tmp = data[0];
//     data[0] = data[3];
//     data[3] = data[1];
//     data[1] = data[2];
//     data[2] = data[3];
//     data[3] = tmp;
// }

export function ThrowOnUndefined<T>(value: T | undefined, error: () => Error) : T {
    if (value === undefined) throw error();
    return value;
}
