import { getToken } from "@/services/auth";
import request, { ServiceRes } from "@/request";
import { addUrlQuery } from "@/utils/url";


// 上传文件路径
export const UploadFileUrl = '';
// 上传文件获取路径
export const GetUploadFileUrl = 'uoload/download';


// 上传文件
export interface UploadFilesRes {

}
export const uploadFiles = (data: FormData): Promise<ServiceRes<UploadFilesRes>> => {
  return request(UploadFileUrl, {
    method: 'post',
    data
  });
};

// 根据上传文件id获取目标文件
export const getUploadFileById = (id: string) => {
  return addUrlQuery({ id, token: getToken() }, GetUploadFileUrl);
};
