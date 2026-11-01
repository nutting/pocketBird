import { FOODS, species, type SpeciesId } from '../data/catalog';
export interface Pet {id:SpeciesId;name:string;hunger:number;mood:number;clean:number;growth:number;hatched:boolean;poops:number;poopClock:number;satiety:number;updated:number;words:Record<string,number>;lastTeach:number;lastPark:number;growthRewarded:boolean}
export interface Save {version:2;coins:number;pets:Partial<Record<SpeciesId,Pet>>;selected:SpeciesId|null;unlocked:SpeciesId[];muted:boolean;highScore:number}
export const clamp=(n:number)=>Math.max(0,Math.min(100,n));
export const newSave=():Save=>({version:2,coins:20,pets:{},selected:null,unlocked:['green','blue','cockatiel','lovebird'],muted:false,highScore:0});
export const newPet=(id:SpeciesId,now=Date.now()):Pet=>({id,name:species(id).short,hunger:75,mood:80,clean:100,growth:0,hatched:true,poops:0,poopClock:0,satiety:0,updated:now,words:{},lastTeach:0,lastPark:0,growthRewarded:false});
export function tick(p:Pet,now=Date.now(),speed=1){
 let seconds=Math.min(7*86400,Math.max(0,(now-p.updated)/1000)*speed);
 while(seconds>0){const dt=Math.min(60,seconds)/3600;const protectedTime=Math.min(p.satiety,dt);p.satiety=Math.max(0,p.satiety-dt);p.hunger=clamp(p.hunger-6*(dt-protectedTime));p.mood=clamp(p.mood-(3+(p.hunger<30?5:0)+(p.clean<30?4:0))*dt);p.clean=clamp(p.clean-(1+p.poops*3)*dt);if(p.hunger>0){p.poopClock+=dt;if(p.poopClock>=2-1e-9){const count=Math.floor((p.poopClock+1e-9)/2);p.poops=Math.min(5,p.poops+count);p.poopClock=Math.max(0,p.poopClock-count*2);}}seconds-=dt*3600;}p.updated=now;return p;
}
export function state(p:Pet){return p.hunger<30?'肚子饿啦':p.clean<30?'想洗个澡':p.mood<30?'想要陪伴':p.mood>=70?'心情超好':'悠闲自在';}
export function feed(s:Save,p:Pet,id:string){const f=FOODS.find(f=>f.id===id);if(!f)return 'unknown';if(p.hunger>=95)return 'full';if(s.coins<f.price)return 'poor';s.coins-=f.price;const likes=(species(p.id).likes as readonly string[]).includes(id);p.hunger=clamp(p.hunger+f.hunger*(likes?1.5:1));p.mood=clamp(p.mood+f.mood);p.satiety=Math.max(p.satiety,f.hours);if(p.growth<8){p.growth++;if(p.growth===8&&!p.growthRewarded){s.coins+=20;p.growthRewarded=true;}}return likes?'love':'ok';}
export function pet(p:Pet,bath=false){if(bath)p.clean=clamp(p.clean+8);else p.mood=clamp(p.mood+3);}
export function clean(p:Pet){if(p.poops>0){p.poops--;p.clean=clamp(p.clean+5);}}
export const canGo=(p:Pet)=>p.hunger>=50;
export function buy(s:Save,id:SpeciesId){if(s.unlocked.includes(id))return true;const cost=species(id).price;if(s.coins<cost)return false;s.coins-=cost;s.unlocked.push(id);return true;}
export function teach(s:Save,p:Pet,word:string,now=Date.now(),random=Math.random){if(!species(p.id).talk||p.growth<8)return 'unable';if((p.words[word]??0)>=5)return 'known';if(now-p.lastTeach<900)return 'cooldown';if(s.coins<2)return 'poor';s.coins-=2;p.lastTeach=now;if(random()<0.35+p.mood/200)p.words[word]=(p.words[word]??0)+1;return (p.words[word]??0)>=5?'learned':'learning';}
export function park(s:Save,p:Pet,items:number,friends:number,now=Date.now()){const n=Math.min(8,Math.max(0,items));s.coins+=n*2;p.mood=clamp(p.mood+(now-p.lastPark<1200000?5:20)+n*2+friends*5);p.hunger=clamp(p.hunger-12);p.clean=clamp(p.clean-12);p.lastPark=now;return n*2;}
export function catchReward(s:Save,p:Pet,score:number){const coins=Math.min(15,Math.floor(Math.max(0,score)/3));s.coins+=coins;s.highScore=Math.max(s.highScore,score);p.mood=clamp(p.mood+10+Math.min(Math.max(0,score),30)/3);p.hunger=clamp(p.hunger-10);return coins;}
