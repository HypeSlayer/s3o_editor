import * as path from 'path';
import { decodeNamedImage, ChannelOrder } from 'image-in-browser';
import { parseDDSHeader, parseKTXHeader, ImageInfo } from 'dds-ktx-parser';

class Texture {
	constructor(public readonly width : number,
				public readonly height : number, 
				public readonly pixel : Uint8Array<ArrayBuffer>, 
				public readonly compressed = false) 
	{

	}
}

class CompressedTexture extends Texture {
	public readonly extension : string;
	public readonly format : string;
	constructor(data : Uint8Array<ArrayBufferLike>, imageInfo : ImageInfo)
	{
		const first = imageInfo.layers[0];
		super(imageInfo.shape.width, imageInfo.shape.height, Uint8Array.from(data.slice(first.offset, first.offset + first.length)), true);
		switch (imageInfo.format)
		{
			case 'BC1': this.extension = "WEBGL_compressed_texture_s3tc"; this.format = "COMPRESSED_RGBA_S3TC_DXT1_EXT"; break;
			case 'BC2': this.extension = "WEBGL_compressed_texture_s3tc"; this.format = "COMPRESSED_RGBA_S3TC_DXT3_EXT"; break;
			case 'BC3': this.extension = "WEBGL_compressed_texture_s3tc"; this.format = "COMPRESSED_RGBA_S3TC_DXT5_EXT"; break;
			case 'BC4': this.extension = "EXT_texture_compression_rgtc"; this.format = "COMPRESSED_RED_RGTC1"; break;
			case 'BC5': this.extension = "EXT_texture_compression_rgtc"; this.format = "COMPRESSED_RG_RGTC2"; break;
			case 'BC6H': this.extension = "EXT_texture_compression_bptc"; this.format = "COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT"; break;
			case 'BC7': this.extension = "EXT_texture_compression_bptc"; this.format = "COMPRESSED_RGBA_BPTC_UNORM_EXT"; break;
		}
	}		
}

function ParseTexture(file_name : string, data : Uint8Array<ArrayBufferLike>) {
	function DDS_KTX_Loader(DDS_KTX : boolean) {
		const buf = Buffer.from(data);
		const imageInfo = DDS_KTX ? parseDDSHeader(buf) : parseKTXHeader(buf);
		if (!imageInfo) throw new Error(`Texture parse failure: ${file_name}.`);
		return new CompressedTexture(buf, imageInfo);
	}
	function IIB_Loader() {
		const image = decodeNamedImage({ data: data, name: file_name });
		if (!image) throw new Error(`Texture parse failure: ${file_name}.`);
		const rgba = image.getBytes({ order:  ChannelOrder.rgba, alpha: 1.0 }) as Uint8Array<ArrayBuffer>;
		if (!rgba.length) throw new Error(`Texture decode failure: ${file_name}.`);
		return new Texture(image.width, image.height, rgba);
	}
	switch (path.extname(file_name).toLowerCase())
	{
		case ".dds": return DDS_KTX_Loader(true);
		case ".ktx": return DDS_KTX_Loader(false);
		default: return IIB_Loader();
	}
}

export { ParseTexture };
