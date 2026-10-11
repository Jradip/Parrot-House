import type { MetadataRoute } from "next";
import { birds } from "@/lib/data/demo";
export default function sitemap():MetadataRoute.Sitemap{const base=process.env.NEXT_PUBLIC_SITE_URL??"http://localhost:3000";const routes=["","/birds","/bird-guide","/about","/faq","/how-to-order","/shipping","/contact"].map((route)=>({url:`${base}${route}`,lastModified:new Date(),changeFrequency:"weekly" as const,priority:route===""?1:0.7}));return [...routes,...birds.map((bird)=>({url:`${base}/birds/${bird.slug}`,lastModified:new Date(bird.createdAt),changeFrequency:"weekly" as const,priority:0.8}))]}
