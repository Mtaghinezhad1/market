import { StorePage } from '@/components/marketplace'
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <StorePage slug={slug}/>}
