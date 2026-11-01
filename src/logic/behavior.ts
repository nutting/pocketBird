import type { Pet } from './pet';
export const BEHAVIORS=['rest','hop','look','preen','stretch','dance','sing','shake','flyWindow','flyFloor','nap','call','talk','sleep'] as const;
export type Behavior=typeof BEHAVIORS[number];
export function chooseBehavior(p:Pet,hour:number,idle:number,random=Math.random):Behavior{
 if(hour>=22||hour<7)return 'sleep';
 const weights:number[]=BEHAVIORS.map(b=>b==='sleep'?0:b==='talk'?(p.growth>=8&&Object.values(p.words).some(v=>v>=5)?3:0):b==='call'?(idle>90?8:1):b==='preen'?(p.clean<30?8:2):b==='nap'?(p.hunger<30?8:1):b==='dance'?(p.mood>=70?4:0):b==='sing'?(p.id==='finch'?5:3):2);
 let n=random()*weights.reduce((a,b)=>a+b,0);return BEHAVIORS[weights.findIndex(w=>(n-=w)<0)]??'rest';
}
