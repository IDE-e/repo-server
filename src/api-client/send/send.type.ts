export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export type SavedSend = {
  id: number;
  name: string;
  method: HttpMethod;
  url: string;
};
