
import { Effect } from "@/backend/type/type";
import { listByType } from "@/backend/models/effect";
import { getById } from "@/backend/models/effect";

export async function listEffectByType(type: number): Promise<Effect[]> {
  return await listByType(type);
}

export async function getEffectById(id: number): Promise<Effect | null> {
  // If database connection string is not configured, fall back to built-in presets
  const hasDb = !!process.env.POSTGRES_URL;
  if (!hasDb) {
    const now = new Date();
    const presets: Record<number, Effect> = {
      1: {
        id: 1,
        name: "Kling v2.1",
        type: 1,
        des: "",
        platform: "replicate",
        link: "https://replicate.com/kwaivgi/kling-v2.1/api",
        api: "kwaivgi/kling-v2.1",
        is_open: 1,
        credit: 15,
        created_at: now as any,
        link_name: "kling-v12",
        model: "kwaivgi/kling-v2.1",
        version: "",
        pre_prompt: ""
      },
      2: {
        id: 2,
        name: "Flux1.1 Pro",
        type: 1,
        des: "",
        platform: "replicate",
        link: "https://replicate.com/black-forest-labs/flux-1.1-pro",
        api: "black-forest-labs/flux-1.1-pro",
        is_open: 1,
        credit: 1,
        created_at: now as any,
        link_name: "flux-1-pro",
        model: "black-forest-labs/flux-1.1-pro",
        version: "",
        pre_prompt: ""
      }
    };
    return presets[id] ?? null;
  }

  const effect = await getById(id);
  return effect;
}
