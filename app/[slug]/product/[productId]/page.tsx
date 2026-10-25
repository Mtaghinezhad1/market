import { ProductPage } from '@/components/marketplace'
export default async function Page({params}:{params:Promise<{slug:string;productId:string}>}){const {slug,productId}=await params;return <ProductPage slug={slug} id={productId}/>}
