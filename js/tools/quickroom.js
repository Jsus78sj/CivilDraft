import {defTool,H,ov,ovLen,rec,pvRect} from './registry.js';
import {commitQuickRoom} from '../core/quick-room.js';
import {previewQuickRectangle} from '../core/quick-preview.js';

defTool({
 id:'quickroom',alias:'qroom غرفة_سريعة',label:'غرفة سريعة',
 hint:'ركنان متقابلان · اسم اختياري · جدران وغرفة في خطوة واحدة',
 opts:[
  {k:'t',label:'السماكة م',type:'len',def:'0.20'},
  {k:'type',label:'نوع الجدار',type:'sel',seg:1,items:[['ext','خارجي'],['int','داخلي']],def:'ext'},
  {k:'name',label:'اسم الغرفة',type:'text',def:''}
 ],
 steps:[
  {p:'الركن الأول'},
  {p:'الركن المقابل',base:0,box:1,restart:1,each(ctx,p){
   const result=commitQuickRoom(ctx.pts[0],p,{thickness:ovLen('quickroom','t'),type:ov('quickroom','type')||'ext',name:ov('quickroom','name')||'',label:'غرفة سريعة'});
   result.walls.forEach(w=>rec(ctx,w,'walls'));
   rec(ctx,result.room,'areas');
   H.rep('ok',`غرفة سريعة · ${result.walls.length} جدران · ${result.room.name||'بلا اسم'}`);
  }}],
 prev(ctx,g){
  if(!ctx.pts.length||!g)return [];
  const p=previewQuickRectangle(ctx.pts[0],g);
  return [pvRect(ctx.pts[0],g,'#5cd98e')];
 }}
);