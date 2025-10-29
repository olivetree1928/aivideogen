const Replicate = require("replicate");

// 从环境变量读取API密钥
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function testReplicateAPI() {
  console.log("开始测试 Replicate API...");
  
  try {
    // 测试1: 验证API密钥
    console.log("1. 验证API密钥...");
    const account = await replicate.accounts.current();
    console.log("✓ API密钥有效，账户信息:", account.username);
    
    // 测试2: 列出可用模型
    console.log("\n2. 获取模型信息...");
    const models = await replicate.models.list();
    console.log("✓ 成功获取模型列表，共", models.results.length, "个模型");
    
    // 测试3: 测试具体的文本到图像模型
    console.log("\n3. 测试文本到图像模型...");
    const testVersion = "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4"; // FLUX.1 [schnell]
    
    const prediction = await replicate.predictions.create({
      version: testVersion,
      input: {
        prompt: "a beautiful sunset over mountains",
        width: 512,
        height: 512,
        output_format: "webp",
        aspect_ratio: "1:1"
      }
    });
    
    console.log("✓ 成功创建预测任务:", prediction.id);
    console.log("预测状态:", prediction.status);
    
    return true;
  } catch (error) {
    console.error("❌ Replicate API 测试失败:");
    console.error("错误类型:", error.constructor.name);
    console.error("错误消息:", error.message);
    if (error.response) {
      console.error("响应状态:", error.response.status);
      console.error("响应数据:", error.response.data);
    }
    return false;
  }
}

testReplicateAPI().then(success => {
  if (success) {
    console.log("\n🎉 Replicate API 测试通过！");
  } else {
    console.log("\n💥 Replicate API 测试失败！");
  }
  process.exit(success ? 0 : 1);
});