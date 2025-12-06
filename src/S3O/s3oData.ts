import * as Utils from '../Utils';

// HACK: endianness is not really tested
// const BigEndian : boolean = Utils.BigEndian();
// console.log("BigEndian:", BigEndian);
// const Apple : boolean = process.platform === 'darwin';
// console.log("Apple:", Apple);

interface Visitor {
    Int(o: Int): void;
    Float(o: Float): void;
    String(o: String): void;
}

export class Int {
    value = 0;
    Visit(v: Visitor) { v.Int(this); }
}

class Float {
    value = 0.0;
    Visit(v: Visitor) { v.Float(this); }
}

class String {
    value = "";
    Visit(v: Visitor) { v.String(this); }
}

const utf8Decoder = new TextDecoder("utf-8");

class StreamRead implements Visitor
{
    offset = 0;

    data: DataView<ArrayBufferLike>;
    maxlen = 0;
    constructor(private buf: Uint8Array<ArrayBufferLike>) 
    { 
        this.data = new DataView(buf.buffer);
        this.maxlen = buf.byteLength;
    }

    Int(o: Int): void {
        if (this.offset + 4 > this.maxlen) throw new Error(`Out of bounds (${this.offset + 4}>${this.maxlen})`);
        o.value = this.data.getInt32(this.offset, true);
        this.offset += 4;
    }
    Float(o: Float): void {
        if (this.offset + 4 > this.maxlen) throw new Error(`Out of bounds (${this.offset + 4}>${this.maxlen})`);
        o.value = this.data.getFloat32(this.offset, true);
        this.offset += 4;
    }
    String(o: String): void {
        const next0 = Utils.ThrowOnUndefined(this.buf.indexOf(0, this.offset), () => new Error(`Undelimited string (${this.offset}...${this.maxlen})`));
        o.value = utf8Decoder.decode(this.buf.slice(this.offset, next0));
        this.offset = next0 + 1;   // To remove the closing '\0'
    }

    // private stream(size: number): Uint8Array {
    //     const b = this.offset;
    //     this.offset += size;
    //     const e = this.offset;
    //     if (e > this.data.byteLength) throw new Error("truncated file");
    //     return this.data.slice(b, e);
    // }

    // private read4(swap: boolean): Uint8Array {
    //     const d = this.stream(4);
    //     if (swap) Utils.Swap4(d);
    //     return d;
    // }

    // constructor(private data: Uint8Array<ArrayBufferLike>) { }

    // private stream(size: number): Uint8Array {
    //     const b = this.offset;
    //     this.offset += size;
    //     const e = this.offset;
    //     if (e > this.data.byteLength) throw new Error("truncated file");
    //     return this.data.slice(b, e);
    // }

    // private read4(swap: boolean): Uint8Array {
    //     const d = this.stream(4);
    //     if (swap) Utils.Swap4(d);
    //     return d;
    // }

    // Int(o: Int): void {
    //     // s3o is little endian
    //     o.value = new Int32Array(this.read4(BigEndian))[0];
    // }
    // Float(o: Float): void {
    //     // __APPLE__ explicitly does not actually swap floats when BigEndian; no idea why.
    //     // There might be other odd cases hiding in byteorder.h?
    //     o.value = new Float32Array(this.read4(BigEndian && !Apple))[0];
    // }

    // String(o: String): void {
    //     const next0 = Utils.ThrowOnUndefined(this.buf.indexOf(0, this.offset), () => new Error("missing string"));
    //     o.value = utf8Decoder.decode(this.stream(next0));
    //     this.offset += 1;   // To remove the closing '\0'
    // }
}

export class Vector2 {
    x = new Float();
    y = new Float();

    Visit(v: Visitor) {
        this.x.Visit(v);
        this.y.Visit(v);
    }
}

export class Vector3 extends Vector2 {
    z = new Float();

    Visit(v: Visitor) {
        super.Visit(v);
        this.z.Visit(v);
    }
}

export class Vertex {
    pos = new Vector3();
    normal = new Vector3();
    tex = new Vector2();

    Visit(v: Visitor) {
        this.pos.Visit(v);
        this.normal.Visit(v);
        this.tex.Visit(v);
    }
}

