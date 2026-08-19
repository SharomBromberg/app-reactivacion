export interface LoginResponseDto {
  accessToken: string;
  admin: {
    id: string;
    name: string;
    email: string;
  };
}
