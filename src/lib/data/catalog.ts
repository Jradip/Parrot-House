import "server-only";
import { hasSupabaseEnv } from "@/lib/env";
import { birdCategories as demoCategories, birds as demoBirds } from "@/lib/data/demo";
import { createClient } from "@/lib/supabase/server";
import type { Bird, BirdCategory, BirdStatus, Gender, InventoryType } from "@/types/domain";

interface DatabaseBird {
  id:string;category_id:string;name:string;slug:string;description:string|null;age_value:number|null;age_unit:string|null;gender:string;color:string|null;price:number;inventory_type:string;stock:number;status:string;tame_status:string|null;featured:boolean;created_at:string;
  bird_categories:{name:string}|Array<{name:string}>|null;
  bird_images:Array<{image_url:string;sort_order:number}>|null;
}

export async function getCategories():Promise<BirdCategory[]>{if(!hasSupabaseEnv)return demoCategories;const supabase=await createClient();const{data,error}=await supabase.from("bird_categories").select("id,name,slug,description,active,sort_order").eq("active",true).order("sort_order");if(error)throw new Error("Kategori belum dapat dimuat.");return(data??[]).map((item)=>({id:item.id,name:item.name,slug:item.slug,description:item.description??"",active:item.active,sortOrder:item.sort_order}));}

export async function getBirds():Promise<Bird[]>{if(!hasSupabaseEnv)return demoBirds;const supabase=await createClient();const{data,error}=await supabase.from("birds").select("id,category_id,name,slug,description,age_value,age_unit,gender,color,price,inventory_type,stock,status,tame_status,featured,created_at,bird_categories(name),bird_images(image_url,sort_order)").is("archived_at",null).order("created_at",{ascending:false});if(error)throw new Error("Koleksi burung belum dapat dimuat.");return((data??[])as unknown as DatabaseBird[]).map(normalizeBird);}

export async function getBirdBySlugFromSource(slug:string){const list=await getBirds();return list.find((bird)=>bird.slug===slug);}

function normalizeBird(item:DatabaseBird):Bird{const category=Array.isArray(item.bird_categories)?item.bird_categories[0]?.name:item.bird_categories?.name;const images=[...(item.bird_images??[])].sort((a,b)=>a.sort_order-b.sort_order);return{id:item.id,categoryId:item.category_id,category:category??"Tanpa kategori",name:item.name,slug:item.slug,imageUrl:images[0]?.image_url??developmentImage(item.slug),price:Number(item.price),age:formatAge(item.age_value,item.age_unit),gender:asGender(item.gender),color:item.color??"Belum tersedia",description:item.description??"Informasi belum dilengkapi.",tameStatus:item.tame_status??"Belum tersedia",inventoryType:asInventoryType(item.inventory_type),stock:item.stock,status:asStatus(item.status),featured:item.featured,createdAt:item.created_at};}
function formatAge(value:number|null,unit:string|null){if(value===null)return"Usia belum tersedia";const units:Record<string,string>={DAYS:"hari",WEEKS:"minggu",MONTHS:"bulan",YEARS:"tahun"};return`${value} ${units[unit??""]??""}`.trim();}
function asGender(value:string):Gender{return value==="MALE"||value==="FEMALE"?value:"UNKNOWN"}
function asInventoryType(value:string):InventoryType{return value==="QUANTITY"?"QUANTITY":"INDIVIDUAL"}
function asStatus(value:string):BirdStatus{return value==="RESERVED"||value==="SOLD"||value==="UNAVAILABLE"?value:"AVAILABLE"}
function developmentImage(slug:string){if(slug.includes("sun-conure"))return"/images/sun-conure.png";if(slug.includes("lovebird"))return"/images/lovebird.png";if(slug.includes("parkit"))return"/images/parkit-australia.png";return"/images/hero-parrot-house.png"}
