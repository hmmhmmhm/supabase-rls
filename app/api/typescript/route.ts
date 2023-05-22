import { ProjectFormInput } from "@/app/page";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const input: ProjectFormInput = await request.json();

  const fetchTypescriptType = async (input: ProjectFormInput) => {
    const response = await fetch(
      `https://api.supabase.com/v1/projects/${input.projectId}/types/typescript?included_schemas=public`,
      {
        headers: {
          Authorization: `Bearer ${input.accessToken}`,
        },
      }
    );

    const data = await response.json();
    return data;
  };

  const result = await fetchTypescriptType(input);
  return NextResponse.json(result);
}
