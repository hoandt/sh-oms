import {
  fetchDeliveryServicesProviders,
  fetchRevenueChannel,
} from "@/app/api/services/sapo";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = req.nextUrl;

  const marketplaceIds = searchParams.get("marketplaceIds");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const mappingConnection = await fetchDeliveryServicesProviders({ marketplaceIds, from, to });
  const response = await fetchRevenueChannel({ marketplaceIds, from, to });

  const mappedResults = response.map(res => {
    // Find corresponding connection in mappingConnection
    const matchingConnection = mappingConnection.find(
      conn => conn.channel_type === res.connection_type
    );
    
    // Return a new object with merged data
    return {
      ...matchingConnection,
      total: res.total,
      quantity: res.quantity
    };
  });

  return NextResponse.json(mappedResults);
}
