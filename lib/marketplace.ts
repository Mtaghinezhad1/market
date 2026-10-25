'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Seller = { id: string; name: string; slug: string; brandColor: string; password: string }
export type Product = { id: string; sellerId: string; name: string; description: string; price: number; category: string; image: string; images: string[]; dimensions: string; material: string; weight: string; inStock: boolean }
export type Category = { id: string; sellerId: string; name: string }

const photos = ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80','https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&q=80','https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80','https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=900&q=80','https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&q=80','https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=900&q=80']
const sellerSeed: Seller[] = [{id:'s1',name:'North & Pine',slug:'northpine',brandColor:'#355c52',password:'demo123'},{id:'s2',name:'Forma Studio',slug:'forma',brandColor:'#b9684e',password:'demo123'},{id:'s3',name:'Morrow Goods',slug:'morrow',brandColor:'#6b5b95',password:'demo123'}]
const categories = ['New arrivals','Home','Accessories','Lifestyle','Stationery']
const productSeed: Product[] = sellerSeed.flatMap((seller, si) => Array.from({length: 30}, (_, i) => ({ id:`${seller.id}-p${i+1}`, sellerId:seller.id, name:['Arc watch','Everyday tote','Stoneware set','Field notes','Cloud sneakers','Linen throw'][i%6] + ` ${i+1}`, description:'Thoughtfully made essentials for everyday rituals. Designed with honest materials and a quiet, enduring point of view.', price:[89,64,48,22,120,76][i%6] + si*8, category:categories[i%categories.length], image:photos[(i+si)%photos.length], images:[photos[(i+si)%photos.length], photos[(i+si+1)%photos.length], photos[(i+si+2)%photos.length]], dimensions:['8 × 4 × 2 in','14 × 12 × 5 in','10 × 10 × 6 in'][i%3], material:['Brushed steel','Organic cotton','Recycled ceramic'][i%3], weight:`${1 + (i%5)} lb`, inStock:i%7 !== 0 })))
const categorySeed = sellerSeed.flatMap(s => categories.slice(0,4).map((name,i)=>({id:`${s.id}-c${i}`,sellerId:s.id,name})))

type State = { sellers: Seller[]; products: Product[]; categories: Category[]; currentSellerId: string | null; login: (slug:string,password:string)=>boolean; register:(data:Omit<Seller,'id'>)=>boolean; logout:()=>void; addProduct:(p:Omit<Product,'id'|'sellerId'>)=>void; updateProduct:(id:string,p:Partial<Product>)=>void; deleteProduct:(id:string)=>void; addCategory:(name:string)=>void; deleteCategory:(id:string)=>void; updateSeller:(p:Partial<Seller>)=>void; reset:()=>void }
export const useMarketplace = create<State>()(persist((set,get)=>({ sellers:sellerSeed, products:productSeed, categories:categorySeed, currentSellerId:null,
 login:(slug,password)=>{const s=get().sellers.find(x=>x.slug===slug&&x.password===password); if(!s)return false; set({currentSellerId:s.id}); return true},
 register:(data)=>{if(get().sellers.some(s=>s.slug===data.slug))return false; const id=`s${Date.now()}`; set({sellers:[...get().sellers,{...data,id}], currentSellerId:id}); return true}, logout:()=>set({currentSellerId:null}),
 addProduct:p=>set({products:[...get().products,{...p,id:`p${Date.now()}`,sellerId:get().currentSellerId!}]}), updateProduct:(id,p)=>set({products:get().products.map(x=>x.id===id?{...x,...p}:x)}), deleteProduct:id=>set({products:get().products.filter(x=>x.id!==id)}),
 addCategory:name=>set({categories:[...get().categories,{id:`c${Date.now()}`,sellerId:get().currentSellerId!,name}]}), deleteCategory:id=>set({categories:get().categories.filter(x=>x.id!==id)}),
 updateSeller:p=>set({sellers:get().sellers.map(x=>x.id===get().currentSellerId?{...x,...p}:x)}), reset:()=>set({sellers:sellerSeed,products:productSeed,categories:categorySeed,currentSellerId:null})}),{name:'marketplace-demo'}))
export function sellerBySlug(slug:string){return sellerSeed.find(s=>s.slug===slug)}
export function getSeller(slug:string,sellers:Seller[]){return sellers.find(s=>s.slug===slug)}
export function money(n:number){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n)}
export function useDebounce<T>(value:T,delay=300){const [v,setV]=require('react').useState(value); require('react').useEffect(()=>{const t=setTimeout(()=>setV(value),delay);return()=>clearTimeout(t)},[value,delay]);return v}
