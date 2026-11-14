// Tạo audio/slide-01.mp3 … từ nội dung slide trong file HTML bằng edge-tts (giọng nữ HoaiMy).
// Chạy: EDGE_TTS=/đường/dẫn/edge-tts node tools/make-audio.mjs [số slide…]
import {readFileSync,mkdirSync} from 'fs';
import {execFileSync} from 'child_process';
import {fileURLToPath} from 'url';
const html=readFileSync(new URL('../Quản lý & khắc phục sự cố Production.html',import.meta.url),'utf8');
const js=html.match(/<script>([\s\S]*?)<\/script>/g).pop().replace(/<\/?script>/g,'');
const S=js.slice(js.indexOf('const S='),js.indexOf('const SEC='));
const P=js.slice(js.indexOf('const PRON='),js.indexOf('// chọn giọng'));
const {S:slides,parts}=new Function(`const strip=s=>s.replace(/^[^\\p{L}\\p{N}]+/u,'');${S}${P}return{S,parts}`)();
const VOICE='vi-VN-HoaiMyNeural',RATE='+8%',PITCH='+0Hz',bin=process.env.EDGE_TTS||'edge-tts';
mkdirSync(new URL('../audio/',import.meta.url),{recursive:true});
const only=process.argv.slice(2).map(Number);
slides.forEach((s,i)=>{if(only.length&&!only.includes(i+1))return;
  // dấu câu quyết định độ ngắt nghỉ: "." nghỉ dài, "," nghỉ ngắn
  const text=parts(s).map(c=>c.t.replace(/[.,;:]+$/,'')+(c.w>=200?'.':',')).join(' ');
  const out=fileURLToPath(new URL(`../audio/slide-${String(i+1).padStart(2,'0')}.mp3`,import.meta.url));
  // dịch vụ của Microsoft thỉnh thoảng trả lỗi ngẫu nhiên nên thử lại vài lần
  for(let t=1;;t++){try{execFileSync(bin,['--voice',VOICE,`--rate=${RATE}`,`--pitch=${PITCH}`,'--text',text,'--write-media',out],{stdio:['ignore','inherit','pipe'],encoding:'utf8'});break}
   catch(e){const m=String(e.stderr||'').trim().split('\n').pop();console.log(`  slide ${i+1} lỗi lần ${t}: ${m}`);if(t==8)throw e;execFileSync('sleep',['3'])}}
  console.log('✓',out,text.length,'ký tự')});