export class Piece {
    name = new Int();               // offset to piece name
    numchildren = new Int();        // number of sub pieces
    children = new Int();           // offset to child pieces table
    numVertices = new Int();        // number of vertices
    vertices = new Int();           // offset to vertices
    vertexType = new Int();         // always 0 for now
    primitiveType = new Int();      // 0=triangles, 1=triangle strips, 2=quads
    vertexTableSize = new Int();    // number of indices
    vertexTable = new Int();        // offset to vertex indices
    collisionData = new Int();      // must be 0 for now
    offset = new Vector3();         // offset from parent piece

    Visit(v: Visitor): void {
        this.name.Visit(v);
        this.numchildren.Visit(v);
        this.children.Visit(v);
        this.numVertices.Visit(v);
        this.vertices.Visit(v);
        this.vertexType.Visit(v);
        this.primitiveType.Visit(v);
        this.vertexTableSize.Visit(v);
        this.vertexTable.Visit(v);
        this.collisionData.Visit(v);
        this.offset.Visit(v);
    }
}

export class Unit0Header {
    radius = new Float();       // collision sphere radius
    height = new Float();       // total height
    mid = new Vector3();        // offset to middle of collision sphere
    rootPiece = new Int();      // offset to root piece
    collisionData = new Int();  // must be 0 for now
    texture1 = new Int();       // offset to first texture filename
    texture2 = new Int();       // offset to second texture filename
    
    Visit(v: Visitor): void {
        this.radius.Visit(v);
        this.height.Visit(v);
        this.mid.Visit(v);
        this.rootPiece.Visit(v);
        this.collisionData.Visit(v);
        this.texture1.Visit(v);
        this.texture2.Visit(v);
    }
}

export class File {
    header = new Unit0Header();
    strings = new Map<Int, String>();
    pieces = new Map<Int, Piece[]>;
    vertices = new Map<Int, Vertex[]>;
    indices = new Map<Int, Int[]>;

    static FromBinary(data: Uint8Array<ArrayBufferLike>) : File {
        const t = new File();

        const reader = new StreamRead(data);

        {   // File validation
            const s = new String();
            reader.String(s);
            if (s.value !== "Spring unit") throw new Error(`Unrecognized file start: got ${JSON.stringify(s.value)}.`);
            const v = new Int();
            reader.Int(v);
            if (v.value !== 0) throw new Error(`Invalid file version: got ${JSON.stringify(v.value)}.`);
        }

        // Read header
        t.header = new Unit0Header();
        t.header.Visit(reader);

        // Prepare offset data buffers
        t.pieces = new Map();
        t.vertices = new Map();
        t.indices = new Map();
        t.strings = new Map();

        // Offset helpers - string
        const AddString = (offset: Int) => {
            const str = new String();
            reader.offset = offset.value;
            reader.String(str);
            t.strings.set(offset, str);
        };

        // Offset helpers - vertex array
        const AddVertices = (offset: Int, size: number) => {
            if (size > 0) {
                reader.offset = offset.value;
                const vs : Vertex[] = [];
                for (let i = 0; i < size; ++i)
                {
                    const v = new Vertex();
                    v.Visit(reader);
                    vs.push(v);
                }
                t.vertices.set(offset, vs); 
            }
        };

        // Offset helpers - indices array
        const ReadIndices = (offset: Int, size: number) : Int[] => {
            reader.offset = offset.value;
            const vs : Int[] = [];
            for (let i = 0; i < size; ++i)
            {
                const v = new Int();
                v.Visit(reader);
                vs.push(v);
            }
            return vs;
        };
        const AddIndices = (offset: Int, size: number) => {
            if (size > 0) 
                t.indices.set(offset, ReadIndices(offset, size));   
        };

        // Offset helpers - pieces
        const ReadPiece = (offset: Int) : Piece => {
            reader.offset = offset.value;
            const v = new Piece();
            v.Visit(reader);
            AddString(v.name);
            AddVertices(v.vertices, v.numVertices.value);
            AddIndices(v.vertexTable, v.vertexTableSize.value);
            AddPieces(v.children, v.numchildren.value);
            return v;
        };
        const AddPieces = (offset: Int, size: number) => {
            if (size > 0) 
            {
                reader.offset = offset.value;
                t.pieces.set(offset, ReadIndices(offset, size).map(i => ReadPiece(i)));
            }
        };

        // Read offset data for header
        if (t.header.texture1.value) 
            AddString(t.header.texture1);
        if (t.header.texture2.value) 
            AddString(t.header.texture2);
        t.pieces.set(t.header.rootPiece, new Array<Piece>(ReadPiece(t.header.rootPiece)));

        return t;
    }
}
