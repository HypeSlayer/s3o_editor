import * as S3O from "./s3oData";
import { ThrowOnUndefined } from "../Utils";

class Vector2 {
    x = 0.0;
    y = 0.0;

    FromData(i : S3O.Vector2)
    {
        this.x = i.x.value;
        this.y = i.y.value;
    }
}

class Vector3 extends Vector2 {
    z = 0.0;

    FromData(i : S3O.Vector3)
    {
        super.FromData(i);
        this.z = i.z.value;
    }
}

export class Vertex {
    pos = new Vector3();
    normal = new Vector3();
    tex = new Vector2();

    static FromData(i : S3O.Vertex) : Vertex
    {
        const t = new Vertex();
        t.pos.FromData(i.pos);
        t.normal.FromData(i.normal);
        t.tex.FromData(i.tex);
        return t;
    }
}

export const TriangleType = { 
    Singles: 0, 
    Strips: 1, 
    Quads: 2,
};

class Piece {
    name = "";
    offset = new Vector3();
    primitiveType = TriangleType.Singles;
    vertices: Vertex[] = [];
    indices: number[] = [];
    children: Piece[] = [];

    FromData(p: S3O.Piece, file: S3O.File)
    {
        this.name = ThrowOnUndefined(file.strings.get(p.name), () => new Error("Incomplete strings read")).value; 
        this.offset.FromData(p.offset);
        this.primitiveType = p.primitiveType.value;
        if (p.numVertices.value > 0)
            this.vertices = ThrowOnUndefined(file.vertices.get(p.vertices), () => new Error("Incomplete vertices read")).map(i => Vertex.FromData(i)); 
        if (p.vertexTableSize.value > 0)
            this.indices = ThrowOnUndefined(file.indices.get(p.vertexTable), () => new Error("Incomplete indices read")).map(i => i.value); 
        if (p.numchildren.value > 0)
            this.children = ThrowOnUndefined(file.pieces.get(p.children), () => new Error("Incomplete pieces read")).map(i => Piece.FromData(i, file)); 
    }

    static FromData(p: S3O.Piece, file: S3O.File) : Piece
    {
        const t = new Piece();
        t.FromData(p, file);
        return t;
    }
}

class File {
    radius = 0.0;
    height = 0.0;
    mid = new Vector3();
    root = new Piece();
    texture1 = "";
    texture2 = "";
    
    static FromData(file: S3O.File) : File {
        const t = new File();
        t.radius = file.header.radius.value;
        t.height = file.header.height.value;
        t.mid.FromData(file.header.mid);

        const Texture = function(t: S3O.Int) : string {
            return ThrowOnUndefined(file.strings.get(t), () => new Error("Incomplete strings read")).value; 
        };

        if (file.header.texture1.value)
            t.texture1 = Texture(file.header.texture1); 
        if (file.header.texture2.value)
            t.texture2 = Texture(file.header.texture2); 
        if (file.header.rootPiece.value)
            t.root.FromData(ThrowOnUndefined(file.pieces.get(file.header.rootPiece), () => new Error("Empty pieces"))[0], file);
        return t;
    }
}

export { File };
