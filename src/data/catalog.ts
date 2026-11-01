export const SPECIES = [
 {id:'green',name:'豆豆绿虎皮',short:'豆豆',price:0,talk:true,color:0xa2bc69,face:0xf4df8a,accent:0x536e42,pitch:1300,likes:['millet']},
 {id:'blue',name:'天空蓝虎皮',short:'蓝蓝',price:0,talk:true,color:0x84bac8,face:0xf8f0cc,accent:0x4b788e,pitch:1400,likes:['millet','grape']},
 {id:'cockatiel',name:'奶油小玄凤',short:'奶油',price:0,talk:true,color:0xc3c4ae,face:0xf4df8a,accent:0xde9463,pitch:1100,likes:['seed','millet']},
 {id:'lovebird',name:'蜜桃小牡丹',short:'蜜桃',price:0,talk:false,color:0x8bb397,face:0xe9a685,accent:0x537e64,pitch:1500,likes:['apple','grape']},
 {id:'finch',name:'糯米小文鸟',short:'糯米',price:80,talk:false,color:0xe8e3d4,face:0xf5f0e5,accent:0x7d7e83,pitch:1700,likes:['millet','cake']},
 {id:'grey',name:'聪明非洲灰',short:'灰灰',price:150,talk:true,color:0xa5a6a1,face:0xe9e6d9,accent:0x786d6a,pitch:900,likes:['cake','seed']},
 {id:'macaw',name:'彩虹小金刚',short:'彩虹',price:220,talk:true,color:0xc97d70,face:0xf4e8cb,accent:0x7aa2aa,pitch:1000,likes:['grape','seed']},
] as const;
export type SpeciesId = typeof SPECIES[number]['id'];
export const species = (id:string) => SPECIES.find(s=>s.id===id) ?? SPECIES[0];
export const FOODS = [
 {id:'seed',name:'瓜子',price:0,hunger:15,mood:3,hours:0,color:'#b6a17f',symbol:'◈'},
 {id:'millet',name:'小米穗',price:2,hunger:22,mood:8,hours:1,color:'#d5b773',symbol:'♧'},
 {id:'apple',name:'苹果块',price:3,hunger:20,mood:10,hours:2,color:'#cb826b',symbol:'◕'},
 {id:'grape',name:'葡萄',price:5,hunger:18,mood:16,hours:3,color:'#a18fa9',symbol:'♣'},
 {id:'cake',name:'蛋黄饼',price:8,hunger:35,mood:10,hours:5,color:'#debd72',symbol:'▦'},
] as const;
export const WORDS = ['你好','早上好','宝贝','吃饭啦','我爱你','晚安'];
