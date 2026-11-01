import {newSave,newPet,tick,type Save} from './pet';
import {SPECIES,type SpeciesId} from '../data/catalog';
const key='birdpet.save';
export function migrate(raw:unknown):Save{
 const fresh=newSave();if(!raw||typeof raw!=='object')return fresh;const r=raw as Partial<Save>;
 if(r.version!==2&& (r as {version?:number}).version!==1)return fresh;
 const finite=(n:unknown,d:number)=>typeof n==='number'&&Number.isFinite(n)?n:d;
 fresh.coins=Math.max(0,Math.floor(finite(r.coins,20)));fresh.highScore=Math.max(0,finite(r.highScore,0));fresh.muted=r.muted===true;
 fresh.unlocked=[...new Set([...fresh.unlocked,...(Array.isArray(r.unlocked)?r.unlocked:[]).filter(id=>SPECIES.some(s=>s.id===id))])];
 for(const s of SPECIES){const p=r.pets?.[s.id];if(p&&typeof p==='object'){const base=newPet(s.id);for(const field of ['hunger','mood','clean','growth','poops','poopClock','satiety','updated','lastTeach','lastPark'] as const)base[field]=finite(p[field],base[field]);base.hunger=Math.max(0,Math.min(100,base.hunger));base.mood=Math.max(0,Math.min(100,base.mood));base.clean=Math.max(0,Math.min(100,base.clean));base.growth=Math.max(0,Math.min(8,base.growth));base.poops=Math.max(0,Math.min(5,Math.floor(base.poops)));base.satiety=Math.max(0,Math.min(5,base.satiety));base.poopClock=Math.max(0,base.poopClock%2);base.name=typeof p.name==='string'?p.name.slice(0,12):s.short;base.words=Object.fromEntries(Object.entries(p.words??{}).filter(([w,v])=>typeof w==='string'&&typeof v==='number'&&Number.isFinite(v)).map(([w,v])=>[w,Math.max(0,Math.min(5,v))]));base.growthRewarded=p.growthRewarded===true;fresh.pets[s.id]=tick(base);if(!fresh.unlocked.includes(s.id))fresh.unlocked.push(s.id);}}
 fresh.selected=r.selected&&fresh.pets[r.selected]?r.selected:Object.keys(fresh.pets)[0] as SpeciesId??null;return fresh;
}
export function load():Save{try{return migrate(JSON.parse(localStorage.getItem(key)??localStorage.getItem('birdpet.save.v1')??'null'));}catch{return newSave();}}
export function persist(s:Save){try{localStorage.setItem(key,JSON.stringify(s));return true;}catch{return false;}}
