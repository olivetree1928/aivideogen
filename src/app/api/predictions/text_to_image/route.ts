import { NextResponse } from "next/server";
import Replicate, { WebhookEventType } from "replicate";
import { createEffectResult } from "@/backend/service/effect_result";
import { genEffectResultId } from "@/backend/utils/genId";
import { generateCheck } from "@/backend/service/generate-_check";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const WEBHOOK_HOST = process.env.REPLICATE_URL

export async function POST(request: Request) {
  try {
    console.log("=== Text to Image API Called ===");
    
    if (!process.env.REPLICATE_API_TOKEN) {
      console.error("REPLICATE_API_TOKEN not found");
      return NextResponse.json({ 
        detail: "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it." 
      }, { status: 500 });
    }
    const requestBody = await request.json();
    console.log("Request body:", JSON.stringify(requestBody));
    const { model, prompt, width, height, output_format, aspect_ratio, user_id, user_email, effect_link_name, version, credit } = requestBody;
    
    // 验证和设置默认的output_format
    const validFormats = ["webp", "jpg", "png"];
    const finalOutputFormat = output_format && validFormats.includes(output_format) ? output_format : "png";
    console.log("Original output_format:", output_format);
    console.log("Final output_format:", finalOutputFormat);
  // check user
  const result = await generateCheck(user_id, user_email, credit);
  console.log("Generate check result:", result);
  if (result !== 1) {
    // If result is a Response object, return it directly
    if (result && typeof result === 'object' && 'status' in result) {
      return result;
    }
    return NextResponse.json({ detail: "Failed to create effect result" }, { status: 500 });
  }

  // 构建API调用参数 - 根据是否有version决定使用model还是version
  let apiParams;
  
  // 构建基础输入参数
  const baseInput = { prompt, width, height, output_format: finalOutputFormat, aspect_ratio };
  
  // 构建webhook参数（只有在有有效HTTPS WEBHOOK_HOST时才添加）
  const webhookParams = (WEBHOOK_HOST && WEBHOOK_HOST.startsWith('https://')) ? {
    webhook: `${WEBHOOK_HOST}/api/webhook/replicate`,
    webhook_events_filter: ["start", "completed"] as WebhookEventType[]
  } : {};
  
  if (version && version !== null) {
    // 如果有version，使用version参数
    apiParams = {
      version: version,
      input: baseInput,
      ...webhookParams
    };
  } else {
    // 如果没有version，使用model参数
    apiParams = {
      model: model,
      input: baseInput,
      ...webhookParams
    };
  }
  
  console.log("Model parameter:", model);
  console.log("Version parameter:", version);
  console.log("API parameters:", JSON.stringify(apiParams));

  let prediction;
  try {
    console.log("Calling Replicate API with options:", JSON.stringify(apiParams));
    // 直接使用apiParams调用API
    prediction = await replicate.predictions.create(apiParams);
    console.log("Replicate API response:", JSON.stringify(prediction));
    
    if (prediction?.error) {
      console.error("Replicate API error:", prediction.error);
      return NextResponse.json({ detail: prediction.error }, { status: 500 });
    }
  } catch (error) {
    console.error("Error calling Replicate API:", error);
    console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    
    // 如果是Replicate API错误，尝试获取详细错误信息
    if (error && typeof error === 'object' && 'response' in error) {
      const response = (error as any).response;
      console.error("Response status:", response?.status);
      console.error("Response data:", response?.data);
      
      if (response && response.status === 422 && response.data) {
        const errorMessage = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        console.error("Replicate API 422 error details:", errorMessage);
        return NextResponse.json({ detail: "Replicate API validation error: " + errorMessage }, { status: 500 });
      }
    }
    
    return NextResponse.json({ detail: "Error calling Replicate API: " + (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }

  const resultId = genEffectResultId();
  try {
    await createEffectResult({
      result_id: resultId,
      user_id: user_id,
      original_id: prediction.id,
      effect_id: 0,
      effect_name: effect_link_name,
      prompt: prompt,
      url: "",
      status: "pending",
      original_url: "",
      storage_type: "S3",
      running_time: -1,
      credit: credit,
      request_params: JSON.stringify(requestBody),
      created_at: new Date()
    });
    
    return NextResponse.json(prediction, { status: 201 });
  } catch (error) {
    console.error("Failed to create effect result:", error);
    return NextResponse.json({ detail: "Failed to create effect result: " + (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
  } catch (globalError) {
    console.error("Global error in text_to_image API:", globalError);
    return NextResponse.json({ 
      detail: "Global API error: " + (globalError instanceof Error ? globalError.message : String(globalError)) 
    }, { status: 500 });
  }
}
