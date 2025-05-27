import { AxiosResponse } from "axios";
import { api } from "../api";
import { ENDPOINTS } from "../endpoints";
import { urlForAttachment } from "@/utils/text";

interface AttachmentResponse {
  id: string;
  url: string;
}

export class WAttachment {
  id: string;
  url: string;

  constructor({ id, url }: AttachmentResponse) {
    this.id = id;
    this.url = urlForAttachment(url);
  }
}

export interface ShopResponse {
  id: string;
  name: string;
  description: string;
  status: string;
  webhook_url: string;
  created_at: string;
  owner_id: string;
  owner_phone: string;
  smtp_host: string;
  smtp_user: string;
  smtp_password: string;
  full_address: string;
  province_code: string;
  district_code: string;
  ward_code: string;
  banners: string[];
  latitude: string;
  longitude: string;
  current_member_id: string;
  zalo_app_id: string | null;
  zalo_app_secret_key: string | null;
  logo: WAttachment | null;
}
export class Shop {
  id: string;
  name: string;
  description: string | null;
  status: string;
  webhookUrl: string | null;
  createdAt: string;
  ownerId: string;
  ownerPhone: string;
  fullAddress: string;
  provinceCode: string | null;
  districtCode: string | null;
  wardCode: string | null;
  banners: string[];
  latitude: string;
  longitude: string;
  currentMemberId: string;
  zaloAppId: string | null;
  zaloAppSecretKey: string | null;
  logo: WAttachment | null;

  constructor({
    id,
    name,
    description,
    status,
    webhook_url,
    created_at,
    owner_id,
    owner_phone,
    full_address,
    province_code,
    district_code,
    ward_code,
    banners,
    latitude,
    longitude,
    current_member_id,
    zalo_app_id,
    zalo_app_secret_key,
    logo,
  }: ShopResponse) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = status;
    this.webhookUrl = webhook_url;
    this.createdAt = created_at;
    this.ownerId = owner_id;
    this.ownerPhone = owner_phone;
    this.fullAddress = full_address;
    this.provinceCode = province_code;
    this.districtCode = district_code;
    this.wardCode = ward_code;
    this.banners = banners;
    this.latitude = latitude;
    this.longitude = longitude;
    this.currentMemberId = current_member_id;
    this.zaloAppId = zalo_app_id;
    this.zaloAppSecretKey = zalo_app_secret_key;
    this.logo = logo ? new WAttachment(logo) : null;
  }
}

export async function getShop(
  id: string,
): Promise<AxiosResponse<ShopResponse>> {
  return await api.get(ENDPOINTS.STORE.detail(id));
}
