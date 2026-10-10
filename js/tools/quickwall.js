import {defTool,H,ov,ovLen,rec,pvLine,pvText} from './registry.js';
import {M,m2} from '../core/units.js';
import {commitQuickWall} from '../core/quick-wall.js';
import {previewQuickWall} from '../core/quick-preview.js';
const TYPES=[['ext','خارجي'],['int','داخلي'],['low','سترة']];
const ALIGNS=[['c','محوري'],['l','الوجه الأيسر'],['r','الوجه الأيمن']];
defTool({
 id:'quickwall',alias:'qw جدار_سريع',label:'جدار سريع',
 hint:'نقطة بداية · اكتب الطول ثم الزاوية أو انقر النهاية',
 opts:[
  {k:'t',label:'السماكة م',type:'len',def:'0.15'},
  {k:'type',label:'النوع',type:'sel',seg:1,items:TYPES,def:'int'},
  {k:'align',label:'المحاذاة',type:'sel',items:ALIGNS,def:'c'}
 ],
 steps:[
  {p:'نقطة البداية'},
  {p:'الطول',text:1,each(ctx,value){
    const length=M(value);
    if(length==null||length<=0)throw new Error('الطول غير صالح');
    ctx.v.length=length;
  }},
  {p:'الزاوية بالدرجات',text:1,each(ctx,value){
    const angle=Number(value);
    if(!Number.isFinite(angle))throw new Error('الزاوية غير صالحة');
    const result=commitQuickWall(ctx.pts[0],ctx.v.length,angle,{thickness:ovLen('quickwall','t'),type:ov('quickwall','type')||'int',align:ov('quickwall','align')||'c',label:'جدار سريع'});
    rec(ctx,result.wall,'walls');
    H.rep('ok',`جدار سريع · ${result.wall.id} · ${(ctx.v.length/1000).toFixed(3)} م`);
  }}],
 prev(ctx,g){
  if(!ctx.pts.length||ctx.v.length==null||!g)return [];
  const angle=Math.atan2(g[1]-ctx.pts[0][1],g[0]-ctx.pts[0][0])*180/Math.PI;
  const p=previewQuickWall(ctx.pts[0],ctx.v.length,angle);
  return [pvLine(p.a,p.b,'#5cd98e'),pvText(p.b,`${m2(p.length)} م · ${angle.toFixed(1)}°`,'#ffd06b')];
 }}
);