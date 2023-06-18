export class User {
  constructor(
    public uid: string,
    public email: string,
    public isSeller: boolean,
    public displayName: string
  ) {}
}
