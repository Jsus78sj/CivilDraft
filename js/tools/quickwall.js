import {defTool,H,ov,ovLen,rec} from './registry.js';
import {commitQuickWall} from '../core/quick-wall.js';
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
  {p:'الطول',text:1},
  {p:'الزاوية بالدرجات',text:1,each(ctx,angle){
    const length=ctx.v.length;
    const result=commitQuickWall(ctx.pts[0],length,angle,{thickness:ovLen('quickwall','t'),type:ov('quickwall','type')||'int',align:ov('quickwall','align')||'c',label:'جدار سريع'});
    rec(ctx,result.wall,'walls');
    H.rep('ok',`جدار سريع · ${result.wall.id} · ${(length/1000).toFixed(3)} م`);
  }}]
});
