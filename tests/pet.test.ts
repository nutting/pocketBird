import {describe,it,expect} from 'vitest';
import {newPet,newSave,tick,feed,pet,clean,state,teach,buy,canGo,park,catchReward} from '../src/logic/pet';
import {chooseBehavior} from '../src/logic/behavior';
import {migrate} from '../src/logic/save';
describe('照顾与时间',()=>{
 it('每小时饱食下降6',()=>{const p=newPet('green',0);tick(p,3600000);expect(p.hunger).toBeCloseTo(69);});
 it('不倒算时间',()=>{const p=newPet('green',2000);tick(p,0);expect(p.hunger).toBe(75);});
 it('离线最多补七天',()=>{const a=newPet('green',0),b=newPet('green',0);tick(a,86400000*7);tick(b,86400000*30);expect(a.hunger).toBe(b.hunger);expect(a.mood).toBe(b.mood);expect(a.poops).toBe(b.poops);});
 it('两小时一坨便便',()=>{const p=newPet('green',0);tick(p,7200000);expect(p.poops).toBe(1);});
 it('便便不超过5',()=>{const p=newPet('green',0);p.satiety=24;tick(p,86400000);expect(p.poops).toBe(5);});
 it('饱食为零不再产生便便',()=>{const p=newPet('green',0);p.hunger=0;tick(p,7200000);expect(p.poops).toBe(0);});
 it('饱腹期间不掉饱食',()=>{const p=newPet('green',0);p.satiety=2;tick(p,3600000);expect(p.hunger).toBe(75);expect(p.satiety).toBeCloseTo(1);});
 it('优先显示饥饿状态',()=>{const p=newPet('green');p.hunger=10;p.clean=0;p.mood=0;expect(state(p)).toBe('肚子饿啦');});
 it('抚摸增加心情',()=>{const p=newPet('green');p.mood=60;pet(p);expect(p.mood).toBe(63);});
 it('洗澡提升清洁',()=>{const p=newPet('green');p.clean=40;pet(p,true);expect(p.clean).toBe(48);});
 it('捡便便加5清洁',()=>{const p=newPet('green');p.poops=2;p.clean=40;clean(p);expect(p.poops).toBe(1);expect(p.clean).toBe(45);});
});
describe('喂食与经济',()=>{
 it('只有瓜子免费',()=>{const s=newSave(),p=newPet('green');p.hunger=20;feed(s,p,'seed');expect(s.coins).toBe(20);});
 it('按份扣费',()=>{const s=newSave(),p=newPet('green');p.hunger=20;feed(s,p,'grape');expect(s.coins).toBe(15);});
 it('refuses when full',()=>{const s=newSave(),p=newPet('green');p.hunger=95;expect(feed(s,p,'cake')).toBe('full');expect(s.coins).toBe(20);});
 it('余额不足不能吃',()=>{const s=newSave(),p=newPet('green');s.coins=0;expect(feed(s,p,'grape')).toBe('poor');expect(p.growth).toBe(0);});
 it('偏好食物增加1.5倍饱食',()=>{const s=newSave(),p=newPet('green');p.hunger=20;expect(feed(s,p,'millet')).toBe('love');expect(p.hunger).toBe(53);});
 it('饱腹时间取大值',()=>{const s=newSave(),p=newPet('green');p.hunger=10;p.satiety=4;feed(s,p,'millet');expect(p.satiety).toBe(4);});
 it('成长奖励只发一次',()=>{const s=newSave(),p=newPet('green');p.growth=7;p.hunger=0;feed(s,p,'seed');expect(s.coins).toBe(40);p.hunger=0;feed(s,p,'seed');expect(s.coins).toBe(40);expect(p.growth).toBe(8);});
 it('购买品种扣费且不重复收费',()=>{const s=newSave();s.coins=100;expect(buy(s,'finch')).toBe(true);expect(s.coins).toBe(20);expect(buy(s,'finch')).toBe(true);expect(s.coins).toBe(20);});
 it('买不起不解锁',()=>{const s=newSave();expect(buy(s,'macaw')).toBe(false);expect(s.unlocked).not.toContain('macaw');});
});
describe('说话与外出',()=>{
 it('雏鸟不能学说话',()=>{const s=newSave(),p=newPet('green');expect(teach(s,p,'你好')).toBe('unable');expect(s.coins).toBe(20);});
 it('每次教学2金币，累计5次学会',()=>{const s=newSave(),p=newPet('green');p.growth=8;for(let i=1;i<=5;i++)teach(s,p,'你好',i*1000,()=>0);expect(p.words['你好']).toBe(5);expect(s.coins).toBe(10);});
 it('已学会的词不收费',()=>{const s=newSave(),p=newPet('green');p.growth=8;p.words['你好']=5;expect(teach(s,p,'你好')).toBe('known');expect(s.coins).toBe(20);});
 it('教学有900ms冷却',()=>{const s=newSave(),p=newPet('green');p.growth=8;teach(s,p,'你好',1000,()=>0);expect(teach(s,p,'你好',1500,()=>0)).toBe('cooldown');expect(s.coins).toBe(18);});
 it('低于50不能外出',()=>{const p=newPet('green');p.hunger=49;expect(canGo(p)).toBe(false);p.hunger=50;expect(canGo(p)).toBe(true);});
 it('公园最多每次16金币',()=>{const s=newSave(),p=newPet('green');expect(park(s,p,99,2)).toBe(16);expect(s.coins).toBe(36);expect(p.hunger).toBe(63);expect(p.clean).toBe(88);});
 it('短时间重复散步基础心情仅5',()=>{const s=newSave(),p=newPet('green');p.mood=0;p.lastPark=1000000;park(s,p,0,0,1000001);expect(p.mood).toBe(5);});
 it('接瓜子结算向下取整且上限15',()=>{const s=newSave(),p=newPet('green');expect(catchReward(s,p,8)).toBe(2);expect(catchReward(s,p,99)).toBe(15);expect(s.highScore).toBe(99);});
 it('夜间必定睡觉',()=>{const p=newPet('green');expect(chooseBehavior(p,23,0)).toBe('sleep');expect(chooseBehavior(p,6,1000)).toBe('sleep');});
 it('雏鸟不选择说话行为',()=>{const p=newPet('green');p.words['你好']=5;for(let i=0;i<100;i++)expect(chooseBehavior(p,12,0,()=>i/100)).not.toBe('talk');});
});
describe('存档',()=>{
 it('损坏结构回退默认值',()=>{expect(migrate(null).coins).toBe(20);expect(migrate({version:33}).selected).toBeNull();});
 it('迁移v1并保留已有鸟',()=>{const p=newPet('blue');const s=migrate({version:1,coins:60,pets:{blue:p},selected:'blue'});expect(s.version).toBe(2);expect(s.coins).toBe(60);expect(s.selected).toBe('blue');});
 it('清理非有限数值与错误选中项',()=>{const s=migrate({version:2,coins:NaN,selected:'unknown',pets:{green:{hunger:Infinity,words:{bad:'wrong'}}}});expect(s.coins).toBe(20);expect(s.selected).toBe('green');expect(s.pets.green!.hunger).toBeLessThanOrEqual(100);expect(s.pets.green!.words).toEqual({});});
});
