import {deflateSync} from 'node:zlib';
export const BIRD=[
'........................',
'...........hhh..........',
'.........hhfffhh........',
'........hfffffffh.......',
'.......hfffffffffh......',
'.......hffffeffffh......',
'......hfffffeefffhh.....',
'......hffffffffffbb.....',
'.....hfffffffffffbb.....',
'.....hffccccfffffh......',
'....hccccccccccch.......',
'....hccccccccccch.......',
'...hcccccccccccch.......',
'...hcccwwwwccccch.......',
'...hccwwwwwwcccch.......',
'...hccwwwwwwcccch.......',
'....hccwwwwccccch.......',
'....hcccccccccch........',
'.....hcccccccch.........',
'......hhcccchh..........',
'......hwhhphhp..........',
'.....hwwh.pp.pp.........',
'.....hhh................',
'........................'];
export function crc(buf:Uint8Array){let c=0xffffffff;for(const b of buf){c^=b;for(let j=0;j<8;j++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^0xffffffff)>>>0;}
function chunk(name:string,data:Buffer){const type=Buffer.from(name);const len=Buffer.alloc(4);len.writeUInt32BE(data.length);const checksum=Buffer.alloc(4);checksum.writeUInt32BE(crc(Buffer.concat([type,data])));return Buffer.concat([len,type,data,checksum]);}
export function png(w:number,h:number,pixels:Uint8Array){const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(w);ihdr.writeUInt32BE(h,4);ihdr[8]=8;ihdr[9]=6;const rows=Buffer.alloc(h*(w*4+1));for(let y=0;y<h;y++)rows.set(pixels.subarray(y*w*4,(y+1)*w*4),y*(w*4+1)+1);return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('IDAT',deflateSync(rows)),chunk('IEND',Buffer.alloc(0))]);}
