import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { getCreditUsageByUserId, updateCreditUsage } from "@/backend/service/credit_usage";

export async function POST(request: NextRequest) {
  try {
    // 获取当前用户会话
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 获取当前用户的积分使用记录
    const creditUsage = await getCreditUsageByUserId(session.user.id);
    
    if (!creditUsage) {
      return NextResponse.json(
        { error: "Credit usage record not found" },
        { status: 404 }
      );
    }

    // 重置积分为5
    creditUsage.period_remain_count = 5;
    creditUsage.used_count = 0;
    creditUsage.updated_at = new Date();

    // 更新数据库
    await updateCreditUsage(creditUsage);

    return NextResponse.json(
      { 
        message: "Credits reset successfully", 
        new_credits: 5 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error resetting credits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}